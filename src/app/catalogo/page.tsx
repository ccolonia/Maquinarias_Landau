'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Menu, 
  X,
  Phone,
  ExternalLink,
  FileText,
  Download
} from 'lucide-react'

export default function CatalogoPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
              <a href="/productos" className="text-gray-500 hover:text-gray-800 transition-colors">Productos</a>
              <a href="/catalogo" className="text-gray-800 font-semibold border-b-2 border-[#BE1E2D]">Catálogo</a>
              <a href="/#contacto" className="text-gray-500 hover:text-gray-800 transition-colors">Contacto</a>
            </div>

            <div className="hidden lg:block">
              <a href="/#contacto">
                <Button className="btn-primary">
                  <Phone className="w-4 h-4 mr-2" />
                  Contáctanos
                </Button>
              </a>
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
              <a href="/productos" className="block text-gray-600 hover:text-gray-900 py-2">Productos</a>
              <a href="/catalogo" className="block text-gray-900 font-semibold py-2">Catálogo</a>
              <a href="/#contacto" className="block text-gray-600 hover:text-gray-900 py-2">Contacto</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-[#BE1E2D]/20 text-[#BE1E2D] border border-[#BE1E2D]/30">
              <FileText className="w-4 h-4 mr-2" />
              Catálogos Oficiales
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Descarga los <span className="text-[#BE1E2D]">Catálogos</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Accede a los catálogos completos de nuestras marcas oficiales. Toda la información de productos, especificaciones técnicas y novedades en un solo lugar.
            </p>
          </div>
        </div>
      </section>

      {/* Catálogos */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Catálogo Bosch */}
            <a
              href="https://www.bosch-professional.com/ar/es/servicios/descargas/catalogos/"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="bg-white rounded-3xl border-2 border-gray-100 p-10 hover:shadow-2xl hover:border-[#0066B3]/40 transition-all duration-300 h-full relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#0066B3]/5 rounded-full -translate-y-20 translate-x-20" />
                
                <div className="relative">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-[#0066B3] flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                      B
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#0066B3] transition-colors">
                        Catálogo Bosch
                      </h3>
                      <p className="text-gray-500">Herramientas Profesionales</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    Descubre la gama completa de herramientas profesionales Bosch. Taladros, amoladoras, sierras, medición y más. Calidad alemana para profesionales exigentes.
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div>
                      <Badge variant="outline" className="text-[#0066B3] border-[#0066B3]/30 bg-[#0066B3]/5">
                        Q1 2026
                      </Badge>
                      <p className="text-sm text-gray-500 mt-2">Edición Interactiva</p>
                    </div>
                    <div className="flex items-center gap-3 text-[#0066B3] font-semibold text-lg">
                      <ExternalLink className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      <span>Descargar</span>
                    </div>
                  </div>
                </div>
              </div>
            </a>

            {/* Catálogo Makita */}
            <a
              href="https://makita.com.ar/productos/"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="bg-white rounded-3xl border-2 border-gray-100 p-10 hover:shadow-2xl hover:border-[#0097A7]/40 transition-all duration-300 h-full relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#0097A7]/5 rounded-full -translate-y-20 translate-x-20" />
                
                <div className="relative">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-[#0097A7] flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                      M
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#0097A7] transition-colors">
                        Catálogo Makita
                      </h3>
                      <p className="text-gray-500">Herramientas Eléctricas</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    Explora el catálogo oficial de Makita con herramientas eléctricas de alta calidad para profesionales y uso industrial. Innovación y rendimiento japonés.
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div>
                      <Badge variant="outline" className="text-[#0097A7] border-[#0097A7]/30 bg-[#0097A7]/5">
                        Oficial
                      </Badge>
                      <p className="text-sm text-gray-500 mt-2">Catálogos y Promociones</p>
                    </div>
                    <div className="flex items-center gap-3 text-[#0097A7] font-semibold text-lg">
                      <ExternalLink className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      <span>Descargar</span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Info adicional */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Necesitas más información?
            </h2>
            <p className="text-gray-600 mb-8">
              Si tienes dudas sobre algún producto o necesitas asesoría personalizada, no dudes en contactarnos. Nuestro equipo está listo para ayudarte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/productos">
                <Button variant="outline" size="lg" className="px-8">
                  Ver Productos en Tienda
                </Button>
              </a>
              <a href="/#contacto">
                <Button className="btn-primary" size="lg">
                  <Phone className="w-5 h-5 mr-2" />
                  Contáctanos
                </Button>
              </a>
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
              <a href="/productos" className="text-gray-500 hover:text-gray-800 text-sm transition-colors">Productos</a>
              <a href="/#contacto" className="text-gray-500 hover:text-gray-800 text-sm transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
