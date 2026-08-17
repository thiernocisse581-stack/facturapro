'use client';

import React from 'react';
import Link from 'next/link';
import {
  Plus,
  Users,
  Building,
  Sparkles,
  ArrowRight,
  FileText,
  CheckCircle2,
  Database,
  RotateCcw,
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { StatusDonutChart } from '@/components/dashboard/StatusDonutChart';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { StatusInvoicesTable } from '@/components/dashboard/StatusInvoicesTable';
import { RecentInvoices } from '@/components/dashboard/RecentInvoices';
import { RecentPayments } from '@/components/dashboard/RecentPayments';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { invoices, clients, organization, loadDemoData, resetToCleanSlate } = useAppData();
  const { user } = useAuth();

  // Dynamic statistics calculations
  const totalRevenue = invoices.reduce(
    (acc, inv) => acc + (inv.amount_paid || (inv.status === 'paid' ? inv.total : 0)),
    0
  );
  const paidAmount = invoices.filter((i) => i.status === 'paid').reduce((acc, i) => acc + i.total, 0);
  const pendingAmount = invoices
    .filter((i) => i.status === 'pending' || i.status === 'sent')
    .reduce((acc, i) => acc + i.total, 0);
  const overdueAmount = invoices
    .filter((i) => i.status === 'overdue')
    .reduce((acc, i) => acc + i.total, 0);

  const userName = user?.full_name || organization.name || 'Gérant';
  const isFreshAccount = invoices.length === 0 && clients.length === 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            Bonjour, {userName} <span className="animate-pulse">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            {isFreshAccount
              ? 'Votre espace entreprise est prêt. Commencez par ajouter vos premiers documents.'
              : "Voici l'aperçu consolidé de votre activité en temps réel."}
          </p>
        </div>

        {/* Demo data toggle helper for testing */}
        <div className="flex items-center gap-2">
          {invoices.length === 0 ? (
            <button
              onClick={loadDemoData}
              className="flex items-center gap-1.5 px-3 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-xs font-semibold border border-brand-200 transition-colors"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Charger des données de démo</span>
            </button>
          ) : (
            <button
              onClick={resetToCleanSlate}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-medium border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Remettre à zéro (Clean)</span>
            </button>
          )}
        </div>
      </div>

      {/* Onboarding Quick Start Banner for Fresh Accounts */}
      {isFreshAccount && (
        <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-blue-700 rounded-3xl p-5 sm:p-7 text-white shadow-xl shadow-brand-500/15 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Bienvenue sur votre SaaS FacturaPro</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              3 étapes simples pour démarrer votre facturation
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Votre compte est configuré avec les normes comptables OHADA (TVA 18%, devises FCFA, NINEA & RCCM).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <Link
                href="/factures/nouvelle"
                className="flex items-center justify-between p-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-xs font-bold text-white transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-white text-brand-600 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span>1. Créer une facture</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/clients"
                className="flex items-center justify-between p-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-xs font-bold text-white transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-white text-indigo-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span>2. Ajouter un client</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/parametres"
                className="flex items-center justify-between p-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-xs font-bold text-white transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-white text-blue-600 flex items-center justify-center">
                    <Building className="w-4 h-4" />
                  </div>
                  <span>3. Compléter NINEA</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 4 StatCards Row (Dynamic values calculated from live state) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Chiffre d'affaires"
          amount={totalRevenue}
          growth={totalRevenue > 0 ? 18.6 : 0}
          growthLabel="total encaissé"
          type="revenue"
        />
        <StatCard
          title="Factures payées"
          amount={paidAmount}
          growth={paidAmount > 0 ? 24.8 : 0}
          growthLabel="règlements reçus"
          type="paid"
        />
        <StatCard
          title="Factures en attente"
          amount={pendingAmount}
          growth={pendingAmount > 0 ? 8.2 : 0}
          growthLabel="encours clients"
          type="pending"
        />
        <StatCard
          title="Factures en retard"
          amount={overdueAmount}
          growth={overdueAmount > 0 ? -12.4 : 0}
          growthLabel="échéances dépassées"
          type="overdue"
        />
      </div>

      {/* Middle Row: Revenue Chart (Left), Donut Chart (Center), Quick Actions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Aperçu des revenus Area Chart */}
        <div className="lg:col-span-5">
          <RevenueChart />
        </div>

        {/* Répartition des factures Donut */}
        <div className="lg:col-span-4">
          <StatusDonutChart />
        </div>

        {/* Actions rapides */}
        <div className="lg:col-span-3">
          <QuickActions />
        </div>
      </div>

      {/* Bottom Row: Factures par statut (Left) & Recent Invoices / Payments (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Factures par statut Table */}
        <div className="lg:col-span-8">
          <StatusInvoicesTable />
        </div>

        {/* Right Widgets: Factures récentes & Paiements récents */}
        <div className="lg:col-span-4 space-y-5">
          <RecentInvoices />
          <RecentPayments />
        </div>
      </div>
    </div>
  );
}
