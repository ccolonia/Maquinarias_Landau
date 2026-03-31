import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, size = '1024x1024' } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Se requiere un prompt para generar la imagen' },
        { status: 400 }
      )
    }

    // Obtener API key de Stability AI
    const apiKey = process.env.STABILITY_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'STABILITY_API_KEY no está configurado en Vercel.' },
        { status: 500 }
      )
    }

    // Mapear tamaños
    const sizeMap: Record<string, { width: number; height: number }> = {
      '1024x1024': { width: 1024, height: 1024 },
      '768x1344': { width: 768, height: 1344 },
      '864x1152': { width: 864, height: 1152 },
      '1344x768': { width: 1344, height: 768 },
      '1152x864': { width: 1152, height: 864 },
      '1440x720': { width: 1440, height: 720 },
      '720x1440': { width: 720, height: 1440 }
    }

    const { width, height } = sizeMap[size] || { width: 1024, height: 1024 }

    // Mejorar el prompt
    const enhancedPrompt = `${prompt}, professional photography, high quality, detailed, sharp focus`

    console.log(`Generating image with Stability AI: ${enhancedPrompt}`)

    // Llamar a Stability AI API v1
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: enhancedPrompt,
            weight: 1
          },
          {
            text: 'blurry, bad quality, distorted, ugly, low resolution, watermark',
            weight: -1
          }
        ],
        cfg_scale: 7,
        height: height,
        width: width,
        samples: 1,
        steps: 30
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Stability AI error:', response.status, errorText)
      return NextResponse.json(
        { error: `Error de Stability AI (${response.status}): ${errorText}` },
        { status: 500 }
      )
    }

    const data = await response.json()
    
    // Stability AI devuelve base64 en artifacts
    const imageBase64 = data.artifacts?.[0]?.base64

    if (!imageBase64) {
      console.error('No image in response:', JSON.stringify(data, null, 2))
      return NextResponse.json(
        { error: 'No se pudo obtener la imagen generada' },
        { status: 500 }
      )
    }

    const dataUrl = `data:image/png;base64,${imageBase64}`

    return NextResponse.json({
      success: true,
      url: dataUrl,
      fileName: `ai-${Date.now()}.png`
    })

  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      { error: 'Error al generar la imagen: ' + (error instanceof Error ? error.message : 'Error desconocido') },
      { status: 500 }
    )
  }
}
