'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  Search,
  Bell,
  Plus,
  Calendar,
  ChevronDown,
  FileText,
  FileSpreadsheet,
  Receipt,
  Users,
  CreditCard,
  CheckCircle,
  Clock,
  AlertTriangle,
  Database,
  RefreshCw,
  LogOut,
  Settings,
  User as UserIcon,
} from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';

interface TopbarProps {
  onToggleMobileSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileSidebar }) => {
  const {
    setIsCommandPaletteOpen,
    supabaseStatus,
    syncWithSupabase,
    isSyncing,
    lastSyncedAt,
    organization,
  } = useAppData();
  const { user, signOut } = useAuth();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('01 mai 2025 - 31 mai 2025');
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const newMenuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (newMenuRef.current && !newMenuRef.current.contains(event.target as Node)) {
        setIsNewMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (periodRef.current && !periodRef.current.contains(event.target as Node)) {
        setIsPeriodOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 'n1',
      title: 'Paiement Wave reçu',
      desc: 'Societe ABC a réglé 2 450 000 FCFA pour la facture FAC-2025-0048.',
      time: 'Il y a 25 min',
      icon: CheckCircle,
      iconColor: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'n2',
      title: 'Facture consultée en ligne',
      desc: 'Global Business a ouvert la facture FAC-2025-0047.',
      time: 'Il y a 2 heures',
      icon: Clock,
      iconColor: 'text-brand-600 bg-brand-50',
    },
    {
      id: 'n3',
      title: 'Échéance dépassée',
      desc: 'La facture FAC-2025-0046 (Tech Solutions) est en retard de règlement.',
      time: 'Hier',
      icon: AlertTriangle,
      iconColor: 'text-rose-600 bg-rose-50',
    },
  ];

  const periodOptions = [
    '01 mai 2025 - 31 mai 2025',
    'Ce mois-ci (Mai 2025)',
    'Le mois dernier (Avril 2025)',
    'Ce trimestre (T2 2025)',
    'Cette année (2025)',
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
      {/* Left section: Hamburger & Search Input */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 -ml-1 text-slate-500 hover:text-slate-900 rounded-xl lg:hidden hover:bg-slate-100 transition-colors"
          aria-label="Ouvrir menu latéral"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar with ⌘K */}
        <div
          onClick={() => setIsCommandPaletteOpen(true)}
          className="relative flex-1 cursor-pointer group"
        >
          <div className="flex items-center w-full px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-400 bg-slate-50 border border-slate-200 rounded-xl group-hover:border-slate-300 group-hover:bg-white transition-all shadow-sm">
            <Search className="w-4 h-4 mr-2 text-slate-400 group-hover:text-slate-600 shrink-0" />
            <span className="text-xs text-slate-500 font-normal truncate">Rechercher une facture, un client...</span>
            <kbd className="hidden sm:inline-flex ml-auto pointer-events-none items-center gap-1 font-mono text-[10px] font-medium text-slate-400 bg-slate-200/70 border border-slate-300/60 px-1.5 py-0.5 rounded-md">
              <span>⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right section: Supabase Sync Badge, Date Range Picker, Notifications, + Nouvelle CTA */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Supabase Status Quick Pill */}
        <Link
          href="/integrations"
          title={`Base Supabase: ${supabaseStatus} ${lastSyncedAt ? `(Synchro: ${lastSyncedAt})` : ''}`}
          className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${
            supabaseStatus === 'connected'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70'
              : supabaseStatus === 'syncing'
              ? 'bg-sky-50 text-sky-700 border-sky-200 animate-pulse'
              : supabaseStatus === 'error'
              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/70'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>{supabaseStatus === 'connected' ? 'Cloud SQL' : 'Local / Démo'}</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              supabaseStatus === 'connected'
                ? 'bg-emerald-500'
                : supabaseStatus === 'syncing'
                ? 'bg-sky-500'
                : supabaseStatus === 'error'
                ? 'bg-rose-500'
                : 'bg-slate-400'
            }`}
          />
        </Link>

        {/* Date Range Picker */}
        <div className="relative hidden xl:block" ref={periodRef}>
          <button
            onClick={() => setIsPeriodOpen(!isPeriodOpen)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{selectedPeriod}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isPeriodOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-dropdown border border-slate-100 py-1.5 z-50 animate-fade-in">
              {periodOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setSelectedPeriod(opt);
                    setIsPeriodOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between ${
                    selectedPeriod === opt
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{opt}</span>
                  {selectedPeriod === opt && <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
              3
            </span>
          </button>

          {isNotificationsOpen && (
            <div className="fixed sm:absolute inset-x-3 sm:inset-x-auto sm:right-0 top-16 sm:top-auto sm:mt-2 w-auto sm:w-96 bg-white rounded-3xl sm:rounded-2xl shadow-dropdown border border-slate-100 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">Notifications</span>
                <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                  3 nouvelles
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto overscroll-contain">
                {notifications.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer"
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${item.iconColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-900 truncate">{item.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium py-1"
                >
                  Tout marquer comme lu
                </button>
              </div>
            </div>
          )}
        </div>

        {/* + Nouvelle CTA Button */}
        <div className="relative" ref={newMenuRef}>
          <button
            onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white rounded-xl font-semibold text-xs shadow-md shadow-brand-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvelle</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80 hidden sm:inline" />
          </button>

          {isNewMenuOpen && (
            <div className="fixed sm:absolute inset-x-3 sm:inset-x-auto sm:right-0 top-16 sm:top-auto sm:mt-2 w-auto sm:w-56 bg-white rounded-3xl sm:rounded-2xl shadow-dropdown border border-slate-100 p-2 z-50 animate-fade-in">
              <Link
                href="/factures/nouvelle"
                onClick={() => setIsNewMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
              >
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Créer une facture</p>
                  <p className="text-[10px] text-slate-400 font-normal">Calcul automatique TVA</p>
                </div>
              </Link>
              <Link
                href="/devis"
                onClick={() => setIsNewMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Créer un devis</p>
                  <p className="text-[10px] text-slate-400 font-normal">Convertible en 1-clic</p>
                </div>
              </Link>
              <Link
                href="/depenses"
                onClick={() => setIsNewMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
              >
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Enregistrer dépense</p>
                  <p className="text-[10px] text-slate-400 font-normal">Justificatif & TVA</p>
                </div>
              </Link>
              <Link
                href="/clients"
                onClick={() => setIsNewMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Ajouter un client</p>
                  <p className="text-[10px] text-slate-400 font-normal">Fiche CRM complète</p>
                </div>
              </Link>
              <Link
                href="/paiements"
                onClick={() => setIsNewMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
              >
                <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Encaisser paiement</p>
                  <p className="text-[10px] text-slate-400 font-normal">Wave, OM, Virement</p>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* User Account Avatar Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 sm:p-1.5 rounded-2xl hover:bg-slate-100/80 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            title="Mon Compte"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              <span>
                {(user?.full_name || organization.name || 'U')
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </span>
            </div>
            <div className="hidden md:block text-left text-xs">
              <p className="font-bold text-slate-900 leading-tight truncate max-w-[110px]">
                {user?.full_name || organization.name || 'Gérant'}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                {organization.subscription_plan === 'business' ? 'Entreprise' : organization.subscription_plan === 'starter' ? 'Starter' : 'Pro'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-dropdown border border-slate-100 p-2 z-50 animate-fade-in divide-y divide-slate-100">
              {/* Account details */}
              <div className="px-3 py-2.5">
                <p className="text-xs font-bold text-slate-900">
                  {user?.full_name || organization.name || 'Gérant'}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {user?.email || organization.email || 'contact@entreprise.sn'}
                </p>
                <div className="mt-2 flex items-center gap-1.5 px-2 py-1 bg-brand-50 text-brand-700 rounded-lg text-[10px] font-semibold w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
                  <span>Organisation: {organization.name}</span>
                </div>
              </div>

              {/* Menu Links */}
              <div className="py-1.5">
                <Link
                  href="/parametres"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Paramètres de l'entreprise</span>
                </Link>
                <Link
                  href="/abonnements"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>Abonnement ({(organization.subscription_plan || 'pro').toUpperCase()})</span>
                </Link>
              </div>

              {/* Logout Button */}
              <div className="pt-1.5">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Se déconnecter</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
