import { NextRequest, NextResponse } from 'next/server';
import { extractAuthUser } from '@/lib/auth';
import { getUserSavedProperties, toggleSaveProperty } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const authPayload = extractAuthUser(req);
    if (!authPayload) {
      return NextResponse.json({ savedProperties: [] });
    }

    const savedPropertyIds = await getUserSavedProperties(authPayload.userId);
    return NextResponse.json({ savedProperties: savedPropertyIds });
  } catch (error) {
    console.error('Fetch saved properties error:', error);
    return NextResponse.json({ error: 'Failed to retrieve saved properties' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authPayload = extractAuthUser(req);
    if (!authPayload) {
      return NextResponse.json({ error: 'Authentication required to save properties' }, { status: 401 });
    }

    const body = await req.json();
    const { propertyId } = body;

    if (!propertyId) {
      return NextResponse.json({ error: 'propertyId is required' }, { status: 400 });
    }

    const result = await toggleSaveProperty(authPayload.userId, propertyId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Toggle save property error:', error);
    return NextResponse.json({ error: 'Failed to update saved property' }, { status: 500 });
  }
}
