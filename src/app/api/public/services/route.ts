import { NextResponse } from 'next/server'

// API pública para la landing page - obtiene servicios
export async function GET() {
  try {
    const { db } = await import('@/lib/db')
    const services = await db.service.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(services)
  } catch (error) {
    // Datos de respaldo
    const fallbackServices = [
      { id: 's1', title: 'Venta de Herramientas Eléctricas', description: 'Amplio catálogo de taladros, amoladoras, sierras y herramientas eléctricas de Bosch y Makita para uso profesional e industrial.', image: '/images/service_1.png', features: '["Bosch","Makita","Garantía Oficial"]', icon: 'Zap', order: 1, active: true },
      { id: 's2', title: 'Servicio Técnico Especializado', description: 'Taller propio con técnicos certificados para reparación y mantenimiento de todas las marcas que comercializamos.', image: '/images/service_2.png', features: '["Reparaciones","Mantenimiento","Repuestos Originales"]', icon: 'Settings', order: 2, active: true },
      { id: 's3', title: 'Herramientas Neumáticas', description: 'Compresores, pistolas de aire, llaves de impacto y toda la línea neumática industrial para sus proyectos más exigentes.', image: '/images/service_3.png', features: '["Compresores","Neumáticos","Accesorios"]', icon: 'Wrench', order: 3, active: true },
      { id: 's4', title: 'Afilado de Herramientas', description: 'Servicio profesional de afilado para sierras, brocas, cuchillas y todo tipo de herramientas de corte industrial.', image: '/images/service_4.png', features: '["Sierras","Brocas","Cuchillas"]', icon: 'Shield', order: 4, active: true },
      { id: 's5', title: 'Venta Mayorista B2B', description: 'Precios especiales para empresas, contratistas y distribuidores. Atención personalizada y entregas programadas.', image: '/images/service_5.png', features: '["Precios Especiales","Crédito","Entregas"]', icon: 'Truck', order: 5, active: true },
      { id: 's6', title: 'Asesoría Técnica Profesional', description: 'Equipo de expertos para ayudarte a elegir la herramienta correcta según tu aplicación y presupuesto.', image: '/images/service_6.png', features: '["Consultoría","Capacitación","Soporte"]', icon: 'Users', order: 6, active: true }
    ]
    return NextResponse.json(fallbackServices)
  }
}
