'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  FileSpreadsheet,
  Receipt,
  Users,
  Package,
  CreditCard,
  BarChart3,
  Percent,
  RefreshCw,
  Settings,
  Puzzle,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  ChevronDown,
  X,
  LogOut,
} from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const pathname = usePathname();
  const { organization, updateSubscription } = useAppData();
  const { user, signOut } = useAuth();

  // Close mobile sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen && onCloseMobile) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, onCloseMobile]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navigationItems = [
    { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Factures', href: '/factures', icon: FileText, hasArrow: true },
    { name: 'Devis', href: '/devis', icon: FileSpreadsheet, hasArrow: true },
    { name: 'Dépenses', href: '/depenses', icon: Receipt },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Produits & Services', href: '/produits', icon: Package },
    { name: 'Paiements', href: '/paiements', icon: CreditCard, hasArrow: true },
    { name: 'Rapports', href: '/rapports', icon: BarChart3 },
    { name: 'Taxes', href: '/taxes', icon: Percent },
    { name: 'Abonnements', href: '/abonnements', icon: RefreshCw },
    { name: 'Paramètres', href: '/parametres', icon: Settings },
    { name: 'Intégrations', href: '/integrations', icon: Puzzle },
  ];

  const isActive = (itemHref: string, exact?: boolean) => {
    if (exact || itemHref === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(itemHref);
  };

  return (
    <>
      {/* Mobile Backdrop with Blur */}
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-2xl lg:shadow-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header with Mobile Close button */}
        <div className="h-16 flex items-center justify-between px-5 sm:px-6 border-b border-slate-100">
          <Link href="/dashboard" onClick={onCloseMobile} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2.2" />
                <path d="M7 8H17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M7 12H14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M7 16H11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Factura<span className="text-brand-600">Pro</span>
            </span>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={onCloseMobile}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links scrollable area */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1 overscroll-contain">
          {navigationItems.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      active ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.hasArrow && (
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      active ? 'text-white/80' : 'text-slate-300 group-hover:text-slate-500'
                    }`}
                  />
                )}
              </Link>
            );
          })}

          {/* Upgrade to Premium Card */}
          <div className="mt-6 mx-0.5 p-4 rounded-2xl bg-gradient-to-br from-brand-50/90 to-blue-100/60 border border-brand-200/60 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Passez à Premium
              </h4>
              <ul className="space-y-1.5 mb-3 text-xs text-slate-600">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span>Factures récurrentes</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span>Personnalisation avancée</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span>Gestion multi-utilisateurs</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span>Rapports avancés</span>
                </li>
              </ul>
              <button
                onClick={() => {
                  updateSubscription('business');
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full py-2.5 px-3 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all text-center flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Mettre à niveau
              </button>
            </div>
          </div>
        </div>

        {/* User profile footer */}
        <div className="p-3 border-t border-slate-100 bg-white space-y-1">
          <Link
            href="/parametres"
            onClick={onCloseMobile}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-brand-100 shrink-0">
                <span>
                  {(user?.full_name || organization.name || 'U')
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </span>
              </div>
              <div className="truncate text-left min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate group-hover:text-brand-600">
                  {user?.full_name || organization.name || 'Gérant'}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {user?.email || organization.email || 'contact@entreprise.sn'}
                </p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
          </Link>

          <button
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              signOut();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>
    </>
  );
};
