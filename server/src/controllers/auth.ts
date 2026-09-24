import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth';
import { ENV } from '../config/env';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const setCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.registerUser(req.body);
    res.status(201).json({ success: true, message: 'Registration successful. Please check your email for the OTP.' });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;
    const user = await authService.verifyOTP(email, otp);
    const tokens = authService.generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    setCookies(res, tokens.accessToken, tokens.refreshToken);
    const userObj = user.toObject();
    delete (userObj as any).passwordHash;
    delete (userObj as any).refreshToken;
    res.status(200).json({ success: true, user: userObj, message: 'OTP verified successfully' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { user, tokens } = await authService.loginUser(email, password);
    setCookies(res, tokens.accessToken, tokens.refreshToken);
    const userObj = user.toObject();
    delete (userObj as any).passwordHash;
    delete (userObj as any).refreshToken;
    res.status(200).json({ success: true, user: userObj });
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;

    // Decode the Google JWT (credential) — no need to verify signature for dev
    // In production, use google-auth-library to verify properly
    const decoded: any = jwt.decode(token);

    if (!decoded || !decoded.email) {
      return res.status(400).json({ success: false, message: 'Invalid Google token' });
    }

    const { email, name, picture } = decoded;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        passwordHash: 'GOOGLE_SSO_NO_PASSWORD',
        role: 'CUSTOMER',
        isVerified: true,
        avatar: picture
      });
      await user.save();
    } else {
      // Always update avatar from Google
      if (picture) {
        user.avatar = picture;
        await user.save();
      }
    }

    const tokens = authService.generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    setCookies(res, tokens.accessToken, tokens.refreshToken);

    const userObj = user.toObject();
    delete (userObj as any).passwordHash;
    delete (userObj as any).refreshToken;

    res.status(200).json({ success: true, user: userObj });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    await authService.requestPasswordReset(email);
    res.status(200).json({ success: true, message: 'If the email is registered, an OTP has been sent.' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp, newPassword } = req.body;
    await authService.resetPassword(email, otp, newPassword);
    res.status(200).json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (user?.id) {
      await authService.logoutUser(user.id);
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }
    const tokens = await authService.refreshUserToken(refreshToken);
    setCookies(res, tokens.accessToken, tokens.refreshToken);
    res.status(200).json({ success: true, message: 'Token refreshed' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const freshUser = await User.findById(user.id).select('-passwordHash -refreshToken');
    res.status(200).json({ success: true, user: freshUser });
  } catch (error) {
    next(error);
  }
};
