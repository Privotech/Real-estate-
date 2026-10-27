'use client';

import React, { useState } from 'react';
import {
  X,
  Building2,
  Calculator,
  ShieldCheck,
  FileText,
  DollarSign,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { formatNaira, formatUSD } from '@/lib/property-data';

interface JointVentureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: 'NGN' | 'USD';
}

export function JointVentureModal({
  isOpen,
  onClose,
  currency,
}: JointVentureModalProps) {
  const [activeTab, setActiveTab] = useState<'calculator' | 'milestones' | 'proposals' | 'legal'>('calculator');

  // JV Feasibility Calculator State
  const [landSizeSqm, setLandSizeSqm] = useState<number>(2000);
  const [landValuePerSqm, setLandValuePerSqm] = useState<number>(1200000); // ₦1.2m/sqm in Ikoyi/VI
  const [buildableFloors, setBuildableFloors] = useState<number>(8);
  const [constructionCostPerSqm, setConstructionCostPerSqm] = useState<number>(450000); // Luxury finishes
  const [projectedSalesPricePerSqm, setProjectedSalesPricePerSqm] = useState<number>(950000);
  const [premiumPaidToOwner, setPremiumPaidToOwner] = useState<number>(250000000); // ₦250m goodwill premium

  // Off-Plan Milestone Calculator State
  const [offPlanPurchasePrice, setOffPlanPurchasePrice] = useState<number>(195000000);
  const [projectedHandoverValue, setProjectedHandoverValue] = useState<number>(260000000);
  const [constructionDurationMonths, setConstructionDurationMonths] = useState<number>(24);

  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!isOpen) return null;

  // JV Calculations
  const totalLandValue = landSizeSqm * landValuePerSqm;
  // Floor area ratio (FAR) approx 0.6 footprint * buildableFloors
  const grossBuiltAreaSqm = landSizeSqm * 0.65 * buildableFloors;
  const totalConstructionCost = grossBuiltAreaSqm * constructionCostPerSqm;
  const grossDevelopmentValue = grossBuiltAreaSqm * projectedSalesPricePerSqm;

  const totalCapitalContribution = totalLandValue + totalConstructionCost;
  const landownerEquityPercent = Math.round((totalLandValue / totalCapitalContribution) * 100);
  const developerEquityPercent = 100 - landownerEquityPercent;

  const projectedGrossProfit = grossDevelopmentValue - (totalConstructionCost + premiumPaidToOwner);
  const developerNetProfit = (projectedGrossProfit * (developerEquityPercent / 100));
  const landownerTotalRealization = (grossDevelopmentValue * (landownerEquityPercent / 100)) + premiumPaidToOwner;

  // Off-Plan Milestones (Nigerian Standard Stage Payments)
  const milestoneStages = [
    {
      stage: '1. Initial Commitment',
      percent: 20,
      timing: 'Upon signing Contract of Sale',
      deliverable: 'Site fencing, survey charting, soil test & piling mobilization',
      amount: offPlanPurchasePrice * 0.2,
    },
    {
      stage: '2. Piling & Raft Foundation',
      percent: 20,
      timing: 'Month 4 - 6',
      deliverable: 'Deep piling cast, raft foundation slab cast & certified by COREN engineer',
      amount: offPlanPurchasePrice * 0.2,
    },
    {
      stage: '3. Carcass & Decking Slab',
      percent: 25,
      timing: 'Month 10 - 12',
      deliverable: 'Full structural concrete carcass, upper floor slabs & roof carcass erected',
      amount: offPlanPurchasePrice * 0.25,
    },
    {
      stage: '4. MEP & Internal Plastering',
      percent: 20,
      timing: 'Month 16 - 18',
      deliverable: 'Concealed plumbing, electrical wiring, POP ceilings, screeding & window glazing',
      amount: offPlanPurchasePrice * 0.2,
    },
    {
      stage: '5. Handover & Key Collection',
      percent: 15,
      timing: 'Month 24 (Completion)',
      deliverable: 'Final snagging clearance, sanitary fittings, substation power connection & Deed of Sublease',
      amount: offPlanPurchasePrice * 0.15,
    },
  ];

  const offPlanGain = projectedHandoverValue - offPlanPurchasePrice;
  const offPlanGainPercent = Math.round((offPlanGain / offPlanPurchasePrice) * 100);

  const handleCopySummary = () => {
    const text = `Nigeria Property Centre - JV Feasibility Model:
Land Size: ${landSizeSqm.toLocaleString()} SQM
Total Land Valuation: ${formatNaira(totalLandValue)}
Gross Built Area: ${Math.round(grossBuiltAreaSqm).toLocaleString()} SQM
Estimated Construction Cost: ${formatNaira(totalConstructionCost)}
Projected GDV: ${formatNaira(grossDevelopmentValue)}
Equitable Sharing: Landowner ${landownerEquityPercent}% / Developer ${developerEquityPercent}%
Goodwill Premium: ${formatNaira(premiumPaidToOwner)}`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                Joint Venture (JV) & Off-Plan Development Hub
              </h2>
              <p className="text-xs text-slate-500">
                Nigerian real estate equity models, milestone installment schedules & developer safeguards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls (Zero-pill functional segment) */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-white flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'calculator', label: 'JV Equity Sharing Model', icon: Calculator },
            { id: 'milestones', label: 'Off-Plan Milestones', icon: Calendar },
            { id: 'proposals', label: 'Active JV Opportunities', icon: Briefcase },
            { id: 'legal', label: 'Legal Safeguards & Contracts', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-emerald-800 text-emerald-800'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 space-y-6">
          {activeTab === 'calculator' && (
            <div className="space-y-6">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 leading-relaxed flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Nigerian Joint Venture (JV) Practice:</span> In prime locations (Ikoyi, Victoria Island, Lekki 1, Maitama Abuja), land is seldom sold outright. Instead, landowners contribute unencumbered land with clean title, while accredited developers finance 100% of construction. Equity and completed units are shared based on verified capital contribution ratios.
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Inputs Left */}
                <div className="lg:col-span-6 space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Project Parameters
                  </h3>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>Land Area (SQM)</span>
                      <span className="font-mono">{landSizeSqm.toLocaleString()} sqm</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="10000"
                      step="100"
                      value={landSizeSqm}
                      onChange={(e) => setLandSizeSqm(Number(e.target.value))}
                      className="w-full accent-emerald-800"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>Land Market Value / SQM</span>
                      <span className="font-mono">{formatNaira(landValuePerSqm)}</span>
                    </div>
                    <input
                      type="range"
                      min="150000"
                      max="2500000"
                      step="50000"
                      value={landValuePerSqm}
                      onChange={(e) => setLandValuePerSqm(Number(e.target.value))}
                      className="w-full accent-emerald-800"
                    />
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Benchmarks: Lekki 1 ~₦650k-₦800k | Ikoyi ~₦1.2m-₦1.8m | Maitama ~₦550k-₦900k
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>Zoned Floor Density</span>
                      <span className="font-mono">{buildableFloors} Floors</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="15"
                      step="1"
                      value={buildableFloors}
                      onChange={(e) => setBuildableFloors(Number(e.target.value))}
                      className="w-full accent-emerald-800"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>Construction Cost / SQM</span>
                      <span className="font-mono">{formatNaira(constructionCostPerSqm)}</span>
                    </div>
                    <input
                      type="range"
                      min="250000"
                      max="800000"
                      step="25000"
                      value={constructionCostPerSqm}
                      onChange={(e) => setConstructionCostPerSqm(Number(e.target.value))}
                      className="w-full accent-emerald-800"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>Projected Sales Price / SQM</span>
                      <span className="font-mono">{formatNaira(projectedSalesPricePerSqm)}</span>
                    </div>
                    <input
                      type="range"
                      min="500000"
                      max="2000000"
                      step="50000"
                      value={projectedSalesPricePerSqm}
                      onChange={(e) => setProjectedSalesPricePerSqm(Number(e.target.value))}
                      className="w-full accent-emerald-800"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>Goodwill Premium to Landowner</span>
                      <span className="font-mono">{formatNaira(premiumPaidToOwner)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000000000"
                      step="25000000"
                      value={premiumPaidToOwner}
                      onChange={(e) => setPremiumPaidToOwner(Number(e.target.value))}
                      className="w-full accent-emerald-800"
                    />
                  </div>
                </div>

                {/* Outputs Right */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="bg-emerald-950 text-white p-5 rounded-xl border border-emerald-900 shadow-md">
                    <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold mb-1">
                      Equitable JV Equity Allocation
                    </div>
                    <div className="flex items-center justify-between mt-3 pb-3 border-b border-emerald-800">
                      <div>
                        <span className="text-xs text-emerald-200">Landowner Share</span>
                        <div className="text-2xl font-bold font-mono text-white">
                          {landownerEquityPercent}%
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-emerald-200">Developer Share</span>
                        <div className="text-2xl font-bold font-mono text-emerald-300">
                          {developerEquityPercent}%
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 text-xs">
                      <div>
                        <span className="text-emerald-300">Land Valuation</span>
                        <div className="font-bold font-mono text-sm text-white">
                          {currency === 'NGN' ? formatNaira(totalLandValue) : formatUSD(totalLandValue)}
                        </div>
                      </div>
                      <div>
                        <span className="text-emerald-300">Estimated Build Cost</span>
                        <div className="font-bold font-mono text-sm text-white">
                          {currency === 'NGN' ? formatNaira(totalConstructionCost) : formatUSD(totalConstructionCost)}
                        </div>
                      </div>
                      <div>
                        <span className="text-emerald-300">Gross Dev. Value (GDV)</span>
                        <div className="font-bold font-mono text-sm text-emerald-400">
                          {currency === 'NGN' ? formatNaira(grossDevelopmentValue) : formatUSD(grossDevelopmentValue)}
                        </div>
                      </div>
                      <div>
                        <span className="text-emerald-300">Developer Net Profit</span>
                        <div className="font-bold font-mono text-sm text-emerald-400">
                          {currency === 'NGN' ? formatNaira(developerNetProfit) : formatUSD(developerNetProfit)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Realization Summary
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-600">Total Built Salable Area</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {Math.round(grossBuiltAreaSqm).toLocaleString()} sqm
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-600">Landowner Gross Realization</span>
                        <span className="font-mono font-semibold text-emerald-800">
                          {currency === 'NGN' ? formatNaira(landownerTotalRealization) : formatUSD(landownerTotalRealization)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-600">Upfront Goodwill Premium</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {currency === 'NGN' ? formatNaira(premiumPaidToOwner) : formatUSD(premiumPaidToOwner)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleCopySummary}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition cursor-pointer"
                    >
                      {copiedSummary ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSummary ? 'Feasibility Copied!' : 'Copy Feasibility Summary'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Off-Plan Purchase Capital Upside
                  </h3>
                  <p className="text-xs text-slate-500">
                    Entering at early foundation stage versus anticipated completion value
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-slate-500 block text-[11px]">Entry Price</span>
                    <span className="font-bold text-slate-900">{formatNaira(offPlanPurchasePrice)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[11px]">Completion Value</span>
                    <span className="font-bold text-emerald-800">{formatNaira(projectedHandoverValue)}</span>
                  </div>
                  <div className="bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-center font-bold">
                    +{offPlanGainPercent}% ROI
                  </div>
                </div>
              </div>

              {/* Milestone Schedule */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Milestone Stage</th>
                      <th className="py-3 px-3">Split</th>
                      <th className="py-3 px-4">Deliverable & COREN Certification</th>
                      <th className="py-3 px-4 text-right">Payment Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {milestoneStages.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                          {m.stage}
                          <span className="block text-[11px] text-slate-500 font-normal">{m.timing}</span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-800">
                          {m.percent}%
                        </td>
                        <td className="py-3 px-4 text-slate-600 leading-relaxed max-w-md">
                          {m.deliverable}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                          {currency === 'NGN' ? formatNaira(m.amount) : formatUSD(m.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  Nigerian Buyer Protection Advice for Off-Plan Purchases
                </div>
                <p className="leading-relaxed text-amber-800">
                  Always demand that your installment payments are deposited into a designated **Project Escrow Account** tied to written structural milestones verified by an independent registered engineer (COREN / NIQS), rather than directly into the developer&apos;s general corporate account.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'proposals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Vetted Joint Venture Proposals Seeking Reputable Developers
                </h3>
                <span className="text-xs text-slate-500">4 Active Mandates</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: '2,500 SQM Prime Waterfront Land',
                    location: 'Queens Drive, Ikoyi, Lagos',
                    titleDoc: 'Federal C of O',
                    sharing: '50:50 Sharing Ratio',
                    premium: '₦350,000,000 Premium',
                    proposal: 'Zoned for 10-storey luxury residential tower (20 penthouses/apartments)',
                    facilitator: 'Prestige Ikoyi Realty Partners',
                    whatsapp: '2348023456789',
                  },
                  {
                    name: '4,200 SQM Elevated Solid Table Land',
                    location: 'Katampe Extension, Abuja (FCT)',
                    titleDoc: 'AGIS Certificate of Occupancy',
                    sharing: '55:45 (Developer:Owner)',
                    premium: '₦180,000,000 Premium',
                    proposal: 'Suitable for gated estate of 14 units 5-bedroom smart duplexes',
                    facilitator: 'Apex Capital Realty Abuja',
                    whatsapp: '2348037894561',
                  },
                  {
                    name: '1,800 SQM Commercial Cornerpiece',
                    location: 'Off Admiralty Way, Lekki Phase 1, Lagos',
                    titleDoc: "Governor's Consent",
                    sharing: '50:50 Sharing Ratio',
                    premium: '₦200,000,000 Premium',
                    proposal: 'Mixed-use residential flats with ground floor commercial retail banking space',
                    facilitator: 'Prestige Lekki Realty Partners',
                    whatsapp: '2348034567890',
                  },
                  {
                    name: '3,000 SQM Industrial/Commercial Strip',
                    location: 'Peter Odili Road corridor, Port Harcourt',
                    titleDoc: 'Rivers State C of O',
                    sharing: '60:40 (Developer:Owner)',
                    premium: '₦80,000,000 Premium',
                    proposal: 'Executive serviced apartments for multinational oil and gas contractors',
                    facilitator: 'Garden City Realties Port Harcourt',
                    whatsapp: '2348065432109',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-700 transition">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 mb-1">
                        <span>{item.name}</span>
                        <span className="text-slate-500 font-normal">{item.location}</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                        {item.proposal}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium text-slate-600">
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-semibold">
                          {item.titleDoc}
                        </span>
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                          {item.sharing}
                        </span>
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-emerald-900 font-bold">
                          {item.premium}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">{item.facilitator}</span>
                      <a
                        href={`https://wa.me/${item.whatsapp}?text=${encodeURIComponent(`Hello, I'm inquiring about the JV proposal: "${item.name}" in ${item.location} on Nigeria Property Centre.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-900 transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Contact Facilitator</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'legal' && (
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <h3 className="text-sm font-bold text-slate-900">
                Essential Nigerian Joint Venture Safeguards & Documentation
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    1. Irrevocable Power of Attorney (POA)
                  </div>
                  <p>
                    The landowner donates an irrevocable POA solely for obtaining town planning building approvals, conducting soil tests, and marketing developer units. Crucially, the POA must NOT convey ultimate legal title to the developer until units are delivered.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    2. Joint Development Agreement (JDA)
                  </div>
                  <p>
                    Executed under seal. Defines the exact sharing ratio (e.g. 50:50), specifies architectural finishes (Italian vs Turkish sanitary wares, elevator specifications), and outlines liquidated damages for project delays beyond the delivery timeline.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    3. Performance Bond / Bank Guarantee
                  </div>
                  <p>
                    A prudent landowner must demand an unconditional Performance Bond issued by a reputable commercial bank (typically 10-15% of project cost) guaranteeing timely completion and protecting against developer default or abandonment.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    4. Sunset & Termination Clause
                  </div>
                  <p>
                    If the developer fails to achieve raft foundation within 6 months of obtaining site possession, the landowner reserves the legal right to terminate the JDA, retain any paid premium, and reclaim unencumbered possession of the land.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            For bespoke legal advisory or cadastral coordination, consult an accredited Nigerian real estate conveyancer.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition cursor-pointer"
          >
            Close Hub
          </button>
        </div>
      </div>
    </div>
  );
}
