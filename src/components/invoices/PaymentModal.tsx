'use client';

import React, { useState } from 'react';
import { X, CheckCircle, Smartphone, CreditCard, Building, Banknote } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Invoice, PaymentProvider } from '@/types';
import { useAppData } from '@/context/AppDataContext';
import { formatCurrency } from '@/lib/formatters';

interface PaymentModalProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  invoice,
  isOpen,
  onClose,
}) => {
  const { markInvoiceAsPaid } = useAppData();

  const remainingDue = invoice.total - (invoice.amount_paid || 0);

  const [amount, setAmount] = useState(remainingDue > 0 ? remainingDue : invoice.total);
  const [provider, setProvider] = useState<PaymentProvider>('wave');
  const [reference, setReference] = useState(`PAY-2025-${Math.floor(1000 + Math.random() * 9000)}`);
  const [transactionId, setTransactionId] = useState(`WAVE_${Math.floor(10000000 + Math.random() * 90000000)}`);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    markInvoiceAsPaid(invoice.id, {
      amount: Number(amount),
      provider,
      reference,
      transaction_id: transactionId,
      paid_at: new Date(paymentDate).toISOString(),
    });

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    onClose();
  };

  const providers: { id: PaymentProvider; name: string; icon: any; colorClass: string }[] = [
    { id: 'wave', name: 'Wave Mobile Money', icon: Smartphone, colorClass: 'border-sky-500 bg-sky-50 text-sky-700' },
    { id: 'orange_money', name: 'Orange Money', icon: Smartphone, colorClass: 'border-orange-500 bg-orange-50 text-orange-700' },
    { id: 'bank_transfer', name: 'Virement bancaire', icon: Building, colorClass: 'border-slate-500 bg-slate-50 text-slate-700' },
    { id: 'stripe', name: 'Carte bancaire', icon: CreditCard, colorClass: 'border-indigo-500 bg-indigo-50 text-indigo-700' },
    { id: 'cash', name: 'Espèces', icon: Banknote, colorClass: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-elevated border border-slate-200 relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Enregistrer un paiement
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              {invoice.invoice_number} — {invoice.client?.name || 'Client'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Amount Due Overview */}
          <div className="p-3 rounded-2xl bg-brand-50/70 border border-brand-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-900">Total facture :</span>
            <span className="text-xs sm:text-sm font-extrabold text-brand-700">
              {formatCurrency(invoice.total, invoice.currency)}
            </span>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Montant encaissé ({invoice.currency})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Provider Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Moyen de paiement
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {providers.map((p) => {
                const Icon = p.icon;
                const isSelected = provider === p.id;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => {
                      setProvider(p.id);
                      if (p.id === 'wave') setTransactionId(`WAVE_${Math.floor(10000000 + Math.random() * 90000000)}`);
                      if (p.id === 'orange_money') setTransactionId(`OM_SN_${Math.floor(100000 + Math.random() * 900000)}`);
                      if (p.id === 'stripe') setTransactionId(`ch_3M${Math.floor(10000000 + Math.random() * 90000000)}`);
                      if (p.id === 'bank_transfer') setTransactionId(`VIR_BOA_${Math.floor(100000 + Math.random() * 900000)}`);
                    }}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                      isSelected
                        ? `${p.colorClass} ring-2 ring-brand-500/20`
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transaction ID & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                N° Transaction / Reçu
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Date de règlement
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-none justify-center px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
