import { Router } from 'express';
import * as authController from '../controllers/auth';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validators/auth';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/verify-otp', authController.verifyOtp);
router.post('/login', validate(loginSchema), authController.login);
router.post('/google', authController.googleLogin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/logout', authenticate, authController.logout);
router.post('/refresh', authController.refresh);
router.get('/me', authenticate, authController.getMe);


router.post('/address', authenticate, async (req, res) => {
  try {
    const { title, text } = req.body;
    const user = await import('../models/User').then(m => m.User.findById(req.user.id));
    if (!user) return res.status(404).json({ success: false });
    
    if (!user.addresses) user.addresses = [];
    user.addresses.push({ title, text });
    await user.save();
    
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;



