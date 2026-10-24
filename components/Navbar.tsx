'use client';

import React from 'react';
import {
  Heart,
  PlusCircle,
  Sparkles,
  SlidersHorizontal,
  Calculator,
  Users,
  ClipboardList,
} from 'lucide-react';

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
  onScrollToTrends: () => void;
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
  onScrollToTrends,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('all')}
              className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-md"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-lg tracking-tighter shadow-xs">
                  NPC
                </div>
                <div>
                  <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap block leading-tight">
                    Nigeria Property Centre
                  </span>
                  <span className="text-[11px] text-slate-500 tracking-normal block">
                    Verified Real Estate Marketplace
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
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
              className="whitespace-nowrap transition-colors hover:text-emerald-800 py-1 cursor-pointer flex items-center gap-1"
            >
              <span>Property Requests</span>
            </button>
            <button
              onClick={onScrollToTrends}
              className="whitespace-nowrap transition-colors hover:text-emerald-800 py-1 cursor-pointer"
            >
              Market Trends
            </button>
            <button
              onClick={onOpenAiAdvisor}
              className="flex items-center gap-1.5 text-emerald-800 font-semibold hover:text-emerald-950 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>AI Advisor</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action & utility controls */}
          <div className="flex items-center gap-2.5 shrink-0">
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

            {/* Closing Cost Calculator button */}
            <button
              onClick={onOpenClosingCalc}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Closing Cost & Legal Fees Calculator"
            >
              <Calculator className="w-3.5 h-3.5 text-slate-600" />
              <span>Closing Fees</span>
            </button>

            {/* Verified Agents Directory button */}
            <button
              onClick={onOpenAgentDirectory}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Verified Real Estate Agents"
            >
              <Users className="w-3.5 h-3.5 text-slate-600" />
              <span>Agents</span>
            </button>

            {/* Compare items button */}
            {compareCount > 0 && (
              <button
                onClick={onOpenCompare}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Compare Properties"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
                <span>Compare ({compareCount})</span>
              </button>
            )}

            {/* Saved favorites button */}
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

            {/* Primary Action Button */}
            <button
              onClick={onOpenPostProperty}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post a Property</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
