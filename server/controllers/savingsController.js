import SavingsGoal from '../models/SavingsGoal.js';

export const getSavingsGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({
      userId: req.user._id
    }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSavingsGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.create({
      userId: req.user._id,
      ...req.body
    });
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSavingsGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!goal)
      return res.status(404).json({ message: 'Goal not found' });

    Object.assign(goal, req.body);
    if (goal.currentAmount >= goal.targetAmount) {
      goal.isCompleted = true;
    }
    const updated = await goal.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSavingsGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!goal)
      return res.status(404).json({ message: 'Goal not found' });
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};