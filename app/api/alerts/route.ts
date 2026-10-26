import { NextRequest, NextResponse } from 'next/server';
import { extractAuthUser } from '@/lib/auth';
import {
  createPropertyAlert,
  getPropertyAlerts,
  deletePropertyAlert,
  togglePropertyAlertActive,
} from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const authPayload = extractAuthUser(req);
    const { searchParams } = new URL(req.url);
    const emailParam = searchParams.get('email');

    const alerts = await getPropertyAlerts({
      userId: authPayload?.userId,
      email: emailParam || (authPayload ? authPayload.email : undefined),
    });

    return NextResponse.json({ alerts, count: alerts.length });
  } catch (error) {
    console.error('Fetch alerts error:', error);
    return NextResponse.json({ error: 'Failed to retrieve property alerts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authPayload = extractAuthUser(req);
    const body = await req.json();

    const {
      name,
      category,
      state,
      area,
      propertyType,
      bedrooms,
      titleDocument,
      maxPrice,
      keyword,
      email,
      dailySummaryEmail,
      phone,
      channels,
      frequency,
      matchesCount,
    } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required for property alerts' }, { status: 400 });
    }

    const newAlert = await createPropertyAlert({
      userId: authPayload?.userId || null,
      name: name || 'Property Alert',
      category: category || 'all',
      state: state || 'All States',
      area: area || 'All Areas',
      propertyType: propertyType || 'All Types',
      bedrooms: bedrooms || 'any',
      titleDocument: titleDocument || 'All Titles',
      maxPrice: Number(maxPrice) || 1000000000,
      keyword: keyword || '',
      email: email.trim().toLowerCase(),
      dailySummaryEmail: dailySummaryEmail !== false,
      phone: phone || null,
      channelsEmail: channels?.email !== false,
      channelsPush: channels?.push !== false,
      channelsWhatsapp: Boolean(channels?.whatsapp),
      frequency: frequency || 'daily',
      matchesCount: Number(matchesCount) || 0,
    });

    return NextResponse.json({
      message: 'Property alert saved to NeonDB successfully',
      alert: newAlert,
    });
  } catch (error) {
    console.error('Create property alert error:', error);
    return NextResponse.json({ error: 'Failed to save property alert' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing alert ID parameter' }, { status: 400 });
    }

    const success = await deletePropertyAlert(id);
    if (!success) {
      return NextResponse.json({ error: 'Alert not found or could not be deleted' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Property alert deleted from NeonDB' });
  } catch (error) {
    console.error('Delete alert error:', error);
    return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing alert ID parameter' }, { status: 400 });
    }

    const updated = await togglePropertyAlertActive(id);
    if (!updated) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Alert status toggled successfully in NeonDB',
      alert: updated,
    });
  } catch (error) {
    console.error('Toggle alert error:', error);
    return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 });
  }
}
