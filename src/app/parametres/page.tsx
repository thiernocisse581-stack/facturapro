'use client';

import React, { useState } from 'react';
import {
  Building,
  Save,
  CheckCircle2,
  Users,
  Shield,
  FileText,
  Mail,
  Lock,
} from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';

export default function ParametresPage() {
  const { organization, updateOrganization } = useAppData();

  const [activeTab, setActiveTab] = useState<'general' | 'team' | 'security'>('general');

  // Form State
  const [name, setName] = useState(organization.name);
  const [legalName, setLegalName] = useState(organization.legal_name || '');
  const [ninea, setNinea] = useState(organization.ninea_number || '');
  const [rccm, setRccm] = useState(organization.rccm_number || '');
  const [email, setEmail] = useState(organization.email || '');
  const [phone, setPhone] = useState(organization.phone || '');
  const [address, setAddress] = useState(organization.address || '');
  const [city, setCity] = useState(organization.city || 'Dakar');
  const [country, setCountry] = useState(organization.country || 'Sénégal');
  const [invoicePrefix, setInvoicePrefix] = useState(organization.invoice_prefix || 'FAC-2025-');
  const [taxRate, setTaxRate] = useState(organization.tax_rate || 18);
  const [paymentInstructions, setPaymentInstructions] = useState(
    organization.payment_instructions ||
      'Wave : +221 77 123 45 67 | Orange Money : +221 78 987 65 43 | Virement bancaire BOA'
  );

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrganization({
      name,
      legal_name: legalName,
      ninea_number: ninea,
      rccm_number: rccm,
      email,
      phone,
      address,
      city,
      country,
      invoice_prefix: invoicePrefix,
      tax_rate: Number(taxRate),
      payment_instructions: paymentInstructions,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const teamMembers = [
    { name: 'Nasser Thierno', email: 'nasser@devtech.sn', role: 'Propriétaire / Admin', status: 'Actif' },
    { name: 'Awa Diop', email: 'awa@devtech.sn', role: 'Comptable', status: 'Actif' },
    { name: 'Moussa Sall', email: 'moussa@devtech.sn', role: 'Commercial', status: 'Invité' },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Paramètres de l'Organisation
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configurez vos mentions légales, coordonnées d'entreprise et options de facturation OHADA.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200/80 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'general'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Informations Entreprise</span>
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'team'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Équipe & Rôles</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'security'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Sécurité & Accès</span>
        </button>
      </div>

      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Raison Sociale & Identifiants Fiscaux
              </h3>
              <p className="text-xs text-slate-500">Ces mentions figureront sur l'en-tête de vos factures et devis.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom commercial *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Forme juridique & Capital</label>
                <input
                  type="text"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="SARL au capital de 5 000 000 FCFA"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Numéro NINEA (Sénégal) *</label>
                <input
                  type="text"
                  value={ninea}
                  onChange={(e) => setNinea(e.target.value)}
                  required
                  placeholder="007894562 2V3"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Registre de Commerce (RCCM)</label>
                <input
                  type="text"
                  value={rccm}
                  onChange={(e) => setRccm(e.target.value)}
                  placeholder="SN.DKR.2023.B.14589"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Coordonnées & Siège</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email officiel</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Adresse postale / Quartier</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Préférences de Facturation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Préfixe de numérotation</label>
                  <input
                    type="text"
                    value={invoicePrefix}
                    onChange={(e) => setInvoicePrefix(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Taux de TVA standard (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Instructions de paiement par défaut</label>
                  <textarea
                    rows={2}
                    value={paymentInstructions}
                    onChange={(e) => setPaymentInstructions(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-sans"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {isSaved ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Modifications enregistrées !
                </span>
              ) : (
                <span className="text-xs text-slate-400">Pensez à sauvegarder vos réglages.</span>
              )}

              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/25 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-card space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Membres de l'équipe</h3>
              <p className="text-xs text-slate-500">Gérez les accès à votre compte FacturaPro.</p>
            </div>
            <button className="px-3.5 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">
              + Inviter un collaborateur
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-brand-600 font-bold text-xs flex items-center justify-center">
                    {member.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{member.name}</p>
                    <p className="text-[11px] text-slate-400">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-700 hidden sm:inline">{member.role}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                    {member.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-card space-y-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-900">Sécurité du Compte</h3>
          <p className="text-xs text-slate-500">
            Authentification forte à deux facteurs (2FA) et journaux d'audit de connexion.
          </p>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Chiffrement SSL/TLS 256 bits actif</span>
            </p>
            <p>Toutes les données de facturation et les clés API sont isolées avec Row Level Security (RLS).</p>
          </div>
        </div>
      )}
    </div>
  );
}
