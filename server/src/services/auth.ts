import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, IUser, UserRole } from '../models/User';
import { ENV } from '../config/env';
import { sendOTPEmail } from './emailService';

export const registerUser = async (data: {
  name: string; email: string; password: string;
  phone?: string; role?: UserRole;
  skill?: string; experience?: string | number; city?: string;
}) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    // If they exist but never verified, resend OTP and update their details
    if (!existingUser.isVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const salt = await bcrypt.genSalt(10);
      existingUser.otp = otp;
      existingUser.otpExpires = new Date(Date.now() + 30 * 60 * 1000);
      existingUser.passwordHash = await bcrypt.hash(data.password, salt);
      if (data.skill) existingUser.skill = data.skill;
      if (data.city) existingUser.city = data.city;
      if (data.experience) existingUser.experience = String(data.experience);
      if (data.phone) existingUser.phone = data.phone;
      if (data.role) existingUser.role = data.role;
      await existingUser.save();
      await sendOTPEmail(data.email, otp);
      return existingUser;
    }
    throw { status: 400, message: 'Email already registered. Please login.' };
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(data.password, salt);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 30 * 60 * 1000);

  const user = new User({
    name: data.name,
    email: data.email,
    passwordHash,
    phone: data.phone,
    role: data.role || UserRole.CUSTOMER,
    skill: data.skill,
    experience: data.experience,
    city: data.city,
    isVerified: false,
    otp,
    otpExpires
  });

  await user.save();
  await sendOTPEmail(data.email, otp);
  return user;
};

export const verifyOTP = async (email: string, otp: string) => {
  const user = await User.findOne({ email });
  if (!user) throw { status: 404, message: 'User not found' };
  if (user.isVerified) throw { status: 400, message: 'User already verified' };
  if (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
    throw { status: 400, message: 'Invalid or expired OTP' };
  }
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw { status: 401, message: 'Invalid credentials' };
  if (!user.isVerified) throw { status: 403, message: 'Please verify your email first. Check your inbox for the OTP.' };

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw { status: 401, message: 'Invalid credentials' };

  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();
  return { user, tokens };
};

export const requestPasswordReset = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw { status: 404, message: 'User not found' };
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  await sendOTPEmail(email, otp);
};

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  const user = await User.findOne({ email });
  if (!user) throw { status: 404, message: 'User not found' };
  if (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
    throw { status: 400, message: 'Invalid or expired OTP' };
  }
  const salt = await bcrypt.genSalt(10);
  user.passwordHash = await bcrypt.hash(newPassword, salt);
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
};

export const logoutUser = async (userId: string) => {
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
};

export const refreshUserToken = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, ENV.JWT_REFRESH_SECRET) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) throw { status: 401, message: 'Invalid refresh token' };
    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    return tokens;
  } catch {
    throw { status: 401, message: 'Invalid or expired refresh token' };
  }
};

export const generateTokens = (user: IUser) => {
  const payload = { id: user._id, role: user.role };
  const accessToken = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN as any });
  const refreshToken = jwt.sign(payload, ENV.JWT_REFRESH_SECRET, { expiresIn: ENV.JWT_REFRESH_EXPIRES_IN as any });
  return { accessToken, refreshToken };
};
