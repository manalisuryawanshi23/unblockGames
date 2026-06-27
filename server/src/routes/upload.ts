import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    // sanitize original name a bit
    const safeName = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    cb(null, `${safeName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/image', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No image provided' });
    return;
  }
  
  // Return relative path so it automatically inherits the frontend's domain and HTTPS protocol
  const imageUrl = `/uploads/${req.file.filename}`;
  
  res.json({ url: imageUrl });
});

export default router;
