'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Receipt,
  Trash2,
  X,
  Tag,
  Building,
  Calendar,
} from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { formatCurrency, formatDate } from '@/lib/formatters';

export default function DepensesPage() {
  const { expenses, addExpense, deleteExpense } = useAppData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New expense form
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(50000);
  const [category, setCategory] = useState('Logiciels & SaaS');
  const [vendor, setVendor] = useState('OVHcloud');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = [
    'all',
    'Logiciels & SaaS',
    'Bureau & Équipements',
    'Télécom & Internet',
    'Transport & Déplacement',
    'Honoraires & Conseils',
    'Marketing & Pub',
    'Autre',
  ];

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.vendor && e.vendor.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;

    addExpense({
      description,
      amount: Number(amount),
      currency: 'FCFA',
      category,
      vendor,
      expense_date: expenseDate,
    });

    setIsModalOpen(false);
    setDescription('');
  };

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Dépenses & Achats
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivez vos charges opérationnelles, achats fournisseurs et TVA déductible.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/25 transition-all w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une dépense</span>
        </button>
      </div>

      {/* Summary KPI */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-card flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total des charges enregistrées</p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{formatCurrency(totalExpenses, 'FCFA')}</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <Receipt className="w-5 h-5" />
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        {/* Category tabs & Search */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat === 'all' ? 'Toutes les catégories' : cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par libellé, fournisseur..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Mobile View: Expense Cards (< 640px) */}
        <div className="divide-y divide-slate-100 sm:hidden">
          {filteredExpenses.map((exp) => (
            <div key={exp.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{exp.description}</span>
                <span className="font-extrabold text-xs text-slate-900">{formatCurrency(exp.amount, exp.currency)}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{exp.vendor || 'Fournisseur'}</span>
                <span>{formatDate(exp.expense_date)}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                  <Tag className="w-3 h-3 text-slate-400" />
                  <span>{exp.category}</span>
                </span>

                <button
                  onClick={() => deleteExpense(exp.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filteredExpenses.length === 0 && (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <Receipt className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">Aucune dépense trouvée.</p>
            </div>
          )}
        </div>

        {/* Desktop Table View (>= 640px) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                <th className="py-3.5 px-5">DESCRIPTION</th>
                <th className="py-3.5 px-4">FOURNISSEUR</th>
                <th className="py-3.5 px-4">CATÉGORIE</th>
                <th className="py-3.5 px-4">DATE</th>
                <th className="py-3.5 px-4">MONTANT</th>
                <th className="py-3.5 px-5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5 font-bold text-slate-900">
                    {exp.description}
                  </td>
                  <td className="py-4 px-4 text-slate-700 font-medium">
                    {exp.vendor || '-'}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700">
                      <Tag className="w-3 h-3 text-slate-400" />
                      <span>{exp.category}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                    {formatDate(exp.expense_date)}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {formatCurrency(exp.amount, exp.currency)}
                  </td>
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredExpenses.length === 0 && (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Receipt className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">Aucune dépense enregistrée.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add Expense */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-elevated border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Enregistrer une dépense
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Motif *</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Ex : Abonnement serveur Cloud & CDN"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Montant TTC (FCFA) *</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none"
                  >
                    {categories.filter((c) => c !== 'all').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fournisseur</label>
                  <input
                    type="text"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    placeholder="Ex : Orange, Sonatel, AWS..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
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
                  Ajouter la dépense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
