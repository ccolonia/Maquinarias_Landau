import { NextRequest, NextResponse } from 'next/server'

// Datos de respaldo vacíos para mensajes (no hay mensajes iniciales)
const fallbackMessages: any[] = []

// GET - Obtener todos los mensajes
export async function GET(request: NextRequest) {
  try {
    const { db } = await import('@/lib/db')
    const { searchParams } = new URL(request.url)
    const unread = searchParams.get('unread')

    const where: Record<string, unknown> = {}
    if (unread === 'true') {
      where.read = false
    }

    const messages = await db.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(messages)
  } catch (error) {
    console.log('Usando datos de respaldo para mensajes')
    return NextResponse.json(fallbackMessages)
  }
}
