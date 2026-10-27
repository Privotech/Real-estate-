'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Phone,
  MessageCircle,
  Search,
  Star,
  MapPin,
  Building2,
  Award,
} from 'lucide-react';
import { VERIFIED_AGENTS, AgentProfile } from '@/lib/property-data';

interface AgentDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AgentDirectoryModal({
  isOpen,
  onClose,
}: AgentDirectoryModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<'All' | 'Lagos' | 'Abuja (FCT)' | 'Rivers'>('All');

  const filteredAgents = VERIFIED_AGENTS.filter((a) => {
    if (selectedState !== 'All' && a.state !== selectedState) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = a.name.toLowerCase().includes(q);
      const matchAgency = a.agency.toLowerCase().includes(q);
      const matchArea = a.areasCovered.some((area) => area.toLowerCase().includes(q));
      return matchName || matchAgency || matchArea;
    }
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Verified Nigerian Real Estate Agents Directory
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Connect directly with vetted, licensed estate practitioners across Lagos, Abuja, and Port Harcourt.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-semibold w-full sm:w-fit">
            {(['All', 'Lagos', 'Abuja (FCT)', 'Rivers'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer flex-1 sm:flex-initial text-center ${
                  selectedState === st
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search agent name, agency, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>
        </div>

        {/* Agents Grid */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAgents.map((agent) => {
              const waUrl = `https://wa.me/${agent.whatsapp}?text=${encodeURIComponent(
                `Hello ${agent.name}, I found your agency profile on Nigeria Property Centre. I would like to enquire about properties in ${agent.areasCovered[0]}.`
              )}`;

              return (
                <div
                  key={agent.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-xs transition"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-900 text-sm">{agent.name}</h4>
                          {agent.verified && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{agent.agency}</p>
                      </div>

                      <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200 text-xs font-bold text-slate-800 font-mono">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{agent.rating}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({agent.reviewsCount})</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1.5 mb-3 bg-white p-2.5 rounded-lg border border-slate-200/80">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-medium text-slate-800">{agent.specialization}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Coverage: {agent.areasCovered.join(', ')} ({agent.state})</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {agent.experienceYears} Years Experience · {agent.activeListingsCount} Active Listings
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${agent.phone}`}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Agent</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
