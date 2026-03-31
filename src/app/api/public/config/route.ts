import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Forzar renderizado dinámico - SIN CACHE
export const dynamic = 'force-dynamic'
export const revalidate = 0

// API pública para la landing page - obtiene configuración del sitio
export async function GET() {
  try {
    const config = await db.siteConfig.findFirst()
    
    if (config) {
      return NextResponse.json(config, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'CDN-Cache-Control': 'no-store',
          'Vercel-CDN-Cache-Control': 'no-store'
        }
      })
    }
    
    // Config por defecto si no hay en DB
    return NextResponse.json({
      siteName: 'Maquinarias Landau',
      siteDescription: 'Potencia y precisión para tu trabajo desde 1949',
      yearsExperience: 75,
      clientsCount: 50000,
      brandsCount: 200,
      techniciansCount: 15
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    })
  } catch (error) {
    console.error('Error en API public/config:', error)
    return NextResponse.json({
      siteName: 'Maquinarias Landau',
      yearsExperience: 75
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    })
  }
}
