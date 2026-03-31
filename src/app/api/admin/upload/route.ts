import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      )
    }

    // Validar tipo de archivo (imágenes y videos)
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Use JPG, PNG, GIF, WebP, MP4, WebM, OGG o MOV' },
        { status: 400 }
      )
    }

    // Determinar si es video o imagen
    const isVideo = file.type.startsWith('video/')

    // Validar tamaño (máximo 50MB para videos, 10MB para imágenes)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `El archivo es demasiado grande. Máximo ${isVideo ? '50MB para videos' : '10MB para imágenes'}` },
        { status: 400 }
      )
    }

    // Convertir archivo a base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const mimeType = file.type || 'image/jpeg'
    
    // Crear data URL (funciona en cualquier lugar)
    const dataUrl = `data:${mimeType};base64,${base64}`
    
    return NextResponse.json({ 
      success: true,
      url: dataUrl,
      fileName: file.name
    })
    
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Error al subir el archivo: ' + (error instanceof Error ? error.message : 'Error desconocido') },
      { status: 500 }
    )
  }
}
