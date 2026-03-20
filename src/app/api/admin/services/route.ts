import { NextRequest, NextResponse } from 'next/server'

// Datos de respaldo cuando no hay base de datos
const fallbackServices = [
  { id: 's1', title: 'Venta de Herramientas Eléctricas', description: 'Amplio catálogo de taladros, amoladoras, sierras y herramientas eléctricas de Bosch y Makita para uso profesional e industrial.', image: '/images/service_1.png', features: '["Bosch","Makita","Garantía Oficial"]', icon: 'Zap', order: 1, active: true },
  { id: 's2', title: 'Servicio Técnico Especializado', description: 'Taller propio con técnicos certificados para reparación y mantenimiento de todas las marcas que comercializamos.', image: '/images/service_2.png', features: '["Reparaciones","Mantenimiento","Repuestos Originales"]', icon: 'Settings', order: 2, active: true },
  { id: 's3', title: 'Herramientas Neumáticas', description: 'Compresores, pistolas de aire, llaves de impacto y toda la línea neumática industrial para sus proyectos más exigentes.', image: '/images/service_3.png', features: '["Compresores","Neumáticos","Accesorios"]', icon: 'Wrench', order: 3, active: true },
  { id: 's4', title: 'Afilado de Herramientas', description: 'Servicio profesional de afilado para sierras, brocas, cuchillas y todo tipo de herramientas de corte industrial.', image: '/images/service_4.png', features: '["Sierras","Brocas","Cuchillas"]', icon: 'Shield', order: 4, active: true },
  { id: 's5', title: 'Venta Mayorista B2B', description: 'Precios especiales para empresas, contratistas y distribuidores. Atención personalizada y entregas programadas.', image: '/images/service_5.png', features: '["Precios Especiales","Crédito","Entregas"]', icon: 'Truck', order: 5, active: true },
  { id: 's6', title: 'Asesoría Técnica Profesional', description: 'Equipo de expertos para ayudarte a elegir la herramienta correcta según tu aplicación y presupuesto.', image: '/images/service_6.png', features: '["Consultoría","Capacitación","Soporte"]', icon: 'Users', order: 6, active: true }
]

// GET - Obtener todos los servicios
export async function GET() {
  try {
    const { db } = await import('@/lib/db')
    const services = await db.service.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(services)
  } catch (error) {
    console.log('Usando datos de respaldo para servicios')
    return NextResponse.json(fallbackServices)
  }
}

// POST - Crear nuevo servicio
export async function POST(request: NextRequest) {
  try {
    const { db } = await import('@/lib/db')
    const data = await request.json()
    const service = await db.service.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        features: JSON.stringify(data.features || []),
        icon: data.icon || 'Wrench',
        order: data.order || 0,
        active: data.active ?? true
      }
    })
    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: 'Base de datos no configurada. Configure PostgreSQL en Vercel.' }, { status: 503 })
  }
}
