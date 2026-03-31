import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { head } from '@vercel/blob'

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

    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop() || (isVideo ? 'mp4' : 'jpg')
    const fileName = `uploads/${isVideo ? 'videos' : 'images'}-${timestamp}-${randomStr}.${extension}`

    // Intentar subir a Vercel Blob Storage
    try {
      const blob = await put(fileName, file, {
        access: 'public',
        addRandomSuffix: false,
      })

      return NextResponse.json({
        success: true,
        url: blob.url,
        fileName: file.name
      })
    } catch (blobError: any) {
      console.error('Blob storage error:', blobError)

      // Si el error es de autenticación del token
      if (blobError.message?.includes('token') || blobError.message?.includes('secret') || blobError.message?.includes('auth')) {
        return NextResponse.json(
          { error: 'Error de configuración: BLOB_READ_WRITE_TOKEN no configurado. Por favor, configura el token en Vercel.' },
          { status: 500 }
        )
      }

      // Para otros errores, devolver el mensaje
      return NextResponse.json(
        { error: `Error al subir a Blob Storage: ${blobError.message || 'Error desconocido'}` },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Error al subir el archivo: ' + (error instanceof Error ? error.message : 'Error desconocido') },
      { status: 500 }
    )
  }
}
