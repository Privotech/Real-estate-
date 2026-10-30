'use client';

import React from 'react';
import Image from 'next/image';
import { X, Heart, Trash2, ArrowRight } from 'lucide-react';
import { Property, formatNaira, formatUSD } from '@/lib/property-data';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Property[];
  currency: 'NGN' | 'USD';
  onRemoveFavorite: (id: string) => void;
  onSelectProperty: (property: Property) => void;
}

export function FavoritesDrawer({
  isOpen,
  onClose,
  favorites,
  currency,
  onRemoveFavorite,
  onSelectProperty,
}: FavoritesDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Saved Properties ({favorites.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {favorites.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <Heart className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-medium text-slate-600 text-sm">No saved properties yet</p>
              <p className="text-xs">
                Click the heart icon on any listing to save and compare properties later.
              </p>
            </div>
          ) : (
            favorites.map((prop) => (
              <div
                key={prop.id}
                className="flex gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 hover:border-slate-300 transition"
              >
                <div
                  className="relative w-24 h-20 rounded-lg overflow-hidden bg-slate-200 shrink-0 cursor-pointer"
                  onClick={() => {
                    onClose();
                    onSelectProperty(prop);
                  }}
                >
                  <Image
                    src={prop.images[0] || '/images/hero_lekki_mansion_1792681047972.jpg'}
                    alt={prop.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase">
                        {prop.category}
                      </span>
                      <button
                        onClick={() => onRemoveFavorite(prop.id)}
                        className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4
                      onClick={() => {
                        onClose();
                        onSelectProperty(prop);
                      }}
                      className="text-xs font-semibold text-slate-900 truncate hover:text-emerald-800 cursor-pointer"
                    >
                      {prop.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 truncate">
                      {prop.area}, {prop.state}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold font-mono text-emerald-950">
                      {currency === 'NGN' ? formatNaira(prop.priceNaira) : formatUSD(prop.priceNaira)}
                    </span>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectProperty(prop);
                      }}
                      className="text-[11px] font-semibold text-emerald-800 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
