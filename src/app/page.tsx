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
  HeartHandshake,
  Loader2
} from 'lucide-react'

// Icon map for dynamic icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap, Settings, Wrench, Shield, Truck, Users
}

interface Service {
  id: string
  title: string
  description: string
  image: string
  features: string
  icon: string
  order: number
}

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
}

interface SiteConfig {
  siteName: string
  heroTitle?: string
  heroSubtitle?: string
  heroDescription?: string
  address?: string
  phone?: string
  whatsapp?: string
  email?: string
  yearsExperience: number
  clientsCount: number
  brandsCount: number
  techniciansCount: number
}

// Flip Card Component - SIN OVERLAY OSCURO
function FlipCard({ service, index }: { service: Service; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const Icon = iconMap[service.icon] || Wrench
  const features = typeof service.features === 'string' ? JSON.parse(service.features) : service.features

  return (
    <div 
      className="flip-card cursor-pointer group"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`flip-card-inner ${isFlipped ? 'transform rotate-y-180' : ''}`}>
        {/* Front - SIN OVERLAY OSCURO */}
        <div className="flip-card-front">
          <div className="relative w-full h-full">
            <img 
              src={service.image} 
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-110"
            />
            {/* Overlay MUY CLARO */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#BE1E2D]" />
                </div>
                <Badge variant="outline" className="bg-white/90 text-[#BE1E2D] border-0 text-xs">
                  Servicio {index + 1}
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-white drop-shadow-lg">{service.title}</h3>
            </div>
          </div>
        </div>
        
        {/* Back */}
        <div className="flip-card-back bg-white p-6 flex flex-col justify-center border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#BE1E2D]/20 flex items-center justify-center border border-[#BE1E2D]/30">
              <Icon className="w-5 h-5 text-[#BE1E2D]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">{service.description}</p>
          <div className="flex flex-wrap gap-2">
            {features.map((feature: string, idx: number) => (
              <Badge 
                key={idx} 
                className="bg-[#BE1E2D]/10 text-[#BE1E2D] border border-[#BE1E2D]/20"
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

// Particle Background Component
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
  
  // Estados para datos dinámicos
  const [services, setServices] = useState<Service[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch datos al cargar
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch con cache: 'no-store' para evitar cache
        const [servicesRes, testimonialsRes, configRes] = await Promise.all([
          fetch('/api/public/services', { cache: 'no-store' }),
          fetch('/api/public/testimonials', { cache: 'no-store' }),
          fetch('/api/public/config', { cache: 'no-store' })
        ])
        
        const servicesData = await servicesRes.json()
        const testimonialsData = await testimonialsRes.json()
        const configData = await configRes.json()
        
        setServices(servicesData)
        setTestimonials(testimonialsData)
        setConfig(configData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

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
  }, [services, testimonials])

  // Métricas desde configuración
  const metrics = config ? [
    { value: config.yearsExperience, suffix: "+", label: "Años de Experiencia" },
    { value: config.clientsCount, suffix: "+", label: "Clientes Satisfechos" },
    { value: config.brandsCount, suffix: "+", label: "Marcas Disponibles" },
    { value: config.techniciansCount, suffix: "", label: "Técnicos Certificados" }
  ] : []

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-[#BE1E2D]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden">
      {/* Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl border-b border-[#BE1E2D]/10' 
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
              <Button className="btn-primary">
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
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-[#BE1E2D]/10">
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
              <Badge className="mb-6 bg-[#BE1E2D]/20 text-[#BE1E2D] border border-[#BE1E2D]/30 animate-fade-in-up">
                <Award className="w-4 h-4 mr-2" />
                +{config?.yearsExperience || 75} Años de Trayectoria
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                {config?.heroTitle || 'Potencia y Precisión'}
                <span className="block text-[#BE1E2D]">para tu Trabajo</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {config?.heroDescription || 'Distribuidores oficiales de Bosch y Makita. Más de 75 años liderando en herramientas industriales con servicio técnico propio y asesoría profesional.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <a href="/catalogo" className="btn-primary text-lg inline-flex items-center">
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
                  className="relative z-10 w-full h-full object-contain animate-float"
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 animate-on-scroll">
            <Badge className="mb-4 bg-[#BE1E2D]/20 text-[#BE1E2D] border border-[#BE1E2D]/30">
              Nuestros Servicios
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Soluciones Completas para
              <span className="text-[#BE1E2D]"> tu Industria</span>
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

      {/* About Section - IMAGEN MÁS CLARA */}
      <section id="nosotros" className="relative py-24 bg-[#4D4D4D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image - SIN OVERLAY OSCURO */}
            <div className="relative animate-on-scroll">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                <img 
                  src="/images/about_image.png" 
                  alt="Maquinarias Landau - Tradición desde 1949"
                  className="w-full h-full object-cover brightness-110"
                />
                {/* Overlay MUY CLARO */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 glass-card p-6 animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                    <Award className="w-8 h-8 text-[#BE1E2D]" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">{config?.yearsExperience || 75}+</div>
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
                <span className="text-[#f87171]"> Confianza</span>
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
            <Badge className="mb-4 bg-[#BE1E2D]/20 text-[#BE1E2D] border border-[#BE1E2D]/30">
              Testimonios
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Lo que Dicen
              <span className="text-[#BE1E2D]"> Nuestros Clientes</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Miles de profesionales y empresas confían en nosotros. Conoce por qué somos
              referentes en el sector de herramientas industriales.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.id} className="bg-white border border-gray-100 animate-on-scroll" style={{ animationDelay: `${index * 100}ms` }}>
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
            <span className="text-[#BE1E2D]"> tu Trabajo?</span>
          </h2>

          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Visítanos en nuestra tienda o contáctanos para recibir asesoría personalizada.
            Más de {config?.yearsExperience || 75} años nos respaldan.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/catalogo" className="btn-primary text-lg inline-flex items-center" style={{padding: '16px 40px'}}>
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
            <Badge className="mb-4 bg-[#BE1E2D]/20 text-[#BE1E2D] border border-[#BE1E2D]/30">
              Contacto
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Estamos para
              <span className="text-[#BE1E2D]"> Servirte</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Visítanos en nuestra tienda física o contáctanos por cualquiera de estos medios.
              Nuestro equipo está listo para atenderte.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="animate-on-scroll bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-6 text-lg">Información de Contacto</h3>
              
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#BE1E2D]/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#BE1E2D]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Dirección</h4>
                    <p className="text-gray-600 text-sm">{config?.address || 'Av. Asamblea 524, C1424 CABA, Argentina'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#BE1E2D]/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#BE1E2D]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Teléfono</h4>
                    <p className="text-gray-600 text-sm">{config?.phone || '4921-7875 / 4923-0918'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#BE1E2D]/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#BE1E2D]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Email</h4>
                    <p className="text-gray-600 text-sm">{config?.email || 'landaumaq2@gmail.com'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#BE1E2D]/20 flex items-center justify-center">
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
            <div className="animate-on-scroll bg-white rounded-2xl border border-gray-100 p-6">
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
              <div className="bg-white border border-gray-100 h-full min-h-[400px] rounded-2xl overflow-hidden">
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
                <a href="#" className="w-10 h-10 rounded-lg bg-[#BE1E2D]/20 flex items-center justify-center hover:bg-[#BE1E2D]/30 transition-colors">
                  <svg className="w-5 h-5 text-[#BE1E2D]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-[#BE1E2D]/20 flex items-center justify-center hover:bg-[#BE1E2D]/30 transition-colors">
                  <svg className="w-5 h-5 text-[#BE1E2D]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#servicios" className="text-gray-600 hover:text-gray-900 text-sm">Servicios</a></li>
                <li><a href="/catalogo" className="text-gray-600 hover:text-gray-900 text-sm">Catálogo</a></li>
                <li><a href="#nosotros" className="text-gray-600 hover:text-gray-900 text-sm">Nosotros</a></li>
                <li><a href="#contacto" className="text-gray-600 hover:text-gray-900 text-sm">Contacto</a></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Categorías</h4>
              <ul className="space-y-2">
                <li><a href="/catalogo?category=taladros" className="text-gray-600 hover:text-gray-900 text-sm">Taladros</a></li>
                <li><a href="/catalogo?category=amoladoras" className="text-gray-600 hover:text-gray-900 text-sm">Amoladoras</a></li>
                <li><a href="/catalogo?category=compresores" className="text-gray-600 hover:text-gray-900 text-sm">Compresores</a></li>
                <li><a href="/catalogo?category=soldadoras" className="text-gray-600 hover:text-gray-900 text-sm">Soldadoras</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#BE1E2D]" />
                  {config?.phone || '4921-7875 / 4923-0918'}
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#BE1E2D]" />
                  {config?.email || 'landaumaq2@gmail.com'}
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#BE1E2D]" />
                  {config?.address || 'Av. Asamblea 524, CABA'}
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Maquinarias Landau. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
