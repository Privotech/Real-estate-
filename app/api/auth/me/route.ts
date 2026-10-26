import { NextRequest, NextResponse } from 'next/server';
import { extractAuthUser } from '@/lib/auth';
import { findUserById } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const authPayload = extractAuthUser(req);
    if (!authPayload) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const user = await findUserById(authPayload.userId);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      phone: user.phone,
      role: user.role,
      agencyName: user.agency_name,
      licenseNumber: user.license_number,
      isVerified: user.is_verified,
      avatarUrl: user.avatar_url,
      createdAt: user.created_at,
    };

    return NextResponse.json({
      authenticated: true,
      user: safeUser,
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Session expired or invalid.' },
      { status: 500 }
    );
  }
}
