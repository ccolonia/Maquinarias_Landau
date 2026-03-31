import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { db } from '@/lib/db'

// Sistema prompt del Agente Comercial
const SYSTEM_PROMPT = `Sos el asesor comercial de Maquinarias Landau, empresa familiar de herramientas industriales desde 1949.

TU IDENTIDAD:
- Asesor comercial profesional y entusiasta
- Hablás como un argentino (vos, tenés, decime, etc.)
- Respuestas cortas y directas (máximo 2-3 oraciones)
- Sin emojis nunca

LO QUE HACÉS:
- Ayudás a clientes a encontrar herramientas
- Respondés consultas sobre productos Bosch y Makita
- Derivás a un asesor humano cuando el cliente lo pide

REGLAS IMPORTANTES:
1. NUNCA des precios - decí "Te puedo cotizar" o "Consultá con nuestro equipo"
2. Mantené el CONTEXTO de la conversación - recordá lo que el cliente dijo antes
3. Si el cliente pide hablar con una PERSONA, ASESOR o HUMANO -> sugerí WhatsApp SIEMPRE
4. No repitas frases - cada respuesta debe ser diferente
5. Si ya te dijeron qué trabajo hacen, NO vuelvas a preguntar

PRODUCTOS PRINCIPALES:
- Taladros: percutores, inalámbricos, profesionales
- Amoladoras: 4½", 7", 9"
- Sierras: circulares, caladoras, de banco
- Rotomartillos: para concreto
- Lijadoras: orbitales, de banda
- Mezcladoras: para mortero

INFORMACIÓN DE CONTACTO:
- Dirección: Av. Asamblea 524, Caballito
- Teléfono: 4921-7875
- Horarios: Lun-Jue 9:30-17:00, Vie 9:30-14:00, Sáb 8:00-13:00

CUÁNDO OFRECER WHATSAPP (SOLO en estos casos):
- Cliente pide hablar con asesor/persona/humano
- Cliente quiere cotización
- Cliente quiere comprar
- Cliente pregunta por precios específicos`

// Detectar si quiere hablar con asesor
function wantsHumanAgent(message: string): boolean {
  const msg = message.toLowerCase()
  const keywords = [
    'hablar con', 'conversar con', 'chatear con',
    'asesor', 'persona', 'humano', 'alguien',
    'representante', 'vendedor', 'encargado',
    'quiero que me atienda', 'necesito hablar',
    'puedo hablar con', 'me comunico con',
    'asesoramiento personal', 'atención personalizada'
  ]
  return keywords.some(k => msg.includes(k))
}

