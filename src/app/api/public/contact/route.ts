import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Resend } from 'resend'

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic'

// API pública para el formulario de contacto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    // Validación básica
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Por favor complete todos los campos requeridos' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Por favor ingrese un email válido' },
        { status: 400 }
      )
    }

    // Guardar mensaje en la base de datos como Lead con estado Pendiente
    const contactMessage = await db.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        status: 'Pendiente'
      }
    })

    // Enviar email de notificación
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      // Email al administrador (notificación de nuevo contacto)
      // En desarrollo, Resend solo envía al email de la cuenta registrada
      // Configurar EMAIL_TO en las variables de entorno
      const adminEmail = process.env.EMAIL_TO || 'landaumaq2@gmail.com'
      
      await resend.emails.send({
        from: 'Maquinarias Landau <onboarding@resend.dev>',
        to: adminEmail,
        subject: `🚀 Nuevo Contacto: ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #BE1E2D; margin: 0;">Nuevo Mensaje de Contacto</h1>
              </div>
              
              <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0;"><strong>Nombre:</strong> ${name}</p>
                <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #BE1E2D;">${email}</a></p>
                <p style="margin: 0 0 10px 0;"><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
              </div>
              
              <div style="background: #fff; padding: 20px; border-left: 4px solid #BE1E2D; margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; color: #333;">Mensaje:</h3>
                <p style="margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
              
              <div style="text-align: center; margin-top: 20px;">
                <a href="https://www.maquinariaslandau.com.ar/admin/login" 
                   style="display: inline-block; padding: 12px 24px; background: #BE1E2D; color: white; text-decoration: none; border-radius: 5px;">
                  Ver en Panel Admin
                </a>
              </div>
            </div>
            
            <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
              Este mensaje fue enviado desde el formulario de contacto de Maquinarias Landau
            </p>
          </div>
        `
      })

      // Email de confirmación al usuario
      await resend.emails.send({
        from: 'Maquinarias Landau <onboarding@resend.dev>',
        to: email,
        subject: 'Hemos recibido tu mensaje - Maquinarias Landau',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #BE1E2D; margin: 0;">¡Gracias por contactarnos!</h1>
              </div>
              
              <p style="color: #333; line-height: 1.6;">Hola <strong>${name}</strong>,</p>
              
              <p style="color: #333; line-height: 1.6;">
                Hemos recibido tu mensaje correctamente. Nuestro equipo se pondrá en contacto contigo 
                a la brevedad para responder tu consulta.
              </p>
              
              <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #666;">Tu mensaje:</h4>
                <p style="margin: 0; color: #333; white-space: pre-wrap; font-size: 14px;">${message}</p>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 14px; margin: 0;">
                  <strong>Maquinarias Landau</strong><br>
                  Av. Asamblea 524, C1424 CABA, Argentina<br>
                  Tel: 4921-7875 / 4923-0918<br>
                  Email: landaumaq2@gmail.com
                </p>
              </div>
            </div>
            
            <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
              © ${new Date().getFullYear()} Maquinarias Landau. Todos los derechos reservados.
            </p>
          </div>
        `
      })
    } catch (emailError) {
      // Si falla el envío de email, lo registramos pero no fallamos la solicitud
      console.error('Error enviando email de notificación:', emailError)
      // El mensaje ya se guardó en la base de datos, así que continuamos
    }

    return NextResponse.json({
      success: true,
      message: '¡Gracias por contactarnos! Te responderemos a la brevedad.',
      id: contactMessage.id
    })
  } catch (error) {
    console.error('Error guardando mensaje de contacto:', error)
    return NextResponse.json(
      { success: false, error: 'Error al enviar el mensaje. Por favor intente nuevamente.' },
      { status: 500 }
    )
  }
}
