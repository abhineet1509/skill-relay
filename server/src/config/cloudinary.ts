import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dce5qcndc',
  api_key: process.env.CLOUDINARY_API_KEY || '958999686751146',
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;
