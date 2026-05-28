import mongoose from 'mongoose';

const savingsGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [1, 'Target must be at least 1']
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative']
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  category: {
    type: String,
    enum: [
      'Emergency Fund', 'Vacation', 'House',
      'Car', 'Education', 'Retirement',
      'Gadget', 'Wedding', 'Others'
    ],
    default: 'Others'
  },
  color: {
    type: String,
    default: '#6366f1'
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('SavingsGoal', savingsGoalSchema);