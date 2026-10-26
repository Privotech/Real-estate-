'use client';

import React, { useState } from 'react';
import {
  X,
  Building,
  CheckCircle2,
  DollarSign,
  Info,
  ArrowRight,
  Calculator,
} from 'lucide-react';
import { formatNaira, formatUSD } from '@/lib/property-data';

interface MortgagePreQualifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: 'NGN' | 'USD';
}

export function MortgagePreQualifierModal({
  isOpen,
  onClose,
  currency,
}: MortgagePreQualifierModalProps) {
  const [monthlyGrossIncome, setMonthlyGrossIncome] = useState<number>(1500000);
  const [availableEquityDownPayment, setAvailableEquityDownPayment] = useState<number>(30000000);
  const [programType, setProgramType] = useState<'commercial' | 'nhf' | 'diaspora'>('commercial');
  const [tenorYears, setTenorYears] = useState<number>(15);

  // Nigerian Mortgage Parameters
  // Commercial NMRC Mortgage: ~19% interest rate
  // National Housing Fund (FMBN NHF): 6% interest rate (max loan capped at ₦15m)
  // Diaspora: ~18% interest rate
  const interestRate =
    programType === 'nhf' ? 6 : programType === 'diaspora' ? 18 : 19;

  // Max allowable monthly payment is 33.3% of gross income (standard banking prudential guideline in Nigeria)
  const maxAllowableMonthlyRepayment = monthlyGrossIncome * 0.333;

  // Loan calculation
  const monthlyRate = interestRate / 100 / 12;
  const numMonths = tenorYears * 12;

  // PV = PMT * (1 - (1+r)^-n) / r
  const calculatedMaxLoan =
    programType === 'nhf'
      ? Math.min(
          15000000,
          maxAllowableMonthlyRepayment * ((1 - Math.pow(1 + monthlyRate, -numMonths)) / monthlyRate)
        )
      : maxAllowableMonthlyRepayment * ((1 - Math.pow(1 + monthlyRate, -numMonths)) / monthlyRate);

  const maxPropertyAffordability = calculatedMaxLoan + availableEquityDownPayment;

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
                Nigerian Mortgage & Housing Loan Pre-Qualifier
              </h3>
              <p className="text-xs text-slate-500">
                Check borrowing eligibility for Commercial NMRC, National Housing Fund (NHF), and Diaspora loans.
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
          {/* Mortgage Program Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Mortgage Scheme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'commercial', label: 'Commercial Mortgage (19%)' },
                { id: 'nhf', label: 'FMBN NHF Scheme (6%)' },
                { id: 'diaspora', label: 'Diaspora Mortgage (18%)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setProgramType(tab.id as any)}
                  className={`p-2.5 rounded-lg border text-center font-medium transition cursor-pointer text-xs ${
                    programType === tab.id
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Inputs */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Monthly Verified Gross Income (₦)
                </label>
                <span className="font-mono font-bold text-emerald-900 text-xs">
                  {formatNaira(monthlyGrossIncome)}
                </span>
              </div>
              <input
                type="range"
                min="300000"
                max="10000000"
                step="100000"
                value={monthlyGrossIncome}
                onChange={(e) => setMonthlyGrossIncome(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>₦300k</span>
                <span>₦2.5M</span>
                <span>₦5M</span>
                <span>₦10M+</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Available Down Payment Equity (₦)
                </label>
                <span className="font-mono font-bold text-emerald-900 text-xs">
                  {formatNaira(availableEquityDownPayment)}
                </span>
              </div>
              <input
                type="range"
                min="2000000"
                max="150000000"
                step="1000000"
                value={availableEquityDownPayment}
                onChange={(e) => setAvailableEquityDownPayment(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>₦2M</span>
                <span>₦30M</span>
                <span>₦75M</span>
                <span>₦150M</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Loan Tenure</label>
                <select
                  value={tenorYears}
                  onChange={(e) => setTenorYears(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium"
                >
                  <option value={5}>5 Years</option>
                  <option value={10}>10 Years</option>
                  <option value={15}>15 Years</option>
                  <option value={20}>20 Years</option>
                  {programType === 'nhf' && <option value={30}>30 Years (NHF Max)</option>}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Max Debt-to-Income (DTI)</label>
                <input
                  type="text"
                  disabled
                  value="33.3% (CBN Guideline)"
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Eligibility Results */}
          <div className="bg-emerald-950 text-white p-5 rounded-xl space-y-3 shadow-md">
            <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider block">
              Estimated Total Property Purchasing Power
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight tabular-nums">
              {currency === 'NGN' ? formatNaira(Math.round(maxPropertyAffordability)) : formatUSD(Math.round(maxPropertyAffordability))}
            </div>

            <div className="pt-3 border-t border-emerald-800/60 grid grid-cols-2 gap-2 text-xs text-emerald-200">
              <div>
                <span className="text-slate-400 block text-[11px]">Maximum Mortgage Loan:</span>
                <span className="font-bold text-white font-mono">
                  {currency === 'NGN' ? formatNaira(Math.round(calculatedMaxLoan)) : formatUSD(Math.round(calculatedMaxLoan))}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Max Monthly Repayment:</span>
                <span className="font-bold text-emerald-300 font-mono">
                  {currency === 'NGN' ? formatNaira(Math.round(maxAllowableMonthlyRepayment)) : formatUSD(Math.round(maxAllowableMonthlyRepayment))}/mo
                </span>
              </div>
            </div>
          </div>

          {/* Accredited Institutions */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-900 block">
              Accredited Primary Mortgage Institutions (PMIs) in Nigeria:
            </span>
            <p className="text-slate-600 leading-relaxed">
              Approved partners for refinancing through the Nigerian Mortgage Refinance Company (NMRC):
              <strong className="text-slate-800"> Stanbic IBTC, Abbey Mortgage Bank, FirstTrust Mortgage Bank, Infinity Trust, and Federal Mortgage Bank of Nigeria (FMBN).</strong>
            </p>
          </div>

          {/* Action */}
          <div className="flex justify-end pt-2 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs transition cursor-pointer"
            >
              Close Pre-Qualifier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
