'use client';

import React from 'react';
import Image from 'next/image';
import { X, Check, Trash2, MapPin, DollarSign, Bed, Bath, ShieldCheck } from 'lucide-react';
import { Property, formatNaira, formatUSD } from '@/lib/property-data';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  currency: 'NGN' | 'USD';
  onRemove: (id: string) => void;
  onSelectProperty: (property: Property) => void;
}

export function CompareModal({
  isOpen,
  onClose,
  properties,
  currency,
  onRemove,
  onSelectProperty,
}: CompareModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Property Comparison ({properties.length} Properties)
            </h3>
            <p className="text-xs text-slate-500">
              Side-by-side analysis of pricing, title documentation, and architectural features.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 sm:p-6">
          {properties.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <p>No properties selected for comparison.</p>
              <p className="text-xs text-slate-400">
                Click the compare icon on any property card to compare features side-by-side.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-3 bg-slate-50 font-bold text-slate-600 w-44">Feature</th>
                    {properties.map((p) => (
                      <th key={p.id} className="p-3 bg-slate-50 min-w-[220px]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] uppercase font-bold text-emerald-800">
                            {p.category}
                          </span>
                          <button
                            onClick={() => onRemove(p.id)}
                            className="text-slate-400 hover:text-rose-600 transition p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div
                          className="relative aspect-16/10 rounded-lg overflow-hidden mb-2 bg-slate-200 cursor-pointer"
                          onClick={() => {
                            onClose();
                            onSelectProperty(p);
                          }}
                        >
                          <Image
                            src={p.images[0] || '/images/hero_lekki_mansion_1792681047972.jpg'}
                            alt={p.title}
                            fill
                            sizes="(max-width: 640px) 80vw, 220px"
                            className="object-cover"
                          />
                        </div>
                        <h4
                          onClick={() => {
                            onClose();
                            onSelectProperty(p);
                          }}
                          className="font-bold text-slate-900 line-clamp-2 hover:text-emerald-800 cursor-pointer"
                        >
                          {p.title}
                        </h4>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50/60">Price</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3 font-mono font-bold text-emerald-950 text-sm">
                        {currency === 'NGN' ? formatNaira(p.priceNaira) : formatUSD(p.priceNaira)}
                        {p.rentalPeriod && <span className="text-xs font-normal text-slate-500 font-sans"> /{p.rentalPeriod.replace('per ', '')}</span>}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50/60">Location</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3 text-slate-700">
                        {p.area}, {p.state}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50/60">Title Document</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3 font-medium text-emerald-900">
                        {p.titleDocument}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50/60">Bedrooms / Baths</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3 text-slate-700">
                        {p.bedrooms > 0 ? `${p.bedrooms} Beds · ${p.bathrooms} Baths` : 'N/A (Land Plot)'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50/60">Land Size</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3 font-mono text-slate-700">
                        {p.landSizeSqm ? `${p.landSizeSqm} SQM` : '—'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50/60">Parking Spaces</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3 text-slate-700">
                        {p.parkingSpaces > 0 ? `${p.parkingSpaces} Cars` : '—'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50/60">Agent & Agency</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3 text-slate-700">
                        <span className="font-semibold block">{p.agent.name}</span>
                        <span className="text-[11px] text-slate-400">{p.agent.agency}</span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
