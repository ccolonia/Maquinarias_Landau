import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import { compare } from 'bcryptjs'

// Contraseña hasheada para el admin por defecto
// Email: admin@landau.com
// Password: Landau2024!
const hashedPassword = '$2a$10$rQZ9YX3vJQK5v8YwX4qPnO5jK6vYwX4qPnO5jK6vYwX4qPnO5jK6vYwX4qPnO5jK6vYwX'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Buscar usuario en la base de datos
          let user = await db.user.findUnique({
            where: { email: credentials.email }
          })

          // Si no existe, crear el usuario admin por defecto
          if (!user && credentials.email === 'admin@landau.com') {
            const bcrypt = await import('bcryptjs')
            const hashedPassword = await bcrypt.hash('Landau2024!', 10)
            user = await db.user.create({
              data: {
                email: 'admin@landau.com',
                password: hashedPassword,
                name: 'Administrador',
                role: 'admin'
              }
            })
          }

          if (!user) {
            return null
          }

          // Verificar contraseña
          const bcrypt = await import('bcryptjs')
          const passwordMatch = await bcrypt.compare(credentials.password, user.password)

          if (!passwordMatch) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        } catch (error) {
          console.error('Auth error:', error)
          
          // Fallback para cuando no hay base de datos
          if (credentials.email === 'admin@landau.com' && credentials.password === 'Landau2024!') {
            return {
              id: 'admin-1',
              email: 'admin@landau.com',
              name: 'Administrador',
              role: 'admin'
            }
          }
          
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'maquinarias-landau-secret-key-2024',
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
