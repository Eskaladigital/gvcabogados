import { sendContactEmails } from '../src/lib/email'

async function main() {
  const result = await sendContactEmails({
    name: 'Narciso (prueba diseño)',
    email: process.env.SMTP_TO?.trim() || process.env.CONTACT_EMAIL?.trim() || 'contacto@gvcabogados.com',
    phone: '628 823 404',
    contactType: 'particular',
    inquiryType: 'Derecho mercantil',
    referralSource: 'google',
    message:
      'Prueba del diseño de correo GVC Abogados: este es el par aviso al despacho + confirmación al cliente.',
  })
  console.log('GVC Abogados', JSON.stringify(result))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
