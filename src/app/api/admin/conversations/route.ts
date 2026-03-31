import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Obtener todas las conversaciones
export async function GET(request: NextRequest) {
  try {
    const conversations = await db.agentConversation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    return NextResponse.json({ conversations })

  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Error al obtener conversaciones' },
      { status: 500 }
    )
  }
}
