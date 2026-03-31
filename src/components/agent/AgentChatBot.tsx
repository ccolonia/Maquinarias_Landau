'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Mic, MicOff, Volume2, VolumeX, Loader2, Home, Square, Radio } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AgentChatBotProps {
  leadName?: string
  leadId?: string
  autoStart?: boolean
}

export function AgentChatBot({ leadName = '', leadId = '', autoStart = false }: AgentChatBotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [hasStarted, setHasStarted] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [suggestWhatsApp, setSuggestWhatsApp] = useState(false)
  const [ttsMode, setTtsMode] = useState<'browser' | 'server'>('browser') // Default a navegador
  const [voicesLoaded, setVoicesLoaded] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Cargar voces del navegador
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const loadVoices = () => {
      const voices = window.speechSynthesis?.getVoices() || []
      if (voices.length > 0) {
        setVoicesLoaded(true)
        console.log('Voces disponibles:', voices.map(v => `${v.name} (${v.lang})`).join(', '))
      }
    }
    
    if ('speechSynthesis' in window) {
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
    
    // Inicializar reconocimiento de voz
    const hasRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    if (hasRecognition) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'es-AR'
    }
  }, [])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Función para detener todo el audio
  const stopAllAudio = useCallback(() => {
    console.log('Deteniendo audio...')
    
    // Detener audio HTML5
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    
    // Detener Web Speech API
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    
    currentUtteranceRef.current = null
    setIsSpeaking(false)
  }, [])

  // Texto a voz usando Web Speech API
  const speakWithBrowserTTS = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.error('Web Speech API no disponible')
      setIsSpeaking(false)
      return
    }

    console.log('Hablando con navegador:', text.slice(0, 50) + '...')
    
    // Cancelar cualquier audio previo
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-AR'
    utterance.rate = 1.0
    utterance.pitch = 0.85 // Más grave = más masculina
    
    // Buscar la mejor voz masculina
    const voices = window.speechSynthesis.getVoices()
    console.log('Buscando voz masculina entre', voices.length, 'voces')
    
    // Prioridad: voz argentina masculina > española masculina > cualquier española
    let selectedVoice = voices.find(v => 
      v.lang === 'es-AR' && (
        v.name.toLowerCase().includes('male') ||
        v.name.toLowerCase().includes('diego') ||
        v.name.toLowerCase().includes('jorge')
      )
    )
    
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang === 'es-AR')
    }
    
    if (!selectedVoice) {
      selectedVoice = voices.find(v => 
        v.lang.startsWith('es') && (
          v.name.toLowerCase().includes('male') ||
          v.name.toLowerCase().includes('diego') ||
          v.name.toLowerCase().includes('jorge') ||
          v.name.toLowerCase().includes('pablo')
        )
      )
    }
    
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith('es'))
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice
      console.log('Voz seleccionada:', selectedVoice.name, '-', selectedVoice.lang)
    } else {
      console.log('No se encontró voz en español, usando default')
    }
    
    utterance.onstart = () => {
      console.log('TTS iniciado')
      setIsSpeaking(true)
    }
    
    utterance.onend = () => {
      console.log('TTS finalizado')
      setIsSpeaking(false)
      currentUtteranceRef.current = null
    }
    
    utterance.onerror = (e) => {
      console.error('Error TTS:', e)
      setIsSpeaking(false)
    }
    
    currentUtteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [])

  // Texto a voz usando API del servidor
  const speakWithServerTTS = useCallback(async (text: string) => {
    console.log('Hablando con servidor:', text.slice(0, 50) + '...')
    setIsSpeaking(true)
    
    try {
      const response = await fetch('/api/agent/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.audio) {
        // Detener audio anterior
        if (audioRef.current) {
          audioRef.current.pause()
        }
        
        audioRef.current = new Audio(data.audio)
        
        audioRef.current.oncanplaythrough = async () => {
          try {
            await audioRef.current?.play()
          } catch (e) {
            console.error('Error reproduciendo:', e)
            setIsSpeaking(false)
          }
        }
        
        audioRef.current.onended = () => {
          setIsSpeaking(false)
          audioRef.current = null
        }
        
        audioRef.current.onerror = (e) => {
          console.error('Error de audio:', e)
          setIsSpeaking(false)
        }
        
        audioRef.current.load()
      } else {
        throw new Error('No se recibió audio')
      }
    } catch (error) {
      console.error('Error servidor TTS, usando browser:', error)
      // Fallback a browser TTS
      speakWithBrowserTTS(text)
    }
  }, [speakWithBrowserTTS])

  // Función principal de TTS
  const speakText = useCallback(async (text: string) => {
    if (!audioEnabled) return

    // Detener cualquier audio previo
    stopAllAudio()
    
    // Pequeño delay para asegurar que el audio anterior se detuvo
    setTimeout(() => {
      if (ttsMode === 'browser') {
        speakWithBrowserTTS(text)
      } else {
        speakWithServerTTS(text)
      }
    }, 100)
  }, [audioEnabled, ttsMode, stopAllAudio, speakWithBrowserTTS, speakWithServerTTS])

  // Iniciar conversación
  const startConversation = useCallback(async () => {
    if (hasStarted) return
    setHasStarted(true)
    setIsLoading(true)

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Iniciá la conversación saludando a ${leadName || 'el cliente'}` }],
          leadName
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessages([{ role: 'assistant', content: data.message }])
        setConversationId(data.conversationId)
        setSuggestWhatsApp(data.suggestWhatsApp)
        
        if (audioEnabled) {
          await speakText(data.message)
        }
      }
    } catch (error) {
      console.error('Error starting conversation:', error)
      const fallbackMessage = `¡Hola${leadName ? ' ' + leadName : ''}! Soy de Maquinarias Landau. ¿En qué te puedo ayudar?`
      setMessages([{ role: 'assistant', content: fallbackMessage }])
      
      if (audioEnabled) {
        await speakText(fallbackMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }, [hasStarted, leadName, audioEnabled, speakText])

  useEffect(() => {
    if (autoStart && !isOpen) {
      const timer = setTimeout(() => setIsOpen(true), 500)
      return () => clearTimeout(timer)
    }
  }, [autoStart])

  useEffect(() => {
    if (isOpen && autoStart && !hasStarted) {
      const timer = setTimeout(() => startConversation(), 800)
      return () => clearTimeout(timer)
    }
  }, [isOpen, autoStart, hasStarted, startConversation])

  // Enviar mensaje
  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: inputText.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInputText('')
    setIsLoading(true)
    
    // Detener audio si está reproduciendo
    stopAllAudio()

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          leadName,
          conversationId
        })
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = { role: 'assistant', content: data.message }
        setMessages([...newMessages, assistantMessage])
        
        if (data.conversationId && !conversationId) {
          setConversationId(data.conversationId)
        }
        
        setSuggestWhatsApp(data.suggestWhatsApp)
        
        if (audioEnabled) {
          await speakText(data.message)
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Reconocimiento de voz
  const startListening = () => {
    if (!recognitionRef.current) {
      alert('Tu navegador no soporta reconocimiento de voz. Usá Chrome.')
      return
    }

    // Detener audio antes de escuchar
    stopAllAudio()
    setIsListening(true)
    
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInputText(transcript)
      setIsListening(false)
    }
    
    recognitionRef.current.onerror = (event: any) => {
      setIsListening(false)
      if (event.error === 'not-allowed') {
        alert('Permití el acceso al micrófono.')
      }
    }
    
    recognitionRef.current.onend = () => setIsListening(false)
    
    try {
      recognitionRef.current.start()
    } catch (error) {
      setIsListening(false)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const toggleChat = () => setIsOpen(!isOpen)

  // Generar mensaje para WhatsApp con historial
  const getWhatsAppMessage = () => {
    const conversationHistory = messages.map(m => 
      m.role === 'user' ? `Cliente: ${m.content}` : `Agente: ${m.content}`
    ).join('\n')
    
    return encodeURIComponent(`Hola, vengo del chat de la web y me gustaría hablar con un asesor.\n\n--- Historial de conversación ---\n${conversationHistory}\n---\n\nMi nombre es: ${leadName || 'No proporcionado'}`)
  }

  const whatsappNumber = '5491162422197'

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
          isOpen ? 'bg-gray-700 hover:bg-gray-800' : 'bg-[#BE1E2D] hover:bg-[#9B1829]'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Ventana de chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col" style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-[#BE1E2D] px-3 py-3 flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm">Agente Landau</h3>
              <p className="text-xs text-white/80 truncate">
                {isSpeaking ? '🔊 Hablando...' : isListening ? '🎤 Escuchando...' : isLoading ? '⏳ Pensando...' : '🟢 En línea'}
              </p>
            </div>
            
            {/* Controles de audio - SIEMPRE VISIBLES */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Botón DETENER - Siempre visible cuando está hablando */}
              {isSpeaking && (
                <button
                  onClick={stopAllAudio}
                  className="p-2 rounded-lg bg-white text-[#BE1E2D] hover:bg-gray-100 transition-colors"
                  title="Detener audio"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>
              )}
              
              {/* Botón cambiar modo de voz */}
              <button
                onClick={() => {
                  stopAllAudio()
                  setTtsMode(ttsMode === 'browser' ? 'server' : 'browser')
                }}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                title={ttsMode === 'browser' ? 'Usar voz del servidor' : 'Usar voz del navegador'}
              >
                <Radio className="w-4 h-4 text-white" />
              </button>
              
              {/* Botón volver al inicio */}
              <a
                href="/"
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                title="Volver al inicio"
              >
                <Home className="w-4 h-4 text-white" />
              </a>
              
              {/* Botón activar/desactivar audio */}
              <button
                onClick={() => {
                  stopAllAudio()
                  setAudioEnabled(!audioEnabled)
                }}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                title={audioEnabled ? 'Silenciar voz' : 'Activar voz'}
              >
                {audioEnabled ? (
                  <Volume2 className="w-4 h-4 text-white" />
                ) : (
                  <VolumeX className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100">
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-gray-500 mt-10">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Iniciando conversación...</p>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-[#BE1E2D] text-white rounded-br-md'
                      : 'bg-white text-gray-900 rounded-bl-md shadow-sm border border-gray-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-900 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-200">
                  <Loader2 className="w-4 h-4 animate-spin text-[#BE1E2D]" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Botón de WhatsApp */}
          <div className={`px-4 py-2 border-t ${suggestWhatsApp ? 'bg-green-100 border-green-200' : 'bg-green-50 border-green-100'}`}>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${getWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 w-full py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BD5A] transition-colors text-sm font-medium ${suggestWhatsApp ? 'animate-pulse' : ''}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {suggestWhatsApp ? '👉 Hablar con asesor' : 'Asesor por WhatsApp'}
            </a>
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribí tu mensaje..."
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                disabled={isLoading || isListening}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-[#BE1E2D] focus:outline-none focus:ring-2 focus:ring-[#BE1E2D]/20 text-gray-900 placeholder-gray-400 text-sm"
              />
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isLoading || isSpeaking}
                className={`p-2 rounded-lg transition-colors ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
                title={isListening ? 'Detener escucha' : 'Hablar'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputText.trim() || isListening}
                className="p-2 rounded-lg bg-[#BE1E2D] text-white hover:bg-[#9B1829] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Enviar mensaje"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            {/* Indicador de modo de voz */}
            <div className="flex items-center justify-center gap-2 mt-2 text-xs">
              <span className={`px-2 py-0.5 rounded ${ttsMode === 'browser' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                🔊 Navegador
              </span>
              <span className="text-gray-400">|</span>
              <span className={`px-2 py-0.5 rounded ${ttsMode === 'server' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                🌐 Servidor
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
