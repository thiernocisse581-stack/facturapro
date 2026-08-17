'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  FileSpreadsheet,
  Sparkles,
  CheckCircle2,
  Trash2,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { formatCurrency, formatDate } from '@/lib/formatters';

export default function DevisPage() {
  const router = useRouter();
  const { quotes, clients, createQuote, convertQuoteToInvoice, deleteQuote } = useAppData();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New quote form state
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(1500000);
  const [notes, setNotes] = useState('Offre valable 30 jours calendaires.');

  const filteredQuotes = quotes.filter((q) => {
    return (
      q.quote_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.client?.name && q.client.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !description) return;

    const subtotal = Number(amount);
    const taxAmount = Math.round((subtotal * 18) / 100);
    const total = subtotal + taxAmount;

    createQuote({
      client_id: clientId,
      status: 'sent',
      issue_date: new Date().toISOString().split('T')[0],
      expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      subtotal,
      tax_amount: taxAmount,
      total,
      currency: 'FCFA',
      notes,
      lines: [
        {
          id: `line-${Date.now()}`,
          description,
          quantity: 1,
          unit_price: subtotal,
          tax_rate: 18,
          line_total: subtotal,
        },
      ],
    });

    setIsModalOpen(false);
    setDescription('');
  };

  const handleConvert = (quoteId: string) => {
    const createdInvoice = convertQuoteToInvoice(quoteId);
    if (createdInvoice) {
      router.push(`/factures/${createdInvoice.id}`);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Devis & Propositions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Émettez des devis professionnels et convertissez-les en factures en un clic dès validation.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/25 transition-all w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un devis</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par numéro de devis, client..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Mobile View: Quote Cards (< 640px) */}
        <div className="divide-y divide-slate-100 sm:hidden">
          {filteredQuotes.map((quote) => (
            <div key={quote.id} className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-purple-700">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>{quote.quote_number}</span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    quote.status === 'accepted' || quote.status === 'converted'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : quote.status === 'sent'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {quote.status === 'converted' ? 'Converti en Facture' : quote.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{quote.client?.name || 'Client'}</span>
                <span className="font-extrabold text-slate-900">{formatCurrency(quote.total, quote.currency)}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Émission : {formatDate(quote.issue_date)}</span>
                <span>Validité : {formatDate(quote.expiry_date)}</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-50">
                {quote.status !== 'converted' ? (
                  <button
                    onClick={() => handleConvert(quote.id)}
                    className="flex-1 py-1.5 px-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Convertir en Facture</span>
                  </button>
                ) : (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 py-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Facturé
                  </span>
                )}

                <button
                  onClick={() => deleteQuote(quote.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredQuotes.length === 0 && (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">Aucun devis trouvé.</p>
            </div>
          )}
        </div>

        {/* Desktop Quotes Table (>= 640px) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                <th className="py-3.5 px-5">DEVIS</th>
                <th className="py-3.5 px-4">CLIENT</th>
                <th className="py-3.5 px-4">DATE D'ÉMISSION</th>
                <th className="py-3.5 px-4">VALABLE JUSQU'AU</th>
                <th className="py-3.5 px-4">MONTANT TTC</th>
                <th className="py-3.5 px-4">STATUT</th>
                <th className="py-3.5 px-5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5 font-bold text-slate-900 flex items-center gap-2 whitespace-nowrap">
                    <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                    <span>{quote.quote_number}</span>
                  </td>

                  <td className="py-4 px-4 font-semibold text-slate-800">
                    {quote.client?.name || 'Client'}
                  </td>

                  <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                    {formatDate(quote.issue_date)}
                  </td>

                  <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                    {formatDate(quote.expiry_date)}
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {formatCurrency(quote.total, quote.currency)}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        quote.status === 'accepted' || quote.status === 'converted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : quote.status === 'sent'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span className="capitalize">{quote.status === 'converted' ? 'Converti en Facture' : quote.status}</span>
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {quote.status !== 'converted' ? (
                        <button
                          onClick={() => handleConvert(quote.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Convertir en Facture</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Facturé
                        </span>
                      )}

                      <button
                        onClick={() => deleteQuote(quote.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
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

          {filteredQuotes.length === 0 && (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">Aucun devis trouvé.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Quote Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-elevated border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Créer un nouveau devis
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuote} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Client *</label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description de l'offre *</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Ex : Mission de refonte applicative & maintenance"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Montant HT (FCFA) *</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Conditions de l'offre</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl resize-none focus:bg-white focus:outline-none font-sans"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm"
                >
                  Générer le devis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
