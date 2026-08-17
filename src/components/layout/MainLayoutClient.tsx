'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { useAuth } from '@/context/AuthContext';
import { FileText } from 'lucide-react';

export const MainLayoutClient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isAuthRoute = pathname === '/login' || pathname === '/register' || pathname?.startsWith('/auth');

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isAuthRoute) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, isAuthRoute, router]);

  // If on Login/Register page, render auth frame without sidebar/topbar
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // Loading Splash Screen while verifying session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-xl shadow-brand-500/30 ring-4 ring-brand-500/20 mb-4 animate-bounce">
          <FileText className="w-7 h-7" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Chargement de FacturaPro...</span>
        </div>
      </div>
    );
  }

  // If not authenticated and not yet redirected, show nothing
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      {/* Fixed Left Sidebar (Desktop + Mobile Drawer) */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Topbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Floating Bottom Nav for Mobile Phones & Tablets */}
      <MobileBottomNav onOpenMobileMenu={() => setMobileSidebarOpen(true)} />
    </div>
  );
};
