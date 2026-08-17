'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Download,
  Eye,
  CreditCard,
  Send,
  Trash2,
  FileText,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { InvoiceStatusBadge } from '@/components/invoices/InvoiceStatusBadge';
import { PaymentModal } from '@/components/invoices/PaymentModal';
import { SendInvoiceModal } from '@/components/invoices/SendInvoiceModal';
import { Invoice } from '@/types';

export default function FacturesPage() {
  const { invoices, deleteInvoice } = useAppData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [selectedInvoiceForSend, setSelectedInvoiceForSend] = useState<Invoice | null>(null);

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.client?.name && inv.client.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatus === 'all'
        ? true
        : selectedStatus === 'pending'
        ? inv.status === 'pending' || inv.status === 'sent'
        : inv.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const totalBilled = invoices.reduce((acc, i) => acc + i.total, 0);
  const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((acc, i) => acc + i.total, 0);
  const totalPending = invoices
    .filter((i) => i.status === 'pending' || i.status === 'sent')
    .reduce((acc, i) => acc + i.total, 0);

  const filterTabs = [
    { id: 'all', label: 'Toutes', count: invoices.length },
    { id: 'paid', label: 'Payées', count: invoices.filter((i) => i.status === 'paid').length },
    { id: 'pending', label: 'En attente', count: invoices.filter((i) => i.status === 'pending' || i.status === 'sent').length },
    { id: 'overdue', label: 'En retard', count: invoices.filter((i) => i.status === 'overdue').length },
    { id: 'draft', label: 'Brouillons', count: invoices.filter((i) => i.status === 'draft').length },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Factures
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gérez vos factures clients, suivez les encaissements et générez des documents conformes OHADA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/factures/nouvelle"
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/25 transition-all w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Créer une facture</span>
          </Link>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card flex items-center justify-between sm:block">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Facturé</p>
          <p className="text-base sm:text-lg font-bold text-slate-900 sm:mt-1">{formatCurrency(totalBilled, 'FCFA')}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card flex items-center justify-between sm:block">
          <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Total Encaissé</p>
          <p className="text-base sm:text-lg font-bold text-emerald-700 sm:mt-1">{formatCurrency(totalPaid, 'FCFA')}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card flex items-center justify-between sm:block">
          <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">Solde en attente</p>
          <p className="text-base sm:text-lg font-bold text-amber-700 sm:mt-1">{formatCurrency(totalPending, 'FCFA')}</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        {/* Search & Filter Tabs Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3.5">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  selectedStatus === tab.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedStatus === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par numéro de facture, client..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Mobile View: Invoice Cards (< 640px) */}
        <div className="divide-y divide-slate-100 sm:hidden">
          {filteredInvoices.map((inv) => (
            <div key={inv.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Link
                  href={`/factures/${inv.id}`}
                  className="font-bold text-xs text-brand-600 hover:underline flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{inv.invoice_number}</span>
                </Link>
                <InvoiceStatusBadge status={inv.status} size="sm" />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{inv.client?.name || 'Client'}</span>
                <span className="font-extrabold text-slate-900">{formatCurrency(inv.total, inv.currency)}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Émission : {formatDate(inv.issue_date)}</span>
                <span>Échéance : {formatDate(inv.due_date)}</span>
              </div>

              {/* Action buttons on mobile */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-50">
                <Link
                  href={`/factures/${inv.id}`}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Voir</span>
                </Link>

                {inv.status !== 'paid' && (
                  <button
                    onClick={() => setSelectedInvoiceForPayment(inv)}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center gap-1"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Encaisser</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedInvoiceForSend(inv)}
                  className="px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Voulez-vous supprimer la facture ${inv.invoice_number} ?`)) {
                      deleteInvoice(inv.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filteredInvoices.length === 0 && (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <FileText className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">Aucune facture trouvée.</p>
            </div>
          )}
        </div>

        {/* Desktop Table View (>= 640px) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                <th className="py-3.5 px-5">FACTURE</th>
                <th className="py-3.5 px-4">CLIENT</th>
                <th className="py-3.5 px-4">DATE D'ÉMISSION</th>
                <th className="py-3.5 px-4">ÉCHÉANCE</th>
                <th className="py-3.5 px-4">MONTANT TTC</th>
                <th className="py-3.5 px-4">STATUT</th>
                <th className="py-3.5 px-5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="py-4 px-5 font-bold text-slate-900 whitespace-nowrap">
                    <Link
                      href={`/factures/${inv.id}`}
                      className="hover:text-brand-600 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                      <span>{inv.invoice_number}</span>
                    </Link>
                  </td>

                  <td className="py-4 px-4 font-semibold text-slate-800 truncate max-w-[160px]">
                    {inv.client?.name || 'Client'}
                  </td>

                  <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                    {formatDate(inv.issue_date)}
                  </td>

                  <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                    {formatDate(inv.due_date)}
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {formatCurrency(inv.total, inv.currency)}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <InvoiceStatusBadge status={inv.status} />
                  </td>

                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/factures/${inv.id}`}
                        className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        title="Voir la facture"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {inv.status !== 'paid' && (
                        <button
                          onClick={() => setSelectedInvoiceForPayment(inv)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Enregistrer un paiement"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedInvoiceForSend(inv)}
                        className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="Envoyer au client"
                      >
                        <Send className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Voulez-vous supprimer la facture ${inv.invoice_number} ?`)) {
                            deleteInvoice(inv.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <FileText className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">Aucune facture ne correspond aux critères.</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {selectedInvoiceForPayment && (
        <PaymentModal
          invoice={selectedInvoiceForPayment}
          isOpen={true}
          onClose={() => setSelectedInvoiceForPayment(null)}
        />
      )}

      {/* Send Invoice Modal */}
      {selectedInvoiceForSend && (
        <SendInvoiceModal
          invoice={selectedInvoiceForSend}
          isOpen={true}
          onClose={() => setSelectedInvoiceForSend(null)}
        />
      )}
    </div>
  );
}
