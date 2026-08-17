'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Plus, Users, Menu } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';

interface MobileBottomNavProps {
  onOpenMobileMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMobileMenu }) => {
  const pathname = usePathname();

  const isTabActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="no-print lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-lg safe-area-bottom"
      aria-label="Navigation mobile principale"
    >
      {/* Tableau de bord */}
      <Link
        href="/dashboard"
        className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all ${
          isTabActive('/dashboard') ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <LayoutDashboard className={`w-5 h-5 ${isTabActive('/dashboard') ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px] mt-0.5 font-medium">Accueil</span>
      </Link>

      {/* Factures */}
      <Link
        href="/factures"
        className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all ${
          isTabActive('/factures') && !pathname.includes('/nouvelle')
            ? 'text-brand-600 font-bold'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <FileText
          className={`w-5 h-5 ${
            isTabActive('/factures') && !pathname.includes('/nouvelle') ? 'stroke-[2.5]' : ''
          }`}
        />
        <span className="text-[10px] mt-0.5 font-medium">Factures</span>
      </Link>

      {/* Center + Action Button */}
      <Link
        href="/factures/nouvelle"
        className="flex items-center justify-center w-12 h-12 -mt-5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/35 active:scale-95 transition-transform ring-4 ring-white"
        aria-label="Créer une facture"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </Link>

      {/* Clients CRM */}
      <Link
        href="/clients"
        className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all ${
          isTabActive('/clients') ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Users className={`w-5 h-5 ${isTabActive('/clients') ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px] mt-0.5 font-medium">Clients</span>
      </Link>

      {/* Menu / All Pages Drawer Trigger */}
      <button
        type="button"
        onClick={onOpenMobileMenu}
        className="flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl text-slate-500 hover:text-slate-900 transition-all"
        aria-label="Ouvrir le menu complet"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 font-medium">Menu</span>
      </button>
    </nav>
  );
};
