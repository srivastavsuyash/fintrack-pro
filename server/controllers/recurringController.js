import RecurringTransaction from '../models/RecurringTransaction.js';

export const getRecurring = async (req, res) => {
  try {
    const recurring = await RecurringTransaction.find({
      userId: req.user._id
    }).sort({ createdAt: -1 });
    res.json(recurring);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRecurring = async (req, res) => {
  try {
    const recurring = await RecurringTransaction.create({
      userId: req.user._id,
      ...req.body
    });
    res.status(201).json(recurring);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRecurring = async (req, res) => {
  try {
    const recurring = await RecurringTransaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!recurring)
      return res.status(404).json({ message: 'Not found' });

    Object.assign(recurring, req.body);
    const updated = await recurring.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRecurring = async (req, res) => {
  try {
    const recurring = await RecurringTransaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!recurring)
      return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Recurring transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};