'use client';

import React from 'react';
import {
  Percent,
  TrendingUp,
  FileCheck2,
  Calendar,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { formatCurrency } from '@/lib/formatters';

export default function TaxesPage() {
  const { invoices, expenses, organization } = useAppData();

  const totalCollectedTax = invoices
    .filter((i) => i.status === 'paid')
    .reduce((acc, i) => acc + i.tax_amount, 0);

  const totalDeductibleTax = Math.round(
    expenses.reduce((acc, e) => acc + (e.amount * 0.18) / 1.18, 0)
  );

  const netTaxPayable = totalCollectedTax - totalDeductibleTax;

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Fiscalité & Déclarations de TVA
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Suivi automatisé de la TVA collectée sur factures et de la TVA déductible sur charges d'exploitation ({organization.country}).
        </p>
      </div>

      {/* VAT Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              TVA Collectée (Ventes)
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              18% TTC
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            {formatCurrency(totalCollectedTax, 'FCFA')}
          </p>
          <p className="text-xs text-slate-500">Générée sur factures payées</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              TVA Déductible (Achats)
            </span>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              Charges
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            {formatCurrency(totalDeductibleTax, 'FCFA')}
          </p>
          <p className="text-xs text-slate-500">Sur dépenses et achats justifiés</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              TVA Nette à Reverser
            </span>
            <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
              Trésor Public
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-brand-600">
            {formatCurrency(netTaxPayable > 0 ? netTaxPayable : 0, 'FCFA')}
          </p>
          <p className="text-xs text-slate-500">Échéance de déclaration : le 15 du mois</p>
        </div>
      </div>

      {/* Tax Guide Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-brand-600 shrink-0" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Aide à la déclaration fiscale mensuelle (DGID)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Calendrier des obligations légales</span>
            </h4>
            <p className="leading-relaxed">
              Au Sénégal et dans l'espace UEMOA, les déclarations de TVA et du BRS (si applicable) doivent être déposées et télépaiées avant le <strong>15 de chaque mois</strong> suivant la période d'imposition.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Mentions obligatoires sur factures</span>
            </h4>
            <p className="leading-relaxed">
              Toutes les factures générées par FacturaPro comportent automatiquement votre NINEA, votre numéro RCCM et la ventilation de la base HT et du taux légal à 18.00%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
