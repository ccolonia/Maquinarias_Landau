import { NextResponse } from 'next/server'

// API pública para la landing page - obtiene configuración del sitio
export async function GET() {
  try {
    const { db } = await import('@/lib/db')
    const config = await db.siteConfig.findFirst()
    if (config) {
      return NextResponse.json(config)
    }
    // Si no hay config, retornar datos por defecto
    return NextResponse.json({
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
    })
  } catch (error) {
    // Datos de respaldo
    return NextResponse.json({
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
    })
  }
}
