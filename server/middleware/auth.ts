import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import type { WSRequestHandler } from 'websocket-express';

export const JWT_SECRET = process.env.JWT_SECRET! || 'ES4vmec3e9QVoDH5kl7KIrkmblY2J0WJ';
export const COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000
} as const;

export const authenticateToken: RequestHandler = (req, res, next) => {
  const token = req.cookies?.token;
  
  if (!token) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Недействительный токен' });
  }
};

export const authenticateWsToken: WSRequestHandler = (req, res, next) => {
  const token = req.cookies?.token;
  
  if (!token) {
    res.emit('authError')
  }

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.emit('authError');
  }
}
