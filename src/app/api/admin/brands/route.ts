import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// Datos de respaldo cuando no hay base de datos
const fallbackBrands = [
  { id: 'bosch', name: 'Bosch', slug: 'bosch', color: '#E31837', logo: null, description: 'Herramientas eléctricas profesionales', order: 1, active: true, _count: { products: 8 } },
  { id: 'makita', name: 'Makita', slug: 'makita', color: '#0047AB', logo: null, description: 'Herramientas a batería y eléctricas', order: 2, active: true, _count: { products: 6 } },
  { id: 'cortarapid', name: 'CortaRapid', slug: 'cortarapid', color: '#FF6600', logo: null, description: 'Amoladoras industriales', order: 3, active: true, _count: { products: 4 } },
  { id: 'skil', name: 'Skil', slug: 'skil', color: '#E31837', logo: null, description: 'Herramientas para bricolaje', order: 4, active: true, _count: { products: 5 } },
  { id: 'ganmar', name: 'Línea Ganmar', slug: 'ganmar', color: '#1E5631', logo: null, description: 'Compresores y neumáticos', order: 5, active: true, _count: { products: 5 } },
  { id: 'aleba', name: 'Soldadoras Aleba', slug: 'aleba', color: '#1E3A5F', logo: null, description: 'Soldadoras eléctricas industriales', order: 6, active: true, _count: { products: 8 } }
]

// GET - Obtener todas las marcas
export async function GET() {
  try {
    const { db } = await import('@/lib/db')
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
    console.log('Usando datos de respaldo para marcas')
    return NextResponse.json(fallbackBrands)
  }
}

// POST - Crear nueva marca
export async function POST(request: NextRequest) {
  try {
    const { db } = await import('@/lib/db')
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
    
    // Revalidar páginas que usan marcas
    revalidatePath('/', 'layout')
    revalidatePath('/catalogo', 'page')
    
    return NextResponse.json(brand)
  } catch (error) {
    return NextResponse.json({ error: 'Base de datos no configurada. Configure PostgreSQL en Vercel.' }, { status: 503 })
  }
}
