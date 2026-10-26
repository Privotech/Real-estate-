import { neon } from '@neondatabase/serverless';
import { prisma } from './prisma';

export interface DbUser {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone: string;
  role: 'SEEKER' | 'AGENT' | 'DEVELOPER' | 'ADMIN';
  agency_name?: string;
  license_number?: string;
  is_verified: boolean;
  avatar_url?: string;
  created_at: string;
}

export interface DbInspection {
  id: string;
  user_id: string;
  property_id: string;
  property_title: string;
  property_location: string;
  preferred_date: string;
  preferred_time: string;
  type: 'PHYSICAL' | 'VIRTUAL_WHATSAPP';
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
}

export interface DbPropertyAlert {
  id: string;
  user_id?: string | null;
  name: string;
  category: string;
  state: string;
  area: string;
  property_type: string;
  bedrooms: string;
  title_document: string;
  max_price: number;
  keyword: string;
  email: string;
  daily_summary_email: boolean;
  phone?: string | null;
  channels_email: boolean;
  channels_push: boolean;
  channels_whatsapp: boolean;
  frequency: 'instant' | 'daily' | 'weekly';
  is_active: boolean;
  matches_count: number;
  created_at: string;
}

// Clean Database URL helper for Neon Serverless connection
export function getCleanDatabaseUrl(): string | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const match = url.match(/postgres(?:ql)?:\/\/[^\s'\"<>()]+/);
  if (!match) return null;
  const clean = match[0];
  if (clean.includes('YOUR_NEON_DATABASE_URL') || clean.includes('ep-xyz')) {
    return null;
  }
  return clean;
}

export function getNeonClient() {
  const cleanUrl = getCleanDatabaseUrl();
  if (!cleanUrl) return null;
  try {
    return neon(cleanUrl);
  } catch (err) {
    console.warn('Neon connection failed:', err);
    return null;
  }
}

// ---------------------------------------------------------------------
// User operations using Prisma with NeonDB
// ---------------------------------------------------------------------

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const normalizedEmail = email.toLowerCase().trim();
  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (user) {
      return {
        id: user.id,
        email: user.email,
        password_hash: user.passwordHash,
        full_name: user.fullName,
        phone: user.phone,
        role: user.role as 'SEEKER' | 'AGENT' | 'DEVELOPER' | 'ADMIN',
        agency_name: user.agencyName || undefined,
        license_number: user.licenseNumber || undefined,
        is_verified: user.isVerified,
        avatar_url: user.avatarUrl || undefined,
        created_at: user.createdAt.toISOString(),
      };
    }
  } catch (err) {
    console.warn('NeonDB findUserByEmail error:', err);
  }
  return null;
}

export async function findUserById(id: string): Promise<DbUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (user) {
      return {
        id: user.id,
        email: user.email,
        password_hash: user.passwordHash,
        full_name: user.fullName,
        phone: user.phone,
        role: user.role as 'SEEKER' | 'AGENT' | 'DEVELOPER' | 'ADMIN',
        agency_name: user.agencyName || undefined,
        license_number: user.licenseNumber || undefined,
        is_verified: user.isVerified,
        avatar_url: user.avatarUrl || undefined,
        created_at: user.createdAt.toISOString(),
      };
    }
  } catch (err) {
    console.warn('NeonDB findUserById error:', err);
  }
  return null;
}

export async function createUser(userData: {
  email: string;
  password_hash: string;
  full_name: string;
  phone: string;
  role: 'SEEKER' | 'AGENT' | 'DEVELOPER' | 'ADMIN';
  agency_name?: string;
  license_number?: string;
}): Promise<DbUser> {
  const isVerified = userData.role === 'AGENT' ? Boolean(userData.license_number) : false;
  
  try {
    const created = await prisma.user.create({
      data: {
        email: userData.email.toLowerCase().trim(),
        passwordHash: userData.password_hash,
        fullName: userData.full_name.trim(),
        phone: userData.phone.trim(),
        role: userData.role,
        agencyName: userData.agency_name?.trim() || null,
        licenseNumber: userData.license_number?.trim() || null,
        isVerified,
      },
    });

    return {
      id: created.id,
      email: created.email,
      password_hash: created.passwordHash,
      full_name: created.fullName,
      phone: created.phone,
      role: created.role as 'SEEKER' | 'AGENT' | 'DEVELOPER' | 'ADMIN',
      agency_name: created.agencyName || undefined,
      license_number: created.licenseNumber || undefined,
      is_verified: created.isVerified,
      avatar_url: created.avatarUrl || undefined,
      created_at: created.createdAt.toISOString(),
    };
  } catch (err) {
    console.error('Failed to create user in NeonDB:', err);
    throw err;
  }
}

