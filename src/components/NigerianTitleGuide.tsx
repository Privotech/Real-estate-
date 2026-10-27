'use client';

import React, { useState } from 'react';
import { ShieldCheck, BookOpen, AlertCircle, FileCheck, CheckCircle } from 'lucide-react';

export function NigerianTitleGuide() {
  const [activeTab, setActiveTab] = useState<'titles' | 'checklist'>('titles');

  const titles = [
    {
      name: 'Certificate of Occupancy (C of O)',
      risk: 'Highest Security (Very Low Risk)',
      description:
        'Issued directly by the State Governor under the Land Use Act 1978. It confirms the owner holds a 99-year leasehold directly from the government. It is the premier title in Nigeria.',
      verification: 'Verified directly at State Ministry of Lands & Survey (e.g. Alausa, Ikeja).',
    },
    {
      name: "Governor's Consent",
      risk: 'Legal Requirement for Resale (Low Risk)',
      description:
        'When a property that already has a C of O or Gazette is sold to a new buyer, the Land Use Act requires the State Governor to formally consent to the transaction. Without it, legal title has not transferred.',
      verification: 'Stamped and registered at the Lands Registry with volume and page numbers.',
    },
    {
      name: 'Government Gazette & Excision',
      risk: 'Approved Community Excision (Low Risk)',
      description:
        'An official record where the state government excises a parcel of land from global government acquisition and returns it legally to ancestral or customary landowners. A Gazette is secure proof of legal title.',
      verification: 'Checked by matching coordinates in the Gazette notice against the Surveyor-General’s chart.',
    },
    {
      name: 'Deed of Assignment & Registered Survey',
      risk: 'Root of Title Dependent (Moderate Risk)',
      description:
        'A legal deed recording the transfer between seller and buyer, attached to a registered survey with unique beacon coordinates. Its validity depends entirely on the seller having genuine root of title.',
      verification: 'Requires charting at the Office of the Surveyor-General to ensure land is not committed.',
    },
  ];

  return (
    <section className="bg-slate-100/70 border-y border-slate-200 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Buyer Due Diligence Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Understanding Nigerian Property Titles & Land Laws
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Buying or renting real estate in Nigeria requires thorough verification under the Land Use Act of 1978. Here is your definitive title guide.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg w-fit mb-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('titles')}
            className={`px-4 py-2 rounded-md transition cursor-pointer ${
              activeTab === 'titles' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Major Title Documents
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-2 rounded-md transition cursor-pointer ${
              activeTab === 'checklist' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            5-Step Land Verification Checklist
          </button>
        </div>

        {activeTab === 'titles' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {titles.map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-slate-900 text-base">{t.name}</h3>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 shrink-0">
                      {t.risk}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{t.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <strong className="text-slate-700">Verification Process:</strong> {t.verification}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              The Safe Real Estate Acquisition Protocol in Nigeria
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <h4 className="font-bold text-slate-900">Physical Site Visit</h4>
                <p className="text-slate-600 leading-normal">
                  Inspect the physical beacons, boundaries, neighborhood, drainage, and security.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <h4 className="font-bold text-slate-900">Coordinate Charting</h4>
                <p className="text-slate-600 leading-normal">
                  Obtain survey plan and take coordinates to Surveyor-General Office to check for government acquisition.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <h4 className="font-bold text-slate-900">Lands Registry Search</h4>
                <p className="text-slate-600 leading-normal">
                  Conduct official search at Alausa (Lagos) or AGIS (Abuja) to confirm registered encumbrances or court injunctions.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                  4
                </span>
                <h4 className="font-bold text-slate-900">Legal Deed Execution</h4>
                <p className="text-slate-600 leading-normal">
                  Engage a verified Nigerian property lawyer to draft the Contract of Sale and Deed of Assignment.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                  5
                </span>
                <h4 className="font-bold text-slate-900">Governor&apos;s Consent Filing</h4>
                <p className="text-slate-600 leading-normal">
                  Submit the executed deed to the state government to obtain official Governor&apos;s Consent and stamp duty.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
