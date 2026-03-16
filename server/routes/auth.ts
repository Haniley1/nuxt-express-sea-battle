// server/routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken, COOKIE_OPTIONS, JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username } = req.body;

  if (!username || username.length < 2 || username.length > 20) {
    return res.status(400).json({ 
      error: 'Никнейм должен быть от 2 до 20 символов' 
    });
  }

  const cleanUsername = username.trim().replace(/[<>&'"]/g, '');

  const payload = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    username: cleanUsername,
    loginTime: new Date().toISOString()
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

  res.cookie('token', token, COOKIE_OPTIONS);
  res.cookie('nickname', cleanUsername, COOKIE_OPTIONS);
  res.json({
    success: true,
    token,
    user: payload
  });
});

// Выход
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ success: true });
});

export default router;
