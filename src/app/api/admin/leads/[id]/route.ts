import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic'

// PUT - Actualizar estado del lead
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    const validStatuses = ['Pendiente', 'Leído', 'Contactado', 'Cerrado', 'Perdido']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Estado inválido' },
        { status: 400 }
      )
    }

    const lead = await db.contactMessage.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el lead' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar lead
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
    console.error('Error deleting lead:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el lead' },
      { status: 500 }
    )
  }
}
