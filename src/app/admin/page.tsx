'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Package, 
  Tag, 
  Layers, 
  UserCheck,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Stats {
  products: number
  brands: number
  categories: number
  leads: number
  pendingLeads: number
  testimonials: number
  services: number
}

interface DashboardCardProps {
  title: string
  value: number
  icon: React.ElementType
  color: string
  href: string
  badge?: number
}

function DashboardCard({ title, value, icon: Icon, color, href, badge }: DashboardCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold text-gray-900">{value}</div>
            {badge !== undefined && badge > 0 && (
              <Badge className="mt-2 bg-[#BE1E2D] text-white">
                {badge} nuevos
              </Badge>
            )}
          </div>
          <Link href={href}>
            <Button variant="ghost" size="sm" className="text-gray-500 group-hover:text-[#BE1E2D]">
              Ver todo
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  status: string
  createdAt: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch stats
        const [productsRes, brandsRes, categoriesRes, leadsRes, testimonialsRes, servicesRes] = await Promise.all([
          fetch('/api/admin/products'),
          fetch('/api/admin/brands'),
          fetch('/api/admin/categories'),
          fetch('/api/admin/leads'),
          fetch('/api/admin/testimonials'),
          fetch('/api/admin/services')
        ])

        const products = await productsRes.json()
        const brands = await brandsRes.json()
        const categories = await categoriesRes.json()
        const leads = await leadsRes.json()
        const testimonials = await testimonialsRes.json()
        const services = await servicesRes.json()

        setStats({
          products: products.length || 0,
          brands: brands.length || 0,
          categories: categories.length || 0,
          leads: leads.length || 0,
          pendingLeads: leads.filter((l: Lead) => l.status === 'Pendiente').length || 0,
          testimonials: testimonials.length || 0,
          services: services.length || 0
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#BE1E2D]" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bienvenido al panel de administración de Maquinarias Landau</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Productos"
          value={stats?.products || 0}
          icon={Package}
          color="bg-[#BE1E2D]"
          href="/admin/productos"
        />
        <DashboardCard
          title="Marcas"
          value={stats?.brands || 0}
          icon={Tag}
          color="bg-blue-500"
          href="/admin/marcas"
        />
        <DashboardCard
          title="Categorías"
          value={stats?.categories || 0}
          icon={Layers}
          color="bg-green-500"
          href="/admin/categorias"
        />
        <DashboardCard
          title="Leads"
          value={stats?.leads || 0}
          icon={UserCheck}
          color="bg-purple-500"
          href="/admin/leads"
          badge={stats?.pendingLeads}
        />
      </div>
    </div>
  )
}
