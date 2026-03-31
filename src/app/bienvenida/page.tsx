'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AgentChatBot } from '@/components/agent/AgentChatBot'
import { Loader2 } from 'lucide-react'

function BienvenidaContent() {
  const searchParams = useSearchParams()
  const [leadName, setLeadName] = useState('')
  const [leadId, setLeadId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener parámetros de la URL
    const name = searchParams.get('nombre') || searchParams.get('name') || ''
    const id = searchParams.get('id') || ''
    
    setLeadName(decodeURIComponent(name))
    setLeadId(id)
    setLoading(false)
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#BE1E2D] to-[#9B1829] flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Preparando tu asesor personal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-[#BE1E2D] text-white py-6 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold">Maquinarias Landau</h1>
          <p className="text-white/80 mt-1">Desde 1949, tu socio en herramientas industriales</p>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Mensaje de bienvenida */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-[#BE1E2D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">👋</span>
            </div>
            
            {leadName && (
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                ¡Hola, {leadName}!
              </h2>
            )}
            
            {!leadName && (
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                ¡Bienvenido!
              </h2>
            )}
            
            <p className="text-gray-600 text-lg mb-6">
              Gracias por contactarte con nosotros. Nuestro asesor comercial está listo para ayudarte a encontrar las mejores herramientas para tu proyecto.
            </p>
          </div>

          {/* Beneficios */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-[#BE1E2D]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="font-semibold text-gray-800">Marcas Oficiales</h3>
              <p className="text-sm text-gray-500 mt-1">Bosch y Makita con garantía oficial</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-[#BE1E2D]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="font-semibold text-gray-800">Servicio Técnico</h3>
              <p className="text-sm text-gray-500 mt-1">Propio, menos tiempo de inactividad</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-[#BE1E2D]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-semibold text-gray-800">Desde 1949</h3>
              <p className="text-sm text-gray-500 mt-1">Más de 75 años de confianza</p>
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <p className="text-gray-600">
            <span className="font-semibold text-[#BE1E2D]">Nuestro agente comercial te contactará en breve.</span>
            <br />
            Mientras tanto, puedes iniciar el chat haciendo clic en el botón rojo de la esquina inferior derecha.
          </p>
        </div>
      </main>

      {/* Chat Bot */}
      <AgentChatBot 
        leadName={leadName} 
        leadId={leadId} 
        autoStart={true}
      />
    </div>
  )
}

export default function BienvenidaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#BE1E2D] to-[#9B1829] flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Cargando...</p>
        </div>
      </div>
    }>
      <BienvenidaContent />
    </Suspense>
  )
}
