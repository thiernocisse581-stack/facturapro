'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Smartphone,
  CreditCard,
  Layers,
  Users,
  PieChart,
  DollarSign,
  Send,
  Sparkles,
  Menu,
  X,
  Star,
  Check,
  TrendingUp,
  Clock,
  ChevronRight,
  Globe,
  Building,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { WaveLogo, OrangeMoneyLogo } from '@/components/ui/BrandLogos';
import LiveDemoModal from '@/components/home/LiveDemoModal';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  // Parallax Stage Refs
  const stageRef = useRef<HTMLDivElement>(null);
  const dashRef = useRef<HTMLDivElement>(null);
  const floatPaymentRef = useRef<HTMLDivElement>(null);
  const floatCustomerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for Reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Magnetic button hover effect
  const handleMagneticMove = (e: React.PointerEvent<HTMLElement>) => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) return;
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    target.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  };

  const handleMagneticLeave = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.transform = '';
  };

  // 3D Parallax on Stage
  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.innerWidth <= 1024) return;
    if (!stageRef.current || !dashRef.current) return;

    const rect = stageRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    dashRef.current.style.transform = `perspective(1450px) rotateY(${px * 4.5}deg) rotateX(${py * -3}deg) translateZ(4px)`;

    if (floatPaymentRef.current) {
      floatPaymentRef.current.style.transform = `rotate(-3deg) translate3d(${px * 16}px, ${py * 12}px, 16px)`;
    }
    if (floatCustomerRef.current) {
      floatCustomerRef.current.style.transform = `rotate(3deg) translate3d(${px * -16}px, ${py * -10}px, 16px)`;
    }
  };

  const handleStagePointerLeave = () => {
    if (dashRef.current) dashRef.current.style.transform = '';
    if (floatPaymentRef.current) floatPaymentRef.current.style.transform = 'rotate(-4deg)';
    if (floatCustomerRef.current) floatCustomerRef.current.style.transform = 'rotate(4deg)';
  };

  // 3D Tilt for feature & pricing cards
  const handleCardTilt = (e: React.PointerEvent<HTMLElement>) => {
    if (typeof window !== 'undefined' && window.innerWidth <= 900) return;
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    target.style.transform = `perspective(900px) rotateX(${py * -3.5}deg) rotateY(${px * 3.5}deg) translateY(-4px) translateZ(2px)`;
  };

  const handleCardLeave = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.transform = '';
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-500/20 selection:text-brand-900 overflow-x-hidden">
      {/* =========================================================================
          NAVIGATION HEADER (Sticky Glassmorphic)
          ========================================================================= */}
      <header className="sticky top-2 sm:top-3.5 z-50 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center justify-between min-h-[58px] sm:min-h-[68px] px-3.5 sm:px-6 py-1.5 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-full shadow-lg shadow-slate-900/[0.04]">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 font-heading font-extrabold text-base sm:text-xl tracking-tight text-slate-900 shrink-0">
              <div className="w-7 h-7 sm:w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 via-sky-500 to-cyan-400 flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-md shadow-brand-500/30">
                FP
              </div>
              <span>Factura<span className="text-brand-600">Pro</span></span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-500 mb-1.5"></span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs xl:text-sm font-medium text-slate-600">
              <a href="#probleme" className="hover:text-brand-600 transition-colors">Pourquoi FacturaPro</a>
              <a href="#fonctionnalites" className="hover:text-brand-600 transition-colors">Fonctionnalités</a>
              <a href="#comment" className="hover:text-brand-600 transition-colors">Comment ça marche</a>
              <a href="#tarifs" className="hover:text-brand-600 transition-colors">Tarifs</a>
              <a href="#temoignages" className="hover:text-brand-600 transition-colors">Témoignages</a>
            </div>

            {/* Actions (Desktop) */}
            <div className="hidden sm:flex items-center gap-2.5">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  onPointerMove={handleMagneticMove}
                  onPointerLeave={handleMagneticLeave}
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-bold text-xs shadow-md shadow-brand-600/25 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                  <span>Mon Tableau de bord</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onPointerMove={handleMagneticMove}
                    onPointerLeave={handleMagneticLeave}
                    className="px-3.5 py-2 text-slate-700 hover:text-slate-900 font-semibold text-xs transition-colors"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/register"
                    onPointerMove={handleMagneticMove}
                    onPointerLeave={handleMagneticLeave}
                    className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-700 hover:to-cyan-600 text-white rounded-full font-bold text-xs shadow-md shadow-brand-600/25 transition-all"
                  >
                    <span>Commencer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </nav>

          {/* Mobile Drawer Dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-2 p-4 sm:p-5 bg-white/98 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl space-y-3 animate-fade-in">
              <div className="flex flex-col gap-2 font-medium text-sm text-slate-700">
                <a
                  href="#probleme"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Pourquoi FacturaPro
                </a>
                <a
                  href="#fonctionnalites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Fonctionnalités
                </a>
                <a
                  href="#comment"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Comment ça marche
                </a>
                <a
                  href="#tarifs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Tarifs
                </a>
                <a
                  href="#temoignages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Témoignages
                </a>
              </div>
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold text-center text-xs"
                  >
                    Mon Tableau de bord
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="w-full py-2.5 border border-slate-200 text-slate-800 rounded-xl font-bold text-center text-xs"
                    >
                      Se connecter
                    </Link>
                    <Link
                      href="/register"
                      className="w-full py-3 bg-gradient-to-r from-brand-600 to-cyan-500 text-white rounded-xl font-bold text-center text-xs shadow-md shadow-brand-600/25"
                    >
                      Commencer gratuitement
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
        {/* Background Light Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[340px] sm:w-[700px] h-[340px] sm:h-[500px] bg-gradient-to-b from-cyan-400/10 via-brand-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-cyan-50 border border-cyan-200/80 rounded-full text-cyan-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-5 sm:mb-6 reveal">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse-glow"></span>
              <span>Facturation &amp; Trésorerie conçue pour l'Afrique 🌍</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-7xl tracking-tight text-slate-900 leading-[1.1] reveal delay-1">
              Fini les factures sur Word <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-sky-500 to-cyan-500">
                &amp; les calculs sur Excel.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 sm:mt-6 text-sm sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed reveal delay-2 px-2 sm:px-0">
              FacturaPro transforme votre facturation en quelques clics : factures certifiées <strong>OHADA</strong>, <strong>TVA 18% automatique</strong>, encaissements directs <strong>Wave &amp; Orange Money</strong> et trésorerie suivie en temps réel.
            </p>

            {/* CTA Buttons */}
            <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 reveal delay-3">
              <Link
                href="/register"
                onPointerMove={handleMagneticMove}
                onPointerLeave={handleMagneticLeave}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-700 hover:to-cyan-600 text-white rounded-full font-bold text-xs sm:text-sm shadow-xl shadow-brand-600/30 transition-all transform hover:-translate-y-0.5"
              >
                <span>Commencer gratuitement</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => setDemoModalOpen(true)}
                onPointerMove={handleMagneticMove}
                onPointerLeave={handleMagneticLeave}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-cyan-400 rounded-full font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all group"
              >
                <Sparkles className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" />
                <span>Explorer la démo live</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-5 sm:mt-6 flex items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-500 flex-wrap reveal delay-3">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-600" />
              <span>Sans carte bancaire</span>
              <span className="text-slate-300">·</span>
              <span>Conforme NINEA &amp; RCCM</span>
              <span className="text-slate-300">·</span>
              <span>Prêt en 60s</span>
            </div>
          </div>

          {/* =====================================================================
              3D PARALLAX DASHBOARD STAGE (#demo)
              ===================================================================== */}
          <div
            id="demo"
            ref={stageRef}
            onPointerMove={handleStagePointerMove}
            onPointerLeave={handleStagePointerLeave}
            className="relative mt-10 sm:mt-20 max-w-5xl mx-auto flex flex-col items-center reveal delay-2 cursor-default"
          >
            {/* Stage Floor Glow */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-36 bg-gradient-to-r from-cyan-400/20 via-brand-500/20 to-sky-400/20 blur-2xl rounded-full pointer-events-none -z-10" />

            {/* Mobile / Tablet Horizontal Highlights (Displayed cleanly above mockup without overlap) */}
            <div className="xl:hidden w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 z-20">
              <div className="p-3.5 sm:p-4 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-md flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <WaveLogo className="w-9 h-9 shrink-0 shadow-sm rounded-xl" />
                  <div>
                    <div className="text-[11px] font-bold text-slate-500">Paiement Wave reçu</div>
                    <div className="font-heading font-extrabold text-sm text-slate-900">+ 185 000 FCFA</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold rounded-full text-[10px] border border-emerald-200/60">
                  Payée ✓
                </span>
              </div>

              <div className="p-3.5 sm:p-4 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-md flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <OrangeMoneyLogo className="w-9 h-9 shrink-0 shadow-sm rounded-xl" />
                  <div>
                    <div className="text-[11px] font-bold text-slate-500">Orange Money reçu</div>
                    <div className="font-heading font-extrabold text-sm text-slate-900">+ 320 000 FCFA</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-extrabold rounded-full text-[10px] border border-amber-200/60">
                  Payée ✓
                </span>
              </div>
            </div>

            {/* Desktop Floating Widget 1: Wave Payment Alert (xl only, positioned outside bounds without overlap) */}
            <div
              ref={floatPaymentRef}
              className="hidden xl:block float-payment-anim absolute -left-12 top-20 z-20 w-56 p-4 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl shadow-slate-900/10 pointer-events-none"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <WaveLogo className="w-5 h-5 rounded-md shrink-0" />
                  <span className="text-cyan-900">Wave Mobile</span>
                </span>
                <span className="text-emerald-600 font-extrabold">✓ Reçu</span>
              </div>
              <div className="font-heading font-extrabold text-xl text-slate-900 mt-2 tracking-tight">
                + 185 000 FCFA
              </div>
              <div className="text-xs text-emerald-700 font-bold mt-1 flex items-center gap-1">
                <span>Facture #FAC-2025-0048</span>
                <span className="text-emerald-500">· Payée</span>
              </div>
            </div>

            {/* Desktop Floating Widget 2: Orange Money Alert (xl only) */}
            <div
              ref={floatCustomerRef}
              className="hidden xl:block float-customer-anim absolute -right-12 top-10 z-20 w-56 p-4 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl shadow-slate-900/10 pointer-events-none"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <OrangeMoneyLogo className="w-5 h-5 rounded-md shrink-0" />
                  <span className="text-orange-900">Orange Money</span>
                </span>
                <span className="text-amber-600 font-extrabold">✓ Reçu</span>
              </div>
              <div className="font-heading font-extrabold text-xl text-slate-900 mt-2 tracking-tight">
                + 320 000 FCFA
              </div>
              <div className="text-xs text-slate-600 font-medium mt-1 flex items-center justify-between">
                <span>Maison Akwa</span>
                <span className="text-slate-400">Dakar</span>
              </div>
            </div>

            {/* Interactive Dashboard Mockup Card */}
            <div
              ref={dashRef}
              className="relative z-10 w-full bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.12)] overflow-hidden transition-transform duration-200 ease-out"
            >
              {/* Mockup Header Bar */}
              <div className="flex items-center justify-between min-h-[50px] sm:min-h-[58px] px-4 sm:px-6 bg-slate-50/90 border-b border-slate-100">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center font-black text-[10px] sm:text-xs shrink-0">
                    FP
                  </div>
                  <span className="font-heading font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                    FacturaPro Workspace
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] sm:text-xs font-bold rounded-full">
                    Sénégal · XOF (FCFA)
                  </span>
                  <span className="hidden md:inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] sm:text-xs font-bold rounded-full border border-emerald-200/60">
                    Supabase Cloud Sync ✓
                  </span>
                </div>
              </div>

              {/* Mockup Body */}
              <div className="grid grid-cols-1 md:grid-cols-[170px_1fr]">
                {/* Mockup Sidebar (Desktop) */}
                <div className="hidden md:block p-3.5 bg-slate-50/50 border-r border-slate-100 text-xs font-semibold text-slate-600 space-y-1">
                  <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 px-3 py-1.5">
                    Gestion
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-cyan-50 text-brand-700 font-bold flex items-center gap-2">
                    <PieChart className="w-3.5 h-3.5" />
                    <span>Vue globale</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-600 flex items-center gap-2 transition-colors">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Factures</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-600 flex items-center gap-2 transition-colors">
                    <Users className="w-3.5 h-3.5" />
                    <span>Clients CRM</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-600 flex items-center gap-2 transition-colors">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Encaissements</span>
                  </div>
                </div>

                {/* Mockup Main Content */}
                <div className="p-3.5 sm:p-6 bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 sm:pb-4 border-b border-slate-100">
                    <div>
                      <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Bonjour, Nasser 👋</div>
                      <div className="font-heading font-extrabold text-sm sm:text-xl text-slate-900 tracking-tight">
                        Votre trésorerie en direct
                      </div>
                    </div>
                    <Link
                      href="/factures/nouvelle"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/25 transition-all shrink-0 self-start sm:self-auto"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>+ Nouvelle facture</span>
                    </Link>
                  </div>

                  {/* 3 KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 my-3 sm:my-4">
                    <div className="p-3 sm:p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chiffre facturé</div>
                      <div className="font-heading font-extrabold text-sm sm:text-lg text-slate-900 mt-1">2 480 000 <span className="text-[10px] sm:text-xs text-slate-500 font-semibold">FCFA</span></div>
                      <div className="text-[10px] text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +18.4% ce mois
                      </div>
                    </div>

                    <div className="p-3 sm:p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">En attente</div>
                      <div className="font-heading font-extrabold text-sm sm:text-lg text-amber-600 mt-1">640 000 <span className="text-[10px] sm:text-xs text-slate-500 font-semibold">FCFA</span></div>
                      <div className="text-[10px] text-slate-500 font-bold mt-0.5">4 factures à échéance</div>
                    </div>

                    <div className="p-3 sm:p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Encaissé Wave/OM</div>
                      <div className="font-heading font-extrabold text-sm sm:text-lg text-emerald-600 mt-1">1 840 000 <span className="text-[10px] sm:text-xs text-slate-500 font-semibold">FCFA</span></div>
                      <div className="text-[10px] text-emerald-600 font-bold mt-0.5">74% du total réglé</div>
                    </div>
                  </div>

                  {/* Factures Table Preview (Fully Responsive) */}
                  <div className="border border-slate-200/80 rounded-2xl overflow-hidden text-xs">
                    <div className="hidden sm:grid grid-cols-4 p-2.5 bg-slate-50 font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                      <span>Client</span>
                      <span>Montant</span>
                      <span>Statut</span>
                      <span className="text-right">Date</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {/* Row 1 */}
                      <div className="p-2.5 sm:p-2.5 hover:bg-slate-50/50 transition-colors">
                        <div className="hidden sm:grid grid-cols-4 items-center">
                          <span className="font-bold text-slate-800">Studio Dakar</span>
                          <span className="text-slate-600 font-semibold">250 000 FCFA</span>
                          <span><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold rounded-full text-[10px]">Payée</span></span>
                          <span className="text-right text-slate-400 text-[11px]">16 août</span>
                        </div>
                        <div className="flex sm:hidden items-center justify-between gap-2">
                          <div>
                            <div className="font-bold text-slate-800 text-xs">Studio Dakar</div>
                            <div className="text-[10px] text-slate-400">16 août</div>
                          </div>
                          <div className="text-right">
                            <div className="text-slate-800 font-bold text-xs">250 000 FCFA</div>
                            <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold rounded-full text-[9px]">Payée</span>
                          </div>
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div className="p-2.5 sm:p-2.5 hover:bg-slate-50/50 transition-colors">
                        <div className="hidden sm:grid grid-cols-4 items-center">
                          <span className="font-bold text-slate-800">Maison Akwa</span>
                          <span className="text-slate-600 font-semibold">420 000 FCFA</span>
                          <span><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold rounded-full text-[10px]">Payée</span></span>
                          <span className="text-right text-slate-400 text-[11px]">14 août</span>
                        </div>
                        <div className="flex sm:hidden items-center justify-between gap-2">
                          <div>
                            <div className="font-bold text-slate-800 text-xs">Maison Akwa</div>
                            <div className="text-[10px] text-slate-400">14 août</div>
                          </div>
                          <div className="text-right">
                            <div className="text-slate-800 font-bold text-xs">420 000 FCFA</div>
                            <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold rounded-full text-[9px]">Payée</span>
                          </div>
                        </div>
                      </div>

                      {/* Row 3 */}
                      <div className="p-2.5 sm:p-2.5 hover:bg-slate-50/50 transition-colors">
                        <div className="hidden sm:grid grid-cols-4 items-center">
                          <span className="font-bold text-slate-800">Teranga Digital</span>
                          <span className="text-slate-600 font-semibold">180 000 FCFA</span>
                          <span><span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-extrabold rounded-full text-[10px]">En attente</span></span>
                          <span className="text-right text-slate-400 text-[11px]">10 août</span>
                        </div>
                        <div className="flex sm:hidden items-center justify-between gap-2">
                          <div>
                            <div className="font-bold text-slate-800 text-xs">Teranga Digital</div>
                            <div className="text-[10px] text-slate-400">10 août</div>
                          </div>
                          <div className="text-right">
                            <div className="text-slate-800 font-bold text-xs">180 000 FCFA</div>
                            <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-700 font-extrabold rounded-full text-[9px]">En attente</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1 : LE PROBLÈME
          ========================================================================= */}
      <section id="probleme" className="py-16 sm:py-28 bg-slate-50/60 border-t border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl reveal">
            <div className="text-brand-600 text-xs font-extrabold uppercase tracking-widest">Le constat</div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight mt-3">
              La facturation ne devrait pas vous faire perdre des heures.
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              Entre les fichiers Word disparates, les calculs manuels de TVA 18% et les relances oubliées sur WhatsApp, une simple facture peut rapidement bloquer votre trésorerie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
            {/* Card 1 */}
            <div
              onPointerMove={handleCardTilt}
              onPointerLeave={handleCardLeave}
              className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden reveal"
            >
              <div className="text-[11px] font-extrabold text-slate-400 tracking-wider">01 — CRÉDIBILITÉ</div>
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center my-4 sm:my-6">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                Des factures Word qui manquent de professionnalisme
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 sm:mt-3 leading-relaxed">
                Des modèles Word bricolés sans mentions légales NINEA / RCCM nuisent à votre image auprès des grands comptes et clients exigeants.
              </p>
            </div>

            {/* Card 2 */}
            <div
              onPointerMove={handleCardTilt}
              onPointerLeave={handleCardLeave}
              className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden reveal delay-1"
            >
              <div className="text-[11px] font-extrabold text-slate-400 tracking-wider">02 — CONFORMITÉ</div>
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center my-4 sm:my-6">
                <CalculatorIcon />
              </div>
              <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                La TVA 18% et le Hors Taxes calculés à la main
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 sm:mt-3 leading-relaxed">
                Un taux mal appliqué ou une erreur d'arrondi sur Excel crée des litiges fiscaux et ralentit la validation de vos paiements.
              </p>
            </div>

            {/* Card 3 */}
            <div
              onPointerMove={handleCardTilt}
              onPointerLeave={handleCardLeave}
              className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden reveal delay-2"
            >
              <div className="text-[11px] font-extrabold text-slate-400 tracking-wider">03 — TRÉSORERIE</div>
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center my-4 sm:my-6">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                Des créances perdues dans les conversations
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 sm:mt-3 leading-relaxed">
                Quand vos échéances vivent dans votre mémoire et vos discussions WhatsApp, les factures en retard s'accumulent sans que vous puissiez agir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 : FONCTIONNALITÉS
          ========================================================================= */}
      <section id="fonctionnalites" className="py-16 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 sm:gap-12 lg:gap-16 items-start">
            <div className="reveal">
              <div className="text-brand-600 text-xs font-extrabold uppercase tracking-widest">Fonctionnalités Clés</div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight mt-3">
                Tout ce qu'il faut pour facturer et encaisser vite.
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                Une interface moderne, ultra-réactive, pensée pour les entrepreneurs, consultants, agences et PME d'Afrique de l'Ouest.
              </p>

              <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-gradient-to-br from-cyan-50 to-brand-50/30 border border-cyan-100 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-900">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Conforme normes fiscales UEMOA / OHADA</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-900">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span className="flex items-center gap-1.5 flex-wrap">
                    <span>Passerelles</span>
                    <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-cyan-200/80 shadow-2xs">
                      <WaveLogo className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold text-cyan-800">Wave</span>
                    </span>
                    <span>&amp;</span>
                    <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-orange-200/80 shadow-2xs">
                      <OrangeMoneyLogo className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold text-orange-800">Orange Money</span>
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-900">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Synchronisation Cloud Supabase PostgreSQL</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Feature 1 */}
              <div
                onPointerMove={handleCardTilt}
                onPointerLeave={handleCardLeave}
                className="p-5 sm:p-7 bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-xl hover:border-cyan-200 transition-all reveal"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-4 sm:mb-5 shadow-sm">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-base sm:text-xl text-slate-900 tracking-tight">
                  Factures &amp; Devis certifiés en 2 clics
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 sm:mt-2.5 leading-relaxed">
                  Ajoutez vos articles du catalogue, sélectionnez votre client et téléchargez un <strong>PDF haute résolution</strong> conforme OHADA.
                </p>
              </div>

              {/* Feature 2 */}
              <div
                onPointerMove={handleCardTilt}
                onPointerLeave={handleCardLeave}
                className="p-5 sm:p-7 bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-xl hover:border-cyan-200 transition-all reveal delay-1"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4 sm:mb-5 shadow-sm">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-base sm:text-xl text-slate-900 tracking-tight">
                  TVA 18% &amp; Totaux automatiques
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 sm:mt-2.5 leading-relaxed">
                  Le montant Hors Taxes (HT), la TVA à 18.00% et le montant TTC sont ventilés en direct sans calculatrice ni formule Excel.
                </p>
              </div>

              {/* Feature 3 */}
              <div
                onPointerMove={handleCardTilt}
                onPointerLeave={handleCardLeave}
                className="p-5 sm:p-7 bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-xl hover:border-cyan-200 transition-all reveal delay-2"
              >
                <div className="flex items-center gap-2 mb-4 sm:mb-5">
                  <div className="p-1.5 bg-sky-50 border border-sky-100 rounded-2xl shadow-sm">
                    <WaveLogo className="w-8 h-8 rounded-xl" />
                  </div>
                  <div className="p-1.5 bg-orange-50 border border-orange-100 rounded-2xl shadow-sm">
                    <OrangeMoneyLogo className="w-8 h-8 rounded-xl" />
                  </div>
                </div>
                <h3 className="font-heading font-extrabold text-base sm:text-xl text-slate-900 tracking-tight">
                  Encaissements Wave &amp; Orange Money
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 sm:mt-2.5 leading-relaxed">
                  Enregistrez vos paiements reçus par <strong>Wave</strong>, <strong>Orange Money</strong>, virement ou carte bancaire avec reçu instantané.
                </p>
              </div>

              {/* Feature 4 */}
              <div
                onPointerMove={handleCardTilt}
                onPointerLeave={handleCardLeave}
                className="p-5 sm:p-7 bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-xl hover:border-cyan-200 transition-all reveal delay-3"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4 sm:mb-5 shadow-sm">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-base sm:text-xl text-slate-900 tracking-tight">
                  CRM Clients &amp; Relances WhatsApp
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 sm:mt-2.5 leading-relaxed">
                  Consultez le solde dû de chaque client, l'historique de ses factures et transmettez vos liens de règlement par <strong>WhatsApp en 1 clic</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 : COMMENT ÇA MARCHE
          ========================================================================= */}
      <section id="comment" className="py-16 sm:py-28 bg-slate-50/60 border-t border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl text-center mx-auto reveal">
            <div className="text-brand-600 text-xs font-extrabold uppercase tracking-widest">Simplicité Absolue</div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight mt-3">
              De zéro à votre première facture en 3 étapes.
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600">
              Aucune connaissance comptable requise. Votre espace démarre propre et prêt à l'emploi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mt-10 sm:mt-14">
            {/* Step 1 */}
            <div
              onPointerMove={handleCardTilt}
              onPointerLeave={handleCardLeave}
              className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-sm relative reveal"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center">
                01
              </div>
              <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight mt-6 sm:mt-10">
                Inscrivez votre entreprise
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 sm:mt-3 leading-relaxed">
                Renseignez votre raison sociale, vos identifiants fiscaux (NINEA, RCCM) et votre logo en moins d'une minute.
              </p>
            </div>

            {/* Step 2 */}
            <div
              onPointerMove={handleCardTilt}
              onPointerLeave={handleCardLeave}
              className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-sm relative reveal delay-1"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center">
                02
              </div>
              <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight mt-6 sm:mt-10">
                Créez votre facture ou devis
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 sm:mt-3 leading-relaxed">
                Sélectionnez le client, ajoutez vos prestations et laissez FacturaPro générer le numéro séquentiel et les calculs de TVA.
              </p>
            </div>

            {/* Step 3 */}
            <div
              onPointerMove={handleCardTilt}
              onPointerLeave={handleCardLeave}
              className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-sm relative reveal delay-2"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cyan-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center">
                03
              </div>
              <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight mt-6 sm:mt-10">
                Transmettez &amp; Encaissez
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 sm:mt-3 leading-relaxed">
                Envoyez le PDF par Email ou lien direct WhatsApp, enregistrez les règlements Wave / OM et visualisez vos métriques réelles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 : TÉMOIGNAGES
          ========================================================================= */}
      <section id="temoignages" className="py-16 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl reveal">
            <div className="text-brand-600 text-xs font-extrabold uppercase tracking-widest">Retours d'expérience</div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight mt-3">
              Adopté par les entrepreneurs qui valorisent leur temps.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mt-8 sm:mt-12">
            {/* Testimonial 1 */}
            <div
              onPointerMove={handleCardTilt}
              onPointerLeave={handleCardLeave}
              className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-sm flex flex-col justify-between reveal"
            >
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                  « Avant, chaque facture me prenait 20 minutes entre le modèle Word et la vérification des montants. Avec FacturaPro, je l'envoie en 3 clics avec mes mentions NINEA et RCCM certifiées. »
                </p>
              </div>
              <div className="flex items-center gap-3 pt-5 border-t border-slate-100 mt-5 sm:mt-6">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cyan-100 text-cyan-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                  AF
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Aminata Fall</div>
                  <div className="text-[11px] text-slate-400">Consultante en Stratégie · Dakar</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div
              onPointerMove={handleCardTilt}
              onPointerLeave={handleCardLeave}
              className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-sm flex flex-col justify-between reveal delay-1"
            >
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                  « La visibilité sur les factures en attente et l'envoi direct sur WhatsApp ont complètement transformé mes encaissements. Les clients paient 2 fois plus vite via Wave. »
                </p>
              </div>
              <div className="flex items-center gap-3 pt-5 border-t border-slate-100 mt-5 sm:mt-6">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-100 text-brand-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                  KK
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Kevin Kouassi</div>
                  <div className="text-[11px] text-slate-400">Fondateur Studio Créatif · Abidjan</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div
              onPointerMove={handleCardTilt}
              onPointerLeave={handleCardLeave}
              className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-sm flex flex-col justify-between reveal delay-2"
            >
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                  « Le calcul automatique de la TVA 18% et le journal des dépenses nous font gagner un temps fou à la fin du mois pour notre déclaration fiscale. Un outil indispensable. »
                </p>
              </div>
              <div className="flex items-center gap-3 pt-5 border-t border-slate-100 mt-5 sm:mt-6">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-100 text-indigo-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                  MN
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Marc Ndong</div>
                  <div className="text-[11px] text-slate-400">Directeur d'Agence · Douala &amp; Dakar</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 : TARIFS (Grille transparente en FCFA)
          ========================================================================= */}
      <section id="tarifs" className="py-16 sm:py-28 bg-slate-50/60 border-t border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl text-center mx-auto reveal">
            <div className="text-brand-600 text-xs font-extrabold uppercase tracking-widest">Tarification Transparente</div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight mt-3">
              Commencez gratuitement. Évoluez avec votre activité.
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600">
              Des forfaits clairs libellés en <strong>FCFA (XOF)</strong>, sans frais cachés ni engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-10 sm:mt-14 items-stretch">
            {/* Starter Plan */}
            <div
              onPointerMove={handleCardTilt}
              onPointerLeave={handleCardLeave}
              className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-sm flex flex-col justify-between relative reveal"
            >
              <div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900">Starter</h3>
                <p className="text-xs text-slate-500 mt-1">Pour tester et émettre vos premières factures.</p>
                <div className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 mt-5 sm:mt-6 tracking-tight">
                  0 <span className="text-xs font-bold text-slate-400">FCFA / mois</span>
                </div>
                <ul className="mt-5 sm:mt-6 space-y-2.5 sm:space-y-3 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Jusqu'à 5 factures / mois</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>1 utilisateur administrateur</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Calcul TVA 18% automatique</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Export PDF conforme OHADA</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register?plan=starter"
                className="mt-6 sm:mt-8 w-full py-3 sm:py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full font-bold text-center text-xs transition-colors"
              >
                Commencer gratuitement
              </Link>
            </div>

            {/* Pro Plan (Featured) */}
            <div
              onPointerMove={handleCardTilt}
              onPointerLeave={handleCardLeave}
              className="p-6 sm:p-8 bg-white border-2 border-brand-500 rounded-3xl shadow-xl shadow-brand-600/10 flex flex-col justify-between relative transform lg:-translate-y-2 reveal delay-1"
            >
              <div className="absolute -top-3.5 right-6 px-3.5 py-1 bg-gradient-to-r from-brand-600 to-cyan-500 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-md">
                Le plus choisi
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900">Professionnel</h3>
                <p className="text-xs text-slate-500 mt-1">Pour indépendants et entreprises en croissance.</p>
                <div className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 mt-5 sm:mt-6 tracking-tight">
                  5 000 <span className="text-xs font-bold text-slate-400">FCFA / mois</span>
                </div>
                <ul className="mt-5 sm:mt-6 space-y-2.5 sm:space-y-3 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-600 shrink-0 font-bold" />
                    <span className="font-bold">Factures &amp; Devis illimités</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>Clients &amp; Articles illimités</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>Paiements Wave &amp; Orange Money</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>Suivi des dépenses &amp; Déclaration TVA</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>5 membres d'équipe</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register?plan=pro"
                className="mt-6 sm:mt-8 w-full py-3 sm:py-3.5 bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-700 hover:to-cyan-600 text-white rounded-full font-bold text-center text-xs shadow-lg shadow-brand-600/25 transition-all"
              >
                Choisir le forfait Pro
              </Link>
            </div>

            {/* Business Plan */}
            <div
              onPointerMove={handleCardTilt}
              onPointerLeave={handleCardLeave}
              className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-sm flex flex-col justify-between relative reveal delay-2 md:col-span-2 lg:col-span-1"
            >
              <div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900">Entreprise</h3>
                <p className="text-xs text-slate-500 mt-1">Pour les équipes et structures établies.</p>
                <div className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 mt-5 sm:mt-6 tracking-tight">
                  15 000 <span className="text-xs font-bold text-slate-400">FCFA / mois</span>
                </div>
                <ul className="mt-5 sm:mt-6 space-y-2.5 sm:space-y-3 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Toutes les fonctionnalités Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Utilisateurs illimités avec rôles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Export comptable Excel / CSV</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Support dédié WhatsApp 7j/7</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register?plan=business"
                className="mt-6 sm:mt-8 w-full py-3 sm:py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full font-bold text-center text-xs transition-colors"
              >
                Passer en Entreprise
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6 : FINAL CALL TO ACTION BOX
          ========================================================================= */}
      <section className="py-12 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl sm:rounded-[40px] bg-gradient-to-tr from-slate-950 via-slate-900 to-brand-950 border border-slate-800 p-6 sm:p-12 lg:p-16 text-center text-white shadow-2xl reveal">
            {/* Background radial elements */}
            <div className="absolute -top-32 -left-32 w-64 sm:w-80 h-64 sm:h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-64 sm:w-80 h-64 sm:h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/15 rounded-full text-cyan-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FacturaPro SaaS</span>
              </div>

              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-6xl tracking-tight leading-[1.15]">
                Rejoignez les entrepreneurs qui facturent comme des pros.
              </h2>

              <p className="mt-4 sm:mt-5 text-sm sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
                Créez votre première facture certifiée gratuitement et mettez de l'ordre dans votre gestion dès aujourd'hui.
              </p>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/register"
                  onPointerMove={handleMagneticMove}
                  onPointerLeave={handleMagneticLeave}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-cyan-400 to-brand-500 hover:from-cyan-300 hover:to-brand-400 text-slate-950 rounded-full font-extrabold text-xs sm:text-sm shadow-xl shadow-cyan-400/20 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Créer mon compte gratuitement</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 sm:py-4 text-white/80 hover:text-white font-semibold text-xs transition-colors"
                >
                  Déjà un compte ? Se connecter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
          ========================================================================= */}
      <footer className="pt-10 sm:pt-12 pb-8 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between gap-8 sm:gap-10 items-start">
            <div>
              <Link href="/" className="flex items-center gap-2.5 font-heading font-extrabold text-xl tracking-tight text-slate-900">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-600 via-sky-500 to-cyan-400 flex items-center justify-center text-white font-black text-xs">
                  FP
                </div>
                <span>Factura<span className="text-brand-600">Pro</span></span>
              </Link>
              <p className="mt-3 text-xs text-slate-500 max-w-xs leading-relaxed">
                Le logiciel de facturation et de trésorerie B2B moderne pour les entrepreneurs, agences et PME en Afrique de l'Ouest.
              </p>
              <div className="flex items-center gap-3 mt-4 text-xs font-semibold text-slate-400">
                <span>Dakar</span>
                <span>·</span>
                <span>Abidjan</span>
                <span>·</span>
                <span>Douala</span>
                <span>·</span>
                <span>Lomé</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 w-full md:w-auto">
              <div>
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-3">Produit</h4>
                <ul className="space-y-2 text-xs font-medium text-slate-600">
                  <li><a href="#fonctionnalites" className="hover:text-brand-600 transition-colors">Fonctionnalités</a></li>
                  <li><a href="#comment" className="hover:text-brand-600 transition-colors">Comment ça marche</a></li>
                  <li><a href="#tarifs" className="hover:text-brand-600 transition-colors">Tarifs en FCFA</a></li>
                  <li><Link href="/dashboard" className="hover:text-brand-600 transition-colors">Démo live</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-3">Conformité</h4>
                <ul className="space-y-2 text-xs font-medium text-slate-600">
                  <li><Link href="/taxes" className="hover:text-brand-600 transition-colors">TVA 18% UEMOA</Link></li>
                  <li><Link href="/parametres" className="hover:text-brand-600 transition-colors">NINEA &amp; RCCM</Link></li>
                  <li><Link href="/integrations" className="hover:text-brand-600 transition-colors">Paiements Wave / OM</Link></li>
                  <li><span className="text-slate-400">Normes OHADA</span></li>
                </ul>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-3">Compte</h4>
                <ul className="space-y-2 text-xs font-medium text-slate-600">
                  <li><Link href="/login" className="hover:text-brand-600 transition-colors">Se connecter</Link></li>
                  <li><Link href="/register" className="hover:text-brand-600 transition-colors">Créer un compte</Link></li>
                  <li><Link href="/abonnements" className="hover:text-brand-600 transition-colors">Grille des forfaits</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 sm:mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>© 2026 FacturaPro. Tous droits réservés.</div>
            <div className="font-semibold text-slate-500 flex items-center gap-1.5">
              <span>Fait avec fierté en Afrique</span>
              <span>🌍</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Live Demo Modal */}
      <LiveDemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  );
}

function CalculatorIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  );
}
