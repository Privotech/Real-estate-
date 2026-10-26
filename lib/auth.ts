import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { DbUser } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'nigeria_property_centre_super_secure_jwt_key_2026';

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

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
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
