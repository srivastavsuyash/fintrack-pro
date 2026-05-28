export const reminderEmailTemplate = ({ name, transactions }) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #6366f1, #4338ca); padding: 30px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0;">💰 FinTrack Pro</h1>
    <p style="color: #e0e7ff; margin: 5px 0 0;">Monthly Finance Reminder</p>
  </div>
  <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
    <h2 style="color: #1e293b;">Hi ${name}! 👋</h2>
    <p style="color: #64748b;">Here are your upcoming recurring transactions:</p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr style="background: #6366f1; color: white;">
          <th style="padding: 10px; text-align: left;">Title</th>
          <th style="padding: 10px; text-align: left;">Amount</th>
          <th style="padding: 10px; text-align: left;">Due Date</th>
        </tr>
      </thead>
      <tbody>
        ${transactions.map((t, i) => `
          <tr style="background: ${i % 2 === 0 ? '#fff' : '#f1f5f9'};">
            <td style="padding: 10px;">${t.title}</td>
            <td style="padding: 10px; color: ${t.type === 'expense' ? '#ef4444' : '#22c55e'};">
              ${t.type === 'expense' ? '-' : '+'}$${t.amount}
            </td>
            <td style="padding: 10px;">${new Date(t.nextDueDate).toLocaleDateString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <p style="color: #94a3b8; font-size: 12px; margin-top: 30px;">
      You're receiving this because you enabled email reminders in FinTrack Pro.
    </p>
  </div>
</div>
`;