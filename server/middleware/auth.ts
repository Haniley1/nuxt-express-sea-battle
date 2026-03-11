import { parseCookie } from 'cookie';
import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import type { VerifyClientCallbackAsync } from 'ws';

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

export const authenticateWsToken: VerifyClientCallbackAsync = (info, cb) => {
  const cookies = parseCookie(info.req.headers.cookie)
  const token = cookies.token

  if (!token) {
    cb(false, 401, 'Auth is required')
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET)
    info.req.userToken = decodedToken
    cb(true)
  } catch (error) {
    cb(false, 401, 'Invalid auth token')
  }
}