// ---------------------------------------------------------------------
// Inspections in NeonDB
// ---------------------------------------------------------------------

export async function createInspection(data: {
  user_id: string;
  property_id: string;
  property_title: string;
  property_location: string;
  preferred_date: string;
  preferred_time: string;
  type: 'PHYSICAL' | 'VIRTUAL_WHATSAPP';
  notes?: string;
}): Promise<DbInspection> {
  try {
    const created = await prisma.inspectionRequest.create({
      data: {
        userId: data.user_id,
        propertyId: data.property_id,
        preferredDate: new Date(data.preferred_date),
        preferredTime: data.preferred_time,
        type: data.type,
        notes: data.notes || null,
        status: 'PENDING',
      },
    });

    return {
      id: created.id,
      user_id: created.userId,
      property_id: created.propertyId,
      property_title: data.property_title,
      property_location: data.property_location,
      preferred_date: data.preferred_date,
      preferred_time: data.preferred_time,
      type: data.type,
      notes: data.notes,
      status: created.status as 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED',
      created_at: created.createdAt.toISOString(),
    };
  } catch (err) {
    console.error('Failed to create inspection in NeonDB:', err);
    throw err;
  }
}

export async function getUserInspections(userId: string): Promise<DbInspection[]> {
  try {
    const list = await prisma.inspectionRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { property: true },
    });

    return list.map((item) => ({
      id: item.id,
      user_id: item.userId,
      property_id: item.propertyId,
      property_title: item.property?.title || 'Property Inspection',
      property_location: item.property?.neighborhood || 'Nigeria',
      preferred_date: item.preferredDate.toISOString().split('T')[0],
      preferred_time: item.preferredTime,
      type: item.type as 'PHYSICAL' | 'VIRTUAL_WHATSAPP',
      notes: item.notes || undefined,
      status: item.status as 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED',
      created_at: item.createdAt.toISOString(),
    }));
  } catch (err) {
    console.warn('NeonDB query inspections error:', err);
    return [];
  }
}

// ---------------------------------------------------------------------
// Saved Properties in NeonDB
// ---------------------------------------------------------------------

export async function toggleSaveProperty(
  userId: string,
  propertyId: string
): Promise<{ saved: boolean; propertyId: string }> {
  try {
    const existing = await prisma.savedProperty.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });

    if (existing) {
      await prisma.savedProperty.delete({
        where: { id: existing.id },
      });
      return { saved: false, propertyId };
    } else {
      await prisma.savedProperty.create({
        data: {
          userId,
          propertyId,
        },
      });
      return { saved: true, propertyId };
    }
  } catch (err) {
    console.warn('NeonDB toggleSaveProperty error:', err);
    return { saved: false, propertyId };
  }
}

export async function getUserSavedProperties(userId: string): Promise<string[]> {
  try {
    const saved = await prisma.savedProperty.findMany({
      where: { userId },
      select: { propertyId: true },
    });
    return saved.map((s) => s.propertyId);
  } catch (err) {
    console.warn('NeonDB getUserSavedProperties error:', err);
    return [];
  }
}

// ---------------------------------------------------------------------
// Property Alerts in NeonDB
// ---------------------------------------------------------------------

