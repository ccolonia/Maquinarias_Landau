import { NextResponse } from 'next/server'

// API de diagnóstico para verificar la base de datos
export async function GET() {
  try {
    const { db } = await import('@/lib/db')
    
    // Obtener configuración
    const config = await db.siteConfig.findFirst()
    
    // Verificar qué campos tiene
    const fields = config ? Object.keys(config) : []
    const hasHeroVideo = fields.includes('heroVideo')
    const hasHeroVideoPoster = fields.includes('heroVideoPoster')
    
    return NextResponse.json({
      success: true,
      database: 'connected',
      configExists: !!config,
      fields: fields,
      hasHeroVideo,
      hasHeroVideoPoster,
      heroVideoValue: hasHeroVideo ? (config as any).heroVideo : 'FIELD_MISSING',
      heroVideoPosterValue: hasHeroVideoPoster ? (config as any).heroVideoPoster : 'FIELD_MISSING',
      heroImageValue: config?.heroImage || null,
      rawConfig: config
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
      database: 'error'
    }, { status: 500 })
  }
}

// POST para intentar agregar las columnas faltantes
export async function POST() {
  try {
    const { db } = await import('@/lib/db')
    
    // Intentar agregar columnas con SQL directo
    try {
      await db.$executeRawUnsafe(`
        ALTER TABLE "SiteConfig" 
        ADD COLUMN IF NOT EXISTS "heroVideo" TEXT,
        ADD COLUMN IF NOT EXISTS "heroVideoPoster" TEXT
      `)
    } catch (e) {
      console.log('Note: Column might already exist or SQL not supported')
    }
    
    // Verificar resultado
    const config = await db.siteConfig.findFirst()
    const fields = config ? Object.keys(config) : []
    
    return NextResponse.json({
      success: true,
      message: 'Migration attempted',
      fields: fields,
      hasHeroVideo: fields.includes('heroVideo'),
      hasHeroVideoPoster: fields.includes('heroVideoPoster')
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}
