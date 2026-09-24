import { Router } from 'express';
import { User, UserRole } from '../models/User';

const router = Router();

// GET all technicians
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query: any = { role: UserRole.TECHNICIAN, isVerified: true };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { skill: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }
    const technicians = await User.find(query).select('-passwordHash -refreshToken -otp -otpExpires');
    res.json({ success: true, technicians });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch technicians' });
  }
});

// GET single technician
router.get('/:id', async (req, res) => {
  try {
    const technician = await User.findOne({ _id: req.params.id, role: UserRole.TECHNICIAN }).select('-passwordHash -refreshToken -otp -otpExpires');
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician not found' });
    }
    res.json({ success: true, technician });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch technician' });
  }
});

export default router;
