import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT - Marcar como leído
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    const message = await db.contactMessage.update({
      where: { id },
      data: { read: data.read ?? true }
    })
    return NextResponse.json(message)
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json({ error: 'Error al actualizar mensaje' }, { status: 500 })
  }
}

// DELETE - Eliminar mensaje
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.contactMessage.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json({ error: 'Error al eliminar mensaje' }, { status: 500 })
  }
}
