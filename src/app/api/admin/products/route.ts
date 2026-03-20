import { NextRequest, NextResponse } from 'next/server'

// Datos de respaldo cuando no hay base de datos
const fallbackProducts = [
  // Bosch
  { id: 'p1', name: 'Amoladora GWS 18V-8 Bosch SB', slug: 'amoladora-gws-18v-8', description: 'Amoladora angular inalámbrica Bosch Professional 18V. Compacta y ergonómica para trabajos de corte y desbaste.', power: '18V', image: '/images/bosch_real/product_1.jpg', features: '["18V Li-Ion","Disco 125mm","8500 RPM","Maletín incluido"]', brandId: 'bosch', categoryId: 'amoladoras', brand: { id: 'bosch', name: 'Bosch', color: '#E31837' }, category: { id: 'amoladoras', name: 'Amoladoras' }, featured: true, active: true, order: 1 },
  { id: 'p2', name: 'Taladro Percutor GSB 12V-30', slug: 'taladro-gsb-12v-30', description: 'Taladro percutor inalámbrico Bosch 12V compacto. Ideal para perforaciones en concreto, madera y metal.', power: '12V', image: '/images/bosch_real/product_2.jpg', features: '["12V Li-Ion","Mandril 10mm","Motor potente","Compacto"]', brandId: 'bosch', categoryId: 'taladros', brand: { id: 'bosch', name: 'Bosch', color: '#E31837' }, category: { id: 'taladros', name: 'Taladros' }, featured: false, active: true, order: 2 },
  { id: 'p3', name: 'Amoladora GWS 18V-10', slug: 'amoladora-gws-18v-10', description: 'Amoladora angular inalámbrica Bosch Professional 5" con alta potencia.', power: '18V', image: '/images/bosch_real/product_3.jpg', features: '["18V Li-Ion","Disco 125mm","10000 RPM","Profesional"]', brandId: 'bosch', categoryId: 'amoladoras', brand: { id: 'bosch', name: 'Bosch', color: '#E31837' }, category: { id: 'amoladoras', name: 'Amoladoras' }, featured: false, active: true, order: 3 },
  { id: 'p4', name: 'Taladro Percutor GSB 18V-50', slug: 'taladro-gsb-18v-50', description: 'Taladro percutor inalámbrico Bosch 18V con motor sin escobillas.', power: '18V', image: '/images/bosch_real/product_4.jpg', features: '["18V Li-Ion","Motor BL","Mandril 13mm","Percutor"]', brandId: 'bosch', categoryId: 'taladros', brand: { id: 'bosch', name: 'Bosch', color: '#E31837' }, category: { id: 'taladros', name: 'Taladros' }, featured: true, active: true, order: 4 },
  // Makita
  { id: 'p5', name: 'Taladro Percutor HP333D', slug: 'taladro-hp333d', description: 'Taladro percutor a batería con motor sin escobillas. Compacto y potente.', power: '18V', image: '/images/product_makita_1.png', features: '["18V Li-Ion","Motor BL","0-1900 RPM","2 baterías"]', brandId: 'makita', categoryId: 'taladros', brand: { id: 'makita', name: 'Makita', color: '#0047AB' }, category: { id: 'taladros', name: 'Taladros' }, featured: false, active: true, order: 5 },
  { id: 'p6', name: 'Amoladora Angular GA5030', slug: 'amoladora-ga5030', description: 'Amoladora angular con diseño ergonómico y protector ajustable.', power: '900W', image: '/images/product_makita_2.png', features: '["900W","Disco 125mm","11.000 RPM","Protector ajustable"]', brandId: 'makita', categoryId: 'amoladoras', brand: { id: 'makita', name: 'Makita', color: '#0047AB' }, category: { id: 'amoladoras', name: 'Amoladoras' }, featured: false, active: true, order: 6 },
  // CortaRapid
  { id: 'p7', name: 'Amoladora 4½" CR-710', slug: 'amoladora-cr-710', description: 'Amoladora angular compacta para corte y desbaste.', power: '710W', image: '/images/product_cortarapid_1.png', features: '["710W","Disco 115mm","11.000 RPM","Diseño ergonómico"]', brandId: 'cortarapid', categoryId: 'amoladoras', brand: { id: 'cortarapid', name: 'CortaRapid', color: '#FF6600' }, category: { id: 'amoladoras', name: 'Amoladoras' }, featured: false, active: true, order: 7 },
  { id: 'p8', name: 'Amoladora 7" CR-2000', slug: 'amoladora-cr-2000', description: 'Amoladora industrial de alta potencia para trabajos pesados.', power: '2000W', image: '/images/product_cortarapid_2.png', features: '["2000W","Disco 180mm","8.500 RPM","Doble empuñadura"]', brandId: 'cortarapid', categoryId: 'amoladoras', brand: { id: 'cortarapid', name: 'CortaRapid', color: '#FF6600' }, category: { id: 'amoladoras', name: 'Amoladoras' }, featured: false, active: true, order: 8 },
  // Skil
  { id: 'p9', name: 'Taladro Percutor 6265', slug: 'taladro-6265', description: 'Taladro percutor con velocidad variable y reversibilidad.', power: '650W', image: '/images/product_skil_1.png', features: '["650W","0-2800 RPM","Mandril 13mm","Reversible"]', brandId: 'skil', categoryId: 'taladros', brand: { id: 'skil', name: 'Skil', color: '#E31837' }, category: { id: 'taladros', name: 'Taladros' }, featured: false, active: true, order: 9 },
  // Ganmar
  { id: 'p10', name: 'Compresor 50L GM-50', slug: 'compresor-gm-50', description: 'Compresor de aire de 50 litros con motor de 2HP.', power: '2HP', image: '/images/product_ganmar_1.png', features: '["2HP","50 litros","8 bar","Sin aceite"]', brandId: 'ganmar', categoryId: 'compresores', brand: { id: 'ganmar', name: 'Línea Ganmar', color: '#1E5631' }, category: { id: 'compresores', name: 'Compresores' }, featured: false, active: true, order: 10 },
  // Aleba
  { id: 'p11', name: 'Soldadora Eléctrica 170A Portátil', slug: 'soldadora-170a-portatil', description: 'Soldadora eléctrica monofásica portátil de 170 amperios.', power: '170A', image: '/images/product_aleba_1.png', features: '["Monofásica","170 Amp","Portátil","Uso doméstico"]', brandId: 'aleba', categoryId: 'soldadoras', brand: { id: 'aleba', name: 'Soldadoras Aleba', color: '#1E3A5F' }, category: { id: 'soldadoras', name: 'Soldadoras' }, featured: false, active: true, order: 11 },
  { id: 'p12', name: 'Soldadora Eléctrica 250A c/Ruedas', slug: 'soldadora-250a', description: 'Soldadora eléctrica mono/bifásica de 250 amperios con ruedas.', power: '250A', image: '/images/product_aleba_4.png', features: '["Mono/Bifásica","250 Amp","Con ruedas","Industrial"]', brandId: 'aleba', categoryId: 'soldadoras', brand: { id: 'aleba', name: 'Soldadoras Aleba', color: '#1E3A5F' }, category: { id: 'soldadoras', name: 'Soldadoras' }, featured: true, active: true, order: 12 },
]

