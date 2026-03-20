import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Obtener configuración del sitio
export async function GET() {
  try {
    let config = await db.siteConfig.findFirst()
    if (!config) {
      // Crear configuración por defecto
      config = await db.siteConfig.create({
        data: {
          siteName: 'Maquinarias Landau',
          siteDescription: 'Potencia y precisión para tu trabajo desde 1949',
          heroTitle: 'Potencia y Precisión para tu Trabajo',
          heroSubtitle: 'Distribuidores oficiales de Bosch y Makita',
          heroDescription: 'Más de 75 años liderando en herramientas industriales con servicio técnico propio y asesoría profesional.',
          address: 'Av. Asamblea 524, C1424 CABA, Argentina',
          phone: '4921-7875 / 4923-0918',
          whatsapp: '5491162422197',
          email: 'landaumaq2@gmail.com',
          schedule: JSON.stringify({
            weekdays: 'Lun-Jue: 9:30-17:00',
            friday: 'Vie: 9:30-14:00',
            saturday: 'Sáb: 8:00-13:00'
          }),
          yearsExperience: 75,
          clientsCount: 50000,
          brandsCount: 200,
          techniciansCount: 15,
          primaryColor: '#BE1E2D'
        }
      })
    }
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching config:', error)
    return NextResponse.json({ error: 'Error al obtener configuración' }, { status: 500 })
  }
}

// PUT - Actualizar configuración
export async function PUT(request: NextRequest) {
  try {
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

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error updating config:', error)
    return NextResponse.json({ error: 'Error al actualizar configuración' }, { status: 500 })
  }
}
