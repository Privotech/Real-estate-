'use client';

import React from 'react';
import Image from 'next/image';
import {
  Bed,
  Bath,
  Car,
  Heart,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react';
import { Property, formatNaira, formatUSD } from '@/lib/property-data';

interface PropertyCardProps {
  property: Property;
  currency: 'NGN' | 'USD';
  isFavorite: boolean;
  canFavorite: boolean;
  isCompared: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onScheduleInspection: (property: Property) => void;
}

export function PropertyCard({
  property,
  currency,
  isFavorite,
  canFavorite,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  onSelectProperty,
  onScheduleInspection,
}: PropertyCardProps) {
  const displayPrice =
    currency === 'NGN'
      ? formatNaira(property.priceNaira)
      : formatUSD(property.priceNaira);

  const whatsappMessage = encodeURIComponent(
    `Hello ${property.agent.name}, I saw this listing on Nigeria Property Centre: "${property.title}" (${property.area}, ${property.state}) priced at ₦${property.priceNaira.toLocaleString()}. Is this property still available for inspection?`
  );

  const whatsappUrl = `https://wa.me/${property.agent.whatsapp}?text=${whatsappMessage}`;

  return (
    <article className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col">
      {/* Media Slot - 4:3 Aspect Ratio with Zero-Broken-Image Policy */}
      <div className="relative aspect-4/3 w-full bg-slate-800 overflow-hidden cursor-pointer" onClick={() => onSelectProperty(property)}>
        <Image
          src={property.images[0] || '/images/hero_lekki_mansion_1792681047972.jpg'}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover group-hover:scale-104 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = '/images/hero_lekki_mansion_1792681047972.jpg';
          }}
        />

        {/* Subtle Scrim for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Category & Status Overlay (clean, subtle text overlay) */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider">
            {property.category === 'for-sale'
              ? 'For Sale'
              : property.category === 'for-rent'
              ? 'For Rent'
              : property.category === 'short-let'
              ? 'Short Let'
              : 'Joint Venture'}
          </span>
          {property.isVerified && (
            <span className="bg-emerald-950/85 backdrop-blur-xs text-emerald-300 text-[11px] font-medium px-2 py-1 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Verified
            </span>
          )}
        </div>

        {/* Favorite & Compare Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(property.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
              isCompared
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-900/60 text-white hover:bg-slate-900/90'
            }`}
            title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {canFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(property.id);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-900/60 text-white hover:bg-slate-900/90'
              }`}
              title={isFavorite ? 'Remove from Saved' : 'Save Property'}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Bottom Image Strip: Location */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1 text-xs text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-medium truncate">{property.area}, {property.state}</span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & Period with Tabular Numerals */}
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {displayPrice}
              {property.rentalPeriod && (
                <span className="text-xs font-normal text-slate-500 font-sans ml-1">
                  /{property.rentalPeriod.replace('per ', '')}
                </span>
              )}
            </div>
            {property.serviceChargeNaira && (
              <span className="text-[11px] text-slate-500 font-mono">
                +₦{(property.serviceChargeNaira / 1000000).toFixed(1)}M serv.
              </span>
            )}
          </div>

          {/* Property Title */}
          <h3
            onClick={() => onSelectProperty(property)}
            className="text-sm sm:text-base font-semibold text-slate-900 hover:text-emerald-800 transition-colors line-clamp-2 cursor-pointer mb-2.5 leading-snug"
          >
            {property.title}
          </h3>

          {/* Zero-Pill Clean Inline Metadata with typographic separators */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-600 mb-3">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-800">{property.bedrooms}</span> Beds
              </span>
            )}
            {property.bathrooms > 0 && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800">{property.bathrooms}</span> Baths
                </span>
              </>
            )}
            {property.parkingSpaces > 0 && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800">{property.parkingSpaces}</span> Cars
                </span>
              </>
            )}
            {property.landSizeSqm && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="font-mono tabular-nums text-slate-700">{property.landSizeSqm} sqm</span>
              </>
            )}
          </div>

          {/* Title Document unboxed label */}
          <div className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Title:</span>
            <span className="font-medium text-slate-700 truncate">{property.titleDocument}</span>
          </div>
        </div>

        {/* Footer of Card: Agent details & Action CTAs */}
        <div className="pt-3 border-t border-slate-100 mt-auto">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <div className="truncate">
              <span className="font-medium text-slate-800 block truncate">{property.agent.name}</span>
              <span className="text-[11px] text-slate-400 truncate block">{property.agent.agency}</span>
            </div>
            <span className="text-[11px] text-slate-400 whitespace-nowrap ml-2">
              {property.postedDate}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
              title="Chat with Agent on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => onScheduleInspection(property)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Inspection</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
