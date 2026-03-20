'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Wrench, 
  Settings, 
  Zap, 
  Shield, 
  Truck, 
  Users, 
  ChevronRight, 
  Menu, 
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Award,
  TrendingUp,
  HeartHandshake
} from 'lucide-react'

// Servicios de Maquinarias Landau
const services = [
  {
    id: 1,
    title: "Venta de Herramientas Eléctricas",
    description: "Amplio catálogo de taladros, amoladoras, sierras y herramientas eléctricas de Bosch y Makita para uso profesional e industrial.",
    image: "/images/service_1.png",
    features: ["Bosch", "Makita", "Garantía Oficial"],
    icon: Zap
  },
  {
    id: 2,
    title: "Servicio Técnico Especializado",
    description: "Taller propio con técnicos certificados para reparación y mantenimiento de todas las marcas que comercializamos.",
    image: "/images/service_2.png",
    features: ["Reparaciones", "Mantenimiento", "Repuestos Originales"],
    icon: Settings
  },
  {
    id: 3,
    title: "Herramientas Neumáticas",
    description: "Compresores, pistolas de aire, llaves de impacto y toda la línea neumática industrial para sus proyectos más exigentes.",
    image: "/images/service_3.png",
    features: ["Compresores", "Neumáticos", "Accesorios"],
    icon: Wrench
  },
  {
    id: 4,
    title: "Afilado de Herramientas",
    description: "Servicio profesional de afilado para sierras, brocas, cuchillas y todo tipo de herramientas de corte industrial.",
    image: "/images/service_4.png",
    features: ["Sierras", "Brocas", "Cuchillas"],
    icon: Shield
  },
  {
    id: 5,
    title: "Venta Mayorista B2B",
    description: "Precios especiales para empresas, contratistas y distribuidores. Atención personalizada y entregas programadas.",
    image: "/images/service_5.png",
    features: ["Precios Especiales", "Crédito", "Entregas"],
    icon: Truck
  },
  {
    id: 6,
    title: "Asesoría Técnica Profesional",
    description: "Equipo de expertos para ayudarte a elegir la herramienta correcta según tu aplicación y presupuesto.",
    image: "/images/service_6.png",
    features: ["Consultoría", "Capacitación", "Soporte"],
    icon: Users
  }
]

// Testimonios
const testimonials = [
  {
    name: "Carlos Rodríguez",
    role: "Jefe de Mantenimiento",
    company: "Industrias Metalúrgicas del Valle",
    content: "Llevamos 15 años trabajando con Maquinarias Landau. Su servicio técnico es impecable y siempre tienen los repuestos que necesitamos.",
    rating: 5
  },
  {
    name: "María Fernanda López",
    role: "Gerente de Compras",
    company: "Constructora Andina S.A.S.",
    content: "La asesoría que recibimos fue fundamental para optimizar nuestra inversión en herramientas. Profesionales de verdad.",
    rating: 5
  },
  {
    name: "Andrés Felipe Zapata",
    role: "Propietario",
    company: "Carpintería Zapata",
    content: "Desde que descubrí Maquinarias Landau, no voy a otro lado. Atención personalizada y precios justos. La tradición se nota.",
    rating: 5
  }
]

// Métricas
const metrics = [
  { value: 75, suffix: "+", label: "Años de Experiencia" },
  { value: 50000, suffix: "+", label: "Clientes Satisfechos" },
  { value: 200, suffix: "+", label: "Marcas Disponibles" },
  { value: 15, suffix: "", label: "Técnicos Certificados" }
]

