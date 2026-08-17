'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  FileText,
  Users,
  Package,
  Receipt,
  Plus,
  ArrowRight,
  Sparkles,
  CreditCard,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { formatCurrency } from '@/lib/formatters';

export const CommandPalette: React.FC = () => {
  const router = useRouter();
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    invoices,
    clients,
    products,
  } = useAppData();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener for ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredInvoices = query
    ? invoices.filter(
        (inv) =>
          inv.invoice_number.toLowerCase().includes(query.toLowerCase()) ||
          (inv.client?.name && inv.client.name.toLowerCase().includes(query.toLowerCase()))
      )
    : invoices.slice(0, 3);

  const filteredClients = query
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.email.toLowerCase().includes(query.toLowerCase())
      )
    : clients.slice(0, 3);

  const navigateTo = (path: string) => {
    setIsCommandPaletteOpen(false);
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-24 px-3 sm:px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-elevated border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-white">
          <Search className="w-5 h-5 text-slate-400 mr-2.5 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher facture, client, devis, action..."
            className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="ml-2 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg hover:bg-slate-200"
          >
            FERMER
          </button>
        </div>

        {/* Scrollable Results Area */}
        <div className="p-2 overflow-y-auto space-y-3 divide-y divide-slate-100">
          {/* Quick Actions */}
          <div className="px-2 pt-1">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Actions rapides
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <button
                onClick={() => navigateTo('/factures/nouvelle')}
                className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors text-left"
              >
                <div className="p-1.5 rounded-lg bg-brand-100 text-brand-600">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <span>Créer une facture</span>
              </button>

              <button
                onClick={() => navigateTo('/devis')}
                className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors text-left"
              >
                <div className="p-1.5 rounded-lg bg-purple-100 text-purple-600">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                </div>
                <span>Créer un devis</span>
              </button>

              <button
                onClick={() => navigateTo('/clients')}
                className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-left"
              >
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span>Nouveau client CRM</span>
              </button>

              <button
                onClick={() => navigateTo('/depenses')}
                className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors text-left"
              >
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
                  <Receipt className="w-3.5 h-3.5" />
                </div>
                <span>Enregistrer une dépense</span>
              </button>
            </div>
          </div>

          {/* Invoices List */}
          {filteredInvoices.length > 0 && (
            <div className="px-2 pt-2.5">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Factures
              </p>
              <div className="space-y-1">
                {filteredInvoices.map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => navigateTo(`/factures/${inv.id}`)}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs hover:bg-slate-50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-slate-900 mr-2">
                          {inv.invoice_number}
                        </span>
                        <span className="text-slate-500 truncate">
                          {inv.client?.name || 'Client'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-extrabold text-slate-800">
                        {formatCurrency(inv.total, inv.currency)}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clients List */}
          {filteredClients.length > 0 && (
            <div className="px-2 pt-2.5">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Clients
              </p>
              <div className="space-y-1">
                {filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => navigateTo('/clients')}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs hover:bg-slate-50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-slate-900 mr-2">
                          {client.name}
                        </span>
                        <span className="text-slate-400 truncate">{client.email}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">{client.phone}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>FacturaPro Search</span>
          </div>
          <span>Tapez ↵ pour ouvrir</span>
        </div>
      </div>
    </div>
  );
};
