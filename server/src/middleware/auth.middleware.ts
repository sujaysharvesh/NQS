import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

export const Authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'No token provided' });
    return;
  }

  const token  = header.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'dummy_secret';

  try {
    const decoded = jwt.verify(token, secret) as {
      id: string;
      role: string;
      email: string;
    };
    
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const RequireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'Admin') {
    res.status(403).json({ success: false, message: 'Access denied — Admin only' });
    return;
  }
  next();
};
