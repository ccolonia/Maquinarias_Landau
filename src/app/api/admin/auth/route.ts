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

// PATCH - Cambiar email y/o contraseña
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Verificar token actual
    const { payload } = await jwtVerify(token, SECRET_KEY)
    const userId = payload.userId as string

    const { currentPassword, newEmail, newPassword } = await request.json()

    // Buscar usuario actual
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Si se quiere cambiar contraseña, verificar la actual
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Debes ingresar tu contraseña actual' }, { status: 400 })
      }
      const bcrypt = await import('bcryptjs')
      const passwordMatch = await bcrypt.compare(currentPassword, user.password)
      if (!passwordMatch) {
        return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 400 })
      }
    }

    // Preparar datos a actualizar
    const updateData: { email?: string; password?: string; name?: string } = {}
    
    if (newEmail && newEmail !== user.email) {
      // Verificar que el email no esté en uso
      const existingUser = await db.user.findUnique({ where: { email: newEmail } })
      if (existingUser) {
        return NextResponse.json({ error: 'El email ya está en uso' }, { status: 400 })
      }
      updateData.email = newEmail
    }

    if (newPassword) {
      const bcrypt = await import('bcryptjs')
      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    // Si no hay cambios
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: 'No hay cambios para realizar' })
    }

    // Actualizar usuario
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData
    })

    // Crear nuevo token con los datos actualizados
    const newToken = await new SignJWT({
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(SECRET_KEY)

    // Actualizar cookie
    cookieStore.set('admin-token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })

    return NextResponse.json({
      success: true,
      message: 'Credenciales actualizadas correctamente',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role
      }
    })
  } catch (error) {
    console.error('Error updating credentials:', error)
    return NextResponse.json({ error: 'Error al actualizar credenciales' }, { status: 500 })
  }
}
