import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST - Sembrar datos iniciales
export async function POST() {
  try {
    // Crear marcas
    const brands = await Promise.all([
      db.brand.upsert({
        where: { slug: 'bosch' },
        update: {},
        create: { name: 'Bosch', slug: 'bosch', color: '#E31837', order: 1 }
      }),
      db.brand.upsert({
        where: { slug: 'makita' },
        update: {},
        create: { name: 'Makita', slug: 'makita', color: '#0047AB', order: 2 }
      }),
      db.brand.upsert({
        where: { slug: 'cortarapid' },
        update: {},
        create: { name: 'CortaRapid', slug: 'cortarapid', color: '#FF6600', order: 3 }
      }),
      db.brand.upsert({
        where: { slug: 'skil' },
        update: {},
        create: { name: 'Skil', slug: 'skil', color: '#E31837', order: 4 }
      }),
      db.brand.upsert({
        where: { slug: 'ganmar' },
        update: {},
        create: { name: 'Línea Ganmar', slug: 'ganmar', color: '#1E5631', order: 5 }
      }),
      db.brand.upsert({
        where: { slug: 'aleba' },
        update: {},
        create: { name: 'Soldadoras Aleba', slug: 'aleba', color: '#1E3A5F', order: 6 }
      })
    ])

    // Crear categorías
    const categories = await Promise.all([
      db.category.upsert({
        where: { slug: 'taladros' },
        update: {},
        create: { name: 'Taladros', slug: 'taladros', order: 1 }
      }),
      db.category.upsert({
        where: { slug: 'amoladoras' },
        update: {},
        create: { name: 'Amoladoras', slug: 'amoladoras', order: 2 }
      }),
      db.category.upsert({
        where: { slug: 'sierras' },
        update: {},
        create: { name: 'Sierras', slug: 'sierras', order: 3 }
      }),
      db.category.upsert({
        where: { slug: 'rotomartillos' },
        update: {},
        create: { name: 'Rotomartillos', slug: 'rotomartillos', order: 4 }
      }),
      db.category.upsert({
        where: { slug: 'lijadoras' },
        update: {},
        create: { name: 'Lijadoras', slug: 'lijadoras', order: 5 }
      }),
      db.category.upsert({
        where: { slug: 'compresores' },
        update: {},
        create: { name: 'Compresores', slug: 'compresores', order: 6 }
      }),
      db.category.upsert({
        where: { slug: 'neumaticos' },
        update: {},
        create: { name: 'Neumáticos', slug: 'neumaticos', order: 7 }
      }),
      db.category.upsert({
        where: { slug: 'soldadoras' },
        update: {},
        create: { name: 'Soldadoras', slug: 'soldadoras', order: 8 }
      }),
      db.category.upsert({
        where: { slug: 'combos' },
        update: {},
        create: { name: 'Combos', slug: 'combos', order: 9 }
      })
    ])

    // Crear servicios
    const services = await Promise.all([
      db.service.upsert({
        where: { id: 'service-1' },
        update: {},
        create: {
          id: 'service-1',
          title: 'Venta de Herramientas Eléctricas',
          description: 'Amplio catálogo de taladros, amoladoras, sierras y herramientas eléctricas de Bosch y Makita para uso profesional e industrial.',
          image: '/images/service_1.png',
          features: JSON.stringify(['Bosch', 'Makita', 'Garantía Oficial']),
          icon: 'Zap',
          order: 1
        }
      }),
      db.service.upsert({
        where: { id: 'service-2' },
        update: {},
        create: {
          id: 'service-2',
          title: 'Servicio Técnico Especializado',
          description: 'Taller propio con técnicos certificados para reparación y mantenimiento de todas las marcas que comercializamos.',
          image: '/images/service_2.png',
          features: JSON.stringify(['Reparaciones', 'Mantenimiento', 'Repuestos Originales']),
          icon: 'Settings',
          order: 2
        }
      }),
      db.service.upsert({
        where: { id: 'service-3' },
        update: {},
        create: {
          id: 'service-3',
          title: 'Herramientas Neumáticas',
          description: 'Compresores, pistolas de aire, llaves de impacto y toda la línea neumática industrial para sus proyectos más exigentes.',
          image: '/images/service_3.png',
          features: JSON.stringify(['Compresores', 'Neumáticos', 'Accesorios']),
          icon: 'Wrench',
          order: 3
        }
      }),
      db.service.upsert({
        where: { id: 'service-4' },
        update: {},
        create: {
          id: 'service-4',
          title: 'Afilado de Herramientas',
          description: 'Servicio profesional de afilado para sierras, brocas, cuchillas y todo tipo de herramientas de corte industrial.',
          image: '/images/service_4.png',
          features: JSON.stringify(['Sierras', 'Brocas', 'Cuchillas']),
          icon: 'Shield',
          order: 4
        }
      }),
      db.service.upsert({
        where: { id: 'service-5' },
        update: {},
        create: {
          id: 'service-5',
          title: 'Venta Mayorista B2B',
          description: 'Precios especiales para empresas, contratistas y distribuidores. Atención personalizada y entregas programadas.',
          image: '/images/service_5.png',
          features: JSON.stringify(['Precios Especiales', 'Crédito', 'Entregas']),
          icon: 'Truck',
          order: 5
        }
      }),
      db.service.upsert({
        where: { id: 'service-6' },
        update: {},
        create: {
          id: 'service-6',
          title: 'Asesoría Técnica Profesional',
          description: 'Equipo de expertos para ayudarte a elegir la herramienta correcta según tu aplicación y presupuesto.',
          image: '/images/service_6.png',
          features: JSON.stringify(['Consultoría', 'Capacitación', 'Soporte']),
          icon: 'Users',
          order: 6
        }
      })
    ])

    // Crear testimonios
    const testimonials = await Promise.all([
      db.testimonial.upsert({
        where: { id: 'testimonial-1' },
        update: {},
        create: {
          id: 'testimonial-1',
          name: 'Carlos Rodríguez',
          role: 'Jefe de Mantenimiento',
          company: 'Industrias Metalúrgicas del Valle',
          content: 'Llevamos 15 años trabajando con Maquinarias Landau. Su servicio técnico es impecable y siempre tienen los repuestos que necesitamos.',
          rating: 5,
          order: 1
        }
      }),
      db.testimonial.upsert({
        where: { id: 'testimonial-2' },
        update: {},
        create: {
          id: 'testimonial-2',
          name: 'María Fernanda López',
          role: 'Gerente de Compras',
          company: 'Constructora Andina S.A.S.',
          content: 'La asesoría que recibimos fue fundamental para optimizar nuestra inversión en herramientas. Profesionales de verdad.',
          rating: 5,
          order: 2
        }
      }),
      db.testimonial.upsert({
        where: { id: 'testimonial-3' },
        update: {},
        create: {
          id: 'testimonial-3',
          name: 'Andrés Felipe Zapata',
          role: 'Propietario',
          company: 'Carpintería Zapata',
          content: 'Desde que descubrí Maquinarias Landau, no voy a otro lado. Atención personalizada y precios justos. La tradición se nota.',
          rating: 5,
          order: 3
        }
      })
    ])

    // Crear configuración del sitio
    const existingConfig = await db.siteConfig.findFirst()
    if (!existingConfig) {
      await db.siteConfig.create({
        data: {
          siteName: 'Maquinarias Landau',
          siteDescription: 'Potencia y precisión para tu trabajo desde 1949',
          heroTitle: 'Potencia y Precisión para tu Trabajo',
          heroSubtitle: 'Distribuidores oficiales de Bosch y Makita',
          heroDescription: 'Más de 75 años liderando en herramientas industriales con servicio técnico propio y asesoría profesional.',
          address: 'Av. Asamblea 524, C1424 CABA, Argentina',
          phone: '4921-7875 / 4923-0918',
          whatsapp: '5491162422197',
          email: 'landaumaq2@gmail.com',
          schedule: JSON.stringify({
            weekdays: 'Lun-Jue: 9:30-17:00',
            friday: 'Vie: 9:30-14:00',
            saturday: 'Sáb: 8:00-13:00'
          }),
          yearsExperience: 75,
          clientsCount: 50000,
          brandsCount: 200,
          techniciansCount: 15,
          primaryColor: '#BE1E2D'
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Datos iniciales creados correctamente',
      data: {
        brands: brands.length,
        categories: categories.length,
        services: services.length,
        testimonials: testimonials.length
      }
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json({ error: 'Error al sembrar datos' }, { status: 500 })
  }
}
