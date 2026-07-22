import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { findUserByEmail, createUser } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export interface UserRecord {
  id: number;
  email: string;
  passwordHash: string;
}

export const registerUser = async (email: string, password: string) => {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error('User already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser(email, passwordHash);
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  return { token, user: { id: user.id, email: user.email } };
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    (req as Request & { user?: { id: number; email: string } }).user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
