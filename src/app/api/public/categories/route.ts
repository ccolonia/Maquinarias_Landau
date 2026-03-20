import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Forzar renderizado dinámico - SIN CACHE
export const dynamic = 'force-dynamic'
export const revalidate = 0

// API pública para la landing page y catálogo - obtiene categorías
export async function GET() {
  try {
    const categories = await db.category.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    })
    
    if (categories && categories.length > 0) {
      return NextResponse.json(categories, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'CDN-Cache-Control': 'no-store',
          'Vercel-CDN-Cache-Control': 'no-store'
        }
      })
    }
    
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    })
  } catch (error) {
    console.error('Error en API public/categories:', error)
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    })
  }
}
