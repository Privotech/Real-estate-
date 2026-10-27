'use client';

import React, { useState } from 'react';
import { X, Calculator, DollarSign, Info, Check, Copy } from 'lucide-react';
import { formatNaira, formatUSD } from '@/lib/property-data';

interface ClosingCostCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: 'NGN' | 'USD';
}

export function ClosingCostCalculatorModal({
  isOpen,
  onClose,
  currency,
}: ClosingCostCalculatorModalProps) {
  const [propertyPrice, setPropertyPrice] = useState<number>(250000000);
  const [state, setState] = useState<'Lagos' | 'Abuja (FCT)' | 'Other States'>('Lagos');
  const [includeAgencyFee, setIncludeAgencyFee] = useState<boolean>(true);
  const [includeLegalFee, setIncludeLegalFee] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Calculations based on Nigerian legal and statutory standards:
  // Lagos State Governor's Consent: 3% (1.5% consent fee + 0.5% capital gains + 1% registration)
  // Abuja AGIS: approx 2.5%
  // Stamp Duty: 1.5%
  // Legal Fee: 5% (standard NBA property conveyancing scale)
  // Agency Fee: 5% (standard real estate commission)
  // Survey Plan & Charting at Lands Bureau: ₦450,000
  const consentRate = state === 'Lagos' ? 0.03 : state === 'Abuja (FCT)' ? 0.025 : 0.02;
  const stampDutyRate = 0.015;
  const legalRate = includeLegalFee ? 0.05 : 0;
  const agencyRate = includeAgencyFee ? 0.05 : 0;
  const surveyFee = 450000;

  const consentFee = propertyPrice * consentRate;
  const stampDutyFee = propertyPrice * stampDutyRate;
  const legalFee = propertyPrice * legalRate;
  const agencyFee = propertyPrice * agencyRate;

  const totalClosingCosts = consentFee + stampDutyFee + legalFee + agencyFee + surveyFee;
  const totalCashRequired = propertyPrice + totalClosingCosts;
  const closingCostPercentage = ((totalClosingCosts / propertyPrice) * 100).toFixed(1);

  const handleCopySummary = () => {
    const text = `Nigeria Property Centre - Acquisition Closing Cost Breakdown
Property Price: ${formatNaira(propertyPrice)}
Governor's Consent & Registration (${(consentRate * 100).toFixed(1)}%): ${formatNaira(consentFee)}
Federal/State Stamp Duty (1.5%): ${formatNaira(stampDutyFee)}
Legal & Conveyancing Fee (${(legalRate * 100).toFixed(0)}%): ${formatNaira(legalFee)}
Agency Brokerage Fee (${(agencyRate * 100).toFixed(0)}%): ${formatNaira(agencyFee)}
Survey & Charting Fee: ${formatNaira(surveyFee)}
---------------------------------------------
Total Ancillary Fees: ${formatNaira(totalClosingCosts)} (${closingCostPercentage}% of purchase)
Total Cash Required to Close: ${formatNaira(totalCashRequired)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Nigerian Property Closing Costs & Legal Fees Calculator
              </h3>
              <p className="text-xs text-slate-500">
                Calculate statutory fees, Governor&apos;s Consent, legal conveyancing, and stamp duty.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 text-xs sm:text-sm">
          {/* Inputs */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Property Purchase Price (₦)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400">
                  ₦
                </span>
                <input
                  type="number"
                  step="5000000"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Math.max(1000000, Number(e.target.value)))}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold text-sm"
                />
              </div>
              <div className="flex justify-between items-center mt-1 text-[11px] text-slate-500">
                <span>In Words: {formatNaira(propertyPrice)}</span>
                <span className="font-mono">
                  (~{formatUSD(propertyPrice, 1450)})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State / Jurisdiction</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-medium"
                >
                  <option value="Lagos">Lagos State (3.0% Consent & Reg)</option>
                  <option value="Abuja (FCT)">Abuja FCT (2.5% AGIS)</option>
                  <option value="Other States">Other States (2.0% Average)</option>
                </select>
              </div>

              <div className="flex flex-col justify-end space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={includeLegalFee}
                    onChange={(e) => setIncludeLegalFee(e.target.checked)}
                    className="accent-emerald-800 w-3.5 h-3.5"
                  />
                  <span>Include Legal / Conveyancing Fee (5%)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={includeAgencyFee}
                    onChange={(e) => setIncludeAgencyFee(e.target.checked)}
                    className="accent-emerald-800 w-3.5 h-3.5"
                  />
                  <span>Include Agency Commission (5%)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="bg-emerald-950 text-white p-5 rounded-xl space-y-3 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider block">
                  Total Cash Required to Close
                </span>
                <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight tabular-nums block mt-1">
                  {currency === 'NGN' ? formatNaira(totalCashRequired) : formatUSD(totalCashRequired)}
                </span>
              </div>
              <span className="bg-emerald-800 text-emerald-100 text-xs px-2.5 py-1 rounded-md font-semibold font-mono">
                +{closingCostPercentage}% on purchase
              </span>
            </div>

            <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between text-xs text-emerald-200 font-mono">
              <span>Pure Acquisition Closing Costs:</span>
              <span className="font-bold text-white">
                {currency === 'NGN' ? formatNaira(totalClosingCosts) : formatUSD(totalClosingCosts)}
              </span>
            </div>
          </div>

          {/* Itemized Breakdown Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              Itemized Cost Breakdown
            </h4>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="p-3 flex justify-between bg-white">
                <div>
                  <span className="font-semibold text-slate-800">Governor&apos;s Consent & Title Registration</span>
                  <span className="block text-[11px] text-slate-400">
                    Paid directly to {state} State Lands Bureau ({(consentRate * 100).toFixed(1)}%)
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {currency === 'NGN' ? formatNaira(consentFee) : formatUSD(consentFee)}
                </span>
              </div>

              <div className="p-3 flex justify-between bg-white">
                <div>
                  <span className="font-semibold text-slate-800">Stamp Duty & Tax Assessment</span>
                  <span className="block text-[11px] text-slate-400">
                    Federal / State Internal Revenue Service (1.5%)
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {currency === 'NGN' ? formatNaira(stampDutyFee) : formatUSD(stampDutyFee)}
                </span>
              </div>

              <div className="p-3 flex justify-between bg-white">
                <div>
                  <span className="font-semibold text-slate-800">Legal Conveyancing & Title Drafting</span>
                  <span className="block text-[11px] text-slate-400">
                    Paid to Buyer&apos;s Solicitor / Property Lawyer (5%)
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {currency === 'NGN' ? formatNaira(legalFee) : formatUSD(legalFee)}
                </span>
              </div>

              <div className="p-3 flex justify-between bg-white">
                <div>
                  <span className="font-semibold text-slate-800">Real Estate Agency Brokerage Fee</span>
                  <span className="block text-[11px] text-slate-400">
                    Standard brokerage commission (5%)
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {currency === 'NGN' ? formatNaira(agencyFee) : formatUSD(agencyFee)}
                </span>
              </div>

              <div className="p-3 flex justify-between bg-white">
                <div>
                  <span className="font-semibold text-slate-800">Registered Survey & Beacon Charting</span>
                  <span className="block text-[11px] text-slate-400">
                    Office of the Surveyor-General (Fixed rate)
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {currency === 'NGN' ? formatNaira(surveyFee) : formatUSD(surveyFee)}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-200">
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Summary Copied!' : 'Copy Closing Summary'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
