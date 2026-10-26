'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  SlidersHorizontal,
  Trash2,
  Send,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Filter,
  Volume2,
  Sun,
  Calendar,
} from 'lucide-react';
import { formatNaira, formatUSD } from '@/lib/property-data';
import { useAuth } from '@/contexts/AuthContext';

export interface PropertyAlertItem {
  id: string;
  name: string;
  category: string;
  state: string;
  area: string;
  propertyType: string;
  bedrooms: string;
  titleDocument: string;
  maxPrice: number;
  keyword: string;
  channels: {
    email: boolean;
    push: boolean;
    whatsapp: boolean;
  };
  email: string;
  dailySummaryEmail?: boolean;
  phone?: string;
  frequency: 'instant' | 'daily' | 'weekly';
  createdAt: string;
  isActive: boolean;
  matchesCount: number;
}

interface PropertyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Current active filter criteria
  category: string;
  selectedState: string;
  selectedArea: string;
  selectedType: string;
  selectedBedrooms: string;
  selectedTitle: string;
  maxPrice: number;
  searchKeyword: string;
  currency: 'NGN' | 'USD';
  matchingCount: number;
  onAlertsChange?: (count: number) => void;
}


export function PropertyAlertModal({
  isOpen,
  onClose,
  category,
  selectedState,
  selectedArea,
  selectedType,
  selectedBedrooms,
  selectedTitle,
  maxPrice,
  searchKeyword,
  currency,
  matchingCount,
  onAlertsChange,
}: PropertyAlertModalProps) {
  const { user } = useAuth();

  // Active Tab: 'create' | 'saved'
  const [activeTab, setActiveTab] = useState<'create' | 'saved'>('create');

  // Compute smart suggested alert name based on criteria
  const suggestedAlertName = React.useMemo(() => {
    const parts: string[] = [];
    if (selectedBedrooms !== 'any') {
      parts.push(`${selectedBedrooms} Bed`);
    }
    if (selectedType !== 'All Types') {
      parts.push(selectedType);
    } else if (category !== 'all') {
      const catMap: Record<string, string> = {
        'for-sale': 'Properties for Sale',
        'for-rent': 'Rentals',
        'short-let': 'Short Lets',
        land: 'Land Plots',
        'joint-venture': 'Joint Venture',
      };
      parts.push(catMap[category] || 'Properties');
    } else {
      parts.push('Properties');
    }

    if (selectedArea !== 'All Areas') {
      parts.push(`in ${selectedArea}`);
    } else if (selectedState !== 'All States') {
      parts.push(`in ${selectedState}`);
    }

    if (maxPrice < 1000000000) {
      parts.push(`under ${currency === 'NGN' ? formatNaira(maxPrice) : formatUSD(maxPrice)}`);
    }

    return parts.join(' ');
  }, [selectedBedrooms, selectedType, category, selectedArea, selectedState, maxPrice, currency]);

  // Form State
  const [customAlertName, setCustomAlertName] = useState<string | null>(null);
  const alertName = customAlertName !== null ? customAlertName : suggestedAlertName;

  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);

  const defaultEmail = user?.email || 'privilegeoyegbile@gmail.com';
  const [customEmail, setCustomEmail] = useState<string | null>(null);
  const emailAddress = customEmail !== null ? customEmail : defaultEmail;

  // Dedicated toggle to enable/disable daily summary emails for saved search criteria
  const [dailySummaryEmail, setDailySummaryEmail] = useState<boolean>(true);

  const defaultPhone = user?.phone || '+234 803 123 4567';
  const [customPhone, setCustomPhone] = useState<string | null>(null);
  const phoneNumber = customPhone !== null ? customPhone : defaultPhone;

  const [frequency, setFrequency] = useState<'instant' | 'daily' | 'weekly'>('daily');

  // Push permission
  const [pushPermission, setPushPermission] = useState<'default' | 'granted' | 'denied'>('default');

  // Saved alerts
  const [savedAlerts, setSavedAlerts] = useState<PropertyAlertItem[]>([]);
  const [successSaved, setSuccessSaved] = useState<PropertyAlertItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  // Load alerts directly from NeonDB
  const loadAlertsFromDb = React.useCallback(async () => {
    try {
      setLoadingAlerts(true);
      const res = await fetch('/api/alerts');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.alerts)) {
          const items: PropertyAlertItem[] = data.alerts.map((a: {
            id: string;
            name: string;
            category: string;
            state: string;
            area: string;
            property_type: string;
            bedrooms: string;
            title_document: string;
            max_price: number;
            keyword: string;
            email: string;
            daily_summary_email: boolean;
            phone?: string | null;
            channels_email: boolean;
            channels_push: boolean;
            channels_whatsapp: boolean;
            frequency: 'instant' | 'daily' | 'weekly';
            is_active: boolean;
            matches_count: number;
            created_at: string;
          }) => ({
            id: a.id,
            name: a.name,
            category: a.category,
            state: a.state,
            area: a.area,
            propertyType: a.property_type,
            bedrooms: a.bedrooms,
            titleDocument: a.title_document,
            maxPrice: a.max_price,
            keyword: a.keyword,
            channels: {
              email: a.channels_email,
              push: a.channels_push,
              whatsapp: a.channels_whatsapp,
            },
            email: a.email,
            dailySummaryEmail: a.daily_summary_email,
            phone: a.phone || undefined,
            frequency: a.frequency,
            createdAt: new Date(a.created_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
            isActive: a.is_active,
            matchesCount: a.matches_count,
          }));
          setSavedAlerts(items);
          onAlertsChange?.(items.length);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch property alerts from NeonDB:', err);
    } finally {
      setLoadingAlerts(false);
    }
  }, [onAlertsChange]);

  // Safely hydrate browser push permission and fetch NeonDB alerts after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setPushPermission(Notification.permission);
      }
      loadAlertsFromDb();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadAlertsFromDb]);

  // Push simulation preview notification toast
  const [simulationToast, setSimulationToast] = useState<{
    show: boolean;
    title: string;
    body: string;
    time: string;
  } | null>(null);

  // Request browser push permission
  const handleRequestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPushPermission(perm);
        if (perm === 'granted') {
          setPushEnabled(true);
        } else if (perm === 'denied') {
          setPushEnabled(false);
        }
      } catch {
        // Fallback
      }
    }
  };

  // Trigger test notification
  const handleTriggerTest = (alertItem?: PropertyAlertItem) => {
    const alertTitle = alertItem ? alertItem.name : alertName || 'Property Alert';
    const recipientEmail = alertItem ? alertItem.email : emailAddress;
    const isDaily = alertItem ? alertItem.dailySummaryEmail !== false : dailySummaryEmail;

    const alertBody = isDaily
      ? `☀️ Daily Summary Email dispatched to ${recipientEmail}: 4 newly verified properties matching "${alertTitle}" found today in ${selectedArea !== 'All Areas' ? selectedArea : 'Lekki'}!`
      : `⚡ Instant Alert dispatched to ${recipientEmail}: New verified property in ${selectedArea !== 'All Areas' ? selectedArea : 'Lekki'} just listed at ₦240,000,000!`;

    // Attempt native browser notification if granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('🔔 Nigeria Property Centre', {
          body: `${alertTitle}: ${alertBody}`,
          icon: '/favicon.ico',
        });
      } catch {
        // In iframe sandboxes, Notification may throw; fallback to custom toast
      }
    }

    // Show simulated toast banner inside the applet
    setSimulationToast({
      show: true,
      title: `🔔 NPC Alert: ${alertTitle}`,
      body: alertBody,
      time: 'Just now',
    });

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setSimulationToast(null);
    }, 6000);
  };

  // Save the alert to NeonDB
  const handleSaveAlert = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = emailAddress.trim();
    if (!trimmedEmail) {
      alert('Please enter your email address to receive property alerts and daily summaries.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      alert('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    if (!emailEnabled && !dailySummaryEmail && !pushEnabled && !whatsappEnabled) {
      alert('Please enable at least one notification channel (Daily Summary Email, Instant Email, Push, or WhatsApp).');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: alertName.trim() || suggestedAlertName,
        category,
        state: selectedState,
        area: selectedArea,
        propertyType: selectedType,
        bedrooms: selectedBedrooms,
        titleDocument: selectedTitle,
        maxPrice,
        keyword: searchKeyword,
        email: trimmedEmail,
        dailySummaryEmail,
        phone: whatsappEnabled ? phoneNumber.trim() : undefined,
        channels: {
          email: emailEnabled || dailySummaryEmail,
          push: pushEnabled,
          whatsapp: whatsappEnabled,
        },
        frequency: dailySummaryEmail && frequency !== 'instant' ? 'daily' : frequency,
        matchesCount: matchingCount,
      };

      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const a = data.alert;
        const newAlert: PropertyAlertItem = {
          id: a.id,
          name: a.name,
          category: a.category,
          state: a.state,
          area: a.area,
          propertyType: a.property_type,
          bedrooms: a.bedrooms,
          titleDocument: a.title_document,
          maxPrice: a.max_price,
          keyword: a.keyword,
          channels: {
            email: a.channels_email,
            push: a.channels_push,
            whatsapp: a.channels_whatsapp,
          },
          email: a.email,
          dailySummaryEmail: a.daily_summary_email,
          phone: a.phone || undefined,
          frequency: a.frequency,
          createdAt: new Date(a.created_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          isActive: a.is_active,
          matchesCount: a.matches_count,
        };

        const updated = [newAlert, ...savedAlerts];
        setSavedAlerts(updated);
        onAlertsChange?.(updated.length);
        setSuccessSaved(newAlert);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save property alert to NeonDB.');
      }
    } catch (err) {
      console.error('Error saving alert to NeonDB:', err);
      alert('Network error while saving alert to NeonDB. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle active/paused status of a saved alert in NeonDB
  const handleToggleAlertActive = async (id: string) => {
    setSavedAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
    try {
      await fetch('/api/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.warn('Failed to toggle alert in NeonDB:', err);
    }
  };

  // Toggle daily summary email on a saved alert in NeonDB
  const handleToggleDailySummary = async (id: string) => {
    setSavedAlerts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, dailySummaryEmail: a.dailySummaryEmail === false } : a
      )
    );
    try {
      await fetch('/api/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.warn('Failed to update summary preference in NeonDB:', err);
    }
  };

  // Delete an alert from NeonDB
  const handleDeleteAlert = async (id: string) => {
    const updated = savedAlerts.filter((a) => a.id !== id);
    setSavedAlerts(updated);
    onAlertsChange?.(updated.length);
    try {
      await fetch(`/api/alerts?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Failed to delete alert in NeonDB:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      {/* Simulation Push Banner (Top Right Floating) */}
      {simulationToast && (
        <div className="fixed top-5 right-5 z-60 max-w-sm w-full bg-slate-900 text-white rounded-xl shadow-2xl border border-emerald-500/30 p-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-emerald-400">Nigeria Property Centre</span>
                <span>{simulationToast.time}</span>
              </div>
              <h5 className="font-bold text-sm text-white mt-0.5 truncate">{simulationToast.title}</h5>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{simulationToast.body}</p>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  ⚡ Verified Title
                </span>
                <span className="text-[11px] text-slate-400">Push Notification Simulated</span>
              </div>
            </div>
            <button
              onClick={() => setSimulationToast(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-900 via-emerald-850 to-slate-900 text-white px-5 sm:px-6 py-5 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                    Property Alert Notification
                  </h3>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider rounded-full">
                    Live Feeds
                  </span>
                </div>
                <p className="text-xs text-emerald-100/90 mt-0.5">
                  Get notified the moment new verified listings match your search criteria.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/15">
            <button
              type="button"
              onClick={() => {
                setActiveTab('create');
                setSuccessSaved(null);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              🔔 Create New Alert
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <span>Saved Alerts</span>
              {savedAlerts.length > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    activeTab === 'saved'
                      ? 'bg-emerald-900 text-white'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  {savedAlerts.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
          {activeTab === 'saved' ? (
            /* Saved Alerts View */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Your Subscribed Searches ({savedAlerts.length})
                  </h4>
                  <p className="text-xs text-slate-500">
                    Manage alert delivery channels, trigger instant tests, or pause subscriptions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('create');
                    setSuccessSaved(null);
                  }}
                  className="px-3 py-1.5 bg-emerald-800 text-white hover:bg-emerald-900 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  + New Alert
                </button>
              </div>

              {savedAlerts.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-400 mx-auto flex items-center justify-center">
                    <Bell className="w-6 h-6" />
                  </div>
                  <h5 className="font-bold text-sm text-slate-800">No saved property alerts yet</h5>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Create an alert based on your current search to get pinged whenever landlords, developers, or agents post new listings.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('create');
                      setSuccessSaved(null);
                    }}
                    className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs hover:bg-emerald-900 transition cursor-pointer"
                  >
                    Set Up Alert for Current Filter
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-xl border transition ${
                        alert.isActive
                          ? 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
                          : 'bg-slate-50/70 border-slate-200 opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-900 truncate">
                              {alert.name}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                alert.isActive
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {alert.isActive ? 'Active' : 'Paused'}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {alert.createdAt}
                            </span>
                          </div>

                          {/* Criteria pills */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] rounded font-medium">
                              {alert.category === 'all'
                                ? 'All Purposes'
                                : alert.category === 'for-sale'
                                ? 'For Sale'
                                : alert.category === 'for-rent'
                                ? 'For Rent'
                                : alert.category === 'short-let'
                                ? 'Short Let'
                                : 'Land'}
                            </span>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] rounded font-medium">
                              📍 {alert.area !== 'All Areas' ? alert.area : alert.state}
                            </span>
                            {alert.propertyType !== 'All Types' && (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] rounded font-medium">
                                🏠 {alert.propertyType}
                              </span>
                            )}
                            {alert.bedrooms !== 'any' && (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] rounded font-medium">
                                🛏️ {alert.bedrooms}+ Beds
                              </span>
                            )}
                            {alert.maxPrice < 1000000000 && (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] rounded font-medium">
                                Max {formatNaira(alert.maxPrice)}
                              </span>
                            )}
                          </div>

                          {/* Delivery info & Daily Summary Toggle */}
                          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 pt-2">
                            {/* Email badge */}
                            <span className="inline-flex items-center gap-1 font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                              <Mail className="w-3 h-3 text-emerald-700" />
                              <span>{alert.email}</span>
                            </span>

                            {/* Daily Summary Email Toggle Button for this saved search */}
                            <button
                              type="button"
                              onClick={() => handleToggleDailySummary(alert.id)}
                              title="Toggle Daily Summary Emails for this search criteria"
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold border transition cursor-pointer ${
                                alert.dailySummaryEmail !== false
                                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                                  : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                              }`}
                            >
                              <Sun className={`w-3 h-3 ${alert.dailySummaryEmail !== false ? 'text-amber-600' : 'text-slate-400'}`} />
                              <span>Daily Digest: {alert.dailySummaryEmail !== false ? 'Active (8 AM)' : 'Disabled'}</span>
                            </button>

                            <span className="flex items-center gap-1 text-[11px] text-slate-500">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span className="capitalize">{alert.frequency}</span>
                            </span>

                            {alert.channels.push && (
                              <span className="inline-flex items-center gap-0.5 text-indigo-700 font-medium text-[11px]">
                                <Bell className="w-3 h-3" /> Push
                              </span>
                            )}
                            {alert.channels.whatsapp && (
                              <span className="inline-flex items-center gap-0.5 text-emerald-600 font-medium text-[11px]">
                                <MessageSquare className="w-3 h-3" /> WA
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleTriggerTest(alert)}
                            title="Simulate / Test Notification"
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1 cursor-pointer"
                          >
                            <Send className="w-3 h-3 text-emerald-700" />
                            <span>Test</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleAlertActive(alert.id)}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                              alert.isActive
                                ? 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                          >
                            {alert.isActive ? 'Pause' : 'Resume'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAlert(alert.id)}
                            title="Delete Alert"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : successSaved ? (
            /* Success Confirmation State */
            <div className="py-6 px-4 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider">
                  Alert Activated Successfully
                </span>
                <h4 className="text-xl font-bold text-slate-900 mt-2">
                  You are now subscribed to &quot;{successSaved.name}&quot;
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                  Whenever a real estate agent, developer, or verified owner lists a property matching your filters, we will dispatch notifications instantly.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left max-w-lg mx-auto space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Recipient Email</span>
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-emerald-700" />
                    <span>{successSaved.email}</span>
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Daily Summary Email</span>
                  <span className={`font-bold flex items-center gap-1 px-2 py-0.5 rounded ${
                    successSaved.dailySummaryEmail !== false
                      ? 'text-amber-800 bg-amber-50 border border-amber-200'
                      : 'text-slate-600 bg-slate-100'
                  }`}>
                    <Sun className="w-3 h-3 text-amber-600" />
                    <span>{successSaved.dailySummaryEmail !== false ? 'Enabled (8:00 AM WAT Daily Digest)' : 'Disabled'}</span>
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Channels Active</span>
                  <div className="flex gap-2">
                    {successSaved.channels.email && (
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✉️ Email
                      </span>
                    )}
                    {successSaved.channels.push && (
                      <span className="font-semibold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        🔔 Web Push
                      </span>
                    )}
                    {successSaved.channels.whatsapp && (
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        💬 WhatsApp
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Frequency</span>
                  <span className="font-bold text-slate-800 capitalize">
                    {successSaved.frequency === 'instant'
                      ? '⚡ Instant (as properties list)'
                      : successSaved.frequency === 'daily'
                      ? '📅 Daily Digest (8:00 AM WAT)'
                      : '📆 Weekly Summary'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Current Pool Matches</span>
                  <span className="font-bold text-emerald-800">
                    {matchingCount} available listings right now
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleTriggerTest(successSaved)}
                  className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Notification Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('saved')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  View All Saved Alerts ({savedAlerts.length})
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Create New Alert Form */
            <form onSubmit={handleSaveAlert} className="space-y-6">
              {/* 1. Captured Active Filters Summary Card */}
              <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-xl p-4">
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-emerald-200/60">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <Filter className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Matching Filter Criteria</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-white/80 px-2 py-0.5 rounded border border-emerald-300">
                    {matchingCount} listings match right now
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {/* Category chip */}
                  <div className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-emerald-200 text-slate-800 font-medium">
                    <span className="text-slate-500">Purpose:</span>
                    <span className="font-semibold text-emerald-900 capitalize">
                      {category === 'all'
                        ? 'All (Sale & Rent)'
                        : category === 'for-sale'
                        ? 'For Sale'
                        : category === 'for-rent'
                        ? 'For Rent'
                        : category === 'short-let'
                        ? 'Short Let'
                        : 'Land'}
                    </span>
                  </div>

                  {/* Location chip */}
                  <div className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-emerald-200 text-slate-800 font-medium">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-semibold text-emerald-900">
                      {selectedArea !== 'All Areas' ? `${selectedArea}, ` : ''}
                      {selectedState !== 'All States' ? selectedState : 'Nigeria (All)'}
                    </span>
                  </div>

                  {/* Type chip */}
                  <div className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-emerald-200 text-slate-800 font-medium">
                    <span className="text-slate-500">Type:</span>
                    <span className="font-semibold text-emerald-900">{selectedType}</span>
                  </div>

                  {/* Bedrooms */}
                  {selectedBedrooms !== 'any' && (
                    <div className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-emerald-200 text-slate-800 font-medium">
                      <span className="text-slate-500">Beds:</span>
                      <span className="font-semibold text-emerald-900">{selectedBedrooms}+ Bedrooms</span>
                    </div>
                  )}

                  {/* Title Document */}
                  {selectedTitle !== 'All Titles' && (
                    <div className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-emerald-200 text-slate-800 font-medium">
                      <span className="text-slate-500">Title:</span>
                      <span className="font-semibold text-emerald-900">{selectedTitle}</span>
                    </div>
                  )}

                  {/* Max budget */}
                  {maxPrice < 1000000000 && (
                    <div className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-emerald-200 text-slate-800 font-medium">
                      <span className="text-slate-500">Max Budget:</span>
                      <span className="font-semibold text-emerald-900">
                        {currency === 'NGN' ? formatNaira(maxPrice) : formatUSD(maxPrice)}
                      </span>
                    </div>
                  )}

                  {/* Keyword */}
                  {searchKeyword.trim() && (
                    <div className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-emerald-200 text-slate-800 font-medium">
                      <span className="text-slate-500">Keyword:</span>
                      <span className="font-semibold text-emerald-900">&quot;{searchKeyword}&quot;</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Alert Label Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Alert Name / Reference
                </label>
                <input
                  type="text"
                  value={alertName}
                  onChange={(e) => setCustomAlertName(e.target.value)}
                  placeholder="e.g. 4 Bed Duplex in Lekki under ₦350M"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* 3. Email Address & Daily Summary Emails Section */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        Email Alerts & Daily Summary
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Receive verified listing briefs and market updates directly in your inbox.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>

                {/* Email Address Input Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="alert-email-input" className="block text-xs font-bold text-slate-700">
                      Email Address <span className="text-emerald-700">*</span>
                    </label>
                    {user?.email && (
                      <span className="text-[10px] text-slate-500">
                        Signed in as {user.email}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="alert-email-input"
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="e.g. privilegeoyegbile@gmail.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 shadow-2xs transition"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    We will send verified properties matching your filter criteria to this email address.
                  </p>
                </div>

                {/* Dedicated Toggle to Enable/Disable Daily Summary Emails */}
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          dailySummaryEmail
                            ? 'bg-amber-100 text-amber-700 border border-amber-300'
                            : 'bg-slate-200 text-slate-400 border border-slate-300'
                        }`}
                      >
                        <Sun className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor="daily-summary-toggle"
                            className="text-xs sm:text-sm font-bold text-slate-900 cursor-pointer"
                          >
                            Daily Summary Emails
                          </label>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              dailySummaryEmail
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-200 text-slate-600 border border-slate-300'
                            }`}
                          >
                            {dailySummaryEmail ? '☀️ Active • 8:00 AM WAT' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                          Receive a consolidated daily summary email of newly listed properties matching your saved search criteria every morning at 8:00 AM WAT.
                        </p>
                      </div>
                    </div>

                    {/* Interactive Toggle Switch */}
                    <button
                      id="daily-summary-toggle"
                      type="button"
                      role="switch"
                      aria-checked={dailySummaryEmail}
                      aria-label="Toggle daily summary emails for saved search criteria"
                      onClick={() => setDailySummaryEmail(!dailySummaryEmail)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 ${
                        dailySummaryEmail ? 'bg-emerald-700' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          dailySummaryEmail ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Additional Notification Channels (Push & WhatsApp) */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Additional Delivery Channels
                </label>

                {/* Instant Email Alerts Checkbox */}
                <div
                  className={`p-3 rounded-xl border transition ${
                    emailEnabled ? 'bg-white border-emerald-300 shadow-xs' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailEnabled}
                      onChange={(e) => setEmailEnabled(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-emerald-800 rounded border-slate-300 focus:ring-emerald-700"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        Instant Email Alerts
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Send immediate email notifications the minute an off-market or hot deal matching your search is published.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Browser Push Option */}
                <div
                  className={`p-3.5 rounded-xl border transition ${
                    pushEnabled ? 'bg-white border-indigo-300 shadow-xs' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex items-start gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={pushEnabled}
                        onChange={(e) => setPushEnabled(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-indigo-700 rounded border-slate-300 focus:ring-indigo-600"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Bell className="w-4 h-4 text-indigo-700" />
                          <span className="font-bold text-xs sm:text-sm text-slate-900">
                            Browser Push Notifications
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Instant desktop & mobile device popups without needing to open your email.
                        </p>
                      </div>
                    </label>

                    {/* Permission Status Pill */}
                    {pushPermission === 'granted' ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 rounded border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Permission Granted
                      </span>
                    ) : pushPermission === 'denied' ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold text-rose-800 bg-rose-50 rounded border border-rose-200">
                        Blocked in Browser
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRequestPushPermission}
                        className="px-2.5 py-1 text-[11px] font-bold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition cursor-pointer"
                      >
                        Enable Permission
                      </button>
                    )}
                  </div>

                  {pushEnabled && (
                    <div className="mt-3 pl-7 flex items-center justify-between text-xs text-slate-500">
                      <span>Preview notification format:</span>
                      <button
                        type="button"
                        onClick={() => handleTriggerTest()}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-[11px] flex items-center gap-1 transition cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3 text-indigo-600" />
                        <span>Send Test Alert</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* WhatsApp Alert Option */}
                <div
                  className={`p-3.5 rounded-xl border transition ${
                    whatsappEnabled ? 'bg-white border-emerald-300 shadow-xs' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={whatsappEnabled}
                      onChange={(e) => setWhatsappEnabled(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-emerald-700" />
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          WhatsApp Fast Ping (Nigeria / Diaspora)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Direct WhatsApp message with quick inspection links when hot off-market deals hit.
                      </p>
                    </div>
                  </label>

                  {whatsappEnabled && (
                    <div className="mt-3 pl-7">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setCustomPhone(e.target.value)}
                        placeholder="+234 803 123 4567"
                        required={whatsappEnabled}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Frequency Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Alert Frequency
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div
                    onClick={() => setFrequency('instant')}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      frequency === 'instant'
                        ? 'bg-emerald-50 border-emerald-400 shadow-xs text-emerald-950'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">⚡</span>
                      <h5 className="font-bold text-xs">Instant</h5>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      As soon as a property is uploaded or price drops.
                    </p>
                  </div>

                  <div
                    onClick={() => setFrequency('daily')}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      frequency === 'daily'
                        ? 'bg-emerald-50 border-emerald-400 shadow-xs text-emerald-950'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">☀️</span>
                      <h5 className="font-bold text-xs">Daily Digest</h5>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      One aggregated summary every morning at 8:00 AM WAT.
                    </p>
                  </div>

                  <div
                    onClick={() => setFrequency('weekly')}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      frequency === 'weekly'
                        ? 'bg-emerald-50 border-emerald-400 shadow-xs text-emerald-950'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">📊</span>
                      <h5 className="font-bold text-xs">Weekly Wrap</h5>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Every Monday morning with local price trend stats.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
                <span className="text-[11px] text-slate-500">
                  🔒 Zero spam guarantee. Unsubscribe with 1-click at any time.
                </span>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Bell className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
                    <span>{isSaving ? 'Saving to NeonDB...' : 'Activate Property Alert'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
