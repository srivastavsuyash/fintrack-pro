import 'dotenv/config';
import Transaction from '../models/Transaction.js';

export const getAIInsights = async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    console.log('Using GROQ Key:', apiKey ? apiKey.substring(0, 10) + '...' : 'NOT FOUND');

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

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1024
        })
      }
    );

    const data = await response.json();
    console.log('Groq Response:', JSON.stringify(data, null, 2));

    if (data.error) {
      return res.status(500).json({ message: data.error.message });
    }

    const insight = data.choices?.[0]?.message?.content
      || 'Unable to generate insights at this time.';

    res.json({ insight });
  } catch (error) {
    console.error('AI Controller Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};