import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { DbUser } from './db';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET must be set in the project-root .env file.');
  }
  return secret;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'SEEKER' | 'AGENT' | 'DEVELOPER' | 'ADMIN';
  fullName: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: DbUser): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    fullName: user.full_name,
  };

  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string): TokenPayload | null {
  const secret = getJwtSecret();
  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch {
    return null;
  }
}

export function extractAuthUser(req: NextRequest): TokenPayload | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return verifyToken(token);
  }

  // Also check cookie if provided
  const cookieToken = req.cookies.get('npc_token')?.value;
  if (cookieToken) {
    return verifyToken(cookieToken);
  }

  return null;
}
