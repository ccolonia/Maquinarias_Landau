import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Obtener todos los mensajes
export async function GET(request: NextRequest) {
  try {
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
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Error al obtener mensajes' }, { status: 500 })
  }
}
