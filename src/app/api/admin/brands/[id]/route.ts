import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Obtener marca por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const brand = await db.brand.findUnique({
      where: { id },
      include: {
        products: true
      }
    })
    if (!brand) {
      return NextResponse.json({ error: 'Marca no encontrada' }, { status: 404 })
    }
    return NextResponse.json(brand)
  } catch (error) {
    console.error('Error fetching brand:', error)
    return NextResponse.json({ error: 'Error al obtener marca' }, { status: 500 })
  }
}

// PUT - Actualizar marca
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    const brand = await db.brand.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        color: data.color,
        logo: data.logo,
        description: data.description,
        order: data.order,
        active: data.active
      }
    })
    return NextResponse.json(brand)
  } catch (error) {
    console.error('Error updating brand:', error)
    return NextResponse.json({ error: 'Error al actualizar marca' }, { status: 500 })
  }
}

// DELETE - Eliminar marca
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.brand.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting brand:', error)
    return NextResponse.json({ error: 'Error al eliminar marca' }, { status: 500 })
  }
}
