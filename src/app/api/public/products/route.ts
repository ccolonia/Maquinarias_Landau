import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Forzar renderizado dinámico - SIN CACHE
export const dynamic = 'force-dynamic'
export const revalidate = 0

// API pública para el catálogo - obtiene productos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brandId = searchParams.get('brandId')
    const categoryId = searchParams.get('categoryId')
    
    // Construir filtro
    const where: Record<string, unknown> = {}
    if (brandId) where.brandId = brandId
    if (categoryId) where.categoryId = categoryId
    
    const products = await db.product.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        brand: { select: { id: true, name: true, color: true, slug: true } },
        category: { select: { id: true, name: true, slug: true } }
      }
    })
    
    return NextResponse.json(products || [], {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store, no-cache'
      }
    })
  } catch (error) {
    console.error('Error en API public/products:', error)
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    })
  }
}
