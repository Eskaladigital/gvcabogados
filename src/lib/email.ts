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
    tls: { rejectUnauthorized: process.env.NODE_ENV === 'production' },
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

function referralLabel(value: string) {
  const map: Record<string, string> = {
    google: 'Búsqueda en Google',
    social: 'Redes sociales',
    referral: 'Recomendación',
    other: 'Otro',
  }
  return map[value] || value
}

const C = {
  page: '#faf8f5',
  paper: '#ffffff',
  ink: '#3D2B14',
  muted: '#6B5238',
  line: '#e0d8cc',
  header: '#3D2B14',
  headerFg: '#d4be92',
  accent: '#714c20',
  box: '#f0ebe3',
}

function layout(content: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>GVC Abogados</title></head>
<body style="margin:0;padding:0;background-color:${C.page};font-family:Arial,Helvetica,sans-serif;color:${C.ink};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.page};">
<tr><td align="center" style="padding:24px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:${C.paper};border:1px solid ${C.line};">
<tr><td style="background-color:${C.header};padding:24px 32px;text-align:center;">
<span style="font-size:20px;font-weight:bold;color:${C.headerFg};letter-spacing:2px;text-transform:uppercase;">GVC Abogados</span>
<br><span style="font-size:11px;color:${C.headerFg};letter-spacing:1px;text-transform:uppercase;">García-Valcárcel &amp; Cáceres</span>
</td></tr>
<tr><td style="padding:32px;">${content}</td></tr>
<tr><td style="background-color:${C.page};padding:20px 32px;border-top:1px solid ${C.line};text-align:center;">
<p style="margin:0;font-size:12px;color:${C.muted};">GVC Abogados — www.gvcabogados.com</p>
<p style="margin:6px 0 0;font-size:11px;color:${C.line};">Este correo se ha enviado de forma automática.</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`
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

export function contactAdminHtml(lead: {
  name: string
  email: string
  phone?: string
  contactType?: string
  company?: string
  inquiryType?: string
  referralSource?: string
  message: string
}) {
  const isPro = lead.contactType === 'professional'
  const name = escapeHtml(lead.name)
  const email = escapeHtml(lead.email)
  const phone = lead.phone ? escapeHtml(lead.phone) : ''
  const company = lead.company ? escapeHtml(lead.company) : ''
  const inquiry = lead.inquiryType ? escapeHtml(lead.inquiryType) : ''
  const referral = lead.referralSource ? escapeHtml(referralLabel(lead.referralSource)) : ''
  const message = escapeHtml(lead.message)
  return layout(`
<h1 style="margin:0 0 4px;font-size:20px;font-weight:bold;text-transform:uppercase;color:${isPro ? C.accent : C.ink};">Nueva consulta${isPro ? ' (Profesional)' : ''}</h1>
<p style="margin:0 0 24px;font-size:14px;color:${C.muted};">${new Date().toLocaleDateString('es-ES')} — ${name}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
<tr><td style="padding:16px;background-color:${C.box};border:1px solid ${C.line};">
<p style="margin:0 0 2px;font-size:11px;font-weight:bold;text-transform:uppercase;color:${C.muted};letter-spacing:1px;">Contacto</p>
<p style="margin:0;font-size:14px;font-weight:bold;">${name}</p>
${company ? `<p style="margin:2px 0 0;font-size:13px;color:${C.muted};">${company}</p>` : ''}
<p style="margin:4px 0 0;font-size:13px;"><a href="mailto:${email}" style="color:${C.accent};">${email}</a></p>
${phone ? `<p style="margin:2px 0 0;font-size:13px;">${phone}</p>` : ''}
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
<tr><td style="padding:16px;border:1px solid ${C.line};">
<p style="margin:0 0 8px;font-size:11px;font-weight:bold;text-transform:uppercase;color:${C.muted};letter-spacing:1px;">Tipo de consulta</p>
<p style="margin:0;font-size:13px;"><strong>${isPro ? 'Profesional' : 'Particular'}</strong>${inquiry ? ` — ${inquiry}` : ''}</p>
${referral ? `<p style="margin:8px 0 0;font-size:13px;color:${C.muted};">Origen: ${referral}</p>` : ''}
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
<tr><td style="padding:16px;border:1px solid ${C.line};">
<p style="margin:0 0 8px;font-size:11px;font-weight:bold;text-transform:uppercase;color:${C.muted};letter-spacing:1px;">Mensaje</p>
<p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap;">${message}</p>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td align="center">
<a href="https://www.gvcabogados.com/administrator/contactos" style="display:inline-block;padding:12px 32px;background-color:${C.accent};color:#ffffff;font-size:13px;font-weight:bold;text-transform:uppercase;text-decoration:none;letter-spacing:1px;">Ver en el panel admin</a>
</td></tr></table>`)
}

export function contactClientHtml(lead: { name: string; email: string; message: string }) {
  const name = escapeHtml(lead.name)
  const message = escapeHtml(lead.message)
  return layout(`
<h1 style="margin:0 0 4px;font-size:20px;font-weight:bold;text-transform:uppercase;color:${C.ink};">Hemos recibido tu consulta</h1>
<p style="margin:0 0 24px;font-size:14px;color:${C.muted};">GVC Abogados</p>
<p style="margin:0 0 16px;font-size:14px;line-height:1.6;">Estimado/a <strong>${name}</strong>,</p>
<p style="margin:0 0 24px;font-size:14px;line-height:1.6;">Gracias por escribirnos. Un abogado del despacho te responderá en menos de 24 horas.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
<tr><td style="padding:16px;background-color:${C.box};border:1px solid ${C.line};">
<p style="margin:0 0 8px;font-size:11px;font-weight:bold;text-transform:uppercase;color:${C.muted};letter-spacing:1px;">Tu mensaje</p>
<p style="margin:0;font-size:13px;line-height:1.6;white-space:pre-wrap;">${message}</p>
</td></tr></table>
<p style="margin:0 0 8px;font-size:14px;line-height:1.6;">Si necesitas añadir algo, responde a este correo o escribe a <a href="mailto:contacto@gvcabogados.com" style="color:${C.accent};">contacto@gvcabogados.com</a>.</p>
<p style="margin:24px 0 0;font-size:14px;line-height:1.6;">968 241 025 · García-Valcárcel &amp; Cáceres Abogados</p>`)
}

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
  const admin = await sendSmtpEmail({
    from: FROM,
    to: ADMIN,
    subject: `[Web] Nueva consulta de ${lead.name}${lead.contactType === 'professional' ? ' (Profesional)' : ''}`,
    html: contactAdminHtml(lead),
    replyTo: lead.email,
  })
  const client = await sendSmtpEmail({
    from: FROM,
    to: lead.email,
    subject: 'Hemos recibido tu consulta — GVC Abogados',
    html: contactClientHtml(lead),
  })
  return { admin, client }
}
