'use client';

import React from 'react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenAiAdvisor: () => void;
  onOpenPostProperty: () => void;
  onOpenRequests?: () => void;
  onOpenClosingCalc?: () => void;
  onOpenAgentDirectory?: () => void;
  onOpenTitleSearch?: () => void;
  onOpenPreQualifier?: () => void;
  onScrollToTrends?: () => void;
}

export function Footer({
  onSelectCategory,
  onOpenAiAdvisor,
  onOpenPostProperty,
  onOpenRequests,
  onOpenClosingCalc,
  onOpenAgentDirectory,
  onOpenTitleSearch,
  onOpenPreQualifier,
  onScrollToTrends,
}: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                NPC
              </div>
              <span className="text-white font-bold text-base tracking-tight">
                Nigeria Property Centre
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              Nigeria Property Centre is the trusted real estate platform for houses, flats, lands, and commercial properties for sale and rent across Lagos, Abuja, Port Harcourt, and Nigeria.
            </p>
            <p className="text-slate-500 text-[11px]">
              Direct contact with verified agents, genuine title documents, and transparent market pricing.
            </p>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-semibold mb-3">Popular Categories</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectCategory('for-sale')}
                  className="hover:text-emerald-400 transition cursor-pointer text-left"
                >
                  Houses for Sale
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('for-rent')}
                  className="hover:text-emerald-400 transition cursor-pointer text-left"
                >
                  Flats for Rent
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('short-let')}
                  className="hover:text-emerald-400 transition cursor-pointer text-left"
                >
                  Short Let Apartments
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('land')}
                  className="hover:text-emerald-400 transition cursor-pointer text-left"
                >
                  Land & Plots for Sale
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenRequests}
                  className="hover:text-emerald-400 transition cursor-pointer text-left"
                >
                  Seeker Requests Board
                </button>
              </li>
            </ul>
          </div>

          {/* Top Nigerian Locations */}
          <div>
            <h4 className="text-white font-semibold mb-3">Top Locations</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-300 font-medium">Lekki Phase 1, Lagos</span>
              </li>
              <li>
                <span className="text-slate-300 font-medium">Ikoyi & Banana Island</span>
              </li>
              <li>
                <span className="text-slate-300 font-medium">Maitama & Asokoro, Abuja</span>
              </li>
              <li>
                <span className="text-slate-300 font-medium">Ikeja GRA, Lagos</span>
              </li>
              <li>
                <span className="text-slate-300 font-medium">Old GRA, Port Harcourt</span>
              </li>
            </ul>
          </div>

          {/* Real Estate Tools */}
          <div>
            <h4 className="text-white font-semibold mb-3">Tools & Services</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenAiAdvisor}
                  className="hover:text-emerald-400 transition cursor-pointer text-left"
                >
                  AI Valuation Advisor
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTitleSearch}
                  className="hover:text-emerald-400 transition cursor-pointer text-left"
                >
                  Land Registry Title Search
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPreQualifier}
                  className="hover:text-emerald-400 transition cursor-pointer text-left"
                >
                  Mortgage & NHF Pre-Qualifier
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenClosingCalc}
                  className="hover:text-emerald-400 transition cursor-pointer text-left"
                >
                  Closing Fees & Tax Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAgentDirectory}
                  className="hover:text-emerald-400 transition cursor-pointer text-left"
                >
                  Verified Estate Agents Directory
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPostProperty}
                  className="hover:text-emerald-400 transition cursor-pointer text-left text-emerald-400 font-medium"
                >
                  Post a Property (Free)
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Nigeria Property Centre. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Terms of Service</span>
            <span>·</span>
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Land Use Act 1978 Advisory</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
