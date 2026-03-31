import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File | null
    const language = formData.get('language') as string || 'es'

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Se requiere el archivo de audio' },
        { status: 400 }
      )
    }

    // Crear instancia del SDK
    const zai = await ZAI.create()

    // Convertir el archivo a base64
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer())
    const base64Audio = audioBuffer.toString('base64')

    // Transcribir audio con ASR
    const transcription = await zai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: language
    })

    const text = transcription.text

    if (!text) {
      return NextResponse.json(
        { error: 'No se pudo transcribir el audio' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      text: text
    })

  } catch (error) {
    console.error('Error in ASR:', error)
    return NextResponse.json(
      { error: 'Error al transcribir audio: ' + (error instanceof Error ? error.message : 'Error desconocido') },
      { status: 500 }
    )
  }
}
