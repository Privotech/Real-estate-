'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [inspections, setInspections] = useState<InspectionItem[]>([]);

  // Safely hydrate auth state from localStorage after initial render to prevent SSR hydration mismatches
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedToken = localStorage.getItem('npc_auth_token');
        const storedUser = localStorage.getItem('npc_auth_user');
        if (storedToken) {
          setToken(storedToken);
        }
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch {
        // Ignore localStorage read errors
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const refreshInspections = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/inspections', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setInspections(data.inspections || []);
      }
    } catch (err) {
      console.warn('Error fetching inspections:', err);
    }
  }, [token]);

  useEffect(() => {
    let isMounted = true;
    if (token) {
      const timer = setTimeout(() => {
        if (!isMounted) return;

        fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (!isMounted || !data) return;
            if (data.authenticated && data.user) {
              setUser(data.user);
              localStorage.setItem('npc_auth_user', JSON.stringify(data.user));
            } else if (data.authenticated === false) {
              setUser(null);
              setToken(null);
              localStorage.removeItem('npc_auth_user');
              localStorage.removeItem('npc_auth_token');
            }
          })
          .catch(() => {});

        fetch('/api/inspections', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (!isMounted || !data) return;
            setInspections(data.inspections || []);
          })
          .catch(() => {});
      }, 50);

      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }
    return () => {
      isMounted = false;
    };
  }, [token]);

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
        setLoading(false);
        return { success: false, error: data.error || 'Login failed' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('npc_auth_user', JSON.stringify(data.user));
      localStorage.setItem('npc_auth_token', data.token);

      setLoading(false);
      return { success: true };
    } catch {
      setLoading(false);
      return { success: false, error: 'Network error during login' };
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
        setLoading(false);
        return { success: false, error: data.error || 'Registration failed' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('npc_auth_user', JSON.stringify(data.user));
      localStorage.setItem('npc_auth_token', data.token);

      setLoading(false);
      return { success: true };
    } catch {
      setLoading(false);
      return { success: false, error: 'Network error during registration' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore
    }
    setUser(null);
    setToken(null);
    setInspections([]);
    localStorage.removeItem('npc_auth_user');
    localStorage.removeItem('npc_auth_token');
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
    if (!token) {
      return { success: false, error: 'You must be signed in to book an inspection.' };
    }

    try {
      const res = await fetch('/api/inspections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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
