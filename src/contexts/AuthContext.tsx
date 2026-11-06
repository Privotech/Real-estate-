'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'SEEKER' | 'AGENT' | 'DEVELOPER' | 'ADMIN';
  agencyName?: string;
  licenseNumber?: string;
  isVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface InspectionItem {
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

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role: 'SEEKER' | 'AGENT' | 'DEVELOPER';
    agencyName?: string;
    licenseNumber?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  inspections: InspectionItem[];
  refreshInspections: () => Promise<void>;
  scheduleInspection: (data: {
    propertyId: string;
    propertyTitle: string;
    propertyLocation: string;
    preferredDate: string;
    preferredTime: string;
    type: 'PHYSICAL' | 'VIRTUAL_WHATSAPP';
    notes?: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [inspections, setInspections] = useState<InspectionItem[]>([]);
  const token = user ? 'cookie-session' : null;

  useEffect(() => {
    let isMounted = true;

    try {
      localStorage.removeItem('npc_auth_token');
      localStorage.removeItem('npc_auth_user');
    } catch (error) {
      console.warn('Could not clear the legacy browser session cache:', error);
    }

    fetch('/api/auth/me')
      .then(async (res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch((error: unknown) => {
        if (isMounted) console.warn('Could not restore the signed-in session:', error);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshInspections = useCallback(async () => {
    if (!user) return;

    try {
      const res = await fetch('/api/inspections');
      if (res.ok) {
        const data = await res.json();
        setInspections(data.inspections || []);
      }
    } catch (error) {
      console.warn('Error fetching inspections:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      void refreshInspections();
    } else {
      setInspections([]);
    }
  }, [user, refreshInspections]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      setUser(data.user);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error during login' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role: 'SEEKER' | 'AGENT' | 'DEVELOPER';
    agencyName?: string;
    licenseNumber?: string;
  }) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      setUser(data.user);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error during registration' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) {
        console.error('The server could not clear the session cookie.');
      }
    } catch (error) {
      console.error('Could not contact the server to clear the session cookie:', error);
    }

    setUser(null);
    setInspections([]);
  };

  const scheduleInspection = async (data: {
    propertyId: string;
    propertyTitle: string;
    propertyLocation: string;
    preferredDate: string;
    preferredTime: string;
    type: 'PHYSICAL' | 'VIRTUAL_WHATSAPP';
    notes?: string;
  }) => {
    if (!user) {
      return { success: false, error: 'You must be signed in to book an inspection.' };
    }

    try {
      const res = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Could not schedule inspection' };
      }

      await refreshInspections();
      return { success: true };
    } catch {
      return { success: false, error: 'Network error scheduling inspection' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        inspections,
        refreshInspections,
        scheduleInspection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
