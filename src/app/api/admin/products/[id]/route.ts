import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Obtener producto por ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const product = await db.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true
      }
    })
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Error al obtener producto' }, { status: 500 })
  }
}

// PUT - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const data = await request.json()
    
    const product = await db.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
        description: data.description,
        power: data.power,
        image: data.image,
        features: typeof data.features === 'string' ? data.features : JSON.stringify(data.features || []),
        brandId: data.brandId,
        categoryId: data.categoryId,
        featured: data.featured,
        active: data.active,
        order: data.order
      },
      include: {
        brand: true,
        category: true
      }
    })
    
    // Revalidar páginas que usan productos
    revalidatePath('/', 'layout')
    revalidatePath('/catalogo', 'page')
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 })
  }
}

// DELETE - Eliminar producto
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    await db.product.delete({
      where: { id }
    })
    
    // Revalidar páginas que usan productos
    revalidatePath('/', 'layout')
    revalidatePath('/catalogo', 'page')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 })
  }
}
