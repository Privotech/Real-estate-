import { neon } from '@neondatabase/serverless';
import { prisma, getCleanDatabaseUrl } from './prisma';

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

// ---------------------------------------------------------------------
// In-Memory Fallback Store (Ensures 100% Uptime if Neon credentials expire)
// ---------------------------------------------------------------------
const memoryUsers: DbUser[] = [
  {
    id: 'agent-adebayo-001',
    email: 'agent@nigeriaproperty.com',
    // bcrypt hash of "password123"
    password_hash: '$2b$10$SQLUvMqpAHsg9lJFAb75x.nsyYNxhKSrXrE06dl7.vtrAAJyC6kSu',
    full_name: 'Adebayo Alabi (LASRERA Certified)',
    phone: '+234 803 456 7890',
    role: 'AGENT',
    agency_name: 'Prime Lekki Realtors & Advisory',
    license_number: 'LASRERA/REA/2024/0892',
    is_verified: true,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'seeker-chioma-002',
    email: 'seeker@nigeriaproperty.com',
    // bcrypt hash of "password123"
    password_hash: '$2b$10$SQLUvMqpAHsg9lJFAb75x.nsyYNxhKSrXrE06dl7.vtrAAJyC6kSu',
    full_name: 'Chioma Okonjo',
    phone: '+234 812 345 6789',
    role: 'SEEKER',
    is_verified: true,
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'dev-emeka-003',
    email: 'developer@nigeriaproperty.com',
    // bcrypt hash of "password123"
    password_hash: '$2b$10$SQLUvMqpAHsg9lJFAb75x.nsyYNxhKSrXrE06dl7.vtrAAJyC6kSu',
    full_name: 'Engr. Emeka Danladi',
    phone: '+234 809 111 2233',
    role: 'DEVELOPER',
    agency_name: 'Eko Atlantic Heights Consortium',
    license_number: 'COREN/ENG/2020/4431',
    is_verified: true,
    created_at: new Date().toISOString(),
  },
];

const memoryInspections: DbInspection[] = [
  {
    id: 'insp-101',
    user_id: 'seeker-chioma-002',
    property_id: 'npc-lekki-001',
    property_title: '5 Bedroom Fully Detached Luxury Duplex with BQ & Pool',
    property_location: 'Ikoyi, Lagos',
    preferred_date: '2026-11-02',
    preferred_time: '11:00 AM',
    type: 'PHYSICAL',
    notes: 'Please verify structural guarantee and C of O documents prior to visit.',
    status: 'CONFIRMED',
    created_at: new Date().toISOString(),
  },
];

const memorySavedProperties: { id: string; user_id: string; property_id: string }[] = [
  { id: 'save-1', user_id: 'seeker-chioma-002', property_id: 'npc-lekki-001' },
  { id: 'save-2', user_id: 'seeker-chioma-002', property_id: 'npc-ikoyi-002' },
];

const memoryAlerts: DbPropertyAlert[] = [
  {
    id: 'alert-sample-001',
    user_id: 'seeker-chioma-002',
    name: 'Lekki Phase 1 Luxury 4-5 Bed Duplexes',
    category: 'for-sale',
    state: 'Lagos',
    area: 'Lekki Phase 1',
    property_type: 'Detached Duplex',
    bedrooms: '4',
    title_document: "Governor's Consent",
    max_price: 350000000,
    keyword: 'Pool BQ',
    email: 'privilegeoyegbile@gmail.com',
    daily_summary_email: true,
    phone: '+234 803 123 4567',
    channels_email: true,
    channels_push: true,
    channels_whatsapp: true,
    frequency: 'daily',
    is_active: true,
    matches_count: 4,
    created_at: new Date().toISOString(),
  },
];

// ---------------------------------------------------------------------
// Health Check & Dual-Mode Controller
// ---------------------------------------------------------------------
let dbStatus: 'unknown' | 'connected' | 'unavailable' = 'unknown';
let lastCheckTime = 0;
const CHECK_INTERVAL_MS = 60 * 1000; // recheck every 60 seconds

export async function isDatabaseHealthy(): Promise<boolean> {
  const now = Date.now();
  if (dbStatus !== 'unknown' && now - lastCheckTime < CHECK_INTERVAL_MS) {
    return dbStatus === 'connected';
  }

  const cleanUrl = getCleanDatabaseUrl();
  if (!cleanUrl || cleanUrl.includes('YOUR_NEON_DATABASE_URL') || cleanUrl.includes('ep-xyz')) {
    dbStatus = 'unavailable';
    lastCheckTime = now;
    return false;
  }

  try {
    // Quick test query with 2500ms timeout to avoid hanging on slow network or socket timeouts
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Connection check timeout')), 2500)
    );
    await Promise.race([prisma.$queryRaw`SELECT 1`, timeoutPromise]);
    dbStatus = 'connected';
    lastCheckTime = now;
    return true;
  } catch (err: unknown) {
    dbStatus = 'unavailable';
    lastCheckTime = now;
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Authentication failed') || msg.includes('password authentication failed')) {
      console.warn('[Database Notice] NeonDB credentials are invalid or expired. Running in local fallback mode. Update DATABASE_URL with fresh credentials to reconnect to Neon.');
    } else {
      console.warn('[Database Notice] NeonDB currently unavailable. Running in local fallback mode.');
    }
    return false;
  }
}

export { getCleanDatabaseUrl };

export function getNeonClient() {
  const cleanUrl = getCleanDatabaseUrl();
  if (!cleanUrl) return null;
  try {
    return neon(cleanUrl);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------
// User operations
// ---------------------------------------------------------------------

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const normalizedEmail = email.toLowerCase().trim();
  
  if (await isDatabaseHealthy()) {
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
    } catch {
      // Fall through to memory store if query fails
    }
  }

  const memoryMatch = memoryUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
  return memoryMatch || null;
}

