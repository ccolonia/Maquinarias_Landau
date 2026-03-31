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

    // Validar tamaño
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `El archivo es demasiado grande. Máximo ${isVideo ? '50MB' : '10MB'}` },
        { status: 400 }
      )
    }

    // Para archivos pequeños (imágenes), usar base64
    // Para videos grandes, requerir URL externa o YouTube/Vimeo
    if (isVideo && file.size > 4 * 1024 * 1024) {
      return NextResponse.json({
        error: 'Los videos mayores a 4MB deben subirse a YouTube/Vimeo y usar la URL.\n\nOpciones:\n1. Sube el video a YouTube y pega el URL\n2. Usa un video más pequeño (menos de 4MB)',
        isVideoTooLarge: true
      }, { status: 400 })
    }

    // Convertir archivo a base64 (funciona para imágenes y videos pequeños)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const mimeType = file.type || (isVideo ? 'video/mp4' : 'image/jpeg')
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
