import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Obtener todos los servicios
export async function GET() {
  try {
    const services = await db.service.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Error al obtener servicios' }, { status: 500 })
  }
}

// POST - Crear nuevo servicio
export async function POST(request: NextRequest) {
  try {
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
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Error al crear servicio' }, { status: 500 })
  }
}
