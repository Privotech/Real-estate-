'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  PlusCircle,
  Sparkles,
  SlidersHorizontal,
  Calculator,
  Users,
  ShieldCheck,
  BadgePercent,
  Building2,
  Calendar,
  LogIn,
  LogOut,
  ChevronDown,
  Menu,
  X,
  TrendingUp,
  FileQuestion,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currency: 'NGN' | 'USD';
  setCurrency: (c: 'NGN' | 'USD') => void;
  favoritesCount: number;
  compareCount: number;
  onOpenFavorites: () => void;
  onOpenCompare: () => void;
  onOpenPostProperty: () => void;
  onOpenAiAdvisor: () => void;
  onOpenRequests: () => void;
  onOpenClosingCalc: () => void;
  onOpenAgentDirectory: () => void;
  onOpenTitleSearch: () => void;
  onOpenPreQualifier: () => void;
  onOpenJVModal: () => void;
  onScrollToTrends: () => void;
  onOpenAuth: () => void;
  onOpenInspections: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  favoritesCount,
  compareCount,
  onOpenFavorites,
  onOpenCompare,
  onOpenPostProperty,
  onOpenAiAdvisor,
  onOpenRequests,
  onOpenClosingCalc,
  onOpenAgentDirectory,
  onOpenTitleSearch,
  onOpenPreQualifier,
  onOpenJVModal,
  onScrollToTrends,
  onOpenAuth,
  onOpenInspections,
}: NavbarProps) {
  const { user, logout, inspections } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const servicesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const serviceTools = [
    {
      title: 'AI Property Advisor',
      desc: 'Instant recommendations & neighborhood analysis',
      icon: Sparkles,
      iconColor: 'text-amber-500 bg-amber-50',
      action: () => {
        setServicesOpen(false);
        setMobileMenuOpen(false);
        onOpenAiAdvisor();
      },
    },
    {
      title: 'Title & Land Search',
      desc: 'Verify C of O, Gazette & land registry records',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600 bg-emerald-50',
      action: () => {
        setServicesOpen(false);
        setMobileMenuOpen(false);
        onOpenTitleSearch();
      },
    },
    {
      title: 'JV & Off-Plan Projects',
      desc: 'Verified developments, joint ventures & pre-construction',
      icon: Building2,
      iconColor: 'text-blue-600 bg-blue-50',
      action: () => {
        setServicesOpen(false);
        setMobileMenuOpen(false);
        onOpenJVModal();
      },
    },
    {
      title: 'Mortgage Pre-Qualifier',
      desc: 'Estimate NHF & commercial bank mortgage eligibility',
      icon: BadgePercent,
      iconColor: 'text-indigo-600 bg-indigo-50',
      action: () => {
        setServicesOpen(false);
        setMobileMenuOpen(false);
        onOpenPreQualifier();
      },
    },
    {
      title: 'Closing Fees Calculator',
      desc: 'Calculate legal, agency, stamp duty & registration',
      icon: Calculator,
      iconColor: 'text-purple-600 bg-purple-50',
      action: () => {
        setServicesOpen(false);
        setMobileMenuOpen(false);
        onOpenClosingCalc();
      },
    },
    {
      title: 'Verified Agent Directory',
      desc: 'Connect with licensed Nigerian realtors & developers',
      icon: Users,
      iconColor: 'text-teal-600 bg-teal-50',
      action: () => {
        setServicesOpen(false);
        setMobileMenuOpen(false);
        onOpenAgentDirectory();
      },
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Wordmark Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setActiveTab('all');
                setMobileMenuOpen(false);
              }}
              className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-md"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-base tracking-tighter shadow-xs">
                  NPC
                </div>
                <div>
                  <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap block leading-tight">
                    Nigeria Property Centre
                  </span>
                  <span className="text-[10px] text-slate-500 tracking-normal block hidden sm:block">
                    Verified Real Estate Marketplace
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Zone 2: Streamlined 4 primary links + Services dropdown */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('for-sale')}
              className={`whitespace-nowrap transition-colors hover:text-emerald-800 py-1 cursor-pointer ${
                activeTab === 'for-sale'
                  ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800'
                  : ''
              }`}
            >
              For Sale
            </button>
            <button
              onClick={() => setActiveTab('for-rent')}
              className={`whitespace-nowrap transition-colors hover:text-emerald-800 py-1 cursor-pointer ${
                activeTab === 'for-rent'
                  ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800'
                  : ''
              }`}
            >
              For Rent
            </button>
            <button
              onClick={onOpenRequests}
              className="whitespace-nowrap transition-colors hover:text-emerald-800 py-1 cursor-pointer"
            >
              Requests
            </button>
            <button
              onClick={onScrollToTrends}
              className="whitespace-nowrap transition-colors hover:text-emerald-800 py-1 cursor-pointer"
            >
              Trends
            </button>

            {/* Services Dropdown */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className={`flex items-center gap-1.5 py-1 px-2 rounded-md transition-colors cursor-pointer text-sm font-medium ${
                  servicesOpen
                    ? 'text-emerald-800 bg-emerald-50'
                    : 'text-slate-600 hover:text-emerald-800'
                }`}
                aria-expanded={servicesOpen}
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    servicesOpen ? 'rotate-180 text-emerald-800' : 'text-slate-400'
                  }`}
                />
              </button>

              {servicesOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Tools & Services
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      Verified NPC Ecosystem
                    </span>
                  </div>
                  <div className="py-1 grid grid-cols-1 gap-0.5">
                    {serviceTools.map((tool, idx) => {
                      const Icon = tool.icon;
                      return (
                        <button
                          key={idx}
                          onClick={tool.action}
                          className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                        >
                          <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${tool.iconColor}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-900 group-hover:text-emerald-800">
                              {tool.title}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {tool.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Essential action controls & Post Property */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Currency switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setCurrency('NGN')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  currency === 'NGN'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Nigerian Naira"
              >
                ₦ NGN
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="US Dollar (~₦1,450/$)"
              >
                $ USD
              </button>
            </div>

            {/* Compare Badge Button (only visible if items are selected) */}
            {compareCount > 0 && (
              <button
                onClick={onOpenCompare}
                className="flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer border border-emerald-200"
                title="Compare Properties"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Compare</span>
                <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] flex items-center justify-center font-bold">
                  {compareCount}
                </span>
              </button>
            )}

            {/* Favorites Icon Button */}
            <button
              onClick={onOpenFavorites}
              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors relative cursor-pointer"
              title="Saved Properties"
              aria-label="Saved Properties"
            >
              <Heart className="w-4 h-4" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-[10px] font-bold text-white flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Inspections Icon Button */}
            <button
              onClick={onOpenInspections}
              className="p-2 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors relative cursor-pointer"
              title="My Scheduled Inspections"
              aria-label="My Scheduled Inspections"
            >
              <Calendar className="w-4 h-4" />
              {inspections.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-700 text-[10px] font-bold text-white flex items-center justify-center">
                  {inspections.length}
                </span>
              )}
            </button>

            {/* User Account / Sign In */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 p-1 pr-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer text-xs font-semibold border border-slate-200"
                >
                  <div className="w-6 h-6 rounded-md bg-emerald-800 text-white flex items-center justify-center text-[11px] font-bold">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="max-w-[70px] sm:max-w-[100px] truncate hidden sm:inline">
                    {user.fullName.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="p-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-900 uppercase">
                        {user.role} {user.isVerified && '• VERIFIED'}
                      </span>
                    </div>

                    <div className="py-1 space-y-0.5 text-xs text-slate-700">
                      <button
                        onClick={onOpenInspections}
                        className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-slate-100 rounded-lg text-left cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                        <span>My Inspections ({inspections.length})</span>
                      </button>
                      <button
                        onClick={onOpenFavorites}
                        className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-slate-100 rounded-lg text-left cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-600" />
                        <span>Saved Properties ({favoritesCount})</span>
                      </button>
                      <button
                        onClick={onOpenPostProperty}
                        className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-slate-100 rounded-lg text-left cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Post a Property Listing</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={async () => {
                          await logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-rose-50 text-rose-700 rounded-lg text-left cursor-pointer text-xs font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-700" />
                <span>Sign In</span>
              </button>
            )}

            {/* Primary Action Button */}
            <button
              onClick={onOpenPostProperty}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Post Property</span>
              <span className="sm:hidden">Post</span>
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => {
                setActiveTab('for-sale');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'for-sale'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              For Sale
            </button>
            <button
              onClick={() => {
                setActiveTab('for-rent');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-left transition-colors ${
                activeTab === 'for-rent'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              For Rent
            </button>
            <button
              onClick={() => {
                onOpenRequests();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <FileQuestion className="w-4 h-4 text-emerald-700" />
              <span>Requests</span>
            </button>
            <button
              onClick={() => {
                onScrollToTrends();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>Trends</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">
              Tools & Services
            </p>
            <div className="space-y-1">
              {serviceTools.map((tool, idx) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={idx}
                    onClick={tool.action}
                    className="w-full flex items-center gap-3 p-2 rounded-lg text-left hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer"
                  >
                    <div className={`p-1.5 rounded-md ${tool.iconColor}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{tool.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
