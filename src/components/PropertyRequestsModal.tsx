'use client';

import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  MessageCircle,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  DollarSign,
  Search,
} from 'lucide-react';
import {
  PropertyRequest,
  formatNaira,
  formatUSD,
  NIGERIAN_STATES,
} from '@/lib/property-data';

interface PropertyRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: PropertyRequest[];
  onAddRequest: (req: PropertyRequest) => void;
  currency: 'NGN' | 'USD';
}

export function PropertyRequestsModal({
  isOpen,
  onClose,
  requests,
  onAddRequest,
  currency,
}: PropertyRequestsModalProps) {
  const [isPosting, setIsPosting] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState<'All' | 'Buy' | 'Rent' | 'Short Let' | 'Land'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState<'Buy' | 'Rent' | 'Short Let' | 'Land'>('Rent');
  const [propertyType, setPropertyType] = useState('Flat / Apartment');
  const [state, setState] = useState('Lagos');
  const [area, setArea] = useState('Lekki Phase 1');
  const [budgetNaira, setBudgetNaira] = useState('15000000');
  const [bedrooms, setBedrooms] = useState('3');
  const [requirements, setRequirements] = useState('');
  const [phone, setPhone] = useState('+234 803 123 4567');
  const [whatsapp, setWhatsapp] = useState('2348031234567');
  const [postedSuccess, setPostedSuccess] = useState(false);

  const filteredRequests = requests.filter((r) => {
    if (selectedPurpose !== 'All' && r.purpose !== selectedPurpose) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.preferredArea.toLowerCase().includes(q) ||
        r.preferredState.toLowerCase().includes(q) ||
        r.requirements.toLowerCase().includes(q) ||
        r.propertyType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !requirements || !phone) return;

    const newReq: PropertyRequest = {
      id: `req-${Date.now().toString().slice(-4)}`,
      seekerName: name,
      purpose,
      propertyType,
      preferredState: state,
      preferredArea: area,
      budgetNaira: Number(budgetNaira),
      bedrooms: Number(bedrooms),
      requirements,
      postedDate: 'Just now',
      seekerPhone: phone,
      seekerWhatsapp: whatsapp.replace(/\D/g, ''),
      status: 'Active',
    };

    onAddRequest(newReq);
    setPostedSuccess(true);
    setTimeout(() => {
      setPostedSuccess(false);
      setIsPosting(false);
      setName('');
      setRequirements('');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Property Seeker Requests & Matching Board
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Can&apos;t find what you are looking for? Post your custom property requirement or connect with direct buyers and tenants.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isPosting && (
              <button
                onClick={() => setIsPosting(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post a Request</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-4">
          {isPosting ? (
            /* Post a Request Form */
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm">
                  Post Your Property Requirement
                </h4>
                <button
                  onClick={() => setIsPosting(false)}
                  className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {postedSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                  <p className="font-bold text-slate-900 text-sm">Request Published!</p>
                  <p className="text-xs text-slate-600">
                    Verified agents covering {area}, {state} have been notified and will reach out with matching properties.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePostSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Arc. Tolu Adeyemi"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Purpose</label>
                      <select
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value as any)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium"
                      >
                        <option value="Buy">Buy Property</option>
                        <option value="Rent">Rent Property</option>
                        <option value="Short Let">Short Let</option>
                        <option value="Land">Buy Land Plot</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Property Type</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 4-Bed Terrace Duplex"
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">State</label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                      >
                        {NIGERIAN_STATES.filter((s) => s !== 'All States').map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Preferred Area</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lekki Phase 1 / Ikate"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Max Budget (₦)</label>
                      <input
                        type="number"
                        required
                        placeholder="15000000"
                        value={budgetNaira}
                        onChange={(e) => setBudgetNaira(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Bedrooms</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Specific Requirements & Features
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Must have 24/7 uninterrupted power, swimming pool, clean borehole water treatment, and spacious parking space for 3 cars."
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number (e.g. 23480...)</label>
                      <input
                        type="text"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsPosting(false)}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg cursor-pointer transition"
                    >
                      Publish Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Requests Feed */
            <>
              {/* Filter bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-semibold w-fit">
                  {(['All', 'Buy', 'Rent', 'Short Let', 'Land'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedPurpose(tab)}
                      className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                        selectedPurpose === tab
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter by area, state or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Requests List */}
              <div className="space-y-3">
                {filteredRequests.map((req) => {
                  const budgetFormatted =
                    currency === 'NGN'
                      ? formatNaira(req.budgetNaira)
                      : formatUSD(req.budgetNaira);

                  const matchMsg = encodeURIComponent(
                    `Hello ${req.seekerName}, I saw your property request on Nigeria Property Centre for a "${req.propertyType}" in ${req.preferredArea}, ${req.preferredState} (Budget: ₦${req.budgetNaira.toLocaleString()}). I am a verified agent with suitable options available. Can I send you pictures and details?`
                  );
                  const waUrl = `https://wa.me/${req.seekerWhatsapp}?text=${matchMsg}`;

                  return (
                    <div
                      key={req.id}
                      className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-emerald-300 rounded-xl p-4 transition shadow-xs space-y-2.5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider bg-emerald-100/70 px-2 py-0.5 rounded">
                              Looking to {req.purpose}
                            </span>
                            <span className="text-xs text-slate-400">·</span>
                            <span className="text-xs font-semibold text-slate-800">
                              {req.propertyType}
                            </span>
                            {req.bedrooms > 0 && (
                              <span className="text-xs text-slate-500">
                                ({req.bedrooms} Beds)
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                            <span className="font-medium text-slate-800">{req.preferredArea}</span>
                            <span>·</span>
                            <span>{req.preferredState}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-slate-400 block text-[10px] uppercase">Budget</span>
                          <span className="text-sm sm:text-base font-bold font-mono text-emerald-950 tabular-nums">
                            {budgetFormatted}
                            {req.purpose === 'Rent' && (
                              <span className="text-[11px] font-normal text-slate-500 font-sans">
                                /yr
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/80">
                        &ldquo;{req.requirements}&rdquo;
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-700">{req.seekerName}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3" />
                            {req.postedDate}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg text-xs transition"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Match on WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
