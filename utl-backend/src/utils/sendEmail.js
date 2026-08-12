/* eslint-disable no-undef */
const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

// ✅ Sends an email via Resend
// Usage stays the same as before: sendEmail({ to, subject, html })
const sendEmail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      // ⚠️ Using Resend's free test sender for now since we don't
      // have a verified domain yet. Once UTL has its own domain,
      // change this to something like 'Ultimate Tech Lab <noreply@ultimatetechlab.com>'
      from: 'Ultimate Tech Lab <onboarding@resend.dev>',
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Resend email error:', error)
      throw new Error(error.message || 'Failed to send email')
    }

    return data
  } catch (err) {
    console.error('sendEmail failed:', err.message)
    throw err
  }
}

module.exports = sendEmail