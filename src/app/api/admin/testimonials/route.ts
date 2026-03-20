import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Obtener todos los testimonios
export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json({ error: 'Error al obtener testimonios' }, { status: 500 })
  }
}

// POST - Crear nuevo testimonio
export async function POST(request: NextRequest) {
  try {
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
    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json({ error: 'Error al crear testimonio' }, { status: 500 })
  }
}
