'use client';

import React from 'react';
import { X, Calendar, Clock, MapPin, Video, UserCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface InspectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export function InspectionsModal({ isOpen, onClose, onOpenAuth }: InspectionsModalProps) {
  const { user, inspections } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-800" />
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                My Property Inspection Schedules
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Physical site tours & verified live WhatsApp video inspections
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!user ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Sign In to Track Inspections</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Log in to synchronize your booked property visits, contact assigned verified agents, and manage inspection reminders.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Sign In / Register
              </button>
            </div>
          ) : inspections.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">No Scheduled Inspections Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Browse our verified listings in Lagos, Abuja, or Port Harcourt and click &quot;Schedule Physical Inspection&quot; or &quot;Request WhatsApp Video Tour&quot;.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Total Bookings ({inspections.length})</span>
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Agent Identity Escort Guaranteed
                </span>
              </div>

              {inspections.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-all shadow-2xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                          item.status === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-900'
                            : item.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.status}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                        {item.property_title}
                      </h4>
                    </div>

                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-md shrink-0 flex items-center gap-1 ${
                        item.type === 'VIRTUAL_WHATSAPP'
                          ? 'bg-teal-50 text-teal-800 border border-teal-200'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {item.type === 'VIRTUAL_WHATSAPP' ? (
                        <>
                          <Video className="w-3.5 h-3.5 text-teal-600" /> WhatsApp Live
                        </>
                      ) : (
                        'Physical On-Site'
                      )}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.property_location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {item.preferred_date} at {item.preferred_time}
                      </span>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-md italic">
                      &quot;{item.notes}&quot;
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-400 text-[11px]">
                      Booked on {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <a
                      href={`https://wa.me/2348034567890?text=${encodeURIComponent(
                        `Hello, I scheduled an inspection for ${item.property_title} on ${item.preferred_date} at ${item.preferred_time}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Chat with Assigned Agent</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
