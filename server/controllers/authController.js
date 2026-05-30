import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendEmail } from '../config/mailer.js';
import crypto from 'crypto';

// @POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, phone });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      budgetLimit: user.budgetLimit,
      emailReminders: user.emailReminders,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      budgetLimit: user.budgetLimit,
      emailReminders: user.emailReminders,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/auth/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.name = req.body.name || user.name;
    user.currency = req.body.currency || user.currency;
    user.budgetLimit = req.body.budgetLimit ?? user.budgetLimit;
    user.emailReminders = req.body.emailReminders ?? user.emailReminders;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      currency: updated.currency,
      budgetLimit: updated.budgetLimit,
      emailReminders: updated.emailReminders,
      token: generateToken(updated._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: 'If this email exists, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    await User.updateOne(
      { _id: user._id },
      {
        resetPasswordToken: resetTokenHash,
        resetPasswordExpire: Date.now() + 15 * 60 * 1000
      }
    );

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: '🔐 FinTrack Pro - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #6366f1, #4338ca); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0;">💰 FinTrack Pro</h1>
            <p style="color: #e0e7ff; margin: 5px 0 0;">Password Reset Request</p>
          </div>
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1e293b;">Hi ${user.name}! 👋</h2>
            <p style="color: #64748b;">You requested a password reset. Click the button below to reset your password.</p>
            <p style="color: #ef4444; font-size: 13px;">⚠️ This link expires in <strong>15 minutes</strong>.</p>
            <a href="${resetUrl}" 
              style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0;">
              Reset Password
            </a>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
              If you didn't request this, please ignore this email. Your password will remain unchanged.
            </p>
          </div>
        </div>
      `
    });

    res.json({ message: 'If this email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({ message: 'Email could not be sent' });
  }
};

// @POST /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ message: 'Invalid or expired reset token' });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      message: 'Password reset successful',
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};