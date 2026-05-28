import Transaction from '../models/Transaction.js';

// @GET /api/transactions
export const getTransactions = async (req, res) => {
  try {
    const {
      category, type, search,
      startDate, endDate,
      page = 1, limit = 10
    } = req.query;

    const query = { userId: req.user._id };

    if (category) query.category = category;
    if (type) query.type = type;
    if (search) query.title = { $regex: search, $options: 'i' };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      transactions,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/transactions
export const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;
    const transaction = await Transaction.create({
      userId: req.user._id,
      title, amount, type, category,
      date: date || Date.now(),
      notes,
      currency: req.user.currency
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/transactions/:id
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!transaction)
      return res.status(404).json({ message: 'Transaction not found' });

    Object.assign(transaction, req.body);
    const updated = await transaction.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/transactions/:id
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!transaction)
      return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/transactions/summary
export const getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user._id
    });

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown
    const categoryBreakdown = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryBreakdown[t.category] =
          (categoryBreakdown[t.category] || 0) + t.amount;
      });

    // Monthly summary (last 6 months)
    const monthlySummary = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();

      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === date.getMonth() &&
               tDate.getFullYear() === year;
      });

      monthlySummary.push({
        month: `${month} ${year}`,
        income: monthTransactions
          .filter(t => t.type === 'income')
          .reduce((s, t) => s + t.amount, 0),
        expense: monthTransactions
          .filter(t => t.type === 'expense')
          .reduce((s, t) => s + t.amount, 0),
      });
    }

    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categoryBreakdown,
      monthlySummary,
      recentTransactions: transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};