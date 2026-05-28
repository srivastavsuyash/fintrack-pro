import Transaction from '../models/Transaction.js';

export const getAIInsights = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user._id
    }).sort({ date: -1 }).limit(50);

    if (transactions.length === 0) {
      return res.json({
        insight: "Add some transactions first to get AI insights!"
      });
    }

    const summary = transactions.map(t =>
      `${t.type === 'expense' ? 'Spent' : 'Earned'} $${t.amount} on ${t.category} (${t.title}) on ${new Date(t.date).toLocaleDateString()}`
    ).join('\n');

    const prompt = `You are a personal finance advisor. Analyze these transactions and give 3-5 specific, actionable insights to help save money and improve financial health. Be concise and friendly.\n\nTransactions:\n${summary}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const insight = data.content?.[0]?.text ||
      'Unable to generate insights at this time.';
    res.json({ insight });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};