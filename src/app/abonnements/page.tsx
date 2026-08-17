'use client';

import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { SubscriptionPlan } from '@/types';
import { formatCurrency } from '@/lib/formatters';

export default function AbonnementsPage() {
  const { subscription, updateSubscription } = useAppData();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const plans: {
    id: SubscriptionPlan;
    name: string;
    description: string;
    priceMonthly: number;
    priceAnnual: number;
    popular?: boolean;
    features: string[];
  }[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Idéal pour freelances et consultants indépendants.',
      priceMonthly: 9900,
      priceAnnual: 7900,
      features: [
        'Jusqu’à 25 factures / mois',
        '1 utilisateur inclus',
        'Export PDF conforme OHADA',
        'Passerelles Wave & Orange Money',
        'Support email standard',
      ],
    },
    {
      id: 'pro',
      name: 'Professionnel',
      description: 'Pour PME et agences en forte croissance.',
      priceMonthly: 24900,
      priceAnnual: 19900,
      popular: true,
      features: [
        'Factures & devis illimités',
        'Jusqu’à 5 collaborateurs',
        'Rapprochement bancaire automatique',
        'Relances WhatsApp & Email automatiques',
        'Gestion des stocks & catalogue',
        'Support prioritaire 7j/7',
      ],
    },
    {
      id: 'business',
      name: 'Entreprise',
      description: 'Pour les structures multi-sociétés et grands comptes.',
      priceMonthly: 59900,
      priceAnnual: 49900,
      features: [
        'Tout ce qui est dans Pro, plus :',
        'Utilisateurs & filiales illimités',
        'Accès API & Webhooks temps réel',
        'Personnalisation graphique totale',
        'Gestionnaire de compte dédié',
        'SLA 99.9% garanti',
      ],
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-brand-600 bg-brand-50 border border-brand-200/60 px-3 py-1 rounded-full uppercase tracking-wider">
          Plans & Tarifs
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Investissez dans la croissance de votre entreprise
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Choisissez la formule adaptée à votre volume de facturation. Changez ou annulez à tout moment.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span
            className={`text-xs font-semibold ${
              billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'
            }`}
          >
            Facturation mensuelle
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              billingCycle === 'annual' ? 'bg-brand-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span
            className={`text-xs font-semibold flex items-center gap-1.5 ${
              billingCycle === 'annual' ? 'text-slate-900' : 'text-slate-400'
            }`}
          >
            <span>Facturation annuelle</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              -20%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {plans.map((plan) => {
          const isCurrent = subscription?.plan === plan.id;
          const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all flex flex-col justify-between relative ${
                plan.popular
                  ? 'border-brand-600 shadow-xl ring-2 ring-brand-500/20'
                  : 'border-slate-200/80 shadow-card hover:shadow-cardHover'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Le plus populaire</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">{plan.name}</h3>
                  {isCurrent && (
                    <span className="text-[10px] font-extrabold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">
                      Plan Actif
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{plan.description}</p>

                <div className="mt-4 pb-4 border-b border-slate-100">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    {formatCurrency(price, 'FCFA')}
                  </span>
                  <span className="text-xs text-slate-400 font-medium"> / mois</span>
                </div>

                <ul className="mt-5 space-y-2.5 text-xs text-slate-600">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => updateSubscription(plan.id)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-400 cursor-default'
                      : plan.popular
                      ? 'bg-brand-600 hover:bg-brand-700 active:scale-95 text-white shadow-md shadow-brand-500/25'
                      : 'bg-slate-900 hover:bg-slate-800 active:scale-95 text-white'
                  }`}
                >
                  {isCurrent ? 'Votre plan actuel' : `Choisir ${plan.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