export async function findUserById(id: string): Promise<DbUser | null> {
  if (await isDatabaseHealthy()) {
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
    } catch {
      // Fall through to memory store if query fails
    }
  }

  const memoryMatch = memoryUsers.find((u) => u.id === id);
  return memoryMatch || null;
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
  
  if (await isDatabaseHealthy()) {
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
    } catch {
      // Fall through to memory store if Neon insert fails
    }
  }

  const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newUser: DbUser = {
    id,
    email: userData.email.toLowerCase().trim(),
    password_hash: userData.password_hash,
    full_name: userData.full_name.trim(),
    phone: userData.phone.trim(),
    role: userData.role,
    agency_name: userData.agency_name?.trim(),
    license_number: userData.license_number?.trim(),
    is_verified: isVerified,
    created_at: new Date().toISOString(),
  };

  memoryUsers.push(newUser);
  return newUser;
}

// ---------------------------------------------------------------------
// Inspections
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
  if (await isDatabaseHealthy()) {
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
    } catch {
      // Fall through to memory store
    }
  }

  const id = `insp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const newInspection: DbInspection = {
    id,
    user_id: data.user_id,
    property_id: data.property_id,
    property_title: data.property_title,
    property_location: data.property_location,
    preferred_date: data.preferred_date,
    preferred_time: data.preferred_time,
    type: data.type,
    notes: data.notes,
    status: 'PENDING',
    created_at: new Date().toISOString(),
  };

  memoryInspections.unshift(newInspection);
  return newInspection;
}

export async function getUserInspections(userId: string): Promise<DbInspection[]> {
  if (await isDatabaseHealthy()) {
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
    } catch {
      // Fall through to memory store
    }
  }

  return memoryInspections
    .filter((i) => i.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

// ---------------------------------------------------------------------
// Saved Properties
// ---------------------------------------------------------------------

export async function toggleSaveProperty(
  userId: string,
  propertyId: string
): Promise<{ saved: boolean; propertyId: string }> {
  if (await isDatabaseHealthy()) {
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
    } catch {
      // Fall through to memory store
    }
  }

  const idx = memorySavedProperties.findIndex(
    (item) => item.user_id === userId && item.property_id === propertyId
  );
  if (idx > -1) {
    memorySavedProperties.splice(idx, 1);
    return { saved: false, propertyId };
  } else {
    memorySavedProperties.push({
      id: `save-${Date.now()}`,
      user_id: userId,
      property_id: propertyId,
    });
    return { saved: true, propertyId };
  }
}

export async function getUserSavedProperties(userId: string): Promise<string[]> {
  if (await isDatabaseHealthy()) {
    try {
      const saved = await prisma.savedProperty.findMany({
        where: { userId },
        select: { propertyId: true },
      });
      return saved.map((s) => s.propertyId);
    } catch {
      // Fall through to memory store
    }
  }

  return memorySavedProperties
    .filter((item) => item.user_id === userId)
    .map((item) => item.property_id);
}

// ---------------------------------------------------------------------
// Property Alerts
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
  if (await isDatabaseHealthy()) {
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
    } catch {
      // Fall through to memory store
    }
  }

  const id = `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const newAlert: DbPropertyAlert = {
    id,
    user_id: data.userId || null,
    name: data.name,
    category: data.category || 'all',
    state: data.state || 'All States',
    area: data.area || 'All Areas',
    property_type: data.propertyType || 'All Types',
    bedrooms: data.bedrooms || 'any',
    title_document: data.titleDocument || 'All Titles',
    max_price: Number(data.maxPrice) || 1000000000,
    keyword: data.keyword || '',
    email: data.email,
    daily_summary_email: data.dailySummaryEmail !== false,
    phone: data.phone || null,
    channels_email: data.channelsEmail !== false,
    channels_push: data.channelsPush !== false,
    channels_whatsapp: Boolean(data.channelsWhatsapp),
    frequency: data.frequency || 'daily',
    is_active: true,
    matches_count: data.matchesCount || 0,
    created_at: new Date().toISOString(),
  };

  memoryAlerts.unshift(newAlert);
  return newAlert;
}

export async function getPropertyAlerts(options?: {
  email?: string;
  userId?: string;
}): Promise<DbPropertyAlert[]> {
  if (await isDatabaseHealthy()) {
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
    } catch {
      // Fall through to memory store
    }
  }

  return memoryAlerts.filter((a) => {
    if (options?.userId && a.user_id === options.userId) return true;
    if (options?.email && a.email.toLowerCase() === options.email.toLowerCase()) return true;
    if (!options?.userId && !options?.email) return true;
    return false;
  });
}

export async function deletePropertyAlert(id: string): Promise<boolean> {
  if (await isDatabaseHealthy()) {
    try {
      await prisma.propertyAlert.delete({
        where: { id },
      });
      return true;
    } catch {
      // Fall through to memory store
    }
  }

  const idx = memoryAlerts.findIndex((a) => a.id === id);
  if (idx > -1) {
    memoryAlerts.splice(idx, 1);
    return true;
  }
  return false;
}

export async function togglePropertyAlertActive(id: string): Promise<DbPropertyAlert | null> {
  if (await isDatabaseHealthy()) {
    try {
      const existing = await prisma.propertyAlert.findUnique({
        where: { id },
      });
      if (existing) {
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
      }
    } catch {
      // Fall through to memory store
    }
  }

  const alert = memoryAlerts.find((a) => a.id === id);
  if (alert) {
    alert.is_active = !alert.is_active;
    return alert;
  }
  return null;
}
