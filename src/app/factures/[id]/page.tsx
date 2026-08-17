'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CreditCard,
  Send,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { InvoicePDFPreview } from '@/components/invoices/InvoicePDFPreview';
import { PaymentModal } from '@/components/invoices/PaymentModal';
import { SendInvoiceModal } from '@/components/invoices/SendInvoiceModal';
import { formatCurrency, formatDate } from '@/lib/formatters';

export default function FactureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { invoices, organization, payments, deleteInvoice } = useAppData();

  const invoiceId = (Array.isArray(params?.id) ? params.id[0] : params?.id) || '';
  const invoice = invoices.find((i) => i.id === invoiceId);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  if (!invoice) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Facture introuvable</h2>
        <p className="text-xs text-slate-500">Cette facture n'existe pas ou a été supprimée.</p>
        <Link
          href="/factures"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-brand-600 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux factures</span>
        </Link>
      </div>
    );
  }

  // Related payments for this invoice
  const invoicePayments = payments.filter((p) => p.invoice_id === invoice.id);

  const handleDelete = () => {
    if (confirm(`Confirmez-vous la suppression de la facture ${invoice.invoice_number} ?`)) {
      deleteInvoice(invoice.id);
      router.push('/factures');
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in pb-12">
      {/* Top Header with Back, Title & Quick Actions */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Link
            href="/factures"
            className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
              <span>Facture</span>
              <span className="text-brand-600">{invoice.invoice_number}</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              Client : <span className="font-semibold text-slate-700">{invoice.client?.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {invoice.status !== 'paid' && (
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/25 transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>Encaisser</span>
            </button>
          )}

          <button
            onClick={() => setIsSendModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/25 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Transmettre</span>
          </button>

          <button
            onClick={handleDelete}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Progress Timeline */}
      <div className="no-print bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                invoice.status === 'paid'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : invoice.status === 'overdue'
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-amber-50 text-amber-600 border border-amber-200'
              }`}
            >
              {invoice.status === 'paid' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : invoice.status === 'overdue' ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <Clock className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Statut actuel :{' '}
                <span className="capitalize">
                  {invoice.status === 'paid'
                    ? 'Payée en totalité'
                    : invoice.status === 'overdue'
                    ? 'En retard de règlement'
                    : 'En attente de paiement'}
                </span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {invoice.status === 'paid'
                  ? `Facture soldée le ${formatDate(invoice.paid_at)}.`
                  : `Échéance fixée au ${formatDate(invoice.due_date)}.`}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-6 text-xs w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Total TTC</p>
              <p className="text-sm font-black text-slate-900">{formatCurrency(invoice.total, invoice.currency)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400">Reste dû</p>
              <p className="text-sm font-black text-brand-600">
                {formatCurrency(Math.max(0, invoice.total - invoice.amount_paid), invoice.currency)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Printable View */}
      <InvoicePDFPreview invoice={invoice} organization={organization} />

      {/* Payments History Ledger for this invoice */}
      {invoicePayments.length > 0 && (
        <div className="no-print bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-3">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
            Historique des encaissements sur cette facture
          </h3>

          <div className="divide-y divide-slate-100">
            {invoicePayments.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-slate-900 truncate">
                      Règlement via <span className="uppercase">{p.provider}</span> ({p.reference})
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {formatDate(p.paid_at)}
                    </p>
                  </div>
                </div>

                <span className="font-extrabold text-emerald-700 text-xs sm:text-sm shrink-0 whitespace-nowrap">
                  +{formatCurrency(p.amount, invoice.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <PaymentModal
        invoice={invoice}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />

      <SendInvoiceModal
        invoice={invoice}
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
      />
    </div>
  );
}
