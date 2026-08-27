import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendContactEmails } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim()
    const message = String(body.message || '').trim()
    const phone = String(body.phone || '').trim()
    const contactType = body.contact_type === 'professional' ? 'professional' : 'particular'
    const company = String(body.company || '').trim()
    const inquiryType = String(body.area || body.inquiry_type || '').trim()
    const referralSource = String(body.referral_source || '').trim()
    const locale = String(body.locale || 'es').trim()
    const gdprConsent = Boolean(body.gdpr_consent || body.privacy)

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }
    if (!gdprConsent) {
      return NextResponse.json({ error: 'Debes aceptar la política de privacidad' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email no válido' }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from('contact_submissions').insert({
      name,
      email,
      phone: phone || null,
      contact_type: contactType,
      company: contactType === 'professional' ? company || null : null,
      inquiry_type: inquiryType || null,
      referral_source: referralSource || null,
      message,
      locale,
      gdpr_consent: gdprConsent,
    })

    if (error) {
      console.error('Contact insert error:', error)
      return NextResponse.json({ error: 'No se pudo guardar la consulta' }, { status: 500 })
    }

    try {
      await sendContactEmails({
        name,
        email,
        phone,
        contactType,
        company,
        inquiryType,
        referralSource,
        message,
      })
    } catch (mailError) {
      console.error('Contact email error:', mailError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
