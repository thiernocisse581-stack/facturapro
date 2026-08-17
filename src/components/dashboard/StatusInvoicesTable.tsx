'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, FileText, ChevronRight, Plus } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { InvoiceStatusBadge } from '@/components/invoices/InvoiceStatusBadge';

export const StatusInvoicesTable: React.FC = () => {
  const { invoices } = useAppData();
  const [activeTab, setActiveTab] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  const filteredInvoices = invoices
    .filter((inv) => {
      if (activeTab === 'all') return true;
      if (activeTab === 'paid') return inv.status === 'paid';
      if (activeTab === 'pending') return inv.status === 'pending' || inv.status === 'sent';
      if (activeTab === 'overdue') return inv.status === 'overdue';
      return true;
    })
    .slice(0, 6);

  const tabs = [
    { id: 'all', label: 'Toutes' },
    { id: 'paid', label: 'Payées' },
    { id: 'pending', label: 'En attente' },
    { id: 'overdue', label: 'En retard' },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-card flex flex-col justify-between">
      {/* Top row with title and filter tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h3 className="text-sm sm:text-base font-bold text-slate-900">
          Factures par statut
        </h3>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 overflow-x-auto max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Card List View (< 640px) */}
      <div className="divide-y divide-slate-100 sm:hidden">
        {filteredInvoices.map((invoice) => (
          <Link
            key={invoice.id}
            href={`/factures/${invoice.id}`}
            className="py-3 flex items-center justify-between gap-3 active:bg-slate-50 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900">{invoice.invoice_number}</span>
                <InvoiceStatusBadge status={invoice.status} size="sm" />
              </div>
              <p className="text-[11px] font-medium text-slate-700 truncate mt-0.5">
                {invoice.client?.name || 'Client'}
              </p>
              <p className="text-[10px] text-slate-400">
                Échéance : {formatDate(invoice.due_date)}
              </p>
            </div>

            <div className="text-right shrink-0 flex items-center gap-2">
              <span className="font-extrabold text-xs text-slate-900">
                {formatCurrency(invoice.total, invoice.currency)}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </Link>
        ))}

        {filteredInvoices.length === 0 && (
          <div className="text-center py-8 px-4 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700">Aucune facture</p>
            <p className="text-[11px] text-slate-400">Émettez votre première facture conforme OHADA.</p>
            <Link
              href="/factures/nouvelle"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Créer une facture</span>
            </Link>
          </div>
        )}
      </div>

      {/* Desktop / Tablet Table (>= 640px) */}
      <div className="hidden sm:block overflow-x-auto">
        {filteredInvoices.length > 0 ? (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">
                <th className="pb-3 font-semibold">FACTURE</th>
                <th className="pb-3 font-semibold">CLIENT</th>
                <th className="pb-3 font-semibold">DATE</th>
                <th className="pb-3 font-semibold">ÉCHÉANCE</th>
                <th className="pb-3 font-semibold">MONTANT</th>
                <th className="pb-3 font-semibold text-right">STATUT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                >
                  <td className="py-3.5 font-semibold text-slate-900">
                    <Link
                      href={`/factures/${invoice.id}`}
                      className="hover:text-brand-600 transition-colors flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-brand-600" />
                      <span>{invoice.invoice_number}</span>
                    </Link>
                  </td>

                  <td className="py-3.5 text-slate-700 font-medium truncate max-w-[140px]">
                    {invoice.client?.name || 'Client'}
                  </td>

                  <td className="py-3.5 text-slate-500 whitespace-nowrap">
                    {formatDate(invoice.issue_date)}
                  </td>

                  <td className="py-3.5 text-slate-500 whitespace-nowrap">
                    {formatDate(invoice.due_date)}
                  </td>

                  <td className="py-3.5 font-bold text-slate-900 whitespace-nowrap">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </td>

                  <td className="py-3.5 text-right whitespace-nowrap">
                    <InvoiceStatusBadge status={invoice.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10 px-4 space-y-2.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-800">Aucune facture dans cette vue</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Créez votre première facture avec génération séquentielle et ventilation automatique de la TVA 18%.
            </p>
            <div className="pt-1">
              <Link
                href="/factures/nouvelle"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Créer une facture</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer Link: Voir toutes les factures → */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100 text-center">
        <Link
          href="/factures"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
        >
          <span>Voir toutes les factures</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
