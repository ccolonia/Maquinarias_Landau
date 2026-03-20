import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'maquinarias-landau-jwt-secret-2024'
)

// Crear usuario admin por defecto si no existe
async function ensureAdminUser() {
  try {
    let admin = await db.user.findUnique({
      where: { email: 'admin@landau.com' }
    })

    if (!admin) {
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('Landau2024!', 10)
      admin = await db.user.create({
        data: {
          email: 'admin@landau.com',
          password: hashedPassword,
          name: 'Administrador',
          role: 'admin'
        }
      })
    }

    return admin
  } catch (error) {
    console.error('Error ensuring admin user:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Asegurar que existe el usuario admin
    await ensureAdminUser()

    // Buscar usuario
    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const bcrypt = await import('bcryptjs')
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }

    // Crear token JWT
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(SECRET_KEY)

    // Establecer cookie
    const cookieStore = await cookies()
    cookieStore.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/'
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value

    if (!token) {
      return NextResponse.json({ authenticated: false })
    }

    try {
      const { payload } = await jwtVerify(token, SECRET_KEY)
      return NextResponse.json({
        authenticated: true,
        user: payload
      })
    } catch {
      return NextResponse.json({ authenticated: false })
    }
  } catch (error) {
    return NextResponse.json({ authenticated: false })
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin-token')
    return NextResponse.json({ success: true, message: 'Sesión cerrada' })
  } catch (error) {
    return NextResponse.json({ error: 'Error al cerrar sesión' }, { status: 500 })
  }
}
