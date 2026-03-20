'use client'

import { useEffect, useState, useCallback } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Loader2,
  Package,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  power: string
  image: string
  features: string
  brandId: string
  categoryId: string
  brand?: { id: string; name: string; color: string }
  category?: { id: string; name: string }
  featured: boolean
  active: boolean
  order: number
}

interface Brand {
  id: string
  name: string
  color: string
}

interface Category {
  id: string
  name: string
}

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBrand, setFilterBrand] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    power: '',
    image: '',
    features: '',
    brandId: '',
    categoryId: '',
    featured: false,
    active: true
  })

  const fetchData = useCallback(async () => {
    try {
      const [productsRes, brandsRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/products', { cache: 'no-store' }),
        fetch('/api/admin/brands', { cache: 'no-store' }),
        fetch('/api/admin/categories', { cache: 'no-store' })
      ])

      const productsData = await productsRes.json()
      const brandsData = await brandsRes.json()
      const categoriesData = await categoriesRes.json()

      setProducts(productsData)
      setBrands(brandsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBrand = filterBrand === 'all' || product.brandId === filterBrand
    return matchesSearch && matchesBrand
  })

  function openCreateDialog() {
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      power: '',
      image: '',
      features: '',
      brandId: brands[0]?.id || '',
      categoryId: categories[0]?.id || '',
      featured: false,
      active: true
    })
    setIsDialogOpen(true)
  }

  function openEditDialog(product: Product) {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      power: product.power,
      image: product.image,
      features: product.features,
      brandId: product.brandId,
      categoryId: product.categoryId,
      featured: product.featured,
      active: product.active
    })
    setIsDialogOpen(true)
  }

  async function handleSave() {
    if (!formData.name || !formData.brandId || !formData.categoryId) {
      toast({
        title: 'Error',
        description: 'Por favor complete los campos requeridos',
        variant: 'destructive'
      })
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        features: formData.features
      }

      if (editingProduct) {
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        
        if (!res.ok) throw new Error('Error al actualizar')
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        
        if (!res.ok) throw new Error('Error al crear')
      }

      toast({
        title: 'Éxito',
        description: editingProduct ? 'Producto actualizado correctamente' : 'Producto creado correctamente'
      })

      setIsDialogOpen(false)
      await fetchData()
      router.refresh()
    } catch (error) {
      console.error('Error saving product:', error)
      toast({
        title: 'Error',
        description: 'No se pudo guardar el producto',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Está seguro de eliminar este producto?')) return

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      
      toast({
        title: 'Éxito',
        description: 'Producto eliminado correctamente'
      })
      await fetchData()
      router.refresh()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el producto',
        variant: 'destructive'
      })
    }
  }

  async function toggleActive(product: Product) {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, active: !product.active })
      })
      if (!res.ok) throw new Error('Error al actualizar')
      
      await fetchData()
      router.refresh()
    } catch (error) {
      console.error('Error toggling product:', error)
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el producto',
        variant: 'destructive'
      })
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600 mt-1">{products.length} productos en total</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-[#BE1E2D] hover:bg-[#9B1829]">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Filters */}
      <Card className="border border-gray-100">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterBrand} onValueChange={setFilterBrand}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las marcas</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map(product => (
          <Card key={product.id} className={`border border-gray-100 overflow-hidden ${!product.active ? 'opacity-60' : ''}`}>
            <div className="relative aspect-square bg-gray-100">
              <img
                src={product.image || '/images/placeholder.png'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder.png'
                }}
              />
              {product.brand && (
                <Badge 
                  className="absolute top-2 left-2"
                  style={{ backgroundColor: product.brand.color, color: 'white' }}
                >
                  {product.brand.name}
                </Badge>
              )}
              {product.featured && (
                <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
                  Destacado
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{product.power}</p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => openEditDialog(product)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => toggleActive(product)}
                  >
                    {product.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Badge variant={product.active ? "default" : "secondary"}>
                  {product.active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron productos</p>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nombre del producto"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del producto"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="power">Potencia</Label>
                <Input
                  id="power"
                  value={formData.power}
                  onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                  placeholder="Ej: 18V, 900W"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">URL de Imagen</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/producto.jpg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="brand">Marca *</Label>
                <Select value={formData.brandId} onValueChange={(value) => setFormData({ ...formData, brandId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map(brand => (
                      <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="features">Características (una por línea)</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="18V Li-Ion&#10;Motor BL&#10;Maletín incluido"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label>Destacado</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label>Activo</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-[#BE1E2D] hover:bg-[#9B1829]">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
