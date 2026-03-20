'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Package, 
  Tag, 
  Layers, 
  MessageSquare, 
  Users, 
  TrendingUp,
  Eye,
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
  messages: number
  unreadMessages: number
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
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-100">
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

interface Message {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  read: boolean
  createdAt: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentMessages, setRecentMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch stats
        const [productsRes, brandsRes, categoriesRes, messagesRes, testimonialsRes, servicesRes] = await Promise.all([
          fetch('/api/admin/products'),
          fetch('/api/admin/brands'),
          fetch('/api/admin/categories'),
          fetch('/api/admin/messages'),
          fetch('/api/admin/testimonials'),
          fetch('/api/admin/services')
        ])

        const products = await productsRes.json()
        const brands = await brandsRes.json()
        const categories = await categoriesRes.json()
        const messages = await messagesRes.json()
        const testimonials = await testimonialsRes.json()
        const services = await servicesRes.json()

        setStats({
          products: products.length || 0,
          brands: brands.length || 0,
          categories: categories.length || 0,
          messages: messages.length || 0,
          unreadMessages: messages.filter((m: Message) => !m.read).length || 0,
          testimonials: testimonials.length || 0,
          services: services.length || 0
        })

        setRecentMessages(messages.slice(0, 5))
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
          title="Mensajes"
          value={stats?.messages || 0}
          icon={MessageSquare}
          color="bg-purple-500"
          href="/admin/mensajes"
          badge={stats?.unreadMessages}
        />
      </div>

      {/* Quick Actions */}
      <Card className="border border-gray-100">
        <CardHeader>
          <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/productos">
              <Button className="bg-[#BE1E2D] hover:bg-[#9B1829]">
                <Package className="w-4 h-4 mr-2" />
                Nuevo Producto
              </Button>
            </Link>
            <Link href="/admin/marcas">
              <Button variant="outline">
                <Tag className="w-4 h-4 mr-2" />
                Nueva Marca
              </Button>
            </Link>
            <Link href="/admin/servicios">
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Nuevo Servicio
              </Button>
            </Link>
            <Link href="/admin/configuracion">
              <Button variant="outline">
                Configurar Sitio
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Messages */}
      <Card className="border border-gray-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Mensajes Recientes</CardTitle>
          <Link href="/admin/mensajes">
            <Button variant="ghost" size="sm">
              Ver todos
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentMessages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay mensajes todavía</p>
          ) : (
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-4 rounded-lg border ${message.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{message.name}</span>
                        {!message.read && (
                          <Badge className="bg-blue-500 text-white text-xs">Nuevo</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{message.email}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(message.createdAt).toLocaleDateString('es-AR')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{message.message}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
