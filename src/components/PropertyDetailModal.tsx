'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  MapPin,
  Bed,
  Bath,
  Car,
  ShieldCheck,
  Check,
  MessageCircle,
  Phone,
  Calendar,
  Calculator,
  Sparkles,
  Share2,
  Heart,
  Loader2,
  FileText,
} from 'lucide-react';
import { Property, formatNaira, formatUSD } from '@/lib/property-data';
import { useAuth } from '@/contexts/AuthContext';

interface PropertyDetailModalProps {
  property: Property | null;
  currency: 'NGN' | 'USD';
  isFavorite: boolean;
  canFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onOpenJVModal?: () => void;
}

export function PropertyDetailModal({
  property,
  currency,
  isFavorite,
  canFavorite,
  onToggleFavorite,
  onClose,
  onOpenJVModal,
}: PropertyDetailModalProps) {
  const { user, scheduleInspection } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'inspection' | 'mortgage' | 'ai-valuation'>('inspection');

  // Inspection Booking Form state
  const [inspectionType, setInspectionType] = useState<'physical' | 'virtual'>('physical');
  const [inspectionDate, setInspectionDate] = useState('2026-10-25');
  const [inspectionTime, setInspectionTime] = useState('10:00 AM - 12:00 PM');
  const [buyerName, setBuyerName] = useState(user?.fullName || '');
  const [buyerPhone, setBuyerPhone] = useState(user?.phone || '');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || '');
  const [isBooked, setIsBooked] = useState(false);

  // Short-let stay booking state
  const [shortLetNights, setShortLetNights] = useState<number>(3);
  const [shortLetGuests, setShortLetGuests] = useState<number>(2);

  // Mortgage Calculator state
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTermYears, setLoanTermYears] = useState(15);
  const [interestRate, setInterestRate] = useState(19); // Typical Nigerian mortgage rate 18-21%

  // AI Valuation State
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  if (!property) return null;

  const displayPrice =
    currency === 'NGN'
      ? formatNaira(property.priceNaira)
      : formatUSD(property.priceNaira);

  // Mortgage calculation
  const principal = property.priceNaira * (1 - downPaymentPercent / 100);
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  const monthlyPaymentNaira =
    monthlyRate > 0
      ? (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      : principal / numberOfPayments;

  const handleBookInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone) return;
    setIsBooked(true);

    if (property) {
      await scheduleInspection({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocation: `${property.area}, ${property.state}`,
        preferredDate: inspectionDate,
        preferredTime: inspectionTime,
        type: inspectionType === 'virtual' ? 'VIRTUAL_WHATSAPP' : 'PHYSICAL',
        notes: `Contact: ${buyerName} (${buyerPhone})`,
      });
    }
  };

  const handleFetchAiValuation = async () => {
    setAiLoading(true);
    setAiReport(null);
    try {
      const res = await fetch('/api/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryType: 'valuation',
          propertyDetails: {
            propertyType: property.propertyType,
            state: property.state,
            area: property.area,
            bedrooms: property.bedrooms,
            titleDocument: property.titleDocument,
            price: property.priceNaira,
            features: property.amenities.join(', '),
          },
        }),
      });
      const data = await res.json();
      setAiReport(data.text || 'Analysis completed.');
    } catch (err) {
      console.error(err);
      setAiReport('Could not generate AI report at this time. Please retry.');
    } finally {
      setAiLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${property.agent.name}, I'm inquiring about "${property.title}" in ${property.area}, ${property.state} (₦${property.priceNaira.toLocaleString()}) listed on Nigeria Property Centre. Please share inspection availability.`
  );
  const whatsappUrl = `https://wa.me/${property.agent.whatsapp}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-900 text-white text-xs font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider">
              {property.category.replace('-', ' ')}
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Ref ID: <span className="font-mono text-slate-700">{property.id}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {canFavorite && (
              <button
                onClick={() => onToggleFavorite(property.id)}
                className="p-2 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                title={isFavorite ? 'Remove from saved properties' : 'Save to favorites'}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
              </button>
            )}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: property.title,
                    text: `Check out this listing on Nigeria Property Centre: ${property.title} in ${property.area}`,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Listing link copied to clipboard!');
                }
              }}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="overflow-y-auto p-5 sm:p-6 lg:p-8 space-y-8">
          {/* Main Hero & Gallery Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Gallery Column (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-900">
                <Image
                  src={property.images[activeImageIndex] || property.images[0] || '/images/hero_lekki_mansion_1792681047972.jpg'}
                  alt={property.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>

              {/* Thumbnails */}
              {property.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {property.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-emerald-700 shadow-sm'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Purchase & Price Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{property.area}, {property.state}</span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 leading-snug">
                  {property.title}
                </h2>

                <div className="text-2xl sm:text-3xl font-bold text-emerald-950 font-mono tabular-nums mb-3">
                  {displayPrice}
                  {property.rentalPeriod && (
                    <span className="text-xs font-normal text-slate-500 font-sans ml-1">
                      /{property.rentalPeriod.replace('per ', '')}
                    </span>
                  )}
                </div>

                {/* Key Spec Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 mb-4 bg-white p-3 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Type:</span>
                    <span className="font-semibold">{property.propertyType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Title Doc:</span>
                    <span className="font-semibold text-emerald-800 truncate block">
                      {property.titleDocument}
                    </span>
                  </div>
                  {property.bedrooms > 0 && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Bedrooms:</span>
                      <span className="font-semibold">{property.bedrooms} Beds ({property.bathrooms} Baths)</span>
                    </div>
                  )}
                  {property.landSizeSqm && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Land Size:</span>
                      <span className="font-semibold font-mono">{property.landSizeSqm} SQM</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Agent Contact Card */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{property.agent.name}</p>
                    <p className="text-[11px] text-slate-500">{property.agent.agency}</p>
                  </div>
                  {property.agent.verifiedAgent && (
                    <span className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Agent
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors border border-emerald-300"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${property.agent.phone}`}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg transition-colors border border-slate-300"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Agent</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Amenities */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-slate-200">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Property Description</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">Features & Amenities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {property.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nigerian Legal & Title Advisory Notice */}
              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-bold text-emerald-950 mb-1">
                  <FileText className="w-4 h-4 text-emerald-800" />
                  <span>Title Verification Advice for this Listing</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  This property is listed with <strong className="text-slate-800">{property.titleDocument}</strong>.
                  Before releasing funds, we advise conducting a title search at the State Lands Bureau (e.g. Alausa Lands Bureau for Lagos or AGIS for Abuja) to confirm registered survey coordinates and verify the Governor’s Consent status.
                </p>
              </div>
            </div>

            {/* Interactive Module Tabs: Inspection / Mortgage / AI Valuation (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              {/* Tab Switcher */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg mb-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('inspection')}
                  className={`flex-1 py-1.5 px-2 rounded-md transition-all cursor-pointer ${
                    activeTab === 'inspection'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Book Inspection
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('mortgage')}
                  className={`flex-1 py-1.5 px-2 rounded-md transition-all cursor-pointer ${
                    activeTab === 'mortgage'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {property.category === 'short-let'
                    ? 'Stay & Rates'
                    : property.category === 'joint-venture'
                    ? 'JV Feasibility'
                    : 'Mortgage Calc'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('ai-valuation');
                    if (!aiReport && !aiLoading) handleFetchAiValuation();
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'ai-valuation'
                      ? 'bg-white text-emerald-800 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-emerald-700" />
                  AI Advice
                </button>
              </div>

              {/* Tab 1: Book Inspection */}
              {activeTab === 'inspection' && (
                <div>
                  {isBooked ? (
                    <div className="text-center py-6 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
                        <Check className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900">Inspection Scheduled!</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Thank you, <strong className="text-slate-800">{buyerName}</strong>. Your {inspectionType} inspection request for{' '}
                        <strong className="text-slate-800">{inspectionDate}</strong> ({inspectionTime}) has been sent directly to{' '}
                        <strong className="text-slate-800">{property.agent.name}</strong>. The agent will call or WhatsApp you shortly.
                      </p>
                      <button
                        onClick={() => setIsBooked(false)}
                        className="text-xs font-semibold text-emerald-800 hover:underline pt-2 cursor-pointer"
                      >
                        Book another time
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleBookInspection} className="space-y-3 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Inspection Mode</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setInspectionType('physical')}
                            className={`py-2 px-3 rounded-lg border text-center font-medium cursor-pointer ${
                              inspectionType === 'physical'
                                ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                                : 'border-slate-200 text-slate-600'
                            }`}
                          >
                            Physical On-Site
                          </button>
                          <button
                            type="button"
                            onClick={() => setInspectionType('virtual')}
                            className={`py-2 px-3 rounded-lg border text-center font-medium cursor-pointer ${
                              inspectionType === 'virtual'
                                ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                                : 'border-slate-200 text-slate-600'
                            }`}
                          >
                            Virtual Video Tour
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Date</label>
                          <input
                            type="date"
                            value={inspectionDate}
                            onChange={(e) => setInspectionDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                          <select
                            value={inspectionTime}
                            onChange={(e) => setInspectionTime(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
                          >
                            <option>10:00 AM - 12:00 PM</option>
                            <option>12:00 PM - 02:00 PM</option>
                            <option>02:00 PM - 04:00 PM</option>
                            <option>04:00 PM - 06:00 PM</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Tolu Adebayo"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">WhatsApp / Phone Number</label>
                        <input
                          type="tel"
                          placeholder="e.g. 0803 123 4567"
                          value={buyerPhone}
                          onChange={(e) => setBuyerPhone(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Email (Optional)</label>
                        <input
                          type="email"
                          placeholder="tolu@example.com"
                          value={buyerEmail}
                          onChange={(e) => setBuyerEmail(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg transition-colors cursor-pointer text-xs mt-2"
                      >
                        Confirm Free Inspection
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Tab 2: Mortgage / Short-Let / JV Custom Module */}
              {activeTab === 'mortgage' && (
                <div>
                  {property.category === 'short-let' ? (
                    <div className="space-y-3 text-xs">
                      <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Daily Rate:</span>
                          <span className="text-base font-bold font-mono text-emerald-900">
                            {formatNaira(property.priceNaira)} / night
                          </span>
                        </div>
                        <div className="text-[11px] text-emerald-800 mt-1 flex items-center gap-1 font-medium">
                          ⚡ Guaranteed 24/7 Electricity · High-Speed WiFi · Daily Housekeeping
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold text-slate-700 mb-1">
                          <span>Duration of Stay:</span>
                          <span className="font-mono text-slate-900">{shortLetNights} Nights</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="30"
                          step="1"
                          value={shortLetNights}
                          onChange={(e) => setShortLetNights(Number(e.target.value))}
                          className="w-full accent-emerald-800 cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold text-slate-700 mb-1">
                          <span>Guests:</span>
                          <span className="font-mono text-slate-900">{shortLetGuests} Persons</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="6"
                          step="1"
                          value={shortLetGuests}
                          onChange={(e) => setShortLetGuests(Number(e.target.value))}
                          className="w-full accent-emerald-800 cursor-pointer"
                        />
                      </div>

                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 text-[11px]">
                        <div className="flex justify-between text-slate-600">
                          <span>Accommodation ({shortLetNights} nights)</span>
                          <span className="font-mono font-semibold text-slate-800">
                            {formatNaira(property.priceNaira * shortLetNights)}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Refundable Caution Deposit</span>
                          <span className="font-mono font-semibold text-slate-800">₦50,000</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Cleaning & Service Fee</span>
                          <span className="font-mono font-semibold text-slate-800">₦10,000</span>
                        </div>
                        <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-xs text-slate-900">
                          <span>Total Payable</span>
                          <span className="font-mono text-emerald-800">
                            {formatNaira(property.priceNaira * shortLetNights + 60000)}
                          </span>
                        </div>
                      </div>

                      <a
                        href={`https://wa.me/${property.agent.whatsapp}?text=${encodeURIComponent(
                          `Hello ${property.agent.name}, I would like to reserve the short let: "${property.title}" in ${property.area} for ${shortLetNights} nights (${shortLetGuests} guests). Estimated Total: ${formatNaira(property.priceNaira * shortLetNights + 60000)}. Please confirm dates availability.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg transition-colors cursor-pointer text-xs flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Reserve Dates on WhatsApp</span>
                      </a>
                    </div>
                  ) : property.category === 'joint-venture' ? (
                    <div className="space-y-3 text-xs">
                      <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200">
                        <span className="text-slate-600 block text-[11px]">JV Proposal Details:</span>
                        <div className="text-base font-bold font-mono text-emerald-950 mt-0.5">
                          50:50 Sharing Ratio
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1">
                          Landowner contributes {property.landSizeSqm?.toLocaleString() || '2,500'} SQM with clean title.
                        </div>
                      </div>

                      <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Land Title:</span>
                          <span className="font-semibold text-slate-900">{property.titleDocument}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Land Size:</span>
                          <span className="font-mono font-semibold text-slate-900">{property.landSizeSqm || 2500} SQM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Required Premium:</span>
                          <span className="font-mono font-bold text-emerald-800">₦350,000,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Facilitators Fee:</span>
                          <span className="font-mono font-semibold text-slate-900">10%</span>
                        </div>
                      </div>

                      {onOpenJVModal && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenJVModal();
                          }}
                          className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5"
                        >
                          <span>Open Full JV Feasibility Model</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">Estimated Monthly Repayment:</span>
                        <span className="text-xl font-bold font-mono text-emerald-900 tabular-nums">
                          {formatNaira(Math.round(monthlyPaymentNaira))}
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          Based on {loanTermYears} yrs at {interestRate}% p.a.
                        </span>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold text-slate-700 mb-1">
                          <span>Down Payment: {downPaymentPercent}%</span>
                          <span className="font-mono text-slate-900">
                            {formatNaira(Math.round((property.priceNaira * downPaymentPercent) / 100))}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="50"
                          step="5"
                          value={downPaymentPercent}
                          onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                          className="w-full accent-emerald-800 cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold text-slate-700 mb-1">
                          <span>Loan Term: {loanTermYears} Years</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="25"
                          step="1"
                          value={loanTermYears}
                          onChange={(e) => setLoanTermYears(Number(e.target.value))}
                          className="w-full accent-emerald-800 cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold text-slate-700 mb-1">
                          <span>Annual Interest Rate: {interestRate}%</span>
                          <span className="text-[11px] text-slate-400">Typical NG Commercial Rate</span>
                        </div>
                        <input
                          type="range"
                          min="12"
                          max="28"
                          step="0.5"
                          value={interestRate}
                          onChange={(e) => setInterestRate(Number(e.target.value))}
                          className="w-full accent-emerald-800 cursor-pointer"
                        />
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                        <p>
                          *Loan availability is subject to applicant&apos;s credit score and primary mortgage institution terms in Nigeria (e.g. NMRC, Federal Mortgage Bank of Nigeria NHF).
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: AI Valuation & Due Diligence */}
              {activeTab === 'ai-valuation' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      AI Valuation & Title Insight
                    </span>
                    <button
                      onClick={handleFetchAiValuation}
                      disabled={aiLoading}
                      className="text-emerald-800 font-semibold hover:underline text-[11px] cursor-pointer"
                    >
                      {aiLoading ? 'Analyzing...' : 'Refresh'}
                    </button>
                  </div>

                  {aiLoading ? (
                    <div className="py-8 text-center text-slate-500 space-y-2">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-700" />
                      <p>Consulting Nigerian real estate market index for {property.area}...</p>
                    </div>
                  ) : aiReport ? (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 text-xs leading-relaxed max-h-60 overflow-y-auto space-y-2 prose-xs">
                      <div className="whitespace-pre-line">{aiReport}</div>
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <button
                        onClick={handleFetchAiValuation}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold cursor-pointer"
                      >
                        Generate Market Analysis
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