export async function createPropertyAlert(data: {
  userId?: string | null;
  name: string;
  category: string;
  state: string;
  area: string;
  propertyType: string;
  bedrooms: string;
  titleDocument: string;
  maxPrice: number;
  keyword: string;
  email: string;
  dailySummaryEmail?: boolean;
  phone?: string | null;
  channelsEmail?: boolean;
  channelsPush?: boolean;
  channelsWhatsapp?: boolean;
  frequency?: 'instant' | 'daily' | 'weekly';
  matchesCount?: number;
}): Promise<DbPropertyAlert> {
  try {
    const alert = await prisma.propertyAlert.create({
      data: {
        userId: data.userId || null,
        name: data.name,
        category: data.category || 'all',
        state: data.state || 'All States',
        area: data.area || 'All Areas',
        propertyType: data.propertyType || 'All Types',
        bedrooms: data.bedrooms || 'any',
        titleDocument: data.titleDocument || 'All Titles',
        maxPrice: Number(data.maxPrice) || 1000000000,
        keyword: data.keyword || '',
        email: data.email,
        dailySummaryEmail: data.dailySummaryEmail !== false,
        phone: data.phone || null,
        channelsEmail: data.channelsEmail !== false,
        channelsPush: data.channelsPush !== false,
        channelsWhatsapp: Boolean(data.channelsWhatsapp),
        frequency: data.frequency || 'daily',
        isActive: true,
        matchesCount: data.matchesCount || 0,
      },
    });

    return {
      id: alert.id,
      user_id: alert.userId,
      name: alert.name,
      category: alert.category,
      state: alert.state,
      area: alert.area,
      property_type: alert.propertyType,
      bedrooms: alert.bedrooms,
      title_document: alert.titleDocument,
      max_price: alert.maxPrice,
      keyword: alert.keyword,
      email: alert.email,
      daily_summary_email: alert.dailySummaryEmail,
      phone: alert.phone,
      channels_email: alert.channelsEmail,
      channels_push: alert.channelsPush,
      channels_whatsapp: alert.channelsWhatsapp,
      frequency: alert.frequency as 'instant' | 'daily' | 'weekly',
      is_active: alert.isActive,
      matches_count: alert.matchesCount,
      created_at: alert.createdAt.toISOString(),
    };
  } catch (err) {
    console.error('Failed to create property alert in NeonDB:', err);
    throw err;
  }
}

export async function getPropertyAlerts(options?: {
  email?: string;
  userId?: string;
}): Promise<DbPropertyAlert[]> {
  try {
    const whereClause: { email?: string; userId?: string } = {};
    if (options?.userId) {
      whereClause.userId = options.userId;
    } else if (options?.email) {
      whereClause.email = options.email;
    }

    const list = await prisma.propertyAlert.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return list.map((a) => ({
      id: a.id,
      user_id: a.userId,
      name: a.name,
      category: a.category,
      state: a.state,
      area: a.area,
      property_type: a.propertyType,
      bedrooms: a.bedrooms,
      title_document: a.titleDocument,
      max_price: a.maxPrice,
      keyword: a.keyword,
      email: a.email,
      daily_summary_email: a.dailySummaryEmail,
      phone: a.phone,
      channels_email: a.channelsEmail,
      channels_push: a.channelsPush,
      channels_whatsapp: a.channelsWhatsapp,
      frequency: a.frequency as 'instant' | 'daily' | 'weekly',
      is_active: a.isActive,
      matches_count: a.matchesCount,
      created_at: a.createdAt.toISOString(),
    }));
  } catch (err) {
    console.warn('NeonDB getPropertyAlerts error:', err);
    return [];
  }
}

export async function deletePropertyAlert(id: string): Promise<boolean> {
  try {
    await prisma.propertyAlert.delete({
      where: { id },
    });
    return true;
  } catch (err) {
    console.warn('NeonDB deletePropertyAlert error:', err);
    return false;
  }
}

export async function togglePropertyAlertActive(id: string): Promise<DbPropertyAlert | null> {
  try {
    const existing = await prisma.propertyAlert.findUnique({
      where: { id },
    });
    if (!existing) return null;

    const updated = await prisma.propertyAlert.update({
      where: { id },
      data: {
        isActive: !existing.isActive,
      },
    });

    return {
      id: updated.id,
      user_id: updated.userId,
      name: updated.name,
      category: updated.category,
      state: updated.state,
      area: updated.area,
      property_type: updated.propertyType,
      bedrooms: updated.bedrooms,
      title_document: updated.titleDocument,
      max_price: updated.maxPrice,
      keyword: updated.keyword,
      email: updated.email,
      daily_summary_email: updated.dailySummaryEmail,
      phone: updated.phone,
      channels_email: updated.channelsEmail,
      channels_push: updated.channelsPush,
      channels_whatsapp: updated.channelsWhatsapp,
      frequency: updated.frequency as 'instant' | 'daily' | 'weekly',
      is_active: updated.isActive,
      matches_count: updated.matchesCount,
      created_at: updated.createdAt.toISOString(),
    };
  } catch (err) {
    console.warn('NeonDB togglePropertyAlertActive error:', err);
    return null;
  }
}
