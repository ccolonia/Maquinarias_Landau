'use client'

import { useEffect, useState } from 'react'
import { 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle,
  Trash2,
  Loader2,
  MailOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Message {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  read: boolean
  createdAt: string
}

export default function MensajesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    try {
      const res = await fetch('/api/admin/messages')
      const data = await res.json()
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(id: string) {
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true })
      })
      fetchMessages()
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Está seguro de eliminar este mensaje?')) return

    try {
      await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
      fetchMessages()
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const filteredMessages = messages.filter(msg => {
    if (activeTab === 'unread') return !msg.read
    return true
  })

  const unreadCount = messages.filter(m => !m.read).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#BE1E2D]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mensajes</h1>
        <p className="text-gray-600 mt-1">{messages.length} mensajes en total</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            Todos ({messages.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            No leídos ({unreadCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <MessageList 
            messages={filteredMessages} 
            onMarkRead={markAsRead} 
            onDelete={handleDelete} 
          />
        </TabsContent>

        <TabsContent value="unread" className="mt-6">
          <MessageList 
            messages={filteredMessages} 
            onMarkRead={markAsRead} 
            onDelete={handleDelete} 
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MessageList({ 
  messages, 
  onMarkRead, 
  onDelete 
}: { 
  messages: Message[]
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
}) {
  if (messages.length === 0) {
    return (
      <Card className="border border-gray-100">
        <CardContent className="py-12 text-center">
          <MailOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay mensajes para mostrar</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map(message => (
        <Card 
          key={message.id} 
          className={`border ${message.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'}`}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{message.name}</h3>
                  {!message.read && (
                    <Badge className="bg-blue-500 text-white">Nuevo</Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${message.email}`} className="hover:text-[#BE1E2D]">
                      {message.email}
                    </a>
                  </div>
                  {message.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${message.phone}`} className="hover:text-[#BE1E2D]">
                        {message.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(message.createdAt).toLocaleString('es-AR')}
                  </div>
                </div>

                <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
              </div>

              <div className="flex gap-2 ml-4">
                {!message.read && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onMarkRead(message.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Marcar leído
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(message.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
