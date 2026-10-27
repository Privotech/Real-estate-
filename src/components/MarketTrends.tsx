'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  MapPin,
  Percent,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import {
  NEIGHBORHOOD_TRENDS,
  NeighborhoodTrend,
  formatNaira,
  formatUSD,
} from '@/lib/property-data';

interface MarketTrendsProps {
  currency: 'NGN' | 'USD';
  onConsultAi: (areaName: string) => void;
}

export function MarketTrends({ currency, onConsultAi }: MarketTrendsProps) {
  const [selectedState, setSelectedState] = useState<'All' | 'Lagos' | 'Abuja (FCT)' | 'Rivers'>('All');

  const filteredTrends = NEIGHBORHOOD_TRENDS.filter(
    (t) => selectedState === 'All' || t.state === selectedState
  );

  return (
    <section className="bg-white py-12 lg:py-16 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>Nigerian Market Intelligence Index</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Neighborhood Price Trends & Rental Yields
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Official benchmark data across Lagos, Abuja, and Port Harcourt residential enclaves based on verified Land Registry and secondary transaction records.
            </p>
          </div>

          {/* State Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold w-fit">
            {(['All', 'Lagos', 'Abuja (FCT)', 'Rivers'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer whitespace-nowrap ${
                  selectedState === st
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Hero Card with Lagos Skyline */}
        <div className="relative rounded-2xl overflow-hidden mb-8 bg-slate-900 text-white min-h-[180px] flex items-center p-6 sm:p-8">
          <img
            src="/images/lagos_skyline_aerial_1792862326152.jpg"
            alt="Aerial view of Lagos skyline and Lekki-Ikoyi link bridge"
            className="absolute inset-0 w-full h-full object-cover opacity-35 object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Market Snapshot
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Lagos & Abuja Real Estate Outperformed Inflation in 2025/2026
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Prime residential assets in Lekki Phase 1, Victoria Island, and Maitama posted average capital appreciation of 18% to 24% YoY, driven by strong diaspora remittances and commercial headquarter expansion.
            </p>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
          <table className="w-full text-xs text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="p-3.5 font-bold">Neighborhood</th>
                <th className="p-3.5 font-bold">State</th>
                <th className="p-3.5 font-bold">Avg. Sale (Duplex)</th>
                <th className="p-3.5 font-bold">Avg. Rent (Annual)</th>
                <th className="p-3.5 font-bold">Gross Yield</th>
                <th className="p-3.5 font-bold">YoY Growth</th>
                <th className="p-3.5 font-bold">Land / SQM</th>
                <th className="p-3.5 font-bold text-right">Due Diligence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrends.map((t, idx) => {
                const salePriceFormatted =
                  currency === 'NGN' ? formatNaira(t.avgSalePriceNaira) : formatUSD(t.avgSalePriceNaira);
                const rentFormatted =
                  currency === 'NGN' ? formatNaira(t.avgRentAnnualNaira) : formatUSD(t.avgRentAnnualNaira);
                const landFormatted =
                  currency === 'NGN' ? formatNaira(t.avgLandPricePerSqm) : formatUSD(t.avgLandPricePerSqm);

                return (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      <span>{t.area}</span>
                      <span className="block text-[11px] font-normal text-slate-500 mt-0.5 line-clamp-1">
                        {t.highlights}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600 font-medium">{t.state}</td>
                    <td className="p-3.5 font-mono font-bold text-slate-900 tabular-nums">
                      {salePriceFormatted}
                    </td>
                    <td className="p-3.5 font-mono text-emerald-950 font-semibold tabular-nums">
                      {rentFormatted}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-800 tabular-nums">
                      {t.rentalYieldPercent}%
                    </td>
                    <td className="p-3.5 font-mono text-emerald-700 font-semibold tabular-nums">
                      <span className="flex items-center gap-0.5">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        +{t.priceGrowthYoY}%
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600 tabular-nums">{landFormatted}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => onConsultAi(t.area)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-700" />
                        <span>AI Valuation</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
