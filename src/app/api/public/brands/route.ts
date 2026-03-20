import { NextResponse } from 'next/server'

// API pública para la landing page - obtiene marcas
export async function GET() {
  try {
    const { db } = await import('@/lib/db')
    const brands = await db.brand.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(brands)
  } catch (error) {
    // Datos de respaldo
    const fallbackBrands = [
      { id: 'bosch', name: 'Bosch', slug: 'bosch', color: '#E31837', logo: null, description: 'Herramientas eléctricas profesionales', order: 1, active: true },
      { id: 'makita', name: 'Makita', slug: 'makita', color: '#0047AB', logo: null, description: 'Herramientas a batería y eléctricas', order: 2, active: true },
      { id: 'cortarapid', name: 'CortaRapid', slug: 'cortarapid', color: '#FF6600', logo: null, description: 'Amoladoras industriales', order: 3, active: true },
      { id: 'skil', name: 'Skil', slug: 'skil', color: '#E31837', logo: null, description: 'Herramientas para bricolaje', order: 4, active: true },
      { id: 'ganmar', name: 'Línea Ganmar', slug: 'ganmar', color: '#1E5631', logo: null, description: 'Compresores y neumáticos', order: 5, active: true },
      { id: 'aleba', name: 'Soldadoras Aleba', slug: 'aleba', color: '#1E3A5F', logo: null, description: 'Soldadoras eléctricas industriales', order: 6, active: true }
    ]
    return NextResponse.json(fallbackBrands)
  }
}
