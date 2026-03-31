'use client'

import { useState, useRef } from 'react'
import { Upload, Sparkles, Link, X, Loader2, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  className?: string
}

// Función para comprimir imagen antes de subir
async function compressImage(file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo proporción
      let width = img.width
      let height = img.height
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      
      // Dibujar imagen redimensionada
      ctx?.drawImage(img, 0, 0, width, height)
      
      // Convertir a blob
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

export function ImageUpload({ value, onChange, label = 'Imagen', className = '' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [aiDialogOpen, setAiDialogOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiSize, setAiSize] = useState('1024x1024')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Manejar subida de archivo con compresión
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // Comprimir imagen si es muy grande (> 500KB)
      let fileToUpload = file
      if (file.size > 500 * 1024) {
        try {
          fileToUpload = await compressImage(file, 1200, 0.8)
          console.log(`Imagen comprimida: ${(file.size / 1024).toFixed(0)}KB → ${(fileToUpload.size / 1024).toFixed(0)}KB`)
        } catch (compressError) {
          console.warn('No se pudo comprimir, subiendo original:', compressError)
        }
      }

      const formData = new FormData()
      formData.append('file', fileToUpload)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      // Verificar si la respuesta es JSON válido
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
          title: 'Imagen subida',
          description: 'La imagen se ha subido correctamente'
        })
      } else {
        throw new Error(data.error || 'Error al subir imagen')
      }
    } catch (error) {
      console.error('Error uploading:', error)
      toast({
        title: 'Error',
        description: `No se pudo subir la imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Manejar generación con IA
  async function handleAIGenerate() {
    if (!aiPrompt.trim()) {
      toast({
        title: 'Error',
        description: 'Ingresa una descripción para generar la imagen',
        variant: 'destructive'
      })
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/admin/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, size: aiSize })
      })

      const data = await response.json()

      if (data.success) {
        onChange(data.url)
        setAiDialogOpen(false)
        setAiPrompt('')
        toast({
          title: 'Imagen generada',
          description: 'La imagen se ha generado con IA correctamente'
        })
      } else {
        throw new Error(data.error || 'Error al generar imagen')
      }
    } catch (error) {
      console.error('Error generating:', error)
      toast({
        title: 'Error',
        description: `No se pudo generar la imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: 'destructive'
      })
    } finally {
      setGenerating(false)
    }
  }

  // Limpiar imagen
  function clearImage() {
    onChange('')
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      
      {/* Preview de imagen */}
      {value && (
        <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
          <img 
            src={value} 
            alt="Preview" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/placeholder.png'
            }}
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={clearImage}
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
            placeholder="URL de imagen o subir/generar"
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
          accept="image/jpeg,image/png,image/gif,image/webp"
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
          Subir Archivo
        </Button>

        {/* Generar con IA */}
        <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-purple-600 border-purple-300 hover:bg-purple-50"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generar con IA
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Generar Imagen con IA</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Descripción de la imagen</Label>
                <Textarea
                  placeholder="Describe la imagen que deseas generar. Ej: Taladro eléctrico profesional en fondo blanco, estilo fotográfico publicitario..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tamaño</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: '1024x1024', label: 'Cuadrado (1024x1024)' },
                    { value: '1344x768', label: 'Horizontal (1344x768)' },
                    { value: '768x1344', label: 'Vertical (768x1344)' },
                    { value: '1152x864', label: 'Apaisado (1152x864)' },
                  ].map((size) => (
                    <Button
                      key={size.value}
                      type="button"
                      variant={aiSize === size.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAiSize(size.value)}
                      className={aiSize === size.value ? 'bg-[#BE1E2D] hover:bg-[#9B1829]' : ''}
                    >
                      {size.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setAiDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAIGenerate}
                disabled={generating || !aiPrompt.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {generating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Generar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
