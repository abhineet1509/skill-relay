import { Router, Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import { User } from '../models/User';
import { authenticate } from '../middleware/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Upload profile picture
router.post('/avatar', authenticate, upload.single('avatar'), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Upload buffer to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'skillrelay/avatars', transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }] },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file!.buffer);
    });

    // Update user avatar in DB
    await User.findByIdAndUpdate(userId, { avatar: result.secure_url });

    res.json({ success: true, avatarUrl: result.secure_url });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

export default router;
