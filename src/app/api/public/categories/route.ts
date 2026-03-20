import { NextResponse } from 'next/server'

// API pública para la landing page - obtiene categorías
export async function GET() {
  try {
    const { db } = await import('@/lib/db')
    const categories = await db.category.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(categories)
  } catch (error) {
    // Datos de respaldo
    const fallbackCategories = [
      { id: 'taladros', name: 'Taladros', slug: 'taladros', description: 'Taladros percutor y rotomartillos', order: 1, active: true },
      { id: 'amoladoras', name: 'Amoladoras', slug: 'amoladoras', description: 'Amoladoras angulares', order: 2, active: true },
      { id: 'sierras', name: 'Sierras', slug: 'sierras', description: 'Sierras circulares y caladoras', order: 3, active: true },
      { id: 'rotomartillos', name: 'Rotomartillos', slug: 'rotomartillos', description: 'Rotomartillos SDS', order: 4, active: true },
      { id: 'lijadoras', name: 'Lijadoras', slug: 'lijadoras', description: 'Lijadoras orbitales', order: 5, active: true },
      { id: 'compresores', name: 'Compresores', slug: 'compresores', description: 'Compresores de aire', order: 6, active: true },
      { id: 'neumaticos', name: 'Neumáticos', slug: 'neumaticos', description: 'Herramientas neumáticas', order: 7, active: true },
      { id: 'soldadoras', name: 'Soldadoras', slug: 'soldadoras', description: 'Soldadoras eléctricas', order: 8, active: true },
      { id: 'combos', name: 'Combos', slug: 'combos', description: 'Kits de herramientas', order: 9, active: true }
    ]
    return NextResponse.json(fallbackCategories)
  }
}
