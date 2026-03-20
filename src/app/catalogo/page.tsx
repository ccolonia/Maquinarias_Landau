'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Menu, 
  X,
  Phone,
  ShoppingCart,
  Filter,
  Search
} from 'lucide-react'

// Marcas disponibles
const brands = [
  { id: 'bosch', name: 'Bosch', color: '#E31837' },
  { id: 'makita', name: 'Makita', color: '#0047AB' },
  { id: 'cortarapid', name: 'CortaRapid', color: '#FF6600' },
  { id: 'skil', name: 'Skil', color: '#E31837' },
  { id: 'ganmar', name: 'Línea Ganmar', color: '#1E5631' },
  { id: 'aleba', name: 'Soldadoras Aleba', color: '#1E3A5F' }
]

// Catálogo de productos por marca
const products = {
  bosch: [
    {
      id: 1,
      name: 'Amoladora GWS 18V-8 Bosch SB',
      category: 'Amoladoras',
      power: '18V',
      description: 'Amoladora angular inalámbrica Bosch Professional 18V. Compacta y ergonómica para trabajos de corte y desbaste.',
      image: '/images/bosch_real/product_1.jpg',
      features: ['18V Li-Ion', 'Disco 125mm', '8500 RPM', 'Maletín incluido']
    },
    {
      id: 2,
      name: 'Taladro Percutor GSB 12V-30',
      category: 'Taladros',
      power: '12V',
      description: 'Taladro percutor inalámbrico Bosch 12V compacto. Ideal para perforaciones en concreto, madera y metal.',
      image: '/images/bosch_real/product_2.jpg',
      features: ['12V Li-Ion', 'Mandril 10mm', 'Motor potente', 'Compacto']
    },
    {
      id: 3,
      name: 'Amoladora GWS 18V-10',
      category: 'Amoladoras',
      power: '18V',
      description: 'Amoladora angular inalámbrica Bosch Professional 5" con alta potencia y autonomía prolongada.',
      image: '/images/bosch_real/product_3.jpg',
      features: ['18V Li-Ion', 'Disco 125mm', '10000 RPM', 'Profesional']
    },
    {
      id: 4,
      name: 'Taladro Percutor GSB 18V-50',
      category: 'Taladros',
      power: '18V',
      description: 'Taladro percutor inalámbrico Bosch 18V con motor sin escobillas. Alto rendimiento para trabajos pesados.',
      image: '/images/bosch_real/product_4.jpg',
      features: ['18V Li-Ion', 'Motor BL', 'Mandril 13mm', 'Percutor']
    },
    {
      id: 5,
      name: 'Amoladora GWS 18V-10 PSC',
      category: 'Amoladoras',
      power: '18V',
      description: 'Amoladora angular inalámbrica Bosch con control de velocidad constante y conectividad Bluetooth.',
      image: '/images/bosch_real/product_5.jpg',
      features: ['18V Li-Ion', 'Speed Control', 'Bluetooth', 'Maletín']
    },
    {
      id: 6,
      name: 'Amoladora Recta GGS 18V-23 PLC',
      category: 'Amoladoras',
      power: '18V',
      description: 'Amoladora recta inalámbrica Bosch Professional para trabajos de precisión en metal.',
      image: '/images/bosch_real/product_6.jpg',
      features: ['18V Li-Ion', '23000 RPM', 'Cabezal 43mm', 'Maletín']
    },
    {
      id: 7,
      name: 'Combo Bosch GSB 185-LI + GWS 180-LI',
      category: 'Combos',
      power: '18V',
      description: 'Combo profesional Bosch: Taladro percutor GSB 185-LI + Amoladora GWS 180-LI. Incluye 2 baterías 18V.',
      image: '/images/bosch_real/product_7.jpg',
      features: ['18V 2B', 'Taladro + Amoladora', 'Motor BL', 'Maletín']
    },
    {
      id: 8,
      name: 'Amoladora GWX 18V-10 PC',
      category: 'Amoladoras',
      power: '18V',
      description: 'Amoladora inalámbrica Bosch con tecnología X-LOCK para cambio rápido de disco sin herramientas.',
      image: '/images/bosch_real/product_8.jpg',
      features: ['18V Li-Ion', 'X-LOCK', '100mm disco', 'Maletín']
    }
  ],
  makita: [
    {
      id: 1,
      name: 'Taladro Percutor HP333D',
      category: 'Taladros',
      power: '18V',
      description: 'Taladro percutor a batería con motor sin escobillas. Compacto, potente y con gran autonomía.',
      image: '/images/product_makita_1.png',
      features: ['18V Li-Ion', 'Motor BL', '0-1900 RPM', '2 baterías incluidas']
    },
    {
      id: 2,
      name: 'Amoladora Angular GA5030',
      category: 'Amoladoras',
      power: '900W',
      description: 'Amoladora angular con diseño ergonómico y protector ajustable sin herramientas. Máxima durabilidad.',
      image: '/images/product_makita_2.png',
      features: ['900W', 'Disco 125mm', '11.000 RPM', 'Protector ajustable']
    },
    {
      id: 3,
      name: 'Sierra Caladora JV103DZ',
      category: 'Sierras',
      power: '18V',
      description: 'Sierra caladora a batería con sistema de cambio rápido de hoja y soplador de polvo integrado.',
      image: '/images/product_makita_3.png',
      features: ['18V Li-Ion', '0-2600 SPM', 'Corte 135mm', '3 orbitales']
    },
    {
      id: 4,
      name: 'Rotomartillo HR2630',
      category: 'Rotomartillos',
      power: '800W',
      description: 'Rotomartillo SDS-Plus de 3 modos con torque de 2.9J. Sistema de amortiguación de vibraciones.',
      image: '/images/product_makita_4.png',
      features: ['800W', '2.9J impacto', 'SDS-Plus', 'AVT anti-vibración']
    },
    {
      id: 5,
      name: 'Tronzadora LC1230',
      category: 'Tronzadoras',
      power: '1650W',
      description: 'Tronzadora profesional para corte de metales con disco de 305mm. Mesa giratoria 45°.',
      image: '/images/product_makita_5.png',
      features: ['1650W', 'Disco 305mm', 'Mesa 45°', 'Tope ajustable']
    },
    {
      id: 6,
      name: 'Pistola de Calor HG5012',
      category: 'Termofusores',
      power: '1800W',
      description: 'Pistola de calor profesional con control de temperatura variable. Ideal para pintura, soldadura y termofusión.',
      image: '/images/product_makita_6.png',
      features: ['1800W', '80-550°C', '2 velocidades', 'Display digital']
    }
  ],
  cortarapid: [
    {
      id: 1,
      name: 'Amoladora 4½" CR-710',
      category: 'Amoladoras',
      power: '710W',
      description: 'Amoladora angular compacta para corte y desbaste. Diseño ergonómico con empuñadura antideslizante.',
      image: '/images/product_cortarapid_1.png',
      features: ['710W', 'Disco 115mm', '11.000 RPM', 'Diseño ergonómico']
    },
    {
      id: 2,
      name: 'Amoladora 7" CR-2000',
      category: 'Amoladoras',
      power: '2000W',
      description: 'Amoladora industrial de alta potencia para trabajos pesados de corte y desbaste en metales.',
      image: '/images/product_cortarapid_2.png',
      features: ['2000W', 'Disco 180mm', '8.500 RPM', 'Doble empuñadura']
    },
    {
      id: 3,
      name: 'Amoladora 9" CR-2200',
      category: 'Amoladoras',
      power: '2200W',
      description: 'Amoladora industrial de máximo rendimiento para aplicaciones profesionales exigentes.',
      image: '/images/product_cortarapid_3.png',
      features: ['2200W', 'Disco 230mm', '6.500 RPM', 'Protector reforzado']
    },
    {
      id: 4,
      name: 'Taladro Percutor CR-850',
      category: 'Taladros',
      power: '850W',
      description: 'Taladro percutor de alto rendimiento con mandril profesional de 13mm y velocidad variable.',
      image: '/images/product_cortarapid_4.png',
      features: ['850W', '0-3000 RPM', 'Mandril 13mm', 'Reversible']
    }
  ],
  skil: [
    {
      id: 1,
      name: 'Taladro Percutor 6265',
      category: 'Taladros',
      power: '650W',
      description: 'Taladro percutor con velocidad variable y reversibilidad. Ideal para bricolaje y trabajos ligeros.',
      image: '/images/product_skil_1.png',
      features: ['650W', '0-2800 RPM', 'Mandril 13mm', 'Reversible']
    },
    {
      id: 2,
      name: 'Amoladora Angular 9295',
      category: 'Amoladoras',
      power: '700W',
      description: 'Amoladora angular compacta y liviana para corte y desbaste en proyectos de bricolaje.',
      image: '/images/product_skil_2.png',
      features: ['700W', 'Disco 115mm', '11.000 RPM', 'Liviana 1.8kg']
    },
    {
      id: 3,
      name: 'Sierra Circular 5680',
      category: 'Sierras',
      power: '1200W',
      description: 'Sierra circular para cortes en madera con guías ajustables y extractor de polvo.',
      image: '/images/product_skil_3.png',
      features: ['1200W', 'Hoja 184mm', 'Profundidad 65mm', 'Guía láser']
    },
    {
      id: 4,
      name: 'Lijadora Orbital 7492',
      category: 'Lijadoras',
      power: '280W',
      description: 'Lijadora orbital para acabados finos en madera. Sistema de recolección de polvo integrado.',
      image: '/images/product_skil_4.png',
      features: ['280W', 'Plato 125mm', '12.000 OPM', 'Bolsa de polvo']
    },
    {
      id: 5,
      name: 'Sierra Caladora 4490',
      category: 'Sierras',
      power: '500W',
      description: 'Sierra caladora con 4 posiciones orbitales para cortes en madera, metal y plástico.',
      image: '/images/product_skil_5.png',
      features: ['500W', '0-3000 SPM', '4 orbitales', 'Soplador de polvo']
    }
  ],
  ganmar: [
    {
      id: 1,
      name: 'Compresor 50L GM-50',
      category: 'Compresores',
      power: '2HP',
      description: 'Compresor de aire de 50 litros con motor de 2HP. Ideal para talleres y trabajos neumáticos.',
      image: '/images/product_ganmar_1.png',
      features: ['2HP', '50 litros', '8 bar', 'Sin aceite']
    },
    {
      id: 2,
      name: 'Compresor 100L GM-100',
      category: 'Compresores',
      power: '3HP',
      description: 'Compresor industrial de 100 litros con doble cilindro para uso continuo en talleres.',
      image: '/images/product_ganmar_2.png',
      features: ['3HP', '100 litros', '10 bar', 'Doble cilindro']
    },
    {
      id: 3,
      name: 'Pistola de Impacto GI-450',
      category: 'Neumáticos',
      power: '450Nm',
      description: 'Llave de impacto neumática de 1/2" con torque de 450Nm. Ideal para trabajo automotriz.',
      image: '/images/product_ganmar_3.png',
      features: ['450Nm', '1/2"', '0-8000 RPM', '3 velocidades']
    },
    {
      id: 4,
      name: 'Llave de Impacto GI-680',
      category: 'Neumáticos',
      power: '680Nm',
      description: 'Llave de impacto profesional de 1/2" con alto torque para aplicaciones industriales.',
      image: '/images/product_ganmar_4.png',
      features: ['680Nm', '1/2"', 'Alta potencia', 'Empuñadura ergonómica']
    },
    {
      id: 5,
      name: 'Pistola de Pintura GP-821',
      category: 'Pintura',
      power: 'HVLP',
      description: 'Pistola pulverizadora HVLP para acabados profesionales. Sistema de baja presión alto volumen.',
      image: '/images/product_ganmar_5.png',
      features: ['HVLP', '1.4mm boquilla', 'Bajo consumo', 'Regulador']
    }
  ],
  aleba: [
    {
      id: 1,
      name: 'Soldadora Eléctrica Monof. 170 Amp Portátil',
      category: 'Soldadoras',
      power: '170A',
      description: 'Soldadora eléctrica monofásica portátil de 170 amperios. Ideal para trabajos ligeros y reparaciones.',
      image: '/images/product_aleba_1.png',
      features: ['Monofásica', '170 Amp', 'Portátil', 'Uso doméstico']
    },
    {
      id: 2,
      name: 'Soldadora Eléctrica Monof. 170 Amp c/Ruedas',
      category: 'Soldadoras',
      power: '170A',
      description: 'Soldadora eléctrica monofásica con ruedas de 170 amperios. Mayor movilidad en taller.',
      image: '/images/product_aleba_2.png',
      features: ['Monofásica', '170 Amp', 'Con ruedas', 'Taller']
    },
    {
      id: 3,
      name: 'Soldadora Eléctrica Monof. 200 Amp c/Ruedas',
      category: 'Soldadoras',
      power: '200A',
      description: 'Soldadora eléctrica monofásica con ruedas de 200 amperios. Para trabajos de media demanda.',
      image: '/images/product_aleba_3.png',
      features: ['Monofásica', '200 Amp', 'Con ruedas', 'Semi-industrial']
    },
    {
      id: 4,
      name: 'Soldadora Eléctrica Mono/Bif. 250 Amp c/Ruedas',
      category: 'Soldadoras',
      power: '250A',
      description: 'Soldadora eléctrica mono/bifásica de 250 amperios con ruedas. Versatilidad de conexión.',
      image: '/images/product_aleba_4.png',
      features: ['Mono/Bifásica', '250 Amp', 'Con ruedas', 'Industrial']
    },
    {
      id: 5,
      name: 'Soldadora Eléctrica Trifásica 250 Amp c/Ruedas',
      category: 'Soldadoras',
      power: '250A',
      description: 'Soldadora eléctrica trifásica industrial de 250 amperios. Para uso intensivo en taller.',
      image: '/images/product_aleba_5.png',
      features: ['Trifásica', '250 Amp', 'Con ruedas', 'Industrial']
    },
    {
      id: 6,
      name: 'Soldadora Eléctrica Trifásica 400 Amp c/Ruedas',
      category: 'Soldadoras',
      power: '400A',
      description: 'Soldadora eléctrica trifásica de alta potencia 400 amperios. Para trabajos pesados industriales.',
      image: '/images/product_aleba_6.png',
      features: ['Trifásica', '400 Amp', 'Con ruedas', 'Pesada']
    },
    {
      id: 7,
      name: 'Soldadora Portátil 150 Amp 4 Regulaciones',
      category: 'Soldadoras',
      power: '150A',
      description: 'Soldadora eléctrica monofásica portátil de 150 amperios con 4 regulaciones de corriente.',
      image: '/images/product_aleba_1.png',
      features: ['Monofásica', '150 Amp', '4 regulaciones', 'Portátil']
    },
    {
      id: 8,
      name: 'Soldadora Modelo 3000 Turbo c/Llave 30 Reg.',
      category: 'Soldadoras',
      power: '300A',
      description: 'Soldadora eléctrica monofásica turbo con llave y 30 regulaciones de corriente.',
      image: '/images/product_aleba_2.png',
      features: ['Monofásica', '300 Amp', '30 regulaciones', 'Turbo']
    }
  ]
}

