'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  FileSpreadsheet,
  Receipt,
  UserPlus,
  PackagePlus,
  ArrowUpRight,
} from 'lucide-react';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      label: 'Créer une facture',
      href: '/factures/nouvelle',
      icon: FileText,
      description: 'Facture conforme avec TVA 18%',
    },
    {
      label: 'Créer un devis',
      href: '/devis',
      icon: FileSpreadsheet,
      description: 'Devis commercial convertible',
    },
    {
      label: 'Enregistrer une dépense',
      href: '/depenses',
      icon: Receipt,
      description: 'Justificatif & TVA déductible',
    },
    {
      label: 'Ajouter un client',
      href: '/clients',
      icon: UserPlus,
      description: 'Fiche CRM & coordonnées',
    },
    {
      label: 'Ajouter un produit / service',
      href: '/produits',
      icon: PackagePlus,
      description: 'Catalogue & tarifs standards',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card flex flex-col justify-between">
      <h3 className="text-base font-bold text-slate-900 mb-4">
        Actions rapides
      </h3>

      <div className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:border-slate-200/80 hover:bg-slate-50/80 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-brand-600 transition-colors">
                  {action.label}
                </span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-600 transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
