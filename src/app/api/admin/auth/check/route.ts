import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'maquinarias-landau-jwt-secret-2024'
)

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
        user: {
          id: payload.userId,
          email: payload.email,
          name: payload.name,
          role: payload.role
        }
      })
    } catch {
      return NextResponse.json({ authenticated: false })
    }
  } catch (error) {
    return NextResponse.json({ authenticated: false })
  }
}
