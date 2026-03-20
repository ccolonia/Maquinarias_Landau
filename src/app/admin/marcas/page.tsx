'use client'

import { useEffect, useState } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Loader2,
  Tag,
  Palette
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface Brand {
  id: string
  name: string
  slug: string
  color: string
  logo: string | null
  description: string | null
  order: number
  active: boolean
  _count?: { products: number }
}

export default function MarcasPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    color: '#BE1E2D',
    logo: '',
    description: '',
    active: true
  })

  useEffect(() => {
    fetchBrands()
  }, [])

  async function fetchBrands() {
    try {
      const res = await fetch('/api/admin/brands')
      const data = await res.json()
      setBrands(data)
    } catch (error) {
      console.error('Error fetching brands:', error)
    } finally {
      setLoading(false)
    }
  }

  function openCreateDialog() {
    setEditingBrand(null)
    setFormData({
      name: '',
      color: '#BE1E2D',
      logo: '',
      description: '',
      active: true
    })
    setIsDialogOpen(true)
  }

  function openEditDialog(brand: Brand) {
    setEditingBrand(brand)
    setFormData({
      name: brand.name,
      color: brand.color,
      logo: brand.logo || '',
      description: brand.description || '',
      active: brand.active
    })
    setIsDialogOpen(true)
  }

  async function handleSave() {
    if (!formData.name) {
      alert('Por favor ingrese un nombre')
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-')
      }

      if (editingBrand) {
        await fetch(`/api/admin/brands/${editingBrand.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        await fetch('/api/admin/brands', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      setIsDialogOpen(false)
      fetchBrands()
    } catch (error) {
      console.error('Error saving brand:', error)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Está seguro de eliminar esta marca?')) return

    try {
      await fetch(`/api/admin/brands/${id}`, { method: 'DELETE' })
      fetchBrands()
    } catch (error) {
      console.error('Error deleting brand:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#BE1E2D]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marcas</h1>
          <p className="text-gray-600 mt-1">{brands.length} marcas registradas</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-[#BE1E2D] hover:bg-[#9B1829]">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Marca
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map(brand => (
          <Card key={brand.id} className={`border border-gray-100 ${!brand.active ? 'opacity-60' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                    style={{ backgroundColor: brand.color }}
                  >
                    {brand.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{brand.name}</h3>
                    <p className="text-sm text-gray-500">
                      {brand._count?.products || 0} productos
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(brand)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(brand.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {brand.description && (
                <p className="text-sm text-gray-600 mt-4 line-clamp-2">{brand.description}</p>
              )}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <Palette className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">{brand.color}</span>
                </div>
                <Badge variant={brand.active ? "default" : "secondary"} className="ml-auto">
                  {brand.active ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBrand ? 'Editar Marca' : 'Nueva Marca'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nombre de la marca"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#BE1E2D"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="logo">URL del Logo</Label>
              <Input
                id="logo"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="/images/logo-marca.png"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción de la marca"
                rows={2}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <Label>Marca activa</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-[#BE1E2D] hover:bg-[#9B1829]">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editingBrand ? 'Guardar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
