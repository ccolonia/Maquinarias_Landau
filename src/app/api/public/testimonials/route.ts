import { NextResponse } from 'next/server'

// API pública para la landing page - obtiene testimonios
export async function GET() {
  try {
    const { db } = await import('@/lib/db')
    const testimonials = await db.testimonial.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(testimonials)
  } catch (error) {
    // Datos de respaldo
    const fallbackTestimonials = [
      { id: 't1', name: 'Carlos Rodríguez', role: 'Jefe de Mantenimiento', company: 'Industrias Metalúrgicas del Valle', content: 'Llevamos 15 años trabajando con Maquinarias Landau. Su servicio técnico es impecable y siempre tienen los repuestos que necesitamos.', rating: 5, active: true, order: 1 },
      { id: 't2', name: 'María Fernanda López', role: 'Gerente de Compras', company: 'Constructora Andina S.A.S.', content: 'La asesoría que recibimos fue fundamental para optimizar nuestra inversión en herramientas. Profesionales de verdad.', rating: 5, active: true, order: 2 },
      { id: 't3', name: 'Andrés Felipe Zapata', role: 'Propietario', company: 'Carpintería Zapata', content: 'Desde que descubrí Maquinarias Landau, no voy a otro lado. Atención personalizada y precios justos. La tradición se nota.', rating: 5, active: true, order: 3 }
    ]
    return NextResponse.json(fallbackTestimonials)
  }
}
