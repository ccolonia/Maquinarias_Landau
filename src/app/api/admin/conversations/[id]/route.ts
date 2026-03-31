import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH - Actualizar estado de conversación
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Estado requerido' },
        { status: 400 }
      )
    }

    const conversation = await db.agentConversation.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json({ success: true, conversation })

  } catch (error) {
    console.error('Error updating conversation:', error)
    return NextResponse.json(
      { error: 'Error al actualizar conversación' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar conversación
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await db.agentConversation.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting conversation:', error)
    return NextResponse.json(
      { error: 'Error al eliminar conversación' },
      { status: 500 }
    )
  }
}
