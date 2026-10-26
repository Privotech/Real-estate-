'use client';

import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Building,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Home,
  HardHat,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
  defaultRole?: 'SEEKER' | 'AGENT' | 'DEVELOPER';
}

export function AuthModal({
  isOpen,
  onClose,
  defaultTab = 'login',
  defaultRole = 'SEEKER',
}: AuthModalProps) {
  const { login, register, loading } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [role, setRole] = useState<'SEEKER' | 'AGENT' | 'DEVELOPER'>(defaultRole);
  const [agencyName, setAgencyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (tab === 'login') {
      const res = await login(email, password);
      if (res.success) {
        setSuccessMsg('Successfully signed in! Welcome back.');
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setError(res.error || 'Failed to sign in. Please verify your email and password.');
      }
    } else {
      if (!fullName.trim() || !email.trim() || !password || !phone.trim()) {
        setError('Please fill in all required fields.');
        return;
      }

      const res = await register({
        email,
        password,
        fullName,
        phone,
        role,
        agencyName: role === 'AGENT' || role === 'DEVELOPER' ? agencyName : undefined,
        licenseNumber: role === 'AGENT' || role === 'DEVELOPER' ? licenseNumber : undefined,
      });

      if (res.success) {
        setSuccessMsg('Account created successfully! Welcome to Nigeria Property Centre.');
        setTimeout(() => {
          onClose();
        }, 900);
      } else {
        setError(res.error || 'Registration failed. Please try again.');
      }
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setError(null);
    setEmail(demoEmail);
    setPassword('password123');
    const res = await login(demoEmail, 'password123');
    if (res.success) {
      setSuccessMsg('Signed in with demo account!');
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setError(res.error || 'Could not log into demo account.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {tab === 'login' ? 'Sign in to Nigeria Property Centre' : 'Create an Account'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {tab === 'login'
                ? 'Access your saved properties, inspections & listings'
                : 'Join Nigeria’s most trusted real estate network'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Feedback Alerts */}
        <div className="px-6 pt-4">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {tab === 'register' && (
            <>
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  I am registering as:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('SEEKER')}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      role === 'SEEKER'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <Home className="w-4 h-4 text-emerald-700 mb-1" />
                    <div className="text-xs font-bold leading-tight">Seeker / Buyer</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Rent or Buy</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('AGENT')}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      role === 'AGENT'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-emerald-700 mb-1" />
                    <div className="text-xs font-bold leading-tight">Agent / Realtor</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Post Listings</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('DEVELOPER')}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      role === 'DEVELOPER'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <HardHat className="w-4 h-4 text-emerald-700 mb-1" />
                    <div className="text-xs font-bold leading-tight">Developer / JV</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Off-Plan & Land</div>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name / Contact Person *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Adebayo Alabi"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nigerian Phone / WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 123 4567"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Agency Details for Agents */}
              {role === 'AGENT' && (
                <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Realtor Verification Credentials</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                      Agency / Firm Name
                    </label>
                    <div className="relative">
                      <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                      <input
                        type="text"
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
                        placeholder="e.g. Prime Lekki Properties"
                        className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                      LASRERA / ERCAAN / CAC Registration Number
                    </label>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="e.g. LASRERA/REA/2024/0981"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                    <p className="text-[10px] text-emerald-800 mt-1">
                      Verified agents receive the green shield badge and higher search rank.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password {tab === 'register' && '(min 6 characters)'} *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : null}
            <span>
              {tab === 'login'
                ? loading
                  ? 'Signing in...'
                  : 'Sign In'
                : loading
                ? 'Creating Account...'
                : 'Create Account'}
            </span>
          </button>

          {/* Quick Demo Accounts */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 mb-2 text-center">
              Quick One-Click Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('agent@nigeriaproperty.com')}
                className="px-2.5 py-1.5 text-[11px] font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 border border-slate-200 rounded-lg transition-colors cursor-pointer text-left"
              >
                <span className="font-semibold block text-slate-800">Verified Agent</span>
                <span className="text-[10px] text-slate-500 block truncate">Adebayo (LASRERA)</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('seeker@nigeriaproperty.com')}
                className="px-2.5 py-1.5 text-[11px] font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 border border-slate-200 rounded-lg transition-colors cursor-pointer text-left"
              >
                <span className="font-semibold block text-slate-800">Property Buyer</span>
                <span className="text-[10px] text-slate-500 block truncate">Chioma Okonjo</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
