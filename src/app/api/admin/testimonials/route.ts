import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// Datos de respaldo cuando no hay base de datos
const fallbackTestimonials = [
  { id: 't1', name: 'Carlos Rodríguez', role: 'Jefe de Mantenimiento', company: 'Industrias Metalúrgicas del Valle', content: 'Llevamos 15 años trabajando con Maquinarias Landau. Su servicio técnico es impecable y siempre tienen los repuestos que necesitamos.', rating: 5, active: true, order: 1 },
  { id: 't2', name: 'María Fernanda López', role: 'Gerente de Compras', company: 'Constructora Andina S.A.S.', content: 'La asesoría que recibimos fue fundamental para optimizar nuestra inversión en herramientas. Profesionales de verdad.', rating: 5, active: true, order: 2 },
  { id: 't3', name: 'Andrés Felipe Zapata', role: 'Propietario', company: 'Carpintería Zapata', content: 'Desde que descubrí Maquinarias Landau, no voy a otro lado. Atención personalizada y precios justos. La tradición se nota.', rating: 5, active: true, order: 3 }
]

// GET - Obtener todos los testimonios
export async function GET() {
  try {
    const { db } = await import('@/lib/db')
    const testimonials = await db.testimonial.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(testimonials)
  } catch (error) {
    console.log('Usando datos de respaldo para testimonios')
    return NextResponse.json(fallbackTestimonials)
  }
}

// POST - Crear nuevo testimonio
export async function POST(request: NextRequest) {
  try {
    const { db } = await import('@/lib/db')
    const data = await request.json()
    const testimonial = await db.testimonial.create({
      data: {
        name: data.name,
        role: data.role,
        company: data.company,
        content: data.content,
        rating: data.rating || 5,
        active: data.active ?? true,
        order: data.order || 0
      }
    })
    
    // Revalidar página principal
    revalidatePath('/', 'page')
    
    return NextResponse.json(testimonial)
  } catch (error) {
    return NextResponse.json({ error: 'Base de datos no configurada. Configure PostgreSQL en Vercel.' }, { status: 503 })
  }
}