// GET - Obtener todos los productos
export async function GET(request: NextRequest) {
  try {
    const { db } = await import('@/lib/db')
    const { searchParams } = new URL(request.url)
    const brandId = searchParams.get('brandId')
    const categoryId = searchParams.get('categoryId')
    const featured = searchParams.get('featured')

    const where: Record<string, unknown> = {}
    if (brandId) where.brandId = brandId
    if (categoryId) where.categoryId = categoryId
    if (featured) where.featured = featured === 'true'

    const products = await db.product.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        brand: true,
        category: true
      }
    })
    return NextResponse.json(products)
  } catch (error) {
    console.log('Usando datos de respaldo para productos')
    const { searchParams } = new URL(request.url)
    const brandId = searchParams.get('brandId')
    const categoryId = searchParams.get('categoryId')
    
    let filtered = fallbackProducts
    if (brandId) filtered = filtered.filter(p => p.brandId === brandId)
    if (categoryId) filtered = filtered.filter(p => p.categoryId === categoryId)
    
    return NextResponse.json(filtered)
  }
}

// POST - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    const { db } = await import('@/lib/db')
    const data = await request.json()
    const product = await db.product.create({
      data: {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
        description: data.description,
        power: data.power,
        image: data.image,
        features: JSON.stringify(data.features || []),
        brandId: data.brandId,
        categoryId: data.categoryId,
        featured: data.featured ?? false,
        active: data.active ?? true,
        order: data.order || 0
      },
      include: {
        brand: true,
        category: true
      }
    })
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Base de datos no configurada. Configure PostgreSQL en Vercel.' }, { status: 503 })
  }
}
