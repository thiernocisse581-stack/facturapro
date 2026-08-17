'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Users,
  Mail,
  Phone,
  MapPin,
  Building,
  Edit2,
  Trash2,
  X,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { Client } from '@/types';
import { formatCurrency } from '@/lib/formatters';

export default function ClientsPage() {
  const { clients, invoices, addClient, updateClient, deleteClient } = useAppData();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dakar');
  const [ninea, setNinea] = useState('');

  const filteredClients = clients.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.tax_identifier && c.tax_identifier.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleOpenCreate = () => {
    setEditingClient(null);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setCity('Dakar');
    setNinea('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Client) => {
    setEditingClient(c);
    setName(c.name);
    setEmail(c.email);
    setPhone(c.phone || '');
    setAddress(c.address || '');
    setCity(c.city || 'Dakar');
    setNinea(c.tax_identifier || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (editingClient) {
      updateClient(editingClient.id, {
        name,
        email,
        phone,
        address,
        city,
        tax_identifier: ninea,
      });
    } else {
      addClient({
        name,
        email,
        phone,
        address,
        city,
        country: 'Sénégal',
        tax_identifier: ninea,
      });
    }

    setIsModalOpen(false);
  };

  // Helper to calculate total billed per client
  const getClientStats = (clientId: string) => {
    const clientInvoices = invoices.filter((i) => i.client_id === clientId);
    const count = clientInvoices.length;
    const totalBilled = clientInvoices.reduce((acc, i) => acc + i.total, 0);
    const pendingBalance = clientInvoices
      .filter((i) => i.status === 'pending' || i.status === 'sent' || i.status === 'overdue')
      .reduce((acc, i) => acc + (i.total - (i.amount_paid || 0)), 0);

    return { count, totalBilled, pendingBalance };
  };

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Répertoire Clients (CRM)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gérez vos comptes clients, coordonnées, identifiants fiscaux NINEA et historique d'encaissements.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/25 transition-all w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un client</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par raison sociale, email, NINEA..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Mobile View: Client CRM Cards (< 640px) */}
        <div className="divide-y divide-slate-100 sm:hidden">
          {filteredClients.map((client) => {
            const stats = getClientStats(client.id);
            return (
              <div key={client.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-brand-600 font-bold text-xs flex items-center justify-center shrink-0">
                      {client.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{client.name}</h4>
                      {client.tax_identifier && (
                        <p className="text-[10px] text-slate-400">NINEA : {client.tax_identifier}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(client)}
                      className="p-1.5 text-slate-500 hover:text-brand-600 rounded-lg"
                      title="Modifier"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteClient(client.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </p>
                  {client.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{client.phone}</span>
                    </p>
                  )}
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total facturé</span>
                    <span className="font-bold text-slate-900">{formatCurrency(stats.totalBilled, 'FCFA')}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Solde en attente</span>
                    <span className={`font-bold ${stats.pendingBalance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {formatCurrency(stats.pendingBalance, 'FCFA')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredClients.length === 0 && (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <Users className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">Aucun client trouvé.</p>
            </div>
          )}
        </div>

        {/* Desktop Table View (>= 640px) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                <th className="py-3.5 px-5">CLIENT</th>
                <th className="py-3.5 px-4">CONTACT</th>
                <th className="py-3.5 px-4">VILLE & ADRESSE</th>
                <th className="py-3.5 px-4">FACTURES</th>
                <th className="py-3.5 px-4">TOTAL FACTURÉ</th>
                <th className="py-3.5 px-4">SOLDE EN ATTENTE</th>
                <th className="py-3.5 px-5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => {
                const stats = getClientStats(client.id);
                return (
                  <tr key={client.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 text-brand-600 font-bold text-xs flex items-center justify-center shrink-0">
                          {client.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{client.name}</p>
                          {client.tax_identifier && (
                            <p className="text-[10px] text-slate-400">NINEA : {client.tax_identifier}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <p className="text-slate-800 font-medium">{client.email}</p>
                      <p className="text-slate-400 text-[11px]">{client.phone || '-'}</p>
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      <p className="font-medium">{client.city || 'Dakar'}</p>
                      <p className="text-slate-400 text-[11px] truncate max-w-[140px]">{client.address || '-'}</p>
                    </td>

                    <td className="py-4 px-4 text-slate-700 font-semibold">
                      {stats.count} doc(s)
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {formatCurrency(stats.totalBilled, 'FCFA')}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`font-bold ${
                          stats.pendingBalance > 0 ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      >
                        {formatCurrency(stats.pendingBalance, 'FCFA')}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(client)}
                          className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteClient(client.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredClients.length === 0 && (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Users className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">Aucun client ne correspond aux critères.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add / Edit Client */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-elevated border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {editingClient ? 'Modifier le client' : 'Ajouter un nouveau client'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Raison sociale / Nom *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ex : DevTech Solutions SARL"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="contact@client.com"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+221 77..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ville</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Dakar"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NINEA / RCCM</label>
                  <input
                    type="text"
                    value={ninea}
                    onChange={(e) => setNinea(e.target.value)}
                    placeholder="001248792 2V3"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Adresse complète</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rue 14 x Boulevard de la République"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
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
                  {editingClient ? 'Enregistrer modifications' : 'Créer le client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
