import { NextResponse } from 'next/server'

// Forzar renderizado dinámico - SIN CACHE
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Configuración por defecto completa
const defaultConfig = {
  siteName: 'Maquinarias Landau',
  siteDescription: 'Potencia y precisión para tu trabajo desde 1949',
  heroTitle: 'Potencia y Precisión para tu Trabajo',
  heroSubtitle: 'Distribuidores oficiales de Bosch y Makita',
  heroDescription: 'Más de 75 años liderando en herramientas industriales con servicio técnico propio y asesoría profesional.',
  heroImage: '/images/hero_visual.jpg',
  heroVideo: null,
  heroVideoPoster: null,
  address: 'Av. Asamblea 524, C1424 CABA, Argentina',
  phone: '4921-7875 / 4923-0918',
  whatsapp: '5491162422197',
  email: 'landaumaq2@gmail.com',
  schedule: '{"weekdays": "Lun-Jue: 9:30-17:00", "friday": "Vie: 9:30-14:00", "saturday": "Sáb: 8:00-13:00"}',
  yearsExperience: 75,
  clientsCount: 50000,
  brandsCount: 200,
  techniciansCount: 15
}

// API pública para la landing page - obtiene configuración del sitio
export async function GET() {
  const headers = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'CDN-Cache-Control': 'no-store',
    'Vercel-CDN-Cache-Control': 'no-store'
  }

  try {
    const { db } = await import('@/lib/db')
    const config = await db.siteConfig.findFirst()
    
    if (config) {
      // Combinar con defaults para asegurar que todos los campos existan
      const fullConfig = {
        ...defaultConfig,
        ...config
      }
      return NextResponse.json(fullConfig, { headers })
    }
    
    return NextResponse.json(defaultConfig, { headers })
  } catch (error) {
    console.error('Error en API public/config:', error)
    return NextResponse.json(defaultConfig, { headers })
  }
}
