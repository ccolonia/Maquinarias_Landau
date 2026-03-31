import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// Datos de respaldo cuando no hay base de datos
const fallbackCategories = [
  { id: 'taladros', name: 'Taladros', slug: 'taladros', description: 'Taladros percutor y rotomartillos', order: 1, active: true, _count: { products: 5 } },
  { id: 'amoladoras', name: 'Amoladoras', slug: 'amoladoras', description: 'Amoladoras angulares', order: 2, active: true, _count: { products: 8 } },
  { id: 'sierras', name: 'Sierras', slug: 'sierras', description: 'Sierras circulares y caladoras', order: 3, active: true, _count: { products: 4 } },
  { id: 'rotomartillos', name: 'Rotomartillos', slug: 'rotomartillos', description: 'Rotomartillos SDS', order: 4, active: true, _count: { products: 2 } },
  { id: 'lijadoras', name: 'Lijadoras', slug: 'lijadoras', description: 'Lijadoras orbitales', order: 5, active: true, _count: { products: 2 } },
  { id: 'compresores', name: 'Compresores', slug: 'compresores', description: 'Compresores de aire', order: 6, active: true, _count: { products: 3 } },
  { id: 'neumaticos', name: 'Neumáticos', slug: 'neumaticos', description: 'Herramientas neumáticas', order: 7, active: true, _count: { products: 3 } },
  { id: 'soldadoras', name: 'Soldadoras', slug: 'soldadoras', description: 'Soldadoras eléctricas', order: 8, active: true, _count: { products: 8 } },
  { id: 'combos', name: 'Combos', slug: 'combos', description: 'Kits de herramientas', order: 9, active: true, _count: { products: 2 } }
]

// GET - Obtener todas las categorías
export async function GET() {
  try {
    const { db } = await import('@/lib/db')
    const categories = await db.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.log('Usando datos de respaldo para categorías')
    return NextResponse.json(fallbackCategories)
  }
}

// POST - Crear nueva categoría
export async function POST(request: NextRequest) {
  try {
    const { db } = await import('@/lib/db')
    const data = await request.json()
    const category = await db.category.create({
      data: {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
        description: data.description,
        order: data.order || 0,
        active: data.active ?? true
      }
    })
    
    // Revalidar páginas que usan categorías
    revalidatePath('/', 'layout')
    revalidatePath('/catalogo', 'page')
    
    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: 'Base de datos no configurada. Configure PostgreSQL en Vercel.' }, { status: 503 })
  }
}
