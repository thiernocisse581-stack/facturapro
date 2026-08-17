'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, CreditCard } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { formatCurrency, formatDate } from '@/lib/formatters';

export const RecentPayments: React.FC = () => {
  const { payments } = useAppData();

  const recentPayments = payments.slice(0, 3);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-900">
          Paiements récents
        </h3>
        <Link
          href="/paiements"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
        >
          Voir tout
        </Link>
      </div>

      <div className="space-y-3">
        {recentPayments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div>
              <p className="text-xs font-bold text-slate-900">
                {payment.reference || `PAY-${payment.id}`}
              </p>
              <p className="text-[11px] text-slate-500">
                {payment.client_name || 'Client'}
              </p>
            </div>

            <div className="flex items-center gap-3 text-right">
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {formatCurrency(payment.amount, 'FCFA')}
                </p>
                <p className="text-[11px] text-slate-400">
                  {formatDate(payment.paid_at)}
                </p>
              </div>
              <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          </div>
        ))}

        {recentPayments.length === 0 && (
          <div className="text-center py-6 px-2 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <CreditCard className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-slate-700">Aucun encaissement</p>
            <p className="text-[11px] text-slate-400">Les règlements Wave et Orange Money reçus apparaîtront ici.</p>
          </div>
        )}
      </div>
    </div>
  );
};
