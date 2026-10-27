import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, fullName, phone, role, agencyName, licenseNumber } = body;

    if (!email || !password || !fullName || !phone) {
      return NextResponse.json(
        { error: 'Email, password, full name, and phone number are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please log in.' },
        { status: 409 }
      );
    }

    const password_hash = await hashPassword(password);
    const validRole = ['SEEKER', 'AGENT', 'DEVELOPER'].includes(role) ? role : 'SEEKER';

    const newUser = await createUser({
      email,
      password_hash,
      full_name: fullName,
      phone,
      role: validRole,
      agency_name: agencyName,
      license_number: licenseNumber,
    });

    const token = generateToken(newUser);

    const safeUser = {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.full_name,
      phone: newUser.phone,
      role: newUser.role,
      agencyName: newUser.agency_name,
      licenseNumber: newUser.license_number,
      isVerified: newUser.is_verified,
      avatarUrl: newUser.avatar_url,
      createdAt: newUser.created_at,
    };

    const response = NextResponse.json({
      message: 'Account successfully registered.',
      token,
      user: safeUser,
    });

    // Set HTTP-only cookie for secure session
    response.cookies.set('npc_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}
