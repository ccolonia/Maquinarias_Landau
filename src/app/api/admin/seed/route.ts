import { NextResponse } from 'next/server'

// Sembrar datos iniciales
export async function POST() {
  try {
    const { db } = await import('@/lib/db')
    
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

    // Crear productos - Obtener IDs de marcas y categorías
    const brandMap: Record<string, string> = {}
    const categoryMap: Record<string, string> = {}
    
    for (const brand of brands) {
      brandMap[brand.slug] = brand.id
    }
    for (const category of categories) {
      categoryMap[category.slug] = category.id
    }

    // Productos con imágenes locales existentes
    const productsData = [
      // Bosch - Amoladoras
      {
        name: 'Amoladora Angular GWS 7-100',
        slug: 'amoladora-bosch-gws-7-100',
        description: 'Amoladora angular profesional de 720W con disco de 100mm. Ideal para corte y desbaste en metal y piedra.',
        power: '720W',
        image: '/images/bosch_real/product_1.jpg',
        features: JSON.stringify(['720W', 'Disco 100mm', 'Profesional']),
        brandSlug: 'bosch',
        categorySlug: 'amoladoras',
        order: 1
      },
      {
        name: 'Amoladora Angular GWS 9-115',
        slug: 'amoladora-bosch-gws-9-115',
        description: 'Amoladora angular de 900W con disco de 115mm. Potencia y control para trabajos exigentes.',
        power: '900W',
        image: '/images/bosch_real/product_2.jpg',
        features: JSON.stringify(['900W', 'Disco 115mm', 'Control de velocidad']),
        brandSlug: 'bosch',
        categorySlug: 'amoladoras',
        order: 2
      },
      {
        name: 'Amoladora Angular GWS 1400',
        slug: 'amoladora-bosch-gws-1400',
        description: 'Amoladora angular de 1400W para trabajos industriales pesados. Sistema de protección reiniciable.',
        power: '1400W',
        image: '/images/bosch_real/product_3.jpg',
        features: JSON.stringify(['1400W', 'Disco 125mm', 'Industrial']),
        brandSlug: 'bosch',
        categorySlug: 'amoladoras',
        order: 3
      },
      {
        name: 'Amoladora Angular GWS 17-125',
        slug: 'amoladora-bosch-gws-17-125',
        description: 'Amoladora angular profesional de 1700W con protección contra rebotes para máxima seguridad.',
        power: '1700W',
        image: '/images/bosch_real/product_4.jpg',
        features: JSON.stringify(['1700W', 'Protección anti-rebote', 'Profesional']),
        brandSlug: 'bosch',
        categorySlug: 'amoladoras',
        order: 4
      },
      {
        name: 'Amoladora Angular GWS 22-230',
        slug: 'amoladora-bosch-gws-22-230',
        description: 'Amoladora industrial de 2200W con disco de 230mm para trabajos pesados de corte y desbaste.',
        power: '2200W',
        image: '/images/bosch_real/product_5.jpg',
        features: JSON.stringify(['2200W', 'Disco 230mm', 'Industrial pesado']),
        brandSlug: 'bosch',
        categorySlug: 'amoladoras',
        order: 5
      },
      // Bosch - Taladros
      {
        name: 'Taladro Percutor GSB 13 RE',
        slug: 'taladro-bosch-gsb-13-re',
        description: 'Taladro percutor profesional de 650W con mandril de 13mm. Ideal para trabajos en concreto y metal.',
        power: '650W',
        image: '/images/bosch_real/product_6.jpg',
        features: JSON.stringify(['650W', 'Mandril 13mm', 'Percutor']),
        brandSlug: 'bosch',
        categorySlug: 'taladros',
        order: 6
      },
      {
        name: 'Taladro Percutor GSB 16 RE',
        slug: 'taladro-bosch-gsb-16-re',
        description: 'Taladro percutor de 750W con capacidad de 16mm para trabajos exigentes en obra.',
        power: '750W',
        image: '/images/bosch_real/product_7.jpg',
        features: JSON.stringify(['750W', 'Mandril 16mm', 'Percutor profesional']),
        brandSlug: 'bosch',
        categorySlug: 'taladros',
        order: 7
      },
      {
        name: 'Taladro Percutor GSB 21-2 RCT',
        slug: 'taladro-bosch-gsb-21-2-rct',
        description: 'Taladro percutor doble velocidad de 1100W para aplicaciones profesionales intensivas.',
        power: '1100W',
        image: '/images/bosch_real/product_8.jpg',
        features: JSON.stringify(['1100W', '2 velocidades', 'Rotomartillo']),
        brandSlug: 'bosch',
        categorySlug: 'taladros',
        order: 8
      },
      // Makita - Amoladoras
      {
        name: 'Amoladora Angular 9555HNR',
        slug: 'amoladora-makita-9555hnr',
        description: 'Amoladora angular de 720W con disco de 115mm. Diseño ergonómico y liviano para trabajo continuo.',
        power: '720W',
        image: '/images/product_makita_1.png',
        features: JSON.stringify(['720W', 'Disco 115mm', 'Ergonómica']),
        brandSlug: 'makita',
        categorySlug: 'amoladoras',
        order: 9
      },
      {
        name: 'Amoladora Angular GA5030',
        slug: 'amoladora-makita-ga5030',
        description: 'Amoladora angular de 900W con motor más pequeño y liviano. Mayor control y menos fatiga.',
        power: '900W',
        image: '/images/product_makita_2.png',
        features: JSON.stringify(['900W', 'Motor compacto', 'Liviana']),
        brandSlug: 'makita',
        categorySlug: 'amoladoras',
        order: 10
      },
      {
        name: 'Amoladora Angular GA7010C',
        slug: 'amoladora-makita-ga7010c',
        description: 'Amoladora industrial de 1400W con disco de 180mm y velocidad variable electrónica.',
        power: '1400W',
        image: '/images/product_makita_3.png',
        features: JSON.stringify(['1400W', 'Disco 180mm', 'Velocidad variable']),
        brandSlug: 'makita',
        categorySlug: 'amoladoras',
        order: 11
      },
      {
        name: 'Amoladora Angular GA9010C',
        slug: 'amoladora-makita-ga9010c',
        description: 'Amoladora industrial de 2000W con disco de 230mm para aplicaciones pesadas.',
        power: '2000W',
        image: '/images/product_makita_4.png',
        features: JSON.stringify(['2000W', 'Disco 230mm', 'Industrial']),
        brandSlug: 'makita',
        categorySlug: 'amoladoras',
        order: 12
      },
      // Makita - Taladros
      {
        name: 'Taladro Percutor HP2050F',
        slug: 'taladro-makita-hp2050f',
        description: 'Taladro percutor de 720W con doble velocidad y luz LED integrada para mejor visibilidad.',
        power: '720W',
        image: '/images/product_makita_5.png',
        features: JSON.stringify(['720W', '2 velocidades', 'Luz LED']),
        brandSlug: 'makita',
        categorySlug: 'taladros',
        order: 13
      },
      {
        name: 'Taladro Percutor HP2070F',
        slug: 'taladro-makita-hp2070f',
        description: 'Taladro percutor profesional de 1010W con doble velocidad para aplicaciones exigentes.',
        power: '1010W',
        image: '/images/product_makita_6.png',
        features: JSON.stringify(['1010W', '2 velocidades', 'Profesional']),
        brandSlug: 'makita',
        categorySlug: 'taladros',
        order: 14
      },
      // Makita - Rotomartillos
      {
        name: 'Rotomartillo HR2630',
        slug: 'rotomartillo-makita-hr2630',
        description: 'Rotomartillo SDS-Plus de 800W con 3 modos de operación. Ideal para perforar concreto.',
        power: '800W',
        image: '/images/product_makita_1.png',
        features: JSON.stringify(['800W', 'SDS-Plus', '3 modos']),
        brandSlug: 'makita',
        categorySlug: 'rotomartillos',
        order: 15
      },
      // CortaRapid
      {
        name: 'Cortadora de Cerámico TC10',
        slug: 'cortadora-cortarapid-tc10',
        description: 'Cortadora de cerámico profesional para piezas de hasta 60cm. Guía láser de precisión.',
        power: '1200W',
        image: '/images/product_cortarapid_1.png',
        features: JSON.stringify(['1200W', 'Corte 60cm', 'Guía láser']),
        brandSlug: 'cortarapid',
        categorySlug: 'sierras',
        order: 16
      },
      {
        name: 'Cortadora de Cerámico TC15',
        slug: 'cortadora-cortarapid-tc15',
        description: 'Cortadora profesional de cerámico para piezas de hasta 80cm con base reforzada.',
        power: '1500W',
        image: '/images/product_cortarapid_2.png',
        features: JSON.stringify(['1500W', 'Corte 80cm', 'Base reforzada']),
        brandSlug: 'cortarapid',
        categorySlug: 'sierras',
        order: 17
      },
      {
        name: 'Cortadora de Cerámico TC20',
        slug: 'cortadora-cortarapid-tc20',
        description: 'Cortadora industrial de cerámico para trabajos profesionales exigentes.',
        power: '2000W',
        image: '/images/product_cortarapid_3.png',
        features: JSON.stringify(['2000W', 'Industrial', 'Profesional']),
        brandSlug: 'cortarapid',
        categorySlug: 'sierras',
        order: 18
      },
      {
        name: 'Cortadora de Cerámico TC25',
        slug: 'cortadora-cortarapid-tc25',
        description: 'Cortadora industrial de alta potencia para grandes proyectos de construcción.',
        power: '2500W',
        image: '/images/product_cortarapid_4.png',
        features: JSON.stringify(['2500W', 'Industrial', 'Alta producción']),
        brandSlug: 'cortarapid',
        categorySlug: 'sierras',
        order: 19
      },
      // Skil
      {
        name: 'Taladro Percutor 6260AA',
        slug: 'taladro-skil-6260aa',
        description: 'Taladro percutor de 650W con variable de velocidad y empuñadura ergonómica.',
        power: '650W',
        image: '/images/product_skil_1.png',
        features: JSON.stringify(['650W', 'Variable', 'Ergonómico']),
        brandSlug: 'skil',
        categorySlug: 'taladros',
        order: 20
      },
      {
        name: 'Amoladora Angular 9295AC',
        slug: 'amoladora-skil-9295ac',
        description: 'Amoladora angular de 850W con sistema anti-vibración para mayor comodidad.',
        power: '850W',
        image: '/images/product_skil_2.png',
        features: JSON.stringify(['850W', 'Anti-vibración', 'Cómoda']),
        brandSlug: 'skil',
        categorySlug: 'amoladoras',
        order: 21
      },
      {
        name: 'Amoladora Angular 9390AA',
        slug: 'amoladora-skil-9390aa',
        description: 'Amoladora angular de 900W con protección contra sobrecarga.',
        power: '900W',
        image: '/images/product_skil_3.png',
        features: JSON.stringify(['900W', 'Protección sobrecarga', 'Segura']),
        brandSlug: 'skil',
        categorySlug: 'amoladoras',
        order: 22
      },
      {
        name: 'Taladro Percutor 6665AA',
        slug: 'taladro-skil-6665aa',
        description: 'Taladro percutor profesional de 750W con mandril de 13mm.',
        power: '750W',
        image: '/images/product_skil_4.png',
        features: JSON.stringify(['750W', 'Mandril 13mm', 'Profesional']),
        brandSlug: 'skil',
        categorySlug: 'taladros',
        order: 23
      },
      {
        name: 'Amoladora Angular 9405AA',
        slug: 'amoladora-skil-9405aa',
        description: 'Amoladora angular de 1000W para trabajos exigentes en taller.',
        power: '1000W',
        image: '/images/product_skil_5.png',
        features: JSON.stringify(['1000W', 'Taller', 'Potente']),
        brandSlug: 'skil',
        categorySlug: 'amoladoras',
        order: 24
      },
      // Ganmar
      {
        name: 'Compresor GM-50L',
        slug: 'compresor-ganmar-gm-50l',
        description: 'Compresor de aire de 50 litros, 2HP. Ideal para trabajos de bricolaje y pequeños talleres.',
        power: '2HP',
        image: '/images/product_ganmar_1.png',
        features: JSON.stringify(['2HP', '50 litros', 'Bricolaje']),
        brandSlug: 'ganmar',
        categorySlug: 'compresores',
        order: 25
      },
      {
        name: 'Compresor GM-100L',
        slug: 'compresor-ganmar-gm-100l',
        description: 'Compresor de aire de 100 litros, 3HP para uso semi-profesional.',
        power: '3HP',
        image: '/images/product_ganmar_2.png',
        features: JSON.stringify(['3HP', '100 litros', 'Semi-profesional']),
        brandSlug: 'ganmar',
        categorySlug: 'compresores',
        order: 26
      },
      {
        name: 'Compresor GM-200L',
        slug: 'compresor-ganmar-gm-200l',
        description: 'Compresor industrial de 200 litros, 5HP para talleres profesionales.',
        power: '5HP',
        image: '/images/product_ganmar_3.png',
        features: JSON.stringify(['5HP', '200 litros', 'Industrial']),
        brandSlug: 'ganmar',
        categorySlug: 'compresores',
        order: 27
      },
      {
        name: 'Llave de Impacto Neumática GI-450',
        slug: 'llave-impacto-ganmar-gi-450',
        description: 'Llave de impacto neumática de 1/2" con torque de 450Nm para taller mecánico.',
        power: '450Nm',
        image: '/images/product_ganmar_4.png',
        features: JSON.stringify(['1/2"', '450Nm', 'Taller mecánico']),
        brandSlug: 'ganmar',
        categorySlug: 'neumaticos',
        order: 28
      },
      {
        name: 'Pistola de Pincel GP-25',
        slug: 'pistola-pincel-ganmar-gp-25',
        description: 'Pistola de pincel de 2.5mm para pintura con compresor.',
        power: '2.5mm',
        image: '/images/product_ganmar_5.png',
        features: JSON.stringify(['2.5mm', 'Pintura', 'Compresor']),
        brandSlug: 'ganmar',
        categorySlug: 'neumaticos',
        order: 29
      },
      {
        name: 'Lijadora Orbital GO-125',
        slug: 'lijadora-ganmar-go-125',
        description: 'Lijadora orbital de 125mm con conexión a aspiradora para trabajo limpio.',
        power: '300W',
        image: '/images/product_ganmar_6.png',
        features: JSON.stringify(['125mm', '300W', 'Con aspiración']),
        brandSlug: 'ganmar',
        categorySlug: 'lijadoras',
        order: 30
      },
      // Aleba
      {
        name: 'Soldadora Inverter MMA-200',
        slug: 'soldadora-aleba-mma-200',
        description: 'Soldadora inverter de 200A para electrodos revestidos. Tecnología IGBT.',
        power: '200A',
        image: '/images/product_aleba_1.png',
        features: JSON.stringify(['200A', 'Inverter', 'Electrodos']),
        brandSlug: 'aleba',
        categorySlug: 'soldadoras',
        order: 31
      },
      {
        name: 'Soldadora Inverter MIG-250',
        slug: 'soldadora-aleba-mig-250',
        description: 'Soldadora inverter MIG/MAG de 250A con alimentador de alambre incorporado.',
        power: '250A',
        image: '/images/product_aleba_2.png',
        features: JSON.stringify(['250A', 'MIG/MAG', 'Alimentador']),
        brandSlug: 'aleba',
        categorySlug: 'soldadoras',
        order: 32
      },
      {
        name: 'Soldadora TIG-315 AC/DC',
        slug: 'soldadora-aleba-tig-315',
        description: 'Soldadora TIG AC/DC de 315A para aluminio y aceros especiales.',
        power: '315A',
        image: '/images/product_aleba_3.png',
        features: JSON.stringify(['315A', 'TIG AC/DC', 'Aluminio']),
        brandSlug: 'aleba',
        categorySlug: 'soldadoras',
        order: 33
      },
      {
        name: 'Soldadora Inverter MMA-315',
        slug: 'soldadora-aleba-mma-315',
        description: 'Soldadora inverter profesional de 315A para trabajo industrial pesado.',
        power: '315A',
        image: '/images/product_aleba_4.png',
        features: JSON.stringify(['315A', 'Industrial', 'Profesional']),
        brandSlug: 'aleba',
        categorySlug: 'soldadoras',
        order: 34
      },
      {
        name: 'Soldadora Multi-proceso MP-400',
        slug: 'soldadora-aleba-mp-400',
        description: 'Soldadora multi-proceso de 400A: MMA, MIG, TIG en un solo equipo.',
        power: '400A',
        image: '/images/product_aleba_5.png',
        features: JSON.stringify(['400A', 'Multi-proceso', 'Versátil']),
        brandSlug: 'aleba',
        categorySlug: 'soldadoras',
        order: 35
      },
      {
        name: 'Cortadora Plasma PL-60',
        slug: 'cortadora-plasma-aleba-pl-60',
        description: 'Cortadora de plasma de 60A para corte de metales de hasta 20mm.',
        power: '60A',
        image: '/images/product_aleba_6.png',
        features: JSON.stringify(['60A', 'Corte 20mm', 'Plasma']),
        brandSlug: 'aleba',
        categorySlug: 'soldadoras',
        order: 36
      }
    ]

    // Crear productos
    let productsCreated = 0
    for (const product of productsData) {
      const brandId = brandMap[product.brandSlug]
      const categoryId = categoryMap[product.categorySlug]
      
      if (brandId && categoryId) {
        try {
          await db.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: {
              name: product.name,
              slug: product.slug,
              description: product.description,
              power: product.power,
              image: product.image,
              features: product.features,
              brandId,
              categoryId,
              order: product.order
            }
          })
          productsCreated++
        } catch (e) {
          console.log(`Producto ya existe: ${product.slug}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Datos iniciales creados correctamente',
      data: {
        brands: brands.length,
        categories: categories.length,
        services: services.length,
        testimonials: testimonials.length,
        products: productsCreated
      }
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json({ 
      success: true, 
      message: 'Usando datos de respaldo. Para persistencia, configure PostgreSQL en Vercel.',
      note: 'El panel funciona con datos de demostración. Configure una base de datos PostgreSQL para guardar cambios permanentes.'
    })
  }
}
