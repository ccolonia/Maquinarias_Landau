'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { MessageCircle, Search, RefreshCw, User, Clock, ChevronDown, ChevronUp } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface Conversation {
  id: string
  leadName: string | null
  leadEmail: string | null
  messages: string
  messageCount: number
  status: string
  source: string
  createdAt: string
  updatedAt: string
}

function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('todas')

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/conversations')
      const data = await res.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const parseMessages = (messagesJson: string): Message[] => {
    try {
      return JSON.parse(messagesJson)
    } catch {
      return []
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = 
      (conv.leadName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      conv.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'todas' || conv.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/admin/conversations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      fetchConversations()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-7 h-7 text-[#BE1E2D]" />
            Agente de Voz
          </h1>
          <p className="text-gray-500 mt-1">Historial de conversaciones del agente comercial</p>
        </div>
        
        <button
          onClick={fetchConversations}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#BE1E2D] text-white rounded-lg hover:bg-[#9B1829] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE1E2D]/20 focus:border-[#BE1E2D]"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE1E2D]/20 focus:border-[#BE1E2D]"
          >
            <option value="todas">Todas las conversaciones</option>
            <option value="activa">Activas</option>
            <option value="cerrada">Cerradas</option>
            <option value="pendiente">Pendientes</option>
          </select>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total conversaciones</p>
          <p className="text-2xl font-bold text-gray-900">{conversations.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Activas</p>
          <p className="text-2xl font-bold text-green-600">{conversations.filter(c => c.status === 'activa').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-600">{conversations.filter(c => c.status === 'pendiente').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Mensajes totales</p>
          <p className="text-2xl font-bold text-[#BE1E2D]">{conversations.reduce((acc, c) => acc + c.messageCount, 0)}</p>
        </div>
      </div>

      {/* Lista de conversaciones */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-[#BE1E2D] mx-auto" />
            <p className="text-gray-500 mt-2">Cargando conversaciones...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-gray-500 mt-2">No hay conversaciones</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredConversations.map((conv) => {
              const messages = parseMessages(conv.messages)
              const isExpanded = expandedId === conv.id
              
              return (
                <div key={conv.id} className="p-4">
                  {/* Resumen de conversación */}
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleExpand(conv.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#BE1E2D]/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-[#BE1E2D]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {conv.leadName || 'Sin nombre'}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {formatDate(conv.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        conv.status === 'activa' ? 'bg-green-500 text-white border-green-600' :
                        conv.status === 'pendiente' ? 'bg-amber-500 text-white border-amber-600' :
                        'bg-gray-500 text-white border-gray-600'
                      }`}>
                        {conv.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {conv.messageCount} mensajes
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {/* Detalle expandido */}
                  {isExpanded && (
                    <div className="mt-4 pl-14 space-y-3">
                      {/* Cambiar estado */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-gray-500">Cambiar estado:</span>
                        <select
                          value={conv.status}
                          onChange={(e) => updateStatus(conv.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            conv.status === 'activa' ? 'bg-green-500 text-white border border-green-600' :
                            conv.status === 'pendiente' ? 'bg-amber-500 text-white border border-amber-600' :
                            'bg-gray-500 text-white border border-gray-600'
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="activa" className="bg-white text-gray-900">Activa</option>
                          <option value="pendiente" className="bg-white text-gray-900">Pendiente</option>
                          <option value="cerrada" className="bg-white text-gray-900">Cerrada</option>
                        </select>
                      </div>
                      
                      {/* Mensajes */}
                      <div className="max-h-80 overflow-y-auto space-y-2 bg-gray-50 rounded-lg p-3">
                        {messages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                                msg.role === 'user'
                                  ? 'bg-[#BE1E2D] text-white'
                                  : 'bg-white text-gray-900 border border-gray-200'
                              }`}
                            >
                              <p>{msg.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Info adicional */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>ID: {conv.id}</span>
                        <span>Actualizado: {formatDate(conv.updatedAt)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ConversationsAdminPage() {
  return (
    <AdminLayout>
      <ConversationsPage />
    </AdminLayout>
  )
}
