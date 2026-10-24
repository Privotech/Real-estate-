'use client';

import React, { useState } from 'react';
import { Search, MapPin, Home, DollarSign, Bed, Filter, CheckCircle2 } from 'lucide-react';
import {
  NIGERIAN_STATES,
  POPULAR_LOCATIONS_BY_STATE,
  PROPERTY_TYPES,
  TITLE_DOCUMENTS,
} from '@/lib/property-data';

interface HeroSearchProps {
  category: string;
  setCategory: (c: string) => void;
  selectedState: string;
  setSelectedState: (s: string) => void;
  selectedArea: string;
  setSelectedArea: (a: string) => void;
  selectedType: string;
  setSelectedType: (t: string) => void;
  selectedBedrooms: string;
  setSelectedBedrooms: (b: string) => void;
  selectedTitle: string;
  setSelectedTitle: (t: string) => void;
  maxPrice: number;
  setMaxPrice: (p: number) => void;
  searchKeyword: string;
  setSearchKeyword: (k: string) => void;
  onSearch: () => void;
}

export function HeroSearch({
  category,
  setCategory,
  selectedState,
  setSelectedState,
  selectedArea,
  setSelectedArea,
  selectedType,
  setSelectedType,
  selectedBedrooms,
  setSelectedBedrooms,
  selectedTitle,
  setSelectedTitle,
  maxPrice,
  setMaxPrice,
  searchKeyword,
  setSearchKeyword,
  onSearch,
}: HeroSearchProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const availableAreas =
    selectedState !== 'All States' && POPULAR_LOCATIONS_BY_STATE[selectedState]
      ? POPULAR_LOCATIONS_BY_STATE[selectedState]
      : [
          'All Areas',
          'Lekki Phase 1',
          'Ikoyi',
          'Banana Island',
          'Victoria Island (VI)',
          'Maitama (Abuja)',
          'Wuse 2 (Abuja)',
          'Old GRA (Port Harcourt)',
        ];

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    setSelectedArea('All Areas');
  };

  const handleQuickPreset = (preset: {
    state?: string;
    area?: string;
    keyword?: string;
    category?: string;
    title?: string;
  }) => {
    if (preset.state) setSelectedState(preset.state);
    if (preset.area) setSelectedArea(preset.area);
    if (preset.keyword !== undefined) setSearchKeyword(preset.keyword);
    if (preset.category) setCategory(preset.category);
    if (preset.title) setSelectedTitle(preset.title);
    onSearch();
  };

  return (
    <section className="relative bg-slate-900 text-white overflow-hidden">
      {/* Background Hero Image with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero_lekki_mansion_1792681047972.jpg"
          alt="Luxury Nigerian contemporary duplex in Lekki"
          className="w-full h-full object-cover object-center opacity-40 scale-102 transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
            <span>Verified Nigerian Real Estate</span>
            <span aria-hidden="true">·</span>
            <span>Lagos · Abuja · Port Harcourt</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white text-balance leading-tight">
            Find Your Next Home, Land or Investment in Nigeria
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Browse verified listings with verified titles (C of O, Governor&apos;s Consent),
            direct WhatsApp contact with verified agents, and transparent Nigerian market pricing.
          </p>
        </div>

        {/* Search Console Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 sm:p-6 text-slate-900">
          {/* Category Tabs (Segmented Control - functional buttons) */}
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-100">
            {[
              { id: 'all', label: 'All Properties' },
              { id: 'for-sale', label: 'For Sale' },
              { id: 'for-rent', label: 'For Rent' },
              { id: 'short-let', label: 'Short Let' },
              { id: 'joint-venture', label: 'Joint Venture' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategory(tab.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  category === tab.id
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Primary Filter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4">
            {/* State Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                State
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 transition"
              >
                {NIGERIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Area / Locality Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                Area / Neighborhood
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 transition"
              >
                {availableAreas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-emerald-700" />
                Property Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 transition"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
                <Bed className="w-3.5 h-3.5 text-emerald-700" />
                Bedrooms
              </label>
              <select
                value={selectedBedrooms}
                onChange={(e) => setSelectedBedrooms(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 transition"
              >
                <option value="any">Any Bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4 Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>
            </div>
          </div>

          {/* Keyword Search & Advanced Filters Bar */}
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search keywords (e.g. pool, cinema, BQ, Lekki, waterfront, elevator)..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 transition"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Hide Filters' : 'More Filters (Title & Price)'}</span>
            </button>

            <button
              type="button"
              onClick={onSearch}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              <Search className="w-4 h-4" />
              <span>Search Properties</span>
            </button>
          </div>

          {/* Advanced Collapsible Row (Title Document & Max Price) */}
          {showAdvanced && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Title Document Filter
                </label>
                <select
                  value={selectedTitle}
                  onChange={(e) => setSelectedTitle(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 transition"
                >
                  {TITLE_DOCUMENTS.map((doc) => (
                    <option key={doc} value={doc}>
                      {doc}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-500">
                  Filter by validated Nigerian land titles (Governor&apos;s Consent, C of O, Gazette).
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                    Maximum Price
                  </label>
                  <span className="text-xs font-semibold font-mono text-emerald-800">
                    {maxPrice >= 1000000000
                      ? 'No Limit'
                      : maxPrice >= 1000000
                      ? `₦${(maxPrice / 1000000).toLocaleString()} Million`
                      : `₦${maxPrice.toLocaleString()}`}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000000"
                  max="1000000000"
                  step="10000000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-emerald-800 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>₦5M</span>
                  <span>₦250M</span>
                  <span>₦500M</span>
                  <span>₦1B+</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Preset Queries (Clean text buttons) */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Popular Searches:</span>
            <button
              onClick={() => handleQuickPreset({ state: 'Lagos', area: 'Lekki Phase 1' })}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 transition cursor-pointer"
            >
              Lekki Phase 1
            </button>
            <button
              onClick={() => handleQuickPreset({ state: 'Lagos', area: 'Ikoyi' })}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 transition cursor-pointer"
            >
              Ikoyi Waterfront
            </button>
            <button
              onClick={() => handleQuickPreset({ state: 'Abuja (FCT)', area: 'Maitama' })}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 transition cursor-pointer"
            >
              Maitama Abuja
            </button>
            <button
              onClick={() => handleQuickPreset({ state: 'Lagos', area: 'Banana Island' })}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 transition cursor-pointer"
            >
              Banana Island
            </button>
            <button
              onClick={() => handleQuickPreset({ category: 'short-let' })}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 transition cursor-pointer"
            >
              Short Let Apartments
            </button>
            <button
              onClick={() => handleQuickPreset({ title: "Governor's Consent" })}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 transition cursor-pointer"
            >
              With Governor&apos;s Consent
            </button>
          </div>
        </div>

        {/* 4-Item Proof Strip Row Below Search Box */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 text-slate-200 text-xs sm:text-sm">
          <div className="bg-slate-800/60 backdrop-blur-xs p-3.5 rounded-xl border border-slate-700/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base shrink-0">
              45k+
            </div>
            <div>
              <p className="font-semibold text-white">Active Listings</p>
              <p className="text-slate-400 text-xs">Across 36 Nigerian states</p>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xs p-3.5 rounded-xl border border-slate-700/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base shrink-0">
              100%
            </div>
            <div>
              <p className="font-semibold text-white">Title Verified</p>
              <p className="text-slate-400 text-xs">C of O, Consent & Gazette</p>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xs p-3.5 rounded-xl border border-slate-700/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base shrink-0">
              2.4k+
            </div>
            <div>
              <p className="font-semibold text-white">Vetted Agents</p>
              <p className="text-slate-400 text-xs">Direct WhatsApp contact</p>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xs p-3.5 rounded-xl border border-slate-700/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base shrink-0">
              ₦0
            </div>
            <div>
              <p className="font-semibold text-white">Free Buyer Enquiries</p>
              <p className="text-slate-400 text-xs">Zero inspection booking fee</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
