'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { formatCurrency } from '@/lib/formatters';
import { InvoiceStatusBadge } from '@/components/invoices/InvoiceStatusBadge';

export const RecentInvoices: React.FC = () => {
  const { invoices } = useAppData();

  const recentList = invoices.slice(0, 5);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-900">
          Factures récentes
        </h3>
        <Link
          href="/factures"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
        >
          Voir tout
        </Link>
      </div>

      <div className="space-y-3">
        {recentList.map((invoice) => (
          <Link
            key={invoice.id}
            href={`/factures/${invoice.id}`}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                {invoice.invoice_number}
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                Client : {invoice.client?.name || 'Client'}
              </p>
            </div>

            <div className="flex items-center gap-3 text-right">
              <span className="text-xs font-bold text-slate-900">
                {formatCurrency(invoice.total, invoice.currency)}
              </span>
              <InvoiceStatusBadge status={invoice.status} size="sm" />
            </div>
          </Link>
        ))}

        {recentList.length === 0 && (
          <div className="text-center py-6 px-2 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-slate-700">Aucune facture récente</p>
            <p className="text-[11px] text-slate-400">Vos dernières factures s'afficheront ici.</p>
          </div>
        )}
      </div>
    </div>
  );
};
