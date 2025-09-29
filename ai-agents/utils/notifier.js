const nodemailer = require('nodemailer')
const axios = require('axios')

// Parse recipients from env (comma-separated)
function parseList(value) {
  if (!value) return []
  return value
    .split(',')
    .map(v => v.trim())
    .filter(Boolean)
}

// Email transport
function createTransport() {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) return null
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

async function sendEmail({ to, subject, text, html }) {
  const transporter = createTransport()
  if (!transporter) {
    return { ok: false, reason: 'email_not_configured' }
  }
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html: html || `<pre style="font: inherit; white-space: pre-wrap;">${text}</pre>`,
    })
    return { ok: true, id: info.messageId }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

async function sendWhatsApp({ to, text }) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  if (!token || !phoneNumberId) {
    return { ok: false, reason: 'whatsapp_not_configured' }
  }
  try {
    const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`
    const res = await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text.substring(0, 4000) },
      },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    )
    return { ok: true, id: res.data.messages?.[0]?.id }
  } catch (err) {
    return { ok: false, error: err.response?.data || err.message }
  }
}

async function notifyBoth({ subject, text, html, emails, phones }) {
  const adminEmails = parseList(process.env.NOTIFY_EMAILS)
  const adminPhones = parseList(process.env.NOTIFY_WHATSAPP_NUMBERS)

  const allEmails = [...new Set([...(emails || []), ...adminEmails])]
  const allPhones = [...new Set([...(phones || []), ...adminPhones])]

  const emailPromises = allEmails.map(to => sendEmail({ to, subject, text, html }))
  const waPromises = allPhones.map(to => sendWhatsApp({ to, text }))
  const results = await Promise.allSettled([...emailPromises, ...waPromises])
  return results
}

module.exports = {
  sendEmail,
  sendWhatsApp,
  notifyBoth,
}