// Respuesta inteligente cuando pide asesor
function getHumanAgentResponse(): string {
  const responses = [
    'Perfecto, te conecto con un asesor humano. Hacé clic en el botón verde de WhatsApp abajo y continuamos la conversación con nuestro equipo comercial.',
    'Sin problema, nuestro equipo está disponible por WhatsApp. Usá el botón verde abajo y te atienden al momento.',
    'Claro, te derivo con un asesor. Apretá el botón de WhatsApp verde y seguimos la conversación con una persona real.'
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

// Respuesta inteligente sin precios
function getSmartResponse(message: string, leadName: string, history: any[]): string {
  const msg = message.toLowerCase()
  
  // Si pide asesor humano
  if (wantsHumanAgent(message)) {
    return getHumanAgentResponse()
  }

  // Saludo inicial
  if (msg.includes('iniciá') || msg.includes('saludando')) {
    return `¡Hola${leadName ? ' ' + leadName : ''}! Soy de Maquinarias Landau, distribuidores oficiales de Bosch y Makita. ¿En qué te puedo ayudar?`
  }

  // Si pregunta por precios - NO DARLOS
  if (msg.includes('precio') || msg.includes('cuánto') || msg.includes('vale') || msg.includes('costo')) {
    return 'Te puedo cotizar cualquier producto. ¿Cuál te interesa? También podés contactarnos por WhatsApp para una atención más rápida con el botón verde de abajo.'
  }

  // Productos específicos
  if (msg.includes('taladro')) {
    return 'Tenemos taladros Bosch y Makita: percutores, inalámbricos y profesionales. ¿Para qué tipo de trabajo lo necesitás?'
  }
  if (msg.includes('amoladora') || msg.includes('angular')) {
    return 'Tenemos amoladoras Bosch y Makita de 4½", 7" y 9". ¿Para qué trabajo la vas a usar?'
  }
  if (msg.includes('sierra') || msg.includes('circular')) {
    return 'Tenemos sierras circulares, caladoras y de banco. ¿Qué materiales vas a cortar?'
  }
  if (msg.includes('rotomartillo') || msg.includes('rompe')) {
    return 'Tenemos rotomartillos Bosch y Makita para trabajo en concreto. ¿Es para obra o uso particular?'
  }
  if (msg.includes('lijadora')) {
    return 'Tenemos lijadoras orbitales y de banda. ¿Para qué tipo de acabado la necesitás?'
  }
  if (msg.includes('mezcladora')) {
    return 'Tenemos mezcladoras para mortero y adhesivos. ¿Es para construcción?'
  }

  // Marcas
  if (msg.includes('bosch')) {
    return 'Bosch tiene excelente calidad. Trabajamos la línea profesional azul. ¿Buscás alguna herramienta en particular?'
  }
  if (msg.includes('makita')) {
    return 'Makita es ideal para trabajo continuo. ¿Qué herramienta te interesa de esta marca?'
  }

  // Rubros - recordar contexto
  if (msg.includes('carpinter')) {
    return 'Para carpintería te recomiendo sierras circulares, caladoras y lijadoras. ¿Qué tipo de muebles o trabajos hacés?'
  }
  if (msg.includes('taller') || msg.includes('mecánic')) {
    return 'Para taller mecánico van bien los taladros percutores y amoladoras. ¿Qué trabajos realizás más seguido?'
  }
  if (msg.includes('construc') || msg.includes('obra')) {
    return 'Para construcción tenemos rotomartillos, mezcladoras y amoladoras. ¿Es para obra grande o chica?'
  }
  if (msg.includes('metal') || msg.includes('herrer')) {
    return 'Para metalmecánica las amoladoras industriales son ideales. ¿Qué espesor de material trabajás?'
  }

  // Materiales específicos
  if (msg.includes('madera') || msg.includes('nogal') || msg.includes('pino') || msg.includes('cedro')) {
    return 'Esa madera es muy buena para trabajo fino. Te recomiendo sierras de disco y lijadoras de grano fino. ¿Qué tipo de muebles hacés?'
  }
  if (msg.includes('metal') || msg.includes('hierro') || msg.includes('acero')) {
    return 'Para metal necesitás amoladoras y discos de corte específicos. ¿Qué espesor trabajás normalmente?'
  }

  // Uso profesional vs particular
  if (msg.includes('profesional') || msg.includes('trabajo todos')) {
    return 'Para uso profesional te recomiendo la línea azul de Bosch o Makita industrial. Son más robustas y duraderas. ¿Qué herramienta necesitás?'
  }
  if (msg.includes('particular') || msg.includes('hogar') || msg.includes('casero')) {
    return 'Para el hogar la línea verde de Bosch es ideal. Económica y funcional. ¿Qué tareas tenés pensado hacer?'
  }

  // Ubicación y horarios
  if (msg.includes('dónde') || msg.includes('dirección') || msg.includes('ubicación')) {
    return 'Estamos en Av. Asamblea 524, Caballito. Horarios: Lun-Jue 9:30-17:00, Vie 9:30-14:00, Sáb 8:00-13:00. ¿Te gustaría visitar el local?'
  }
  if (msg.includes('horario') || msg.includes('abierto')) {
    return 'Atendemos Lun a Jue 9:30-17:00, Vie 9:30-14:00, Sáb 8:00-13:00. Estamos en Caballito.'
  }

  // Servicio técnico
  if (msg.includes('servicio') || msg.includes('garantía') || msg.includes('reparación')) {
    return 'Tenemos servicio técnico propio. Reparamos Bosch y Makita con repuestos originales. ¿Tenés algo que necesite revisión?'
  }

  // Financiación y envíos
  if (msg.includes('financia') || msg.includes('cuotas') || msg.includes('tarjeta')) {
    return 'Trabajamos con todas las tarjetas y tenemos cuotas sin interés. Para ver las promociones vigentes, consultá por WhatsApp con el botón verde.'
  }
  if (msg.includes('envío') || msg.includes('delivery')) {
    return 'Hacemos envíos a todo el país. Para cotizar el envío, escribime por WhatsApp con el botón verde de abajo.'
  }

  // Cierre
  if (msg.includes('gracias') || msg.includes('perfecto') || msg.includes('excelente')) {
    return '¡Un placer! Si necesitás algo más, estoy acá. También podés llamarnos al 4921-7875 o visitarnos en Caballito.'
  }

  // Respuesta general contextual
  return 'Entendido. ¿Hay alguna herramienta específica que te interese? Trabajamos Bosch y Makita oficiales.'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, leadName, conversationId } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Mensajes requeridos' }, { status: 400 })
    }

    const lastMessage = messages[messages.length - 1]?.content || ''
    let responseContent = ''
    let shouldSuggestWhatsApp = false
    
    // Verificar si quiere hablar con asesor
    if (wantsHumanAgent(lastMessage)) {
      responseContent = getHumanAgentResponse()
      shouldSuggestWhatsApp = true
    } else {
      try {
        const zai = await ZAI.create()

        const systemMessage = {
          role: 'assistant' as const,
          content: leadName 
            ? SYSTEM_PROMPT + `\n\nEl cliente se llama: ${leadName}`
            : SYSTEM_PROMPT
        }

        const completion = await Promise.race([
          zai.chat.completions.create({
            messages: [systemMessage, ...messages],
            thinking: { type: 'disabled' }
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 10000)
          )
        ]) as any

        responseContent = completion.choices[0]?.message?.content

        if (!responseContent) {
          throw new Error('Respuesta vacía')
        }

        // Verificar si la respuesta de la IA sugiere WhatsApp
        if (responseContent.toLowerCase().includes('whatsapp') || 
            responseContent.toLowerCase().includes('asesor')) {
          shouldSuggestWhatsApp = true
        }

      } catch (aiError: any) {
        console.error('Error IA:', aiError.message)
        responseContent = getSmartResponse(lastMessage, leadName || '', messages)
        
        if (responseContent.includes('WhatsApp')) {
          shouldSuggestWhatsApp = true
        }
      }
    }

    // Guardar conversación en la base de datos
    try {
      const messagesJson = JSON.stringify(messages.map((m: any) => ({
        role: m.role,
        content: m.content,
        timestamp: new Date().toISOString()
      })))

      if (conversationId) {
        // Actualizar conversación existente
        await db.agentConversation.update({
          where: { id: conversationId },
          data: {
            messages: messagesJson,
            messageCount: messages.length,
            updatedAt: new Date()
          }
        })
      } else {
        // Crear nueva conversación
        const newConversation = await db.agentConversation.create({
          data: {
            leadName: leadName || null,
            messages: messagesJson,
            messageCount: messages.length,
            status: 'activa',
            source: 'chat'
          }
        })
        
        return NextResponse.json({
          success: true,
          message: responseContent,
          conversationId: newConversation.id,
          suggestWhatsApp: shouldSuggestWhatsApp
        })
      }
    } catch (dbError) {
      console.error('Error guardando conversación:', dbError)
    }

    return NextResponse.json({
      success: true,
      message: responseContent,
      conversationId: conversationId || null,
      suggestWhatsApp: shouldSuggestWhatsApp
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error procesando mensaje' }, { status: 500 })
  }
}
