import rateLimit from 'express-rate-limit';
import fileUpload from 'express-fileupload';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

const fileLimiter = fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, 
  abortOnLimit: true,
  limitHandler: (req, res) => {
    res.status(413).json({ error: 'File too large. Maximum size is 10MB.' });
  },
})

export { limiter, fileLimiter };