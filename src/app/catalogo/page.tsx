'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Menu, 
  X,
  Phone,
  ShoppingCart,
  Filter,
  Search,
  Loader2
} from 'lucide-react'

interface Brand {
  id: string
  name: string
  color: string
  slug: string
}

interface Category {
  id: string
  name: string
  slug: string
}

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
  brand: { id: string; name: string; color: string }
  category: { id: string; name: string }
}

export default function CatalogoPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Estados para datos dinámicos
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch datos al cargar
  useEffect(() => {
    async function fetchData() {
      try {
        const [brandsRes, categoriesRes, productsRes] = await Promise.all([
          fetch('/api/public/brands', { cache: 'no-store' }),
          fetch('/api/public/categories', { cache: 'no-store' }),
          fetch('/api/public/products', { cache: 'no-store' })
        ])
        
        const brandsData = await brandsRes.json()
        const categoriesData = await categoriesRes.json()
        const productsData = await productsRes.json()
        
        setBrands(brandsData)
        setCategories(categoriesData)
        setProducts(productsData)
        
        // Seleccionar primera marca por defecto
        if (brandsData && brandsData.length > 0) {
          setSelectedBrand(brandsData[0].id)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesBrand = !selectedBrand || product.brandId === selectedBrand
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesBrand && matchesCategory && matchesSearch
  })

  const currentBrand = brands.find(b => b.id === selectedBrand)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-[#BE1E2D]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="/" className="flex items-center">
              <img src="/images/logo.png" alt="Maquinarias Landau" className="h-16 w-auto" />
            </a>

            <div className="hidden lg:flex items-center gap-8">
              <a href="/" className="text-gray-500 hover:text-gray-800 transition-colors">Inicio</a>
              <a href="/#servicios" className="text-gray-500 hover:text-gray-800 transition-colors">Servicios</a>
              <a href="/catalogo" className="text-gray-800 font-semibold border-b-2 border-[#BE1E2D]">Catálogo</a>
              <a href="/#contacto" className="text-gray-500 hover:text-gray-800 transition-colors">Contacto</a>
            </div>

            <div className="hidden lg:block">
              <Button className="btn-primary">
                <Phone className="w-4 h-4 mr-2" />
                Contáctanos
              </Button>
            </div>

            <button className="lg:hidden p-2 text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200">
            <div className="px-4 py-6 space-y-4">
              <a href="/" className="block text-gray-600 hover:text-gray-900 py-2">Inicio</a>
              <a href="/#servicios" className="block text-gray-600 hover:text-gray-900 py-2">Servicios</a>
              <a href="/catalogo" className="block text-gray-900 font-semibold py-2">Catálogo</a>
              <a href="/#contacto" className="block text-gray-600 hover:text-gray-900 py-2">Contacto</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-8 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-[#BE1E2D]/20 text-[#BE1E2D] border border-[#BE1E2D]/30">
              Catálogo de Productos
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Herramientas de <span className="text-[#BE1E2D]">Calidad Profesional</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explora nuestra amplia gama de herramientas y equipos de las mejores marcas del mercado.
            </p>
          </div>

          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#BE1E2D] focus:ring-2 focus:ring-[#BE1E2D]/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contenido */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Marcas ({brands.length})
                </h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => setSelectedBrand(brand.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                        selectedBrand === brand.id
                          ? 'bg-[#BE1E2D]/10 text-[#BE1E2D] font-medium border border-[#BE1E2D]/20'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Categorías ({categories.length})</h3>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      !selectedCategory
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Todas
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedCategory === category.id
                          ? 'bg-gray-100 text-gray-900 font-medium'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Productos */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {currentBrand && (
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: currentBrand.color }}
                    >
                      {currentBrand.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentBrand?.name || 'Productos'}</h2>
                    <p className="text-sm text-gray-500">{filteredProducts.length} productos</p>
                  </div>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const features = typeof product.features === 'string' 
                      ? JSON.parse(product.features) 
                      : product.features
                    
                    return (
                      <Card 
                        key={product.id}
                        className="group bg-white border border-gray-100 hover:shadow-xl hover:border-[#BE1E2D]/20 transition-all duration-300 overflow-hidden"
                      >
                        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-110"
                          />
                          <Badge 
                            className="absolute top-3 left-3"
                            style={{ backgroundColor: product.brand?.color || '#BE1E2D', color: 'white' }}
                          >
                            {product.category?.name}
                          </Badge>
                          <Badge variant="outline" className="absolute top-3 right-3 bg-white/90">
                            {product.power}
                          </Badge>
                        </div>

                        <CardContent className="p-5">
                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#BE1E2D] transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                            {product.description}
                          </p>

                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {features && features.slice(0, 2).map((feature: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-600">
                                {feature}
                              </Badge>
                            ))}
                            {features && features.length > 2 && (
                              <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-600">
                                +{features.length - 2}
                              </Badge>
                            )}
                          </div>

                          <Button className="w-full btn-primary text-sm">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Consultar Disponibilidad
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No se encontraron productos con esos criterios.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/5491162422197"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        aria-label="Contactar por WhatsApp"
      >
        <svg
          className="w-7 h-7 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Footer */}
      <footer className="bg-[#F5F5F5] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2024 Maquinarias Landau. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <a href="/" className="text-gray-500 hover:text-gray-800 text-sm transition-colors">Volver al Inicio</a>
              <a href="/#contacto" className="text-gray-500 hover:text-gray-800 text-sm transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
