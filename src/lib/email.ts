import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

let _transporter: Transporter | null = null
let _warned = false

function smtpPass() {
  return process.env.SMTP_PASS?.trim() || process.env.SMTP_PASSWORD?.trim() || ''
}

function getTransporter(): Transporter | null {
  if (_transporter) return _transporter
  const host = process.env.SMTP_HOST?.trim() || 'ssl0.ovh.net'
  const port = Number(process.env.SMTP_PORT) || 465
  const user = process.env.SMTP_USER?.trim()
  const pass = smtpPass()
  if (!user || !pass) {
    if (!_warned) {
      console.warn('[email] SMTP_USER / SMTP_PASS no configurados; correo omitido')
      _warned = true
    }
    return null
  }
  _transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  })
  return _transporter
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function sendSmtpEmail(opts: {
  from: string
  to: string
  subject: string
  html: string
  replyTo?: string
}) {
  const transporter = getTransporter()
  if (!transporter) return { ok: false, skipped: true as const }
  try {
    await transporter.sendMail({
      from: opts.from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
    })
    return { ok: true, skipped: false as const }
  } catch (err) {
    console.error('[email] SMTP error', err)
    return { ok: false, skipped: false as const }
  }
}

const FROM = process.env.SMTP_FROM?.trim() || 'GVC Abogados <contacto@gvcabogados.com>'
const ADMIN = process.env.SMTP_TO?.trim() || process.env.CONTACT_EMAIL?.trim() || 'contacto@gvcabogados.com'

export async function sendContactEmails(lead: {
  name: string
  email: string
  phone?: string
  contactType?: string
  company?: string
  inquiryType?: string
  referralSource?: string
  message: string
}) {
  const name = escapeHtml(lead.name)
  const email = escapeHtml(lead.email)
  const phone = lead.phone ? escapeHtml(lead.phone) : ''
  const company = lead.company ? escapeHtml(lead.company) : ''
  const inquiry = lead.inquiryType ? escapeHtml(lead.inquiryType) : ''
  const referral = lead.referralSource ? escapeHtml(lead.referralSource) : ''
  const contactType = lead.contactType === 'professional' ? 'Profesional' : 'Particular'
  const message = escapeHtml(lead.message)

  const adminHtml = `
    <p><strong>Nombre:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
    <p><strong>Tipo:</strong> ${contactType}</p>
    ${company ? `<p><strong>Empresa:</strong> ${company}</p>` : ''}
    ${inquiry ? `<p><strong>Área:</strong> ${inquiry}</p>` : ''}
    ${referral ? `<p><strong>Origen:</strong> ${referral}</p>` : ''}
    <p><strong>Mensaje:</strong></p>
    <p style="white-space:pre-wrap">${message}</p>
  `

  const clientHtml = `
    <p>Estimado/a ${name},</p>
    <p>Hemos recibido tu consulta y te responderemos en menos de 24 horas.</p>
    <p>García-Valcárcel &amp; Cáceres Abogados<br>968 241 025 · contacto@gvcabogados.com</p>
  `

  const admin = await sendSmtpEmail({
    from: FROM,
    to: ADMIN,
    subject: `Nueva consulta web de ${lead.name}`,
    html: adminHtml,
    replyTo: lead.email,
  })
  const client = await sendSmtpEmail({
    from: FROM,
    to: lead.email,
    subject: 'Hemos recibido tu consulta — GVC Abogados',
    html: clientHtml,
  })
  return { admin, client }
}
