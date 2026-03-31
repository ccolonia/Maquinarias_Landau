import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// Función para convertir PCM a WAV (formato compatible con navegadores)
function pcmToWav(pcmBuffer: Buffer, sampleRate: number = 24000, numChannels: number = 1, bitsPerSample: number = 16): Buffer {
  const byteRate = sampleRate * numChannels * bitsPerSample / 8
  const blockAlign = numChannels * bitsPerSample / 8
  const dataSize = pcmBuffer.length
  const bufferSize = 44 + dataSize
  
  const buffer = Buffer.alloc(bufferSize)
  
  // RIFF header
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + dataSize, 4)
  buffer.write('WAVE', 8)
  
  // fmt chunk
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16, 16) // chunk size
  buffer.writeUInt16LE(1, 20) // audio format (PCM)
  buffer.writeUInt16LE(numChannels, 22)
  buffer.writeUInt32LE(sampleRate, 24)
  buffer.writeUInt32LE(byteRate, 28)
  buffer.writeUInt16LE(blockAlign, 32)
  buffer.writeUInt16LE(bitsPerSample, 34)
  
  // data chunk
  buffer.write('data', 36)
  buffer.writeUInt32LE(dataSize, 40)
  pcmBuffer.copy(buffer, 44)
  
  return buffer
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text } = body

    if (!text) {
      return NextResponse.json(
        { error: 'Se requiere el texto para convertir a voz' },
        { status: 400 }
      )
    }

    // Limitar texto a 500 caracteres para respuestas más rápidas
    const limitedText = text.slice(0, 500)

    const zai = await ZAI.create()

    // Usar TTS sin especificar voz (usa la voz por defecto del sistema)
    const response = await zai.audio.tts.create({
      input: limitedText,
      speed: 0.95 // Velocidad normal
    })

    // El SDK devuelve un objeto Response
    const arrayBuffer = await response.arrayBuffer()
    const pcmBuffer = Buffer.from(new Uint8Array(arrayBuffer))
    
    // Convertir PCM a WAV para compatibilidad con navegadores
    const wavBuffer = pcmToWav(pcmBuffer, 24000, 1, 16)
    const base64Audio = wavBuffer.toString('base64')

    return NextResponse.json({
      success: true,
      audio: `data:audio/wav;base64,${base64Audio}`
    })

  } catch (error) {
    console.error('Error in TTS:', error)
    return NextResponse.json(
      { 
        error: 'Error al generar audio', 
        details: error instanceof Error ? error.message : 'Error desconocido' 
      },
      { status: 500 }
    )
  }
}
