import cron from 'node-cron';
import RecurringTransaction from '../models/RecurringTransaction.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import { sendEmail } from '../config/mailer.js';
import { reminderEmailTemplate } from './emailTemplates.js';

const getNextDueDate = (frequency, fromDate) => {
  const date = new Date(fromDate);
  switch (frequency) {
    case 'daily':   date.setDate(date.getDate() + 1); break;
    case 'weekly':  date.setDate(date.getDate() + 7); break;
    case 'monthly': date.setMonth(date.getMonth() + 1); break;
    case 'yearly':  date.setFullYear(date.getFullYear() + 1); break;
  }
  return date;
};

export const startRecurringScheduler = () => {
  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Running recurring transaction scheduler...');
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dueRecurring = await RecurringTransaction.find({
        isActive: true,
        nextDueDate: { $lte: today }
      });

      for (const recurring of dueRecurring) {
        await Transaction.create({
          userId: recurring.userId,
          title: recurring.title,
          amount: recurring.amount,
          type: recurring.type,
          category: recurring.category,
          date: today,
          notes: `Auto-generated from recurring: ${recurring.frequency}`,
          isRecurring: true,
          recurringId: recurring._id
        });

        recurring.nextDueDate = getNextDueDate(recurring.frequency, today);
        await recurring.save();
      }

      console.log(`✅ Processed ${dueRecurring.length} recurring transactions`);
    } catch (error) {
      console.error('❌ Scheduler error:', error.message);
    }
  });

  // Send email reminders every Monday at 9am
  cron.schedule('0 9 * * 1', async () => {
    console.log('📧 Sending weekly email reminders...');
    try {
      const usersWithReminders = await User.find({ emailReminders: true });

      for (const user of usersWithReminders) {
        const upcoming = await RecurringTransaction.find({
          userId: user._id,
          isActive: true
        }).limit(5);

        if (upcoming.length > 0) {
          await sendEmail({
            to: user.email,
            subject: '💰 FinTrack Pro - Your Weekly Finance Reminder',
            html: reminderEmailTemplate({
              name: user.name,
              transactions: upcoming
            })
          });
        }
      }
    } catch (error) {
      console.error('❌ Email reminder error:', error.message);
    }
  });

  console.log('✅ Recurring scheduler started');
};