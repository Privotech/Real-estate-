'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Zap,
  Droplets,
  ShieldCheck,
  Building,
  Navigation,
  ArrowRight,
} from 'lucide-react';

interface NeighborhoodExplorerProps {
  onSelectArea: (state: string, area: string) => void;
}

interface DistrictInfo {
  name: string;
  state: string;
  category: string;
  powerScore: string; // e.g. "99% Steady"
  floodRisk: 'Zero Risk (Elevated)' | 'Zero Risk (Paved System)' | 'Moderate (Rainy Season)';
  securityRating: string;
  keyLandmarks: string[];
  vibe: string;
  avgRentAnnual: string;
  avgSaleDuplex: string;
}

const DISTRICTS: DistrictInfo[] = [
  {
    name: 'Banana Island, Ikoyi',
    state: 'Lagos',
    category: 'Ultra-Luxury Island',
    powerScore: '99% Dedicated IPP',
    floodRisk: 'Zero Risk (Paved System)',
    securityRating: 'Military & Island Gate Pass',
    keyLandmarks: ['Ikoyi Waterfront', 'Lekki-Ikoyi Link Bridge (5 mins)', 'Five Cowries Creek'],
    vibe: 'Nigeria’s most prestigious residential neighborhood; serene manicured boulevards with billionaires, diplomats, and business moguls.',
    avgRentAnnual: '₦35,000,000',
    avgSaleDuplex: '₦950,000,000',
  },
  {
    name: 'Lekki Phase 1',
    state: 'Lagos',
    category: 'Upscale Commercial & Residential',
    powerScore: '85% Dual Estate Generator',
    floodRisk: 'Zero Risk (Paved System)',
    securityRating: 'Gated Closes & Armed Patrol',
    keyLandmarks: ['Admiralty Way', 'Lekki Toll Gate', 'Filmhouse IMAX Cinema', 'Circle Mall'],
    vibe: 'The vibrant heart of the Island. Packed with top restaurants, tech founders, luxury cafes, and high-yielding serviced duplexes.',
    avgRentAnnual: '₦14,000,000',
    avgSaleDuplex: '₦380,000,000',
  },
  {
    name: 'Victoria Island (VI)',
    state: 'Lagos',
    category: 'Central Financial Hub & Penthouses',
    powerScore: '90% Commercial Grade Grid',
    floodRisk: 'Zero Risk (Paved System)',
    securityRating: '24/7 Corporate & Police Patrol',
    keyLandmarks: ['Eko Atlantic City', 'Ozumba Mbadiwe Lagoon', 'Civic Centre', 'Landmark Beach'],
    vibe: 'High-density luxury apartment towers, international bank headquarters, luxury short-lets, and nightlife.',
    avgRentAnnual: '₦18,000,000',
    avgSaleDuplex: '₦450,000,000',
  },
  {
    name: 'Maitama',
    state: 'Abuja (FCT)',
    category: 'Diplomatic & Ambassadorial',
    powerScore: '95% FCT Priority Grid',
    floodRisk: 'Zero Risk (Elevated)',
    securityRating: 'Federal Diplomatic Security',
    keyLandmarks: ['IBB Golf Course', 'Transcorp Hilton (6 mins)', 'Gana Street Corridor', 'Federal High Court'],
    vibe: 'Sprawling ambassadorial villas, lush tree-lined avenues, top diplomatic missions, and serene luxury living in Abuja.',
    avgRentAnnual: '₦24,000,000',
    avgSaleDuplex: '₦580,000,000',
  },
  {
    name: 'Wuse 2',
    state: 'Abuja (FCT)',
    category: 'Cosmopolitan Hub',
    powerScore: '88% Priority Grid',
    floodRisk: 'Zero Risk (Elevated)',
    securityRating: '24/7 Police Outposts',
    keyLandmarks: ['Adetokunbo Ademola Crescent', 'Banex Plaza', 'Aminu Kano Way'],
    vibe: 'Abuja’s dynamic commercial and lifestyle capital with modern semi-detached homes, boutique lounges, and embassies.',
    avgRentAnnual: '₦15,000,000',
    avgSaleDuplex: '₦310,000,000',
  },
  {
    name: 'Old GRA',
    state: 'Rivers',
    category: 'Historic Prime Quarter',
    powerScore: '82% Grid + Standby Generator',
    floodRisk: 'Zero Risk (Elevated)',
    securityRating: 'Private Gatehouses & Mobile Police',
    keyLandmarks: ['Government House axis', 'Peter Odili Corridor (8 mins)', 'Port Harcourt Club'],
    vibe: 'Colonial-era serenity with large leafy compounds, headquarters of multinational energy firms, and luxury villas.',
    avgRentAnnual: '₦9,500,000',
    avgSaleDuplex: '₦240,000,000',
  },
];

export function NeighborhoodExplorer({ onSelectArea }: NeighborhoodExplorerProps) {
  const [activeDistrict, setActiveDistrict] = useState<DistrictInfo>(DISTRICTS[0]);
  const [activeRegion, setActiveRegion] = useState<'All' | 'Lagos' | 'Abuja (FCT)' | 'Rivers'>('All');

  const filteredDistricts = DISTRICTS.filter(
    (d) => activeRegion === 'All' || d.state === activeRegion
  );

  return (
    <section className="bg-slate-900 text-white py-12 lg:py-16 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              <Navigation className="w-4 h-4" />
              <span>Location & Infrastructure Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Nigerian Neighborhood & District Guide
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-world insights on 24/7 electricity uptime, flood drainage integrity, security infrastructure, and landmark transit across prime Nigerian cities.
            </p>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg text-xs font-semibold w-fit border border-slate-700">
            {(['All', 'Lagos', 'Abuja (FCT)', 'Rivers'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setActiveRegion(r)}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer whitespace-nowrap ${
                  activeRegion === r
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Split: District Selector on Left, Deep Dive on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: District List Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {filteredDistricts.map((district) => {
              const isSelected = activeDistrict.name === district.name;
              return (
                <div
                  key={district.name}
                  onClick={() => setActiveDistrict(district)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        {district.state}
                      </span>
                      <h4 className="font-bold text-white text-sm sm:text-base">{district.name}</h4>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {district.category}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-300 border-t border-slate-700/60 pt-2 font-mono tabular-nums">
                    <span>Duplex: {district.avgSaleDuplex}</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      Rent: {district.avgRentAnnual}/yr
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Selected District Intelligence Card (7 cols) */}
          <div className="lg:col-span-7 bg-slate-800 rounded-2xl border border-slate-700 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-700">
                <div>
                  <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                    District Spotlight
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-0.5">{activeDistrict.name}</h3>
                  <p className="text-xs text-slate-400">{activeDistrict.state} · {activeDistrict.category}</p>
                </div>

                <button
                  onClick={() => onSelectArea(activeDistrict.state, activeDistrict.name.split(',')[0])}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-lg text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span>Explore Available Properties</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* District Overview prose */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed my-5">
                {activeDistrict.vibe}
              </p>

              {/* 3 Infrastructure Score Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-700/70 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                    <Zap className="w-4 h-4" />
                    <span>Power Reliability</span>
                  </div>
                  <p className="font-bold text-white text-sm">{activeDistrict.powerScore}</p>
                  <p className="text-[11px] text-slate-400">Independent grid / central gen</p>
                </div>

                <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-700/70 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold">
                    <Droplets className="w-4 h-4" />
                    <span>Flood Drainage</span>
                  </div>
                  <p className="font-bold text-white text-sm">{activeDistrict.floodRisk}</p>
                  <p className="text-[11px] text-slate-400">Storm drainage & topography</p>
                </div>

                <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-700/70 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Security Level</span>
                  </div>
                  <p className="font-bold text-white text-sm">{activeDistrict.securityRating}</p>
                  <p className="text-[11px] text-slate-400">Perimeter gate & surveillance</p>
                </div>
              </div>

              {/* Key Transit & Landmarks */}
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  Key Landmarks & Corridors
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeDistrict.keyLandmarks.map((lm, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-slate-800 text-slate-200 px-3 py-1 rounded-md border border-slate-700"
                    >
                      {lm}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Baselines */}
            <div className="pt-5 border-t border-slate-700 mt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div className="text-slate-300">
                Average Duplex Sale: <strong className="text-white text-sm">{activeDistrict.avgSaleDuplex}</strong>
              </div>
              <div className="text-slate-300">
                Average Annual Rent: <strong className="text-emerald-400 text-sm">{activeDistrict.avgRentAnnual}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
