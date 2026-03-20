import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// Configuración por defecto cuando no hay base de datos
const fallbackConfig = {
  id: 'default',
  siteName: 'Maquinarias Landau',
  siteDescription: 'Potencia y precisión para tu trabajo desde 1949',
  logo: '/images/logo.png',
  heroTitle: 'Potencia y Precisión para tu Trabajo',
  heroSubtitle: 'Distribuidores oficiales de Bosch y Makita',
  heroDescription: 'Más de 75 años liderando en herramientas industriales con servicio técnico propio y asesoría profesional.',
  heroImage: '/images/hero_visual.png',
  address: 'Av. Asamblea 524, C1424 CABA, Argentina',
  phone: '4921-7875 / 4923-0918',
  whatsapp: '5491162422197',
  email: 'landaumaq2@gmail.com',
  schedule: '{"weekdays": "Lun-Jue: 9:30-17:00", "friday": "Vie: 9:30-14:00", "saturday": "Sáb: 8:00-13:00"}',
  facebook: '',
  instagram: '',
  yearsExperience: 75,
  clientsCount: 50000,
  brandsCount: 200,
  techniciansCount: 15,
  primaryColor: '#BE1E2D'
}

// GET - Obtener configuración del sitio
export async function GET() {
  try {
    const { db } = await import('@/lib/db')
    let config = await db.siteConfig.findFirst()
    if (!config) {
      config = fallbackConfig as any
    }
    return NextResponse.json(config)
  } catch (error) {
    console.log('Usando configuración de respaldo')
    return NextResponse.json(fallbackConfig)
  }
}

// PUT - Actualizar configuración
export async function PUT(request: Request) {
  try {
    const { db } = await import('@/lib/db')
    const data = await request.json()
    let config = await db.siteConfig.findFirst()

    if (!config) {
      config = await db.siteConfig.create({
        data: {
          siteName: data.siteName,
          siteDescription: data.siteDescription,
          logo: data.logo,
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          heroDescription: data.heroDescription,
          heroImage: data.heroImage,
          address: data.address,
          phone: data.phone,
          whatsapp: data.whatsapp,
          email: data.email,
          schedule: typeof data.schedule === 'string' ? data.schedule : JSON.stringify(data.schedule),
          facebook: data.facebook,
          instagram: data.instagram,
          yearsExperience: data.yearsExperience,
          clientsCount: data.clientsCount,
          brandsCount: data.brandsCount,
          techniciansCount: data.techniciansCount,
          primaryColor: data.primaryColor
        }
      })
    } else {
      config = await db.siteConfig.update({
        where: { id: config.id },
        data: {
          siteName: data.siteName,
          siteDescription: data.siteDescription,
          logo: data.logo,
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          heroDescription: data.heroDescription,
          heroImage: data.heroImage,
          address: data.address,
          phone: data.phone,
          whatsapp: data.whatsapp,
          email: data.email,
          schedule: typeof data.schedule === 'string' ? data.schedule : JSON.stringify(data.schedule),
          facebook: data.facebook,
          instagram: data.instagram,
          yearsExperience: data.yearsExperience,
          clientsCount: data.clientsCount,
          brandsCount: data.brandsCount,
          techniciansCount: data.techniciansCount,
          primaryColor: data.primaryColor
        }
      })
    }

    // Revalidar todas las páginas
    revalidatePath('/', 'layout')
    
    return NextResponse.json(config)
  } catch (error) {
    return NextResponse.json({ error: 'Base de datos no configurada. Configure PostgreSQL en Vercel.' }, { status: 503 })
  }
}
