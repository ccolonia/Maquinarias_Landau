import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Obtener todos los productos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brandId = searchParams.get('brandId')
    const categoryId = searchParams.get('categoryId')
    const featured = searchParams.get('featured')

    const where: Record<string, unknown> = {}
    if (brandId) where.brandId = brandId
    if (categoryId) where.categoryId = categoryId
    if (featured) where.featured = featured === 'true'

    const products = await db.product.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        brand: true,
        category: true
      }
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 })
  }
}

// POST - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const product = await db.product.create({
      data: {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
        description: data.description,
        power: data.power,
        image: data.image,
        features: JSON.stringify(data.features || []),
        brandId: data.brandId,
        categoryId: data.categoryId,
        featured: data.featured ?? false,
        active: data.active ?? true,
        order: data.order || 0
      },
      include: {
        brand: true,
        category: true
      }
    })
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 })
  }
}
