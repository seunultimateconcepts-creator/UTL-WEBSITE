/* eslint-disable no-undef */
const nodemailer = require('nodemailer')

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

const mailOptions = {
  from: process.env.EMAIL_FROM,
  to,
  subject,
  html,
  headers: {
    'X-Priority': '1',
    'X-Mailer': 'Ultimate Tech Lab Mailer',
  },
}

  const info = await transporter.sendMail(mailOptions)
  console.log('✅ Email sent:', info.messageId)
  return info

  
}

module.exports = sendEmail