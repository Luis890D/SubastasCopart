const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
const os     = require('os');

// En Serverless (Vercel/Lambda) el filesystem es de solo lectura excepto /tmp
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const uploadDir    = isServerless
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(__dirname, '../../uploads');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  console.warn('[WARN] No se pudo crear uploadDir:', e.message);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});


const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  if (allowed.test(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB por imagen
});

module.exports = upload;
module.exports.default = upload;

