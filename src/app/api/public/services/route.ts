import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Forzar renderizado dinámico - SIN CACHE
export const dynamic = 'force-dynamic'
export const revalidate = 0

// API pública para la landing page - obtiene servicios
export async function GET() {
  try {
    const services = await db.service.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    })
    
    if (services && services.length > 0) {
      return NextResponse.json(services, {
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
    console.error('Error en API public/services:', error)
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    })
  }
}
