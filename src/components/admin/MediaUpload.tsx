'use client'

import { useState, useRef } from 'react'
import { Upload, Link, X, Loader2, Video, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

interface MediaUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  accept?: 'image' | 'video' | 'both'
  className?: string
}

// Función para comprimir imagen antes de subir
async function compressImage(file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      let width = img.width
      let height = img.height

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      ctx?.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            reject(new Error('Error al comprimir imagen'))
          }
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => reject(new Error('Error al cargar imagen'))
    img.src = URL.createObjectURL(file)
  })
}

export function MediaUpload({
  value,
  onChange,
  label = 'Media',
  accept = 'both',
  className = ''
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Detectar si es video o imagen (incluye data URLs y URLs externas)
  const isVideo = value ? (
    /\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i.test(value) ||
    value.startsWith('data:video/') ||
    value.includes('youtube.com') ||
    value.includes('youtu.be') ||
    value.includes('vimeo.com')
  ) : false

  // Función mejorada para extraer ID de YouTube
  function getYouTubeId(url: string): string | null {
    if (!url) return null
    
    // Formato: youtube.com/watch?v=ID (con o sin www, con o sin parámetros adicionales)
    const watchMatch = url.match(/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/)
    if (watchMatch) return watchMatch[1]
    
    // Formato: youtube.com/embed/ID
    const embedMatch = url.match(/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
    if (embedMatch) return embedMatch[1]
    
    // Formato: youtu.be/ID
    const shortMatch = url.match(/(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/)
    if (shortMatch) return shortMatch[1]
    
    // Formato: youtube.com/v/ID (formato antiguo)
    const vMatch = url.match(/(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/)
    if (vMatch) return vMatch[1]
    
    // Formato: youtube.com/shorts/ID (YouTube Shorts)
    const shortsMatch = url.match(/(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/)
    if (shortsMatch) return shortsMatch[1]
    
    return null
  }

  // Extraer ID de Vimeo para previsualización
  function getVimeoId(url: string): string | null {
    if (!url) return null
    const vimeoMatch = url.match(/(?:www\.)?(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/)
    return vimeoMatch ? vimeoMatch[1] : null
  }

  const youtubeId = getYouTubeId(value)
  const vimeoId = getVimeoId(value)

  // Manejar subida de archivo
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    const isImage = file.type.startsWith('image/')
    const isVideoFile = file.type.startsWith('video/')

    if (accept === 'image' && !isImage) {
      toast({
        title: 'Error',
        description: 'Solo se permiten archivos de imagen',
        variant: 'destructive'
      })
      return
    }

    if (accept === 'video' && !isVideoFile) {
      toast({
        title: 'Error',
        description: 'Solo se permiten archivos de video',
        variant: 'destructive'
      })
      return
    }

    if (accept === 'both' && !isImage && !isVideoFile) {
      toast({
        title: 'Error',
        description: 'Solo se permiten archivos de imagen o video',
        variant: 'destructive'
      })
      return
    }

    // Para videos grandes, sugerir usar URL externa
    if (isVideoFile && file.size > 4 * 1024 * 1024) {
      toast({
        title: 'Video muy grande',
        description: 'Para videos mayores a 4MB, te recomendamos subirlo a YouTube o Vimeo y pegar la URL directamente.',
        variant: 'destructive',
        duration: 6000
      })
      return
    }

    setUploading(true)
    try {
      let fileToUpload = file

      // Comprimir imagen si es muy grande (> 500KB)
      if (isImage && file.size > 500 * 1024) {
        try {
          fileToUpload = await compressImage(file, 1200, 0.8)
          console.log(`Imagen comprimida: ${(file.size / 1024).toFixed(0)}KB → ${(fileToUpload.size / 1024).toFixed(0)}KB`)
        } catch (compressError) {
          console.warn('No se pudo comprimir, subiendo original:', compressError)
        }
      }

      // Validar tamaño máximo (4MB para videos, 10MB para imágenes)
      const maxSize = isVideoFile ? 4 * 1024 * 1024 : 10 * 1024 * 1024
      if (fileToUpload.size > maxSize) {
        throw new Error(`El archivo es muy grande. Máximo ${isVideoFile ? '4MB para videos' : '10MB para imágenes'}`)
      }

      const formData = new FormData()
      formData.append('file', fileToUpload)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        throw new Error(text.substring(0, 100) || 'Error del servidor')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}`)
      }

      if (data.success) {
        onChange(data.url)
        toast({
          title: 'Archivo subido',
          description: `El ${isVideoFile ? 'video' : 'imagen'} se ha subido correctamente`
        })
      } else {
        throw new Error(data.error || 'Error al subir archivo')
      }
    } catch (error) {
      console.error('Error uploading:', error)
      toast({
        title: 'Error',
        description: `No se pudo subir el archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Limpiar archivo
  function clearMedia() {
    onChange('')
  }

  // Determinar tipos aceptados
  const acceptTypes = accept === 'image'
    ? 'image/jpeg,image/png,image/gif,image/webp'
    : accept === 'video'
    ? 'video/mp4,video/webm,video/ogg,video/quicktime'
    : 'image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/ogg,video/quicktime'

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="flex items-center gap-2">
        {accept === 'video' ? <Video className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
        {label}
      </Label>

      {/* Preview de media */}
      {value && (
        <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
          {isVideo ? (
            youtubeId ? (
              // YouTube embed preview
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : vimeoId ? (
              // Vimeo embed preview
              <iframe
                src={`https://player.vimeo.com/video/${vimeoId}`}
                className="w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              // Video local
              <video
                src={value}
                className="w-full h-full object-cover"
                controls
                muted
                playsInline
              />
            )
          ) : (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder.png'
              }}
            />
          )}
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={clearMedia}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Input de URL */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={accept === 'video'
              ? 'URL de YouTube, Vimeo o archivo MP4'
              : accept === 'image'
              ? 'URL de imagen'
              : 'URL de imagen o video'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2 flex-wrap">
        {/* Subir archivo */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptTypes}
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="text-gray-700 border-gray-300 hover:bg-gray-100"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          Subir {accept === 'video' ? 'Video' : accept === 'image' ? 'Imagen' : 'Archivo'}
        </Button>
      </div>

      {/* Nota sobre tamaño */}
      {accept === 'video' && (
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Videos locales:</strong> Máximo 4MB (formato MP4, WebM, OGG)</p>
          <p><strong>Videos grandes:</strong> Sube a YouTube/Vimeo y pega la URL</p>
        </div>
      )}
    </div>
  )
}
