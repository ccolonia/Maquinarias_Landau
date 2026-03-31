'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Phone, Search, Filter, Eye, X, Clock, User, ChevronDown, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface Conversation {
  id: string
  leadName: string | null
  leadEmail: string | null
  leadPhone: string | null
  messages: string
  messageCount: number
  status: string
  source: string
  createdAt: string
  updatedAt: string
}

export default function AgenteVozPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todas')
  const [sourceFilter, setSourceFilter] = useState('todos')

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/conversations')
      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
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

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = 
      (conv.leadName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (conv.leadEmail?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (conv.leadPhone?.includes(searchTerm))

    const matchesStatus = statusFilter === 'todas' || conv.status === statusFilter
    const matchesSource = sourceFilter === 'todos' || conv.source === sourceFilter

    return matchesSearch && matchesStatus && matchesSource
  })

  const parseMessages = (messagesJson: string): Message[] => {
    try {
      return JSON.parse(messagesJson)
    } catch {
      return []
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activa': return 'bg-green-500 text-white border-green-600'
      case 'cerrada': return 'bg-gray-500 text-white border-gray-600'
      case 'pendiente': return 'bg-amber-500 text-white border-amber-600'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusSelectColor = (status: string) => {
    switch (status) {
      case 'activa': return 'bg-green-500 text-white border-green-600'
      case 'cerrada': return 'bg-gray-500 text-white border-gray-600'
      case 'pendiente': return 'bg-amber-500 text-white border-amber-600'
      default: return 'bg-white text-gray-800 border-gray-300'
    }
  }

  const getSourceIcon = (source: string) => {
    return source === 'voz' ? 
      <Phone className="w-4 h-4 text-blue-600" /> : 
      <MessageCircle className="w-4 h-4 text-[#BE1E2D]" />
  }

  // Estadísticas
  const totalConversaciones = conversations.length
  const conversacionesActivas = conversations.filter(c => c.status === 'activa').length
  const conversacionesPendientes = conversations.filter(c => c.status === 'pendiente').length
  const totalMensajes = conversations.reduce((acc, c) => acc + c.messageCount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agente de Voz</h1>
          <p className="text-gray-500 mt-1">Conversaciones del chatbot y asistente de voz</p>
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

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalConversaciones}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{conversacionesActivas}</p>
              <p className="text-sm text-gray-500">Activas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{conversacionesPendientes}</p>
              <p className="text-sm text-gray-500">Pendientes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#BE1E2D]/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#BE1E2D]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalMensajes}</p>
              <p className="text-sm text-gray-500">Mensajes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#BE1E2D] focus:outline-none focus:ring-2 focus:ring-[#BE1E2D]/20"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:border-[#BE1E2D] focus:outline-none focus:ring-2 focus:ring-[#BE1E2D]/20 bg-white"
              >
                <option value="todas">Todos los estados</option>
                <option value="activa">Activas</option>
                <option value="pendiente">Pendientes</option>
                <option value="cerrada">Cerradas</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:border-[#BE1E2D] focus:outline-none focus:ring-2 focus:ring-[#BE1E2D]/20 bg-white"
              >
                <option value="todos">Todas las fuentes</option>
                <option value="chat">Chat</option>
                <option value="voz">Voz</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de conversaciones */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#BE1E2D]" />
            <p className="mt-2 text-gray-500">Cargando conversaciones...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="w-12 h-12 mx-auto text-gray-300" />
            <p className="mt-2 text-gray-500">No hay conversaciones</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedConversation(conv)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#BE1E2D]/10 rounded-full flex items-center justify-center">
                    {getSourceIcon(conv.source)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 truncate">
                        {conv.leadName || 'Sin nombre'}
                      </p>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(conv.status)}`}>
                        {conv.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {conv.messageCount} mensaje{conv.messageCount !== 1 ? 's' : ''} • {formatDate(conv.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={conv.status}
                      onChange={(e) => {
                        e.stopPropagation()
                        updateStatus(conv.id, e.target.value)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={`text-sm px-3 py-1.5 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 ${getStatusSelectColor(conv.status)}`}
                    >
                      <option value="activa" className="bg-white text-gray-900">Activa</option>
                      <option value="pendiente" className="bg-white text-gray-900">Pendiente</option>
                      <option value="cerrada" className="bg-white text-gray-900">Cerrada</option>
                    </select>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedConversation(conv)
                      }}
                      className="p-2 text-gray-500 hover:text-[#BE1E2D] hover:bg-[#BE1E2D]/10 rounded-lg transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de conversación */}
      {selectedConversation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header del modal */}
            <div className="bg-[#BE1E2D] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  {getSourceIcon(selectedConversation.source)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {selectedConversation.leadName || 'Sin nombre'}
                  </h3>
                  <p className="text-sm text-white/80">
                    {formatDate(selectedConversation.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedConversation(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {parseMessages(selectedConversation.messages).map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-[#BE1E2D] text-white rounded-br-md'
                        : 'bg-white text-gray-900 rounded-bl-md shadow-sm border border-gray-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                    {msg.timestamp && (
                      <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer del modal */}
            <div className="border-t border-gray-200 px-6 py-4 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {selectedConversation.leadEmail && (
                    <span className="text-sm text-gray-500">{selectedConversation.leadEmail}</span>
                  )}
                  {selectedConversation.leadPhone && (
                    <span className="text-sm text-gray-500">{selectedConversation.leadPhone}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedConversation.status}
                    onChange={(e) => {
                      updateStatus(selectedConversation.id, e.target.value)
                      setSelectedConversation({ ...selectedConversation, status: e.target.value })
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 ${getStatusSelectColor(selectedConversation.status)}`}
                  >
                    <option value="activa" className="bg-white text-gray-900">Activa</option>
                    <option value="pendiente" className="bg-white text-gray-900">Pendiente</option>
                    <option value="cerrada" className="bg-white text-gray-900">Cerrada</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
