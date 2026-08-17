'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Package,
  Edit2,
  Trash2,
  X,
  Tag,
} from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { ProductService } from '@/types';
import { formatCurrency } from '@/lib/formatters';

export default function ProduitsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useAppData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'service' | 'product'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductService | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'service' | 'product'>('service');
  const [price, setPrice] = useState(150000);
  const [unit, setUnit] = useState('prestation');
  const [taxRate, setTaxRate] = useState(18);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'all' || p.type === selectedType;

    return matchesSearch && matchesType;
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setType('service');
    setPrice(150000);
    setUnit('prestation');
    setTaxRate(18);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ProductService) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description || '');
    setType(p.type || 'service');
    setPrice(p.default_price);
    setUnit(p.unit);
    setTaxRate(p.tax_rate);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        description,
        type,
        default_price: Number(price),
        unit,
        tax_rate: Number(taxRate),
      });
    } else {
      addProduct({
        name,
        description,
        type,
        category: type === 'service' ? 'Services & Conseil' : 'Matériel',
        is_active: true,
        default_price: Number(price),
        unit,
        tax_rate: Number(taxRate),
        currency: 'FCFA',
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Catalogue Produits & Services
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configurez vos prestations récurrentes, grilles tarifaires et taux de TVA pour une facturation accélérée.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/25 transition-all w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter au catalogue</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        {/* Filters & Search */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'Tout le catalogue' },
              { id: 'service', label: 'Services & Prestations' },
              { id: 'product', label: 'Produits physiques' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedType === tab.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un article..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Mobile View: Product Cards (< 640px) */}
        <div className="divide-y divide-slate-100 sm:hidden">
          {filteredProducts.map((p) => (
            <div key={p.id} className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{p.name}</span>
                <span className="font-extrabold text-xs text-brand-600">
                  {formatCurrency(p.default_price, p.currency || 'FCFA')}
                </span>
              </div>

              {p.description && (
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{p.description}</p>
              )}

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                    Unité : {p.unit}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-brand-700">
                    TVA {p.tax_rate}%
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-1.5 text-slate-500 hover:text-brand-600 rounded-lg"
                    title="Modifier"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <Package className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">Aucun article trouvé.</p>
            </div>
          )}
        </div>

        {/* Desktop Table View (>= 640px) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                <th className="py-3.5 px-5">ARTICLE / PRESTATION</th>
                <th className="py-3.5 px-4">TYPE</th>
                <th className="py-3.5 px-4">UNITÉ</th>
                <th className="py-3.5 px-4">TVA APPLICABLE</th>
                <th className="py-3.5 px-4">TARIF HT</th>
                <th className="py-3.5 px-5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5">
                    <p className="font-bold text-slate-900">{p.name}</p>
                    <p className="text-slate-400 text-[11px] truncate max-w-sm">{p.description || '-'}</p>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        p.type === 'service'
                          ? 'bg-blue-50 text-brand-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {p.type === 'service' ? 'Service' : 'Produit'}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-slate-600 font-medium">
                    {p.unit}
                  </td>

                  <td className="py-4 px-4 text-slate-600 font-semibold">
                    {p.tax_rate}%
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {formatCurrency(p.default_price, p.currency || 'FCFA')}
                  </td>

                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Package className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">Aucun article ne correspond aux critères.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-elevated border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {editingProduct ? 'Modifier l’article' : 'Ajouter au catalogue'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom / Intitulé *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ex : Maintenance applicative mensuelle"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description détaillée</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Détails des livrables inclus..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl resize-none focus:bg-white focus:outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type d'article</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none"
                  >
                    <option value="service">Service / Prestation</option>
                    <option value="product">Produit physique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unité</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="ex: heure, jour, mois, projet, unité"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tarif HT (FCFA) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Taux TVA (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:outline-none"
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
                  {editingProduct ? 'Enregistrer' : 'Ajouter au catalogue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
