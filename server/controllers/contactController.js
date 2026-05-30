import { sendEmail } from '../config/mailer.js'

export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `📬 Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #6366f1, #4338ca); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0;">💰 FinTrack Pro</h1>
            <p style="color: #e0e7ff; margin: 5px 0 0;">New Contact Form Submission</p>
          </div>
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 100px;">Name</td>
                <td style="padding: 8px 0; color: #1e293b; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Email</td>
                <td style="padding: 8px 0; color: #6366f1;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Subject</td>
                <td style="padding: 8px 0; color: #1e293b; font-weight: 600;">${subject}</td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding: 16px; background: white; border-radius: 8px; border-left: 4px solid #6366f1;">
              <p style="color: #64748b; font-size: 13px; margin: 0 0 8px;">Message</p>
              <p style="color: #1e293b; line-height: 1.6; margin: 0;">${message}</p>
            </div>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
              This message was sent via FinTrack Pro Contact Form.
            </p>
          </div>
        </div>
      `
    })

    // Confirmation email to user
    await sendEmail({
      to: email,
      subject: '✅ We received your message — FinTrack Pro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #6366f1, #4338ca); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0;">💰 FinTrack Pro</h1>
            <p style="color: #e0e7ff; margin: 5px 0 0;">Message Received!</p>
          </div>
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1e293b;">Hi ${name}! 👋</h2>
            <p style="color: #64748b;">Thanks for reaching out. We've received your message and will get back to you within 24–48 hours.</p>
            <div style="margin-top: 16px; padding: 16px; background: white; border-radius: 8px; border-left: 4px solid #6366f1;">
              <p style="color: #64748b; font-size: 13px; margin: 0 0 4px;">Your message</p>
              <p style="color: #1e293b; margin: 0;">${message}</p>
            </div>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">— Team FinTrack Pro</p>
          </div>
        </div>
      `
    })

    res.json({ message: 'Message sent successfully!' })
  } catch (error) {
    console.error('Contact email error:', error.message)
    res.status(500).json({ message: 'Failed to send message. Please try again.' })
  }
}