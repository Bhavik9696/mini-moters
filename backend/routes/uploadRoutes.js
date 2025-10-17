import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'mern-ecommerce',
    });

    // Remove temp file after upload
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: '✅ Image uploaded successfully!',
      imageUrl: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({ error: 'Cloudinary upload failed', details: error.message });
  }
});

export default router;
