'use client';

import React, { useState, useMemo } from 'react';
import {
  INITIAL_PROPERTIES,
  INITIAL_REQUESTS,
  Property,
  PropertyRequest,
} from '@/lib/property-data';
import { Navbar } from '@/components/Navbar';
import { HeroSearch } from '@/components/HeroSearch';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyDetailModal } from '@/components/PropertyDetailModal';
import { PostPropertyModal } from '@/components/PostPropertyModal';
import { AiAdvisorModal } from '@/components/AiAdvisorModal';
import { CompareModal } from '@/components/CompareModal';
import { FavoritesDrawer } from '@/components/FavoritesDrawer';
import { NigerianTitleGuide } from '@/components/NigerianTitleGuide';
import { MarketTrends } from '@/components/MarketTrends';
import { PropertyRequestsModal } from '@/components/PropertyRequestsModal';
import { ClosingCostCalculatorModal } from '@/components/ClosingCostCalculatorModal';
import { AgentDirectoryModal } from '@/components/AgentDirectoryModal';
import { Footer } from '@/components/Footer';
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  ArrowUpDown,
  SearchX,
  PlusCircle,
  TrendingUp,
  Calculator,
  Users,
} from 'lucide-react';

export default function HomePage() {
  // Master Property List
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);

  // Master Seeker Requests List
  const [requests, setRequests] = useState<PropertyRequest[]>(INITIAL_REQUESTS);

  // Currency selection: NGN vs USD
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');

  // Search & Filter State
  const [category, setCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');
  const [selectedType, setSelectedType] = useState<string>('All Types');
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>('any');
  const [selectedTitle, setSelectedTitle] = useState<string>('All Titles');
  const [maxPrice, setMaxPrice] = useState<number>(1000000000);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [sortBy, setSortBy] = useState<
    'featured' | 'price-low' | 'price-high' | 'beds-high' | 'newest'
  >('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // Modals & Drawers
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState<boolean>(false);
  const [isClosingCalcOpen, setIsClosingCalcOpen] = useState<boolean>(false);
  const [isAgentDirectoryOpen, setIsAgentDirectoryOpen] = useState<boolean>(false);

  // Favorites & Compare IDs
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['npc-lekki-001']);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle Compare
  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 properties at a time.');
        return prev;
      }
      return [...prev, id];
    });
  };

  // Add new property listing
  const handleAddProperty = (newProp: Property) => {
    setProperties((prev) => [newProp, ...prev]);
  };

  // Add new seeker request
  const handleAddRequest = (newReq: PropertyRequest) => {
    setRequests((prev) => [newReq, ...prev]);
  };

  // Filter and Sort properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        // Category check
        if (category === 'land') {
          if (p.propertyType !== 'Residential Land' && p.propertyType !== 'Commercial Land') {
            return false;
          }
        } else if (category !== 'all' && p.category !== category) {
          return false;
        }

        // State check
        if (selectedState !== 'All States' && p.state !== selectedState) {
          return false;
        }

        // Area check
        if (
          selectedArea !== 'All Areas' &&
          selectedArea !== 'All Lagos' &&
          selectedArea !== 'All Abuja' &&
          selectedArea !== 'All Rivers' &&
          selectedArea !== 'All Oyo' &&
          selectedArea !== 'All Ogun' &&
          selectedArea !== 'All Delta' &&
          !p.area.toLowerCase().includes(selectedArea.toLowerCase())
        ) {
          return false;
        }

        // Property Type check
        if (selectedType !== 'All Types' && p.propertyType !== selectedType) {
          return false;
        }

        // Bedrooms check
        if (selectedBedrooms !== 'any') {
          const targetBeds = parseInt(selectedBedrooms, 10);
          if (targetBeds === 5) {
            if (p.bedrooms < 5) return false;
          } else if (p.bedrooms !== targetBeds) {
            return false;
          }
        }

        // Title Document check
        if (selectedTitle !== 'All Titles' && p.titleDocument !== selectedTitle) {
          return false;
        }

        // Max Price check
        if (p.priceNaira > maxPrice) {
          return false;
        }

        // Keyword search
        if (searchKeyword.trim()) {
          const kw = searchKeyword.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(kw);
          const matchDesc = p.description.toLowerCase().includes(kw);
          const matchArea = p.area.toLowerCase().includes(kw);
          const matchState = p.state.toLowerCase().includes(kw);
          const matchAmenities = p.amenities.some((a) => a.toLowerCase().includes(kw));
          if (!matchTitle && !matchDesc && !matchArea && !matchState && !matchAmenities) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.priceNaira - b.priceNaira;
        if (sortBy === 'price-high') return b.priceNaira - a.priceNaira;
        if (sortBy === 'beds-high') return b.bedrooms - a.bedrooms;
        if (sortBy === 'newest') return a.id.localeCompare(b.id);
        // Featured default
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    properties,
    category,
    selectedState,
    selectedArea,
    selectedType,
    selectedBedrooms,
    selectedTitle,
    maxPrice,
    searchKeyword,
    sortBy,
  ]);

  const favoritesList = useMemo(() => {
    return properties.filter((p) => favoriteIds.includes(p.id));
  }, [properties, favoriteIds]);

  const comparedList = useMemo(() => {
    return properties.filter((p) => compareIds.includes(p.id));
  }, [properties, compareIds]);

  const resetFilters = () => {
    setCategory('all');
    setSelectedState('All States');
    setSelectedArea('All Areas');
    setSelectedType('All Types');
    setSelectedBedrooms('any');
    setSelectedTitle('All Titles');
    setMaxPrice(1000000000);
    setSearchKeyword('');
  };

  const scrollToTrends = () => {
    const el = document.getElementById('market-trends-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract (1 Row, 3 Zones) */}
      <Navbar
        activeTab={category}
        setActiveTab={(cat) => setCategory(cat)}
        currency={currency}
        setCurrency={setCurrency}
        favoritesCount={favoriteIds.length}
        compareCount={compareIds.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onOpenPostProperty={() => setIsPostModalOpen(true)}
        onOpenAiAdvisor={() => setIsAiModalOpen(true)}
        onOpenRequests={() => setIsRequestsModalOpen(true)}
        onOpenClosingCalc={() => setIsClosingCalcOpen(true)}
        onOpenAgentDirectory={() => setIsAgentDirectoryOpen(true)}
        onScrollToTrends={scrollToTrends}
      />

      <main className="flex-1">
        {/* Section 1: Hero Section & Nigerian Search Console */}
        <HeroSearch
          category={category}
          setCategory={setCategory}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedBedrooms={selectedBedrooms}
          setSelectedBedrooms={setSelectedBedrooms}
          selectedTitle={selectedTitle}
          setSelectedTitle={setSelectedTitle}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          onSearch={() => {
            const resultsElement = document.getElementById('listings-catalog');
            if (resultsElement) {
              resultsElement.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        {/* Section 2: Property Listings Catalog */}
        <section id="listings-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          {/* Catalog Header & View Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                <span>Properties in Nigeria</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-emerald-800 font-bold">{filteredProperties.length} Available</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {category === 'all'
                  ? 'All Verified Real Estate Listings'
                  : category === 'for-sale'
                  ? 'Houses & Properties for Sale'
                  : category === 'for-rent'
                  ? 'Flats & Apartments for Rent'
                  : category === 'short-let'
                  ? 'Holiday & Business Short Let Apartments'
                  : category === 'land'
                  ? 'Commercial & Residential Land Plots'
                  : 'Joint Venture Opportunities'}
                {selectedState !== 'All States' && ` in ${selectedState}`}
              </h2>
            </div>

            {/* Sort & View Mode Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="beds-high">Bedrooms: Most First</option>
                  <option value="newest">Recently Listed</option>
                </select>
              </div>

              {/* Reset filter button if active */}
              {(selectedState !== 'All States' ||
                selectedArea !== 'All Areas' ||
                selectedType !== 'All Types' ||
                selectedBedrooms !== 'any' ||
                searchKeyword ||
                maxPrice < 1000000000) && (
                <button
                  onClick={resetFilters}
                  className="px-2.5 py-1.5 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 font-medium transition cursor-pointer"
                >
                  Clear Filters
                </button>
              )}

              {/* View Switcher */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    viewMode === 'compact' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Banner for Seeker Requests & Closing Fees */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setIsRequestsModalOpen(true)}
              className="bg-emerald-50 border border-emerald-200 hover:border-emerald-300 p-4 rounded-xl flex items-center justify-between cursor-pointer transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-800 text-white flex items-center justify-center shrink-0">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-emerald-900">
                    Property Seeker Board
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {requests.length} active buyer & tenant requests
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 underline">View</span>
            </div>

            <div
              onClick={() => setIsClosingCalcOpen(true)}
              className="bg-slate-100 border border-slate-200 hover:border-slate-300 p-4 rounded-xl flex items-center justify-between cursor-pointer transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-slate-900">
                    Closing Fees Calculator
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Governor&apos;s Consent, legal & stamp duty
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-800 underline">Calculate</span>
            </div>

            <div
              onClick={() => setIsAgentDirectoryOpen(true)}
              className="bg-slate-100 border border-slate-200 hover:border-slate-300 p-4 rounded-xl flex items-center justify-between cursor-pointer transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-slate-900">
                    Verified Agent Directory
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Direct WhatsApp & phone with vetted agents
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-800 underline">Browse</span>
            </div>
          </div>

          {/* Listings Grid */}
          {filteredProperties.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-white rounded-2xl border border-slate-200 mt-6">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <SearchX className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No matching properties found</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                We couldn&apos;t find any listings matching your specific criteria. Try adjusting your state, budget, or title filter.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                >
                  Reset All Filters
                </button>
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition cursor-pointer"
                >
                  Post This Property
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`mt-6 grid gap-6 sm:gap-7 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1 md:grid-cols-2'
              }`}
            >
              {filteredProperties.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  currency={currency}
                  isFavorite={favoriteIds.includes(prop.id)}
                  isCompared={compareIds.includes(prop.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleCompare={handleToggleCompare}
                  onSelectProperty={(p) => setSelectedProperty(p)}
                  onScheduleInspection={(p) => setSelectedProperty(p)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Section 3: Market Intelligence & Neighborhood Price Trends */}
        <div id="market-trends-section">
          <MarketTrends
            currency={currency}
            onConsultAi={(area) => {
              setIsAiModalOpen(true);
            }}
          />
        </div>

        {/* Section 4: Buyer Due Diligence & Nigerian Title Documentation Guide */}
        <NigerianTitleGuide />

        {/* Call to action for Agents & Property Owners */}
        <section className="bg-emerald-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Are you a Property Owner, Developer or Real Estate Agent?
              </h3>
              <p className="text-emerald-100 text-xs sm:text-sm">
                Reach over 2.5 million active home seekers, diaspora investors, and corporate tenants across Nigeria and worldwide.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="px-5 py-2.5 bg-white text-emerald-950 hover:bg-emerald-50 font-bold rounded-lg transition text-xs sm:text-sm cursor-pointer whitespace-nowrap shadow-xs"
              >
                Post Your Property Free
              </button>
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-800 text-white font-medium border border-emerald-600 rounded-lg transition text-xs sm:text-sm cursor-pointer whitespace-nowrap flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>AI Valuation Advisor</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setCategory(cat);
          const resultsElement = document.getElementById('listings-catalog');
          if (resultsElement) resultsElement.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAiAdvisor={() => setIsAiModalOpen(true)}
        onOpenPostProperty={() => setIsPostModalOpen(true)}
        onOpenRequests={() => setIsRequestsModalOpen(true)}
        onOpenClosingCalc={() => setIsClosingCalcOpen(true)}
        onOpenAgentDirectory={() => setIsAgentDirectoryOpen(true)}
        onScrollToTrends={scrollToTrends}
      />

      {/* Modals & Drawers */}
      <PropertyDetailModal
        property={selectedProperty}
        currency={currency}
        isFavorite={selectedProperty ? favoriteIds.includes(selectedProperty.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onClose={() => setSelectedProperty(null)}
      />

      <PostPropertyModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onAddProperty={handleAddProperty}
      />

      <AiAdvisorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      <PropertyRequestsModal
        isOpen={isRequestsModalOpen}
        onClose={() => setIsRequestsModalOpen(false)}
        requests={requests}
        onAddRequest={handleAddRequest}
        currency={currency}
      />

      <ClosingCostCalculatorModal
        isOpen={isClosingCalcOpen}
        onClose={() => setIsClosingCalcOpen(false)}
        currency={currency}
      />

      <AgentDirectoryModal
        isOpen={isAgentDirectoryOpen}
        onClose={() => setIsAgentDirectoryOpen(false)}
      />

      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        properties={comparedList}
        currency={currency}
        onRemove={(id) => setCompareIds((prev) => prev.filter((item) => item !== id))}
        onSelectProperty={(p) => setSelectedProperty(p)}
      />

      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favoritesList}
        currency={currency}
        onRemoveFavorite={handleToggleFavorite}
        onSelectProperty={(p) => setSelectedProperty(p)}
      />
    </div>
  );
}