// Flip Card Component
function FlipCard({ service, index }: { service: typeof services[0]; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const Icon = service.icon

  return (
    <div 
      className="flip-card cursor-pointer group"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`flip-card-inner ${isFlipped ? 'transform rotate-y-180' : ''}`}>
        {/* Front */}
        <div className="flip-card-front">
          <div className="relative w-full h-full">
            <img 
              src={service.image} 
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#BE1E2D]/20 backdrop-blur-sm flex items-center justify-center border border-[#BE1E2D]/30">
                  <Icon className="w-5 h-5 text-[#BE1E2D]" />
                </div>
                <Badge variant="outline" className="border-[#BE1E2D]/30 text-[#f87171] text-xs">
                  Servicio {service.id}
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-white">{service.title}</h3>
            </div>
          </div>
        </div>
        
        {/* Back */}
        <div className="flip-card-back bg-white shadow-xl p-6 flex flex-col justify-center border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#BE1E2D]/20 flex items-center justify-center border border-[#BE1E2D]/30">
              <Icon className="w-5 h-5 text-[#BE1E2D]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">{service.description}</p>
          <div className="flex flex-wrap gap-2">
            {service.features.map((feature, idx) => (
              <Badge 
                key={idx} 
                className="bg-[#BE1E2D]/20 text-[#f87171] border border-[#BE1E2D]/30 hover:bg-[#BE1E2D]/30"
              >
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Counter Component
function Counter({ end, suffix, duration = 2000 }: { end: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return
    
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [end, duration, hasStarted])

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">
        {count.toLocaleString()}{suffix}
      </div>
    </div>
  )
}

// Particle Background Component - Fixed hydration issue
function ParticleBackground() {
  const [particles, setParticles] = useState<Array<{
    left: number;
    top: number;
    delay: number;
    duration: number;
    opacity: number;
    width: number;
    height: number;
  }>>([])

  useEffect(() => {
    // Generate particles only on client side to avoid hydration mismatch
    const generatedParticles = [...Array(30)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 15 + Math.random() * 10,
      opacity: 0.3 + Math.random() * 0.4,
      width: 2 + Math.random() * 4,
      height: 2 + Math.random() * 4,
    }))
    setParticles(generatedParticles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            opacity: particle.opacity,
            width: `${particle.width}px`,
            height: `${particle.height}px`,
          }}
        />
      ))}
    </div>
  )
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden">
      {/* Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl border-b border-[#BE1E2D]/10 shadow-lg shadow-black/10' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#" className="flex items-center">
              <img 
                src="/images/logo.png" 
                alt="Maquinarias Landau" 
                className="h-16 w-auto"
              />
            </a>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="#servicios" className="text-gray-500 hover:text-gray-800 transition-colors relative group">
                Servicios
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#BE1E2D] transition-all group-hover:w-full" />
              </a>
              <a href="/catalogo" className="text-gray-500 hover:text-gray-800 transition-colors relative group">
                Catálogo
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#BE1E2D] transition-all group-hover:w-full" />
              </a>
              <a href="#nosotros" className="text-gray-500 hover:text-gray-800 transition-colors relative group">
                Nosotros
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#BE1E2D] transition-all group-hover:w-full" />
              </a>
              <a href="#testimonios" className="text-gray-500 hover:text-gray-800 transition-colors relative group">
                Testimonios
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#BE1E2D] transition-all group-hover:w-full" />
              </a>
              <a href="#contacto" className="text-gray-500 hover:text-gray-800 transition-colors relative group">
                Contacto
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#BE1E2D] transition-all group-hover:w-full" />
              </a>
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Button className="btn-primary animate-pulse-glow">
                <Phone className="w-4 h-4 mr-2" />
                Contáctanos
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-[#BE1E2D]/10 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <a href="#servicios" className="block text-gray-600 hover:text-gray-900 py-2" onClick={() => setIsMenuOpen(false)}>
                Servicios
              </a>
              <a href="/catalogo" className="block text-gray-600 hover:text-gray-900 py-2" onClick={() => setIsMenuOpen(false)}>
                Catálogo
              </a>
              <a href="#nosotros" className="block text-gray-600 hover:text-gray-900 py-2" onClick={() => setIsMenuOpen(false)}>
                Nosotros
              </a>
              <a href="#testimonios" className="block text-gray-600 hover:text-gray-900 py-2" onClick={() => setIsMenuOpen(false)}>
                Testimonios
              </a>
              <a href="#contacto" className="block text-gray-600 hover:text-gray-900 py-2" onClick={() => setIsMenuOpen(false)}>
                Contacto
              </a>
              <Button className="w-full btn-primary mt-4">
                <Phone className="w-4 h-4 mr-2" />
                Contáctanos
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F5F5F5] to-white" />
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-20"
          style={{ 
            background: 'radial-gradient(ellipse at center, rgba(190, 30, 45, 0.3) 0%, transparent 70%)' 
          }}
        />
        <ParticleBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <Badge className="mb-6 bg-[#BE1E2D]/20 text-[#f87171] border border-[#BE1E2D]/30 animate-fade-in-up">
                <Award className="w-4 h-4 mr-2" />
                +75 Años de Trayectoria
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Potencia y Precisión
                <span className="block glow-text">para tu Trabajo</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Distribuidores oficiales de <span className="text-gray-900 font-semibold">Bosch</span> y <span className="text-gray-900 font-semibold">Makita</span>.
                Más de 75 años liderando en herramientas industriales con servicio técnico propio y asesoría profesional.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <a href="/catalogo" className="btn-primary text-lg animate-pulse-glow inline-flex items-center">
                  Ver Catálogo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
                <button className="bg-gray-800 text-gray-200 hover:bg-gray-700 text-lg font-semibold border border-gray-600 rounded-xl transition-all duration-300" style={{padding: '16px 32px'}}>
                  <Phone className="w-5 h-5 mr-2 inline" />
                  Servicio Técnico
                </button>
              </div>

              {/* Brands */}
              <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <p className="text-sm text-gray-500 mb-4 uppercase tracking-wider">Marcas oficiales</p>
                <div className="flex items-center gap-8 justify-center lg:justify-start">
                  <div className="text-2xl font-bold text-gray-500 hover:text-gray-800 transition-colors">BOSCH</div>
                  <div className="text-2xl font-bold text-gray-500 hover:text-gray-800 transition-colors">MAKITA</div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative animate-fade-in-rotate hidden lg:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Glow background */}
                <div 
                  className="absolute inset-0 rounded-full blur-3xl opacity-40"
                  style={{ 
                    background: 'radial-gradient(ellipse at center, rgba(190, 30, 45, 0.4) 0%, transparent 70%)' 
                  }}
                />
                
                {/* Main image */}
                <img 
                  src="/images/hero_visual.png" 
                  alt="Maquinarias Landau - Herramientas Industriales"
                  className="relative z-10 w-full h-full object-contain animate-float drop-shadow-2xl"
                />
                
                {/* Decorative ring */}
                <div 
                  className="absolute inset-4 rounded-full border-2 border-[#BE1E2D]/20 animate-spin-slow"
                  style={{ animationDuration: '30s' }}
                />
                <div 
                  className="absolute inset-8 rounded-full border border-[#BE1E2D]/10"
                  style={{ animation: 'spin-slow 40s linear infinite reverse' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#BE1E2D]/50 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-[#BE1E2D] rounded-full" />
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="relative py-16 bg-[#F5F5F5] border-y border-[#BE1E2D]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <Counter end={metric.value} suffix={metric.suffix} />
                <p className="text-gray-500 text-sm uppercase tracking-wider">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="relative py-24 bg-white">
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute top-1/4 left-0 w-[600px] h-[600px] rounded-full"
            style={{ 
              background: 'radial-gradient(ellipse at center, rgba(190, 30, 45, 0.15) 0%, transparent 70%)' 
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 animate-on-scroll">
            <Badge className="mb-4 bg-[#BE1E2D]/20 text-[#f87171] border border-[#BE1E2D]/30">
              Nuestros Servicios
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Soluciones Completas para
              <span className="glow-text"> tu Industria</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Desde la venta de herramientas hasta el servicio técnico especializado,
              ofrecemos todo lo que necesitas para mantener tu operación en óptimas condiciones.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <FlipCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="nosotros" className="relative py-24 bg-[#4D4D4D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative animate-on-scroll">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                <img 
                  src="/images/about_image.png" 
                  alt="Maquinarias Landau - Tradición desde 1949"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 glass-card p-6 animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#BE1E2D]/20 flex items-center justify-center border border-[#BE1E2D]/30">
                    <Award className="w-8 h-8 text-[#BE1E2D]" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">75+</div>
                    <p className="text-sm text-[#A1A1AA]">Años de Experiencia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="animate-on-scroll">
              <Badge className="mb-4 bg-[#BE1E2D]/20 text-[#f87171] border border-[#BE1E2D]/30">
                Sobre Nosotros
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Una Historia de
                <span className="glow-text"> Confianza</span>
              </h2>
              <p className="text-[#A1A1AA] text-lg mb-6 leading-relaxed">
                Desde 1949, <span className="text-white font-semibold">Maquinarias Landau</span> ha sido sinónimo de calidad y confianza 
                en el sector de herramientas industriales. Como empresa familiar de tercera generación, hemos construido 
                nuestra reputación sobre la base del servicio personalizado y la excelencia técnica.
              </p>
              <p className="text-[#A1A1AA] text-lg mb-8 leading-relaxed">
                Somos distribuidores oficiales de marcas líderes como <span className="text-white font-semibold">Bosch</span> y 
                <span className="text-white font-semibold"> Makita</span>, y contamos con un servicio técnico propio que garantiza 
                que tus herramientas siempre operen al máximo rendimiento.
              </p>

              {/* Features list */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: CheckCircle, text: "Distribuidor Autorizado Bosch" },
                  { icon: CheckCircle, text: "Distribuidor Autorizado Makita" },
                  { icon: CheckCircle, text: "Servicio Técnico Propio" },
                  { icon: CheckCircle, text: "Asesoría Profesional" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-[#BE1E2D] flex-shrink-0" />
                    <span className="text-white">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="relative py-24 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 animate-on-scroll">
            <Badge className="mb-4 bg-[#BE1E2D]/20 text-[#f87171] border border-[#BE1E2D]/30">
              Testimonios
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Lo que Dicen
              <span className="glow-text"> Nuestros Clientes</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Miles de profesionales y empresas confían en nosotros. Conoce por qué somos
              referentes en el sector de herramientas industriales.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-lg border border-gray-100 animate-on-scroll" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-[#BE1E2D] fill-[#BE1E2D]" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-gray-700 mb-6 leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#BE1E2D] to-[#881520] flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-xs text-gray-500">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(190, 30, 45, 0.15) 0%, rgba(245, 245, 245, 1) 70%)'
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-[#BE1E2D]/10 text-[#BE1E2D] border border-[#BE1E2D]/20">
            <HeartHandshake className="w-4 h-4 mr-2" />
            Estamos para Ayudarte
          </Badge>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            ¿Listo para Potenciar
            <span className="glow-text"> tu Trabajo?</span>
          </h2>

          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Visítanos en nuestra tienda o contáctanos para recibir asesoría personalizada.
            Más de 75 años nos respaldan.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/catalogo" className="btn-primary text-lg animate-pulse-glow inline-flex items-center" style={{padding: '16px 40px'}}>
              Ver Catálogo
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
            <button className="bg-transparent text-gray-800 hover:text-gray-900 text-lg font-semibold border-2 border-[#BE1E2D]/50 hover:border-[#BE1E2D] hover:bg-[#BE1E2D]/5 rounded-xl transition-all duration-300" style={{padding: '16px 40px'}}>
              <Phone className="w-5 h-5 mr-2 inline" />
              Llamar Ahora
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="relative py-24 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#BE1E2D]/20 text-[#f87171] border border-[#BE1E2D]/30">
              Contacto
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Estamos para
              <span className="glow-text"> Servirte</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Visítanos en nuestra tienda física o contáctanos por cualquiera de estos medios.
              Nuestro equipo está listo para atenderte.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="animate-on-scroll bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-6 text-lg">Información de Contacto</h3>
              
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#BE1E2D]/20 flex items-center justify-center border border-[#BE1E2D]/30">
                    <MapPin className="w-5 h-5 text-[#BE1E2D]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Dirección</h4>
                    <p className="text-gray-600 text-sm">Av. Asamblea 524, C1424</p>
                    <p className="text-gray-600 text-sm">CABA, Argentina</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#BE1E2D]/20 flex items-center justify-center border border-[#BE1E2D]/30">
                    <Phone className="w-5 h-5 text-[#BE1E2D]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Teléfono</h4>
                    <p className="text-gray-600 text-sm">4921-7875 / 4923-0918</p>
                    <p className="text-gray-600 text-sm">11 6242 2197 (WhatsApp)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#BE1E2D]/20 flex items-center justify-center border border-[#BE1E2D]/30">
                    <Mail className="w-5 h-5 text-[#BE1E2D]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Email</h4>
                    <p className="text-gray-600 text-sm">landaumaq2@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#BE1E2D]/20 flex items-center justify-center border border-[#BE1E2D]/30">
                    <Clock className="w-5 h-5 text-[#BE1E2D]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Horario</h4>
                    <p className="text-gray-600 text-sm">Lun-Jue: 9:30-17:00</p>
                    <p className="text-gray-600 text-sm">Vie: 9:30-14:00 | Sáb: 8:00-13:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-on-scroll bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-6 text-lg">Envíanos un Mensaje</h3>
              
              <form className="space-y-4" action="https://formsubmit.co/landaumaq2@gmail.com" method="POST">
                <input type="hidden" name="_subject" value="Nuevo mensaje desde Maquinarias Landau" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#BE1E2D] focus:ring-2 focus:ring-[#BE1E2D]/20 outline-none transition-all text-sm"
                    placeholder="Tu nombre"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#BE1E2D] focus:ring-2 focus:ring-[#BE1E2D]/20 outline-none transition-all text-sm"
                    placeholder="tu@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input 
                    type="tel" 
                    name="phone"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#BE1E2D] focus:ring-2 focus:ring-[#BE1E2D]/20 outline-none transition-all text-sm"
                    placeholder="Tu número de teléfono"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                  <textarea 
                    name="message"
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#BE1E2D] focus:ring-2 focus:ring-[#BE1E2D]/20 outline-none transition-all text-sm resize-none"
                    placeholder="¿En qué podemos ayudarte?"
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="w-full btn-primary py-3 text-sm"
                >
                  Enviar Mensaje
                  <ArrowRight className="w-4 h-4 ml-2 inline" />
                </button>
              </form>
            </div>

            {/* Map */}
            <div className="animate-on-scroll">
              <div className="bg-white shadow-lg border border-gray-100 h-full min-h-[400px] rounded-2xl overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.8463!2d-58.4359885!3d-34.6342724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccbb37212985b%3A0xa5539ac08a79546f!2sLandau%20Maquinarias!5e0!3m2!1ses!2sar!4v1700000000000"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, minHeight: '400px' }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-2xl"
                ></iframe>
              </div>
              <a 
                href="https://maps.app.goo.gl/BTVKzxeY8xwDDX5JA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-[#BE1E2D] hover:text-[#881520] font-medium text-sm"
              >
                <MapPin className="w-4 h-4" />
                Ver ubicación exacta en Google Maps
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[#F5F5F5] border-t border-[#BE1E2D]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="mb-4">
                <img src="/images/logo.png" alt="Maquinarias Landau" className="h-14 w-auto" />
              </div>
              <p className="text-gray-600 text-sm mb-6">
                Potencia y precisión para tu trabajo desde 1949. Distribuidores oficiales de Bosch y Makita.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-[#BE1E2D]/20 flex items-center justify-center border border-[#BE1E2D]/30 hover:bg-[#BE1E2D]/30 transition-colors">
                  <svg className="w-5 h-5 text-[#BE1E2D]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-[#BE1E2D]/20 flex items-center justify-center border border-[#BE1E2D]/30 hover:bg-[#BE1E2D]/30 transition-colors">
                  <svg className="w-5 h-5 text-[#BE1E2D]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-[#BE1E2D]/20 flex items-center justify-center border border-[#BE1E2D]/30 hover:bg-[#BE1E2D]/30 transition-colors">
                  <svg className="w-5 h-5 text-[#BE1E2D]" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                </a>
              </div>
            </div>

            {/* Services Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Servicios</h3>
              <ul className="space-y-3">
                {['Venta de Herramientas', 'Servicio Técnico', 'Herramientas Neumáticas', 'Afilado', 'Venta Mayorista', 'Asesoría Técnica'].map((item) => (
                  <li key={item}>
                    <a href="#servicios" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brands */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Marcas</h3>
              <ul className="space-y-3">
                {['Bosch', 'Makita', 'Stanley', 'DeWalt', ' Milwaukee', 'Y más...'].map((item) => (
                  <li key={item}>
                    <span className="text-gray-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contacto</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-600 text-sm">
                  <Phone className="w-4 h-4 text-[#BE1E2D]" />
                  4921-7875 / 4923-0918
                </li>
                <li className="flex items-center gap-2 text-gray-600 text-sm">
                  <Mail className="w-4 h-4 text-[#BE1E2D]" />
                  landaumaq2@gmail.com
                </li>
                <li className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 text-[#BE1E2D]" />
                  Av. Asamblea 524, CABA
                </li>
                <li className="flex items-center gap-2 text-gray-600 text-sm">
                  <Clock className="w-4 h-4 text-[#BE1E2D]" />
                  Lun-Jue: 9:30-17:00
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-[#BE1E2D]/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 Maquinarias Landau. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-gray-800 text-sm transition-colors">
                Términos y Condiciones
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-800 text-sm transition-colors">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/5491162422197?text=Hola,%20me%20interesa%20obtener%20información%20sobre%20sus%20productos"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        aria-label="Contactar por WhatsApp"
      >
        <svg 
          className="w-7 h-7 text-white" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="absolute right-full mr-3 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          ¡Chateá con nosotros!
        </span>
      </a>
    </div>
  )
}