// Categorías únicas
const allCategories = ['Todos', 'Taladros', 'Amoladoras', 'Sierras', 'Rotomartillos', 'Lijadoras', 'Atornilladores', 'Neumáticos', 'Compresores', 'Soldadoras', 'Plasma', 'Pintura', 'Termofusores', 'Tronzadoras', 'Combos', 'Tijeras']

export default function CatalogoPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState('bosch')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')

  // Filtrar productos
  const filteredProducts = products[selectedBrand as keyof typeof products].filter(product => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const currentBrand = brands.find(b => b.id === selectedBrand)

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg">
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
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-lg">
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
            <Badge className="mb-4 bg-[#BE1E2D]/20 text-[#f87171] border border-[#BE1E2D]/30">
              Catálogo de Productos
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Herramientas de <span className="glow-text">Calidad Profesional</span>
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
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Marcas
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

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Categorías</h3>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {allCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedCategory === category
                          ? 'bg-gray-100 text-gray-900 font-medium'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Productos */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: currentBrand?.color }}
                  >
                    {currentBrand?.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentBrand?.name}</h2>
                    <p className="text-sm text-gray-500">{filteredProducts.length} productos</p>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card 
                    key={product.id}
                    className="group bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#BE1E2D]/20 transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <Badge 
                        className="absolute top-3 left-3"
                        style={{ backgroundColor: currentBrand?.color, color: 'white' }}
                      >
                        {product.category}
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
                        {product.features.slice(0, 2).map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-600">
                            {feature}
                          </Badge>
                        ))}
                        {product.features.length > 2 && (
                          <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-600">
                            +{product.features.length - 2}
                          </Badge>
                        )}
                      </div>

                      <Button className="w-full btn-primary text-sm">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Consultar Disponibilidad
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No se encontraron productos con esos criterios.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

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
