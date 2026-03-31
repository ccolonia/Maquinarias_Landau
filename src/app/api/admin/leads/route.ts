import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic'

// GET - Obtener todos los leads
export async function GET() {
  try {
    const leads = await db.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(leads)
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json([], { status: 200 })
  }
}
