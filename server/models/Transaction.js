import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Type is required']
  },
  category: {
    type: String,
    enum: [
      'Food', 'Travel', 'Shopping', 'Salary',
      'Bills', 'Entertainment', 'Healthcare',
      'Education', 'Investment', 'Others'
    ],
    required: [true, 'Category is required']
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: [300, 'Notes cannot exceed 300 characters'],
    default: ''
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecurringTransaction',
    default: null
  },
  currency: {
    type: String,
    default: 'USD'
  }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);