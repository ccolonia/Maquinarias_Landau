'use client'

import { useEffect, useState } from 'react'
import { 
  Mail, 
  Phone, 
  Clock,
  Trash2,
  Loader2,
  MailOpen,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  status: string
  createdAt: string
}

const LEAD_STATUSES = [
  { value: 'Pendiente', label: 'Pendiente', bgColor: 'bg-yellow-500', textColor: 'text-white', lightBg: 'bg-yellow-100', lightText: 'text-yellow-800' },
  { value: 'Leído', label: 'Leído', bgColor: 'bg-blue-500', textColor: 'text-white', lightBg: 'bg-blue-100', lightText: 'text-blue-800' },
  { value: 'Contactado', label: 'Contactado', bgColor: 'bg-purple-500', textColor: 'text-white', lightBg: 'bg-purple-100', lightText: 'text-purple-800' },
  { value: 'Cerrado', label: 'Cerrado', bgColor: 'bg-green-500', textColor: 'text-white', lightBg: 'bg-green-100', lightText: 'text-green-800' },
  { value: 'Perdido', label: 'Perdido', bgColor: 'bg-red-500', textColor: 'text-white', lightBg: 'bg-red-100', lightText: 'text-red-800' },
]

const ITEMS_PER_PAGE = 10

function getStatusConfig(status: string | null | undefined) {
  if (!status) return LEAD_STATUSES[0] // Default a Pendiente
  return LEAD_STATUSES.find(s => s.value === status) || LEAD_STATUSES[0]
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchLeads()
  }, [])

  async function fetchLeads() {
    try {
      const res = await fetch('/api/admin/leads')
      const data = await res.json()
      // Asegurar que todos los leads tengan status
      const leadsWithStatus = data.map((l: Lead) => ({
        ...l,
        status: l.status || 'Pendiente'
      }))
      setLeads(leadsWithStatus)
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (res.ok) {
        // Actualizar localmente
        setLeads(prevLeads => 
          prevLeads.map(l => l.id === id ? { ...l, status: newStatus } : l)
        )
      } else {
        console.error('Error en la respuesta del servidor')
      }
    } catch (error) {
      console.error('Error updating lead status:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Está seguro de eliminar este lead?')) return

    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setLeads(prevLeads => prevLeads.filter(l => l.id !== id))
      }
    } catch (error) {
      console.error('Error deleting lead:', error)
    }
  }

  const filteredLeads = leads.filter(lead => {
    if (activeFilter === 'all') return true
    return (lead.status || 'Pendiente') === activeFilter
  })

  const getStatusCount = (status: string) => {
    if (status === 'all') return leads.length
    return leads.filter(l => (l.status || 'Pendiente') === status).length
  }

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset page when filter changes
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#BE1E2D]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-1">{leads.length} leads en total</p>
        </div>
        {getStatusCount('Pendiente') > 0 && (
          <Badge className="bg-[#BE1E2D] text-white px-4 py-2 text-sm">
            {getStatusCount('Pendiente')} nuevos
          </Badge>
        )}
      </div>

      {/* Filtros como botones */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-4 py-2 rounded-md font-medium transition-all ${
            activeFilter === 'all'
              ? 'bg-[#BE1E2D] text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Todos ({getStatusCount('all')})
        </button>
        {LEAD_STATUSES.map(status => (
          <button
            key={status.value}
            onClick={() => handleFilterChange(status.value)}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              activeFilter === status.value
                ? 'bg-[#BE1E2D] text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {status.label} ({getStatusCount(status.value)})
          </button>
        ))}
      </div>

      {/* Lista de Leads */}
      {paginatedLeads.length === 0 ? (
        <Card className="border border-gray-200 bg-white">
          <CardContent className="py-12 text-center">
            <MailOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay leads para mostrar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {paginatedLeads.map(lead => {
            const statusConfig = getStatusConfig(lead.status)
            
            return (
              <Card 
                key={lead.id} 
                className="border border-gray-200 bg-white hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#BE1E2D] flex items-center justify-center flex-shrink-0">
                          <UserCheck className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">{lead.name}</h3>
                        <Badge className={`${statusConfig.bgColor} text-white text-xs px-3 py-1`}>
                          {statusConfig.label}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                            {lead.email}
                          </a>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                              {lead.phone}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{new Date(lead.createdAt).toLocaleString('es-AR')}</span>
                        </div>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-gray-700 whitespace-pre-wrap text-sm">{lead.message}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-start">
                      {/* Botones de estado */}
                      <div className="flex flex-wrap gap-1">
                        {LEAD_STATUSES.map(status => {
                          const isActive = (lead.status || 'Pendiente') === status.value
                          return (
                            <button
                              key={status.value}
                              onClick={() => updateStatus(lead.id, status.value)}
                              className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                                isActive
                                  ? `${status.bgColor} text-white`
                                  : `${status.lightBg} ${status.lightText} hover:opacity-80`
                              }`}
                            >
                              {status.label}
                            </button>
                          )
                        })}
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(lead.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
      
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-4">
          <p className="text-sm text-gray-600">
            Mostrando {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredLeads.length)} de {filteredLeads.length} leads
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
              className="border-gray-300"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page: number
                if (totalPages <= 5) {
                  page = i + 1
                } else if (currentPage <= 3) {
                  page = i + 1
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i
                } else {
                  page = currentPage - 2 + i
                }
                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={page === currentPage 
                      ? "bg-[#BE1E2D] hover:bg-[#9B1829]" 
                      : "border-gray-300"
                    }
                  >
                    {page}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
              className="border-gray-300"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
