'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Check, Upload, Building, MapPin, DollarSign, Bed, ShieldCheck, CheckCircle2 } from 'lucide-react';
import {
  Property,
  NIGERIAN_STATES,
  POPULAR_LOCATIONS_BY_STATE,
  PROPERTY_TYPES,
  TITLE_DOCUMENTS,
} from '@/lib/property-data';
import { useAuth } from '@/contexts/AuthContext';

interface PostPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty: (newProp: Property) => void;
}

export function PostPropertyModal({
  isOpen,
  onClose,
  onAddProperty,
}: PostPropertyModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'for-sale' | 'for-rent' | 'short-let' | 'joint-venture'>('for-sale');
  const [propertyType, setPropertyType] = useState<Property['propertyType']>('Detached Duplex');
  const [priceNaira, setPriceNaira] = useState<string>('250000000');
  const [rentalPeriod, setRentalPeriod] = useState<'per year' | 'per day' | 'per month'>('per year');
  const [state, setState] = useState<'Lagos' | 'Abuja (FCT)' | 'Rivers' | 'Oyo' | 'Ogun' | 'Delta'>('Lagos');
  const [area, setArea] = useState('Lekki Phase 1');
  const [address, setAddress] = useState('');
  const [bedrooms, setBedrooms] = useState(4);
  const [bathrooms, setBathrooms] = useState(4);
  const [parkingSpaces, setParkingSpaces] = useState(3);
  const [landSizeSqm, setLandSizeSqm] = useState(500);
  const [titleDocument, setTitleDocument] = useState<Property['titleDocument']>('Certificate of Occupancy (C of O)');
  const [description, setDescription] = useState('');
  const [agentName, setAgentName] = useState(user?.fullName || 'Kolawole Sanusi');
  const [agency, setAgency] = useState(user?.agencyName || 'Sanusi Real Estate Ltd');
  const [phone, setPhone] = useState(user?.phone || '+234 802 111 2233');
  const [whatsapp, setWhatsapp] = useState(
    user?.phone ? user.phone.replace(/[^0-9]/g, '') : '2348021112233'
  );
  const [selectedImage, setSelectedImage] = useState('/images/hero_lekki_mansion_1792681047972.jpg');
  const [isSuccess, setIsSuccess] = useState(false);

  // Selected Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    '24/7 Electricity / Dual Generators',
    'Fitted Kitchen with Heat Extractor & Oven',
    'Private Swimming Pool',
    '1-Room Boys Quarter (BQ)',
    'Access Controlled Gated Estate',
  ]);

  const allAmenitiesOptions = [
    '24/7 Electricity / Dual Generators',
    'Private Swimming Pool',
    'Fitted Kitchen with Heat Extractor & Oven',
    '1-Room Boys Quarter (BQ)',
    '2-Room Boys Quarter (BQ)',
    'Access Controlled Gated Estate',
    'Smart Home Automation',
    'CCTV & Video Door Bell',
    'Industrial Water Treatment Plant',
    'Dedicated Solar Inverter Setup',
    'Gymnasium',
    'Private Elevator',
    'Lagoon / Ocean View',
  ];

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !priceNaira || !address) return;

    const newProperty: Property = {
      id: `npc-user-${Date.now().toString().slice(-4)}`,
      title,
      category,
      propertyType,
      priceNaira: Number(priceNaira),
      rentalPeriod: category === 'for-rent' ? rentalPeriod : category === 'short-let' ? 'per day' : undefined,
      state,
      area,
      address,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      toilets: Number(bathrooms),
      parkingSpaces: Number(parkingSpaces),
      landSizeSqm: Number(landSizeSqm),
      titleDocument,
      isVerified: true,
      featured: true,
      description:
        description ||
        `Newly listed ${bedrooms}-bedroom ${propertyType} in ${area}, ${state}. Features modern architecture, spacious interiors, fully fitted kitchen, and excellent road network.`,
      images: [selectedImage, '/images/banana_island_terrace_1792681049395.jpg'],
      amenities: selectedAmenities,
      agent: {
        name: agentName,
        agency,
        phone,
        whatsapp: whatsapp.replace(/\D/g, ''),
        verifiedAgent: true,
        rating: 5.0,
        listingsCount: 12,
      },
      postedDate: 'Just now',
    };

    onAddProperty(newProperty);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              List Your Property on Nigeria Property Centre
            </h3>
            <p className="text-xs text-slate-500">
              Free listing for verified owners, real estate agents and developers.
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
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Property Successfully Listed!</h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your property has been verified and published to Nigeria Property Centre. Buyers and tenants can now view and contact you directly via WhatsApp.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
            {/* Title */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Property Headline / Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Luxurious 4 Bedroom Semi-Detached Duplex with Swimming Pool"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm"
              />
            </div>

            {/* Category & Property Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Listing Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium"
                >
                  <option value="for-sale">For Sale</option>
                  <option value="for-rent">For Rent</option>
                  <option value="short-let">Short Let</option>
                  <option value="joint-venture">Joint Venture</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium"
                >
                  {PROPERTY_TYPES.filter((t) => t !== 'All Types').map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Rental Period */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Price in Naira (₦) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="250000000"
                  value={priceNaira}
                  onChange={(e) => setPriceNaira(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-sm"
                />
              </div>

              {category === 'for-rent' ? (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rental Period</label>
                  <select
                    value={rentalPeriod}
                    onChange={(e) => setRentalPeriod(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium"
                  >
                    <option value="per year">Per Year</option>
                    <option value="per month">Per Month</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Land Size (SQM)</label>
                  <input
                    type="number"
                    value={landSizeSqm}
                    onChange={(e) => setLandSizeSqm(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono"
                  />
                </div>
              )}
            </div>

            {/* State & Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">State</label>
                <select
                  value={state}
                  onChange={(e) => {
                    const newState = e.target.value as any;
                    setState(newState);
                    const defaultArea = POPULAR_LOCATIONS_BY_STATE[newState]?.[1] || 'Central Area';
                    setArea(defaultArea);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium"
                >
                  {NIGERIAN_STATES.filter((s) => s !== 'All States').map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Neighborhood / Area</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lekki Phase 1, Maitama, Old GRA"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium"
                />
              </div>
            </div>

            {/* Specific Address */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                required
                placeholder="e.g. Admiralty Way, Off Freedom Way, Lekki Phase 1, Lagos"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>

            {/* Beds, Baths, Parking, Title */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Parking Spaces</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={parkingSpaces}
                  onChange={(e) => setParkingSpaces(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title Document</label>
                <select
                  value={titleDocument}
                  onChange={(e) => setTitleDocument(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-2 text-slate-900 text-xs truncate"
                >
                  {TITLE_DOCUMENTS.filter((d) => d !== 'All Titles').map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Photo Selection */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Featured Photo</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'lekki', url: '/images/hero_lekki_mansion_1792681047972.jpg', label: 'Lekki Duplex' },
                  { id: 'banana', url: '/images/banana_island_terrace_1792681049395.jpg', label: 'Banana Island Terrace' },
                  { id: 'abuja', url: '/images/abuja_maitama_villa_1792681049601.jpg', label: 'Maitama Villa' },
                  { id: 'penthouse', url: '/images/ikoyi_waterfront_penthouse_1792681048808.jpg', label: 'Ikoyi Penthouse' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedImage(item.url)}
                    className={`relative aspect-4/3 rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                      selectedImage === item.url ? 'border-emerald-700 ring-2 ring-emerald-500' : 'border-transparent opacity-75'
                    }`}
                  >
                    <Image src={item.url} alt={item.label} fill sizes="25vw" className="object-cover" />
                    <span className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded truncate">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Checkboxes */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Amenities & Facilities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {allAmenitiesOptions.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition cursor-pointer text-[11px] ${
                      selectedAmenities.includes(amenity)
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-medium'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Check
                      className={`w-3 h-3 shrink-0 ${
                        selectedAmenities.includes(amenity) ? 'text-emerald-700' : 'opacity-20'
                      }`}
                    />
                    <span className="truncate">{amenity}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Agent / Contact details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900">Your Contact Details (For Buyer Inquiries)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Agency / Company Name</label>
                  <input
                    type="text"
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">WhatsApp Number (e.g. 23480...)</label>
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold shadow-xs transition cursor-pointer"
              >
                Publish Listing Now
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
