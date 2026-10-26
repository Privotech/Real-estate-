import { NextRequest, NextResponse } from 'next/server';
import { extractAuthUser } from '@/lib/auth';
import { createInspection, getUserInspections } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const authPayload = extractAuthUser(req);
    if (!authPayload) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const inspections = await getUserInspections(authPayload.userId);
    return NextResponse.json({ inspections });
  } catch (error) {
    console.error('Fetch inspections error:', error);
    return NextResponse.json({ error: 'Failed to retrieve inspections' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authPayload = extractAuthUser(req);
    if (!authPayload) {
      return NextResponse.json({ error: 'Authentication required to schedule an inspection' }, { status: 401 });
    }

    const body = await req.json();
    const { propertyId, propertyTitle, propertyLocation, preferredDate, preferredTime, type, notes } = body;

    if (!propertyId || !propertyTitle || !preferredDate || !preferredTime) {
      return NextResponse.json({ error: 'Missing required inspection parameters' }, { status: 400 });
    }

    const inspection = await createInspection({
      user_id: authPayload.userId,
      property_id: propertyId,
      property_title: propertyTitle,
      property_location: propertyLocation || 'Nigeria',
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      type: type === 'VIRTUAL_WHATSAPP' ? 'VIRTUAL_WHATSAPP' : 'PHYSICAL',
      notes,
    });

    return NextResponse.json({
      message: 'Inspection request submitted successfully.',
      inspection,
    });
  } catch (error) {
    console.error('Create inspection error:', error);
    return NextResponse.json({ error: 'Failed to schedule inspection' }, { status: 500 });
  }
}
