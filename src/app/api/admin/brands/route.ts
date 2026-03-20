import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Obtener todas las marcas
export async function GET() {
  try {
    const brands = await db.brand.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })
    return NextResponse.json(brands)
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json({ error: 'Error al obtener marcas' }, { status: 500 })
  }
}

// POST - Crear nueva marca
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const brand = await db.brand.create({
      data: {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
        color: data.color || '#BE1E2D',
        logo: data.logo,
        description: data.description,
        order: data.order || 0,
        active: data.active ?? true
      }
    })
    return NextResponse.json(brand)
  } catch (error) {
    console.error('Error creating brand:', error)
    return NextResponse.json({ error: 'Error al crear marca' }, { status: 500 })
  }
}
