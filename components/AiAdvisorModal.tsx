'use client';

import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2, ShieldAlert, BookOpen, Building2, Copy, Check } from 'lucide-react';

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiAdvisorModal({ isOpen, onClose }: AiAdvisorModalProps) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const samplePrompts = [
    {
      title: 'Lekki 1 Rental Benchmarks',
      text: 'What is the current average rental price and tenant demand for a serviced 3-bedroom flat in Lekki Phase 1, Lagos?',
    },
    {
      title: "Governor's Consent vs Gazette",
      text: "Explain the legal difference between Governor's Consent, Gazette, and C of O in Lagos State under the Land Use Act.",
    },
    {
      title: 'Alausa Lands Bureau Search',
      text: 'What are the exact step-by-step procedures to conduct a title search at Alausa Lands Bureau before buying land in Lagos?',
    },
    {
      title: 'Abuja High-Yield Areas',
      text: 'Which neighborhoods in Abuja (FCT) currently provide the highest rental yield for residential duplexes and apartments?',
    },
  ];

  const handleAskAi = async (textToAsk: string) => {
    if (!textToAsk.trim() || loading) return;
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch('/api/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToAsk,
          queryType: 'advisor',
        }),
      });
      const data = await res.json();
      setResponse(data.text || 'Unable to retrieve answer. Please try again.');
    } catch (err) {
      console.error(err);
      setResponse('An error occurred while consulting the Nigerian property index. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
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
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Nigeria Real Estate AI Advisor</span>
                <span className="text-[10px] font-semibold bg-emerald-800 text-emerald-100 px-2 py-0.5 rounded">
                  AI Market Engine
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Accurate Nigerian market valuations, rental yields & legal land title guidance.
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

        {/* Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 text-xs sm:text-sm">
          {/* Quick preset chips */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Popular Inquiries:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {samplePrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(item.text);
                    handleAskAi(item.text);
                  }}
                  className="p-2.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-lg text-left transition cursor-pointer flex flex-col"
                >
                  <span className="font-bold text-slate-800 text-xs mb-0.5">{item.title}</span>
                  <span className="text-[11px] text-slate-500 line-clamp-1">{item.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Response Container */}
          {loading && (
            <div className="py-12 text-center text-slate-500 space-y-3 bg-slate-50 rounded-xl border border-slate-200">
              <Loader2 className="w-7 h-7 animate-spin mx-auto text-emerald-700" />
              <p className="font-medium text-slate-700">Analyzing Nigerian property data & legal title databases...</p>
              <p className="text-xs text-slate-400">Verifying state market rates (Lekki, Ikoyi, Maitama, Ikeja, PH)</p>
            </div>
          )}

          {response && !loading && (
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  Advisor Insights
                </span>
                <button
                  onClick={handleCopy}
                  className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="text-slate-800 leading-relaxed space-y-2 whitespace-pre-line text-xs sm:text-sm">
                {response}
              </div>
            </div>
          )}

          {/* User Input Bar */}
          <div className="pt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAi(prompt);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask anything about Nigerian property prices, titles, or locations..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm"
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-lg font-semibold flex items-center gap-1.5 text-xs sm:text-sm transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Ask Advisor</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
