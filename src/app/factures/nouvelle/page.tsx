'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Send,
  UserPlus,
  X,
} from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { InvoiceLine } from '@/types';
import { formatCurrency } from '@/lib/formatters';

export default function NouvelleFacturePage() {
  const router = useRouter();
  const { clients, products, organization, createInvoice, addClient } = useAppData();

  const nextSeq = (organization.current_invoice_seq || 48) + 1;
  const nextInvoiceNumber = `${organization.invoice_prefix || 'FAC-2025-'}${String(nextSeq).padStart(4, '0')}`;

  const todayStr = new Date().toISOString().split('T')[0];
  const due30DaysStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [issueDate, setIssueDate] = useState(todayStr);
  const [dueDate, setDueDate] = useState(due30DaysStr);
  const [currency, setCurrency] = useState('FCFA');
  const [notes, setNotes] = useState(
    'Paiement exigible à la date d’échéance. En cas de retard, une pénalité forfaitaire sera appliquée conformément aux dispositions OHADA.'
  );

  // Line items
  const [lines, setLines] = useState<InvoiceLine[]>([
    {
      id: 'line-1',
      description: products[0]?.name || 'Prestation de développement & intégration',
      quantity: 1,
      unit_price: products[0]?.default_price || 1500000,
      tax_rate: 18,
      line_total: products[0]?.default_price || 1500000,
    },
  ]);

  // Inline Client Modal
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientAddress, setNewClientAddress] = useState('');
  const [newClientNinea, setNewClientNinea] = useState('');

  // Update line item
  const updateLine = (index: number, updates: Partial<InvoiceLine>) => {
    setLines((prev) =>
      prev.map((line, i) => {
        if (i === index) {
          const updated = { ...line, ...updates };
          updated.line_total = (updated.quantity || 1) * (updated.unit_price || 0);
          return updated;
        }
        return line;
      })
    );
  };

  // Add line item
  const addLine = () => {
    setLines((prev) => [
      ...prev,
      {
        id: `line-${Date.now()}`,
        description: '',
        quantity: 1,
        unit_price: 0,
        tax_rate: 18,
        line_total: 0,
      },
    ]);
  };

  // Remove line item
  const removeLine = (index: number) => {
    if (lines.length <= 1) return;
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  // Select pre-existing product
  const handleProductSelect = (index: number, productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    updateLine(index, {
      product_service_id: prod.id,
      description: prod.name,
      unit_price: prod.default_price,
      tax_rate: prod.tax_rate || 18,
    });
  };

  // Live Totals calculation
  const subtotal = lines.reduce((acc, l) => acc + l.line_total, 0);
  const taxAmount = Math.round(
    lines.reduce((acc, l) => acc + (l.line_total * (l.tax_rate || 18)) / 100, 0)
  );
  const total = subtotal + taxAmount;

  // Handle New Client creation inline
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName) return;

    const created = addClient({
      name: newClientName,
      email: newClientEmail,
      phone: newClientPhone,
      address: newClientAddress,
      country: 'Sénégal',
      tax_identifier: newClientNinea,
    });

    setClientId(created.id);
    setIsClientModalOpen(false);
    setNewClientName('');
    setNewClientEmail('');
    setNewClientPhone('');
    setNewClientAddress('');
    setNewClientNinea('');
  };

  // Save invoice
  const handleSaveInvoice = (status: 'draft' | 'pending') => {
    if (!clientId) {
      alert('Veuillez sélectionner un client.');
      return;
    }

    if (lines.length === 0 || lines.some((l) => !l.description.trim())) {
      alert('Veuillez renseigner une description pour chaque ligne de facture.');
      return;
    }

    const created = createInvoice({
      client_id: clientId,
      status,
      issue_date: issueDate,
      due_date: dueDate,
      subtotal,
      tax_amount: taxAmount,
      total,
      amount_paid: 0,
      currency,
      notes,
      lines,
    });

    router.push(`/factures/${created.id}`);
  };

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in pb-16">
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Link
            href="/factures"
            className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
              <span>Nouvelle Facture</span>
              <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-200/60 font-mono">
                {nextInvoiceNumber}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSaveInvoice('draft')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>Brouillon</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveInvoice('pending')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/25 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Émettre</span>
          </button>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-4 sm:p-8 space-y-6 sm:space-y-8">
        {/* Section 1: Client & Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 pb-6 border-b border-slate-100">
          {/* Client Selector */}
          <div className="sm:col-span-2 lg:col-span-6 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Client destinataire *</label>
              <button
                type="button"
                onClick={() => setIsClientModalOpen(true)}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Nouveau client</span>
              </button>
            </div>

            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.city ? `(${c.city})` : ''} — {c.email}
                </option>
              ))}
            </select>
          </div>

          {/* Issue Date, Due Date, Currency */}
          <div className="space-y-1.5 lg:col-span-2">
            <label className="text-xs font-bold text-slate-700">Date d'émission</label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="space-y-1.5 lg:col-span-2">
            <label className="text-xs font-bold text-slate-700">Date d'échéance</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
            <label className="text-xs font-bold text-slate-700">Devise</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none"
            >
              <option value="FCFA">FCFA (XOF)</option>
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
        </div>

        {/* Section 2: Dynamic Line Items */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              Lignes de prestations / Articles
            </h3>
            <span className="text-[11px] text-slate-400">Taux de TVA standard : 18.00%</span>
          </div>

          <div className="space-y-3">
            {lines.map((line, index) => (
              <div
                key={line.id || index}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-12 sm:gap-3 sm:items-center"
              >
                {/* Product Fast Fill */}
                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Catalogue
                  </label>
                  <select
                    onChange={(e) => handleProductSelect(index, e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Choisir un article...
                    </option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.default_price.toLocaleString()} {currency})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={line.description}
                    onChange={(e) => updateLine(index, { description: e.target.value })}
                    placeholder="Description de la prestation..."
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                {/* Mobile Row for Qty & Price */}
                <div className="grid grid-cols-2 gap-2 sm:contents">
                  {/* Quantity */}
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Qté
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={line.quantity}
                      onChange={(e) => updateLine(index, { quantity: Number(e.target.value) || 1 })}
                      className="w-full px-2 py-2 text-xs bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-900 focus:outline-none"
                    />
                  </div>

                  {/* Unit Price */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Prix Unit. HT
                    </label>
                    <input
                      type="number"
                      value={line.unit_price}
                      onChange={(e) => updateLine(index, { unit_price: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-right font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Total HT & Delete Button */}
                <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/50">
                  <div className="text-left sm:text-right">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">
                      Total HT
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">
                      {formatCurrency(line.line_total, currency)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeLine(index)}
                    disabled={lines.length === 1}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30"
                    title="Supprimer la ligne"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addLine}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une ligne</span>
          </button>
        </div>

        {/* Section 3: Notes & Totals Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 border-t border-slate-100">
          {/* Notes */}
          <div className="lg:col-span-7 space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Conditions de règlement & Mentions légales
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none font-sans leading-relaxed"
            />
          </div>

          {/* Totals Calculation Summary */}
          <div className="lg:col-span-5 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Sous-total HT :</span>
              <span className="font-bold text-slate-900">{formatCurrency(subtotal, currency)}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>TVA légale (18%) :</span>
              <span className="font-bold text-slate-900">{formatCurrency(taxAmount, currency)}</span>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t-2 border-slate-200 text-sm font-black text-slate-900">
              <span>Total TTC :</span>
              <span className="text-base sm:text-lg text-brand-600">{formatCurrency(total, currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Client Modal */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-elevated border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Créer un nouveau client
              </h3>
              <button onClick={() => setIsClientModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Raison sociale / Nom *</label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  required
                  placeholder="Ex : Societe ABC"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="contact@client.com"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="+221 77..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NINEA</label>
                  <input
                    type="text"
                    value={newClientNinea}
                    onChange={(e) => setNewClientNinea(e.target.value)}
                    placeholder="0012487..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Adresse</label>
                <input
                  type="text"
                  value={newClientAddress}
                  onChange={(e) => setNewClientAddress(e.target.value)}
                  placeholder="Dakar, Plateau"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm"
                >
                  Enregistrer client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
