'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  CheckCircle2,
  Calendar,
  Building,
  Banknote,
} from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { WaveLogo, OrangeMoneyLogo, StripeLogo } from '@/components/ui/BrandLogos';

export default function PaiementsPage() {
  const { payments, invoices } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('all');

  const getProviderBadge = (provider: string) => {
    switch (provider) {
      case 'wave':
        return {
          label: 'Wave Mobile',
          renderIcon: (size = 'w-3.5 h-3.5') => <WaveLogo className={`${size} shrink-0 rounded`} />,
          className: 'bg-sky-50 text-sky-900 border border-sky-200 font-bold',
        };
      case 'orange_money':
        return {
          label: 'Orange Money',
          renderIcon: (size = 'w-3.5 h-3.5') => <OrangeMoneyLogo className={`${size} shrink-0 rounded`} />,
          className: 'bg-orange-50 text-orange-900 border border-orange-200 font-bold',
        };
      case 'stripe':
        return {
          label: 'Carte bancaire',
          renderIcon: (size = 'w-3.5 h-3.5') => <StripeLogo className={`${size} shrink-0 rounded`} />,
          className: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
        };
      case 'bank_transfer':
        return {
          label: 'Virement bancaire',
          renderIcon: (size = 'w-3.5 h-3.5') => <Building className={`${size} text-slate-700 shrink-0`} />,
          className: 'bg-slate-100 text-slate-700 border border-slate-200',
        };
      default:
        return {
          label: 'Espèces',
          renderIcon: (size = 'w-3.5 h-3.5') => <Banknote className={`${size} text-emerald-700 shrink-0`} />,
          className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        };
    }
  };

  const filteredPayments = payments.filter((p) => {
    const inv = invoices.find((i) => i.id === p.invoice_id);
    const matchesSearch =
      (p.reference && p.reference.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.transaction_id && p.transaction_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inv && inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inv && inv.client?.name && inv.client.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesProvider = selectedProvider === 'all' || p.provider === selectedProvider;

    return matchesSearch && matchesProvider;
  });

  const totalCollected = payments
    .filter((p) => p.status === 'completed')
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Journal des Paiements & Rapprochements
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Historique complet des transactions Wave, Orange Money, Virements et Cartes bancaires.
          </p>
        </div>
      </div>

      {/* KPI */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-card flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
            Total des encaissements reçus
          </p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
            {formatCurrency(totalCollected, 'FCFA')}
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <CreditCard className="w-5 h-5" />
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        {/* Provider Filters & Search */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {[
              { id: 'all', label: 'Tous les canaux' },
              { id: 'wave', label: 'Wave' },
              { id: 'orange_money', label: 'Orange Money' },
              { id: 'bank_transfer', label: 'Virement' },
              { id: 'stripe', label: 'Carte Stripe' },
            ].map((prov) => (
              <button
                key={prov.id}
                onClick={() => setSelectedProvider(prov.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedProvider === prov.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {prov.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par référence, transaction, facture, client..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Mobile View: Payment Cards (< 640px) */}
        <div className="divide-y divide-slate-100 sm:hidden">
          {filteredPayments.map((payment) => {
            const inv = invoices.find((i) => i.id === payment.invoice_id);
            const badge = getProviderBadge(payment.provider);

            return (
              <div key={payment.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900">{payment.reference}</span>
                  <span className="font-extrabold text-xs text-emerald-700">{formatCurrency(payment.amount, payment.currency)}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{inv?.client?.name || 'Client'}</span>
                  <span className="text-slate-500 font-medium">{inv?.invoice_number || '-'}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold ${badge.className}`}>
                    {badge.renderIcon('w-3.5 h-3.5')}
                    <span>{badge.label}</span>
                  </span>

                  <span className="text-[11px] text-slate-400">{formatDate(payment.paid_at)}</span>
                </div>
              </div>
            );
          })}

          {filteredPayments.length === 0 && (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <CreditCard className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">Aucun paiement trouvé.</p>
            </div>
          )}
        </div>

        {/* Desktop Table View (>= 640px) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                <th className="py-3.5 px-5">RÉFÉRENCE</th>
                <th className="py-3.5 px-4">FACTURE</th>
                <th className="py-3.5 px-4">CLIENT</th>
                <th className="py-3.5 px-4">CANAL</th>
                <th className="py-3.5 px-4">N° TRANSACTION</th>
                <th className="py-3.5 px-4">DATE REÇUE</th>
                <th className="py-3.5 px-5 text-right">MONTANT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((payment) => {
                const inv = invoices.find((i) => i.id === payment.invoice_id);
                const badge = getProviderBadge(payment.provider);

                return (
                  <tr key={payment.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-5 font-bold font-mono text-slate-900">
                      {payment.reference}
                    </td>

                    <td className="py-4 px-4 font-semibold text-brand-600">
                      {inv?.invoice_number || '-'}
                    </td>

                    <td className="py-4 px-4 text-slate-800 font-medium">
                      {inv?.client?.name || 'Client'}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${badge.className}`}
                      >
                        {badge.renderIcon('w-3.5 h-3.5')}
                        <span>{badge.label}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-500 text-[11px]">
                      {payment.transaction_id || '-'}
                    </td>

                    <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(payment.paid_at)}
                    </td>

                    <td className="py-4 px-5 text-right font-extrabold text-emerald-700 whitespace-nowrap">
                      {formatCurrency(payment.amount, payment.currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <CreditCard className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">Aucun paiement ne correspond aux critères.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
