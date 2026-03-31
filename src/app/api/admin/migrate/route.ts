import { NextResponse } from 'next/server'

// API para migrar/agregar columnas faltantes a la base de datos
export async function POST() {
  try {
    const { db } = await import('@/lib/db')
    
    // Obtener configuración existente
    let config = await db.siteConfig.findFirst()
    
    if (config) {
      // Verificar si tiene los campos de video
      const hasHeroVideo = 'heroVideo' in config
      const hasHeroVideoPoster = 'heroVideoPoster' in config
      
      if (!hasHeroVideo || !hasHeroVideoPoster) {
        // Actualizar con los campos faltantes usando raw query
        try {
          // Para PostgreSQL
          await db.$executeRawUnsafe(`
            ALTER TABLE "SiteConfig" 
            ADD COLUMN IF NOT EXISTS "heroVideo" TEXT,
            ADD COLUMN IF NOT EXISTS "heroVideoPoster" TEXT
          `)
          console.log('Columnas heroVideo y heroVideoPoster agregadas')
        } catch (e) {
          // Si falla, intentamos update directo
          console.log('Intentando actualización directa...')
        }
        
        // Actualizar el registro con valores null para los nuevos campos
        try {
          await db.siteConfig.update({
            where: { id: config.id },
            data: {
              heroVideo: (config as any).heroVideo || null,
              heroVideoPoster: (config as any).heroVideoPoster || null
            }
          })
        } catch (updateError) {
          console.log('Error en update:', updateError)
        }
      }
      
      config = await db.siteConfig.findFirst()
    } else {
      // Crear configuración inicial
      config = await db.siteConfig.create({
        data: {
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
          yearsExperience: 75,
          clientsCount: 50000,
          brandsCount: 200,
          techniciansCount: 15,
          primaryColor: '#BE1E2D'
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Migración completada',
      config: {
        hasHeroVideo: 'heroVideo' in config,
        hasHeroVideoPoster: 'heroVideoPoster' in config,
        heroVideo: (config as any).heroVideo || null,
        heroVideoPoster: (config as any).heroVideoPoster || null
      }
    })
  } catch (error) {
    console.error('Error en migración:', error)
    return NextResponse.json({
      success: false,
      error: String(error),
      message: 'Error al migrar. Ejecute: npx prisma db push en Vercel'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST para ejecutar la migración de base de datos'
  })
}
