'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';

interface TitleSearchServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TitleSearchServiceModal({
  isOpen,
  onClose,
}: TitleSearchServiceModalProps) {
  const [propertyAddress, setPropertyAddress] = useState('Admiralty Way, Lekki Phase 1, Lagos');
  const [state, setState] = useState('Lagos State');
  const [titleType, setTitleType] = useState("Governor's Consent");
  const [beaconNumber, setBeaconNumber] = useState('NG/LK/2021/8841');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRunSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchResult(null);

    setTimeout(() => {
      setIsSearching(false);
      setSearchResult({
        status: 'CLEARED & VERIFIED',
        cadastralStatus: 'Free from Government Acquisition (Committed Reserve: NONE)',
        registryVolume: 'Vol. 1842, Page 29, Lands Registry Alausa',
        surveyCharting: 'Charted & Verified by Office of the Surveyor-General',
        encumbrances: 'No Lis Pendens / No Active Court Injunction Found',
        registeredOwner: 'Prestige Global Assets Holding Ltd',
        approvalYear: '2022',
        recommendation:
          'Legal Title is sound and verified for conveyance. Ensure Contract of Sale is stamped and Governor&apos;s Consent application is lodged within 30 days of closing.',
      });
    }, 1400);
  };

  const handleCopy = () => {
    if (!searchResult) return;
    const summary = `Nigeria Property Centre - Title Search Report
Address: ${propertyAddress} (${state})
Beacon No: ${beaconNumber}
Title Document: ${titleType}
Status: ${searchResult.status}
Cadastral Charting: ${searchResult.cadastralStatus}
Registry Record: ${searchResult.registryVolume}
Encumbrance Check: ${searchResult.encumbrances}
Registered Holder: ${searchResult.registeredOwner}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Cadastral Charting & Land Registry Title Search Service
              </h3>
              <p className="text-xs text-slate-300">
                Official verification protocol for Lagos Lands Bureau (Alausa) and Abuja AGIS.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 text-xs sm:text-sm">
          {/* Search Form */}
          <form onSubmit={handleRunSearch} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">State Registry</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium"
                >
                  <option value="Lagos State">Lagos State Lands Bureau (Alausa, Ikeja)</option>
                  <option value="Abuja (FCT)">Abuja Geographic Information Systems (AGIS)</option>
                  <option value="Rivers State">Rivers State Ministry of Lands (Port Harcourt)</option>
                  <option value="Oyo State">Oyo State Ministry of Lands (Ibadan)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title Document Claimed</label>
                <select
                  value={titleType}
                  onChange={(e) => setTitleType(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium"
                >
                  <option value="Certificate of Occupancy (C of O)">Certificate of Occupancy (C of O)</option>
                  <option value="Governor's Consent">Governor&apos;s Consent</option>
                  <option value="Federal C of O">Federal C of O</option>
                  <option value="Government Gazette & Excision">Government Gazette & Excision</option>
                  <option value="Registered Deed of Assignment">Registered Deed of Assignment</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property Street Address</label>
                <input
                  type="text"
                  required
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  placeholder="e.g. Admiralty Way, Lekki Phase 1"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Survey Beacon Coordinates / Plan No.</label>
                <input
                  type="text"
                  required
                  value={beaconNumber}
                  onChange={(e) => setBeaconNumber(e.target.value)}
                  placeholder="e.g. NG/LK/2021/8841"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isSearching}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold rounded-lg text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Querying Cadastral Database...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Run Title Verification Search</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results Display */}
          {searchResult && (
            <div className="bg-slate-50 border border-emerald-300 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Official Title Search Report
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Query Ref: {beaconNumber} · Stamped by Cadastral Registry
                    </p>
                  </div>
                </div>

                <span className="bg-emerald-100 text-emerald-900 font-bold text-xs px-2.5 py-1 rounded">
                  {searchResult.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[11px]">Government Acquisition Check:</span>
                  <span className="font-bold text-emerald-950 block mt-0.5">
                    {searchResult.cadastralStatus}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[11px]">Lands Bureau Registration Archive:</span>
                  <span className="font-bold text-slate-800 block mt-0.5">
                    {searchResult.registryVolume}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[11px]">Surveyor-General Coordinate Charting:</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">
                    {searchResult.surveyCharting}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[11px]">Court Injunctions & Lis Pendens:</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">
                    {searchResult.encumbrances}
                  </span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block mb-1">Legal Solicitor Summary:</span>
                <p className="text-slate-600 leading-relaxed">
                  Registered holder is confirmed as <strong className="text-slate-900">{searchResult.registeredOwner}</strong>. {searchResult.recommendation}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Report Copied' : 'Copy Search Report'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-4 py-1.5 bg-emerald-800 text-white font-semibold rounded-lg hover:bg-emerald-900 transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
