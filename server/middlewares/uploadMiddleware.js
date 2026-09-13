import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '') || '.bin';
    const name = uuidv4() + ext;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow all non-empty files for now; tighten in production.
  if (!file.mimetype) {
    return cb(new Error('Unable to determine file type'), false);
  }
  cb(null, true);
};

export default multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE_MB || '50', 10) * 1024 * 1024
  }
});
