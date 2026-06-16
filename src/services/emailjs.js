import emailjs from '@emailjs/browser'

const PUBLIC_KEY = 'zGwfaP6kOxnr932Nj'
const SERVICE_ID = 'service_8dm8nqh'
const TEMPLATE_ID = 'template_i5bz0rl'

emailjs.init(PUBLIC_KEY)

export function sendQrCodeEmail({ toEmail, toName, qrCodeUrl }) {
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, {
    to_email: toEmail,
    to_name: toName,
    qr_code_url: qrCodeUrl,
  })
}
