'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign,
  FileText,
  Smartphone,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { WaveLogo, OrangeMoneyLogo } from '@/components/ui/BrandLogos';

interface LiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CLIENT_PRESETS = [
  { name: 'Maison Akwa SARL', city: 'Dakar, Sénégal', ninea: '005489621 2V3' },
  { name: 'Nomad Digital Agency', city: 'Abidjan, Côte d\'Ivoire', ninea: 'CI-ABJ-098234' },
  { name: 'Cabinet Sylla & Associés', city: 'Bamako, Mali', ninea: 'ML-BKO-445892' },
];

const SERVICE_PRESETS = [
  { title: 'Développement Web & Passerelle Wave / OM', price: 350000, qty: 1 },
  { title: 'Conseil & Accompagnement Fiscal OHADA', price: 180000, qty: 1 },
  { title: 'Refonte Identité Visuelle & Marketing B2B', price: 250000, qty: 1 },
];

export default function LiveDemoModal({ isOpen, onClose }: LiveDemoModalProps) {
  const router = useRouter();
  const { signInDemo } = useAuth();

  const [selectedClient, setSelectedClient] = useState(CLIENT_PRESETS[0]);
  const [selectedService, setSelectedService] = useState(SERVICE_PRESETS[0]);
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(350000);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'wave_paid' | 'om_paid'>('pending');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isLaunchingDashboard, setIsLaunchingDashboard] = useState(false);

  if (!isOpen) return null;

  // Real-time OHADA Calculations
  const subtotal = unitPrice * quantity;
  const tvaRate = 0.18; // 18% UEMOA
  const tvaAmount = Math.round(subtotal * tvaRate);
  const totalTTC = subtotal + tvaAmount;

  const handleSelectService = (preset: typeof SERVICE_PRESETS[0]) => {
    setSelectedService(preset);
    setUnitPrice(preset.price);
    setQuantity(preset.qty);
    setPaymentStatus('pending');
  };

  const handleSimulatePayment = (provider: 'wave' | 'om') => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setPaymentStatus(provider === 'wave' ? 'wave_paid' : 'om_paid');
    }, 600);
  };

  const handleLaunchFullDemo = async () => {
    setIsLaunchingDashboard(true);
    try {
      await signInDemo();
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setIsLaunchingDashboard(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-3xl bg-white border border-slate-200/80 rounded-3xl shadow-2xl overflow-hidden my-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-300 text-xs font-bold mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Simulateur Interactif Live · Sans Inscription</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Testez la création &amp; l'encaissement en direct ⚡
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
            Modifiez les montants, observez le calcul OHADA automatique de la TVA 18% et simulez un encaissement Wave ou Orange Money instantané.
          </p>
        </div>

        {/* Modal Body: Interactive Sandbox */}
        <div className="p-4 sm:p-6 space-y-5 bg-slate-50/50">
          {/* Step 1: Choose Client */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              1. Sélectionnez un client B2B test
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {CLIENT_PRESETS.map((client) => (
                <button
                  key={client.name}
                  type="button"
                  onClick={() => {
                    setSelectedClient(client);
                    setPaymentStatus('pending');
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedClient.name === client.name
                      ? 'bg-cyan-50/80 border-cyan-500 text-slate-900 shadow-sm ring-2 ring-cyan-500/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900 truncate">{client.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{client.city}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Service & Live Calculation */}
          <div className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                2. Prestation &amp; Calcul Dynamique OHADA
              </label>
              {/* Presets switch */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {SERVICE_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectService(p)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                      selectedService.title === p.title
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    Preset {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs: Service Title + Qty + Price */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_80px_140px] gap-2.5">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Description</span>
                <input
                  type="text"
                  value={selectedService.title}
                  onChange={(e) => {
                    setSelectedService({ ...selectedService, title: e.target.value });
                    setPaymentStatus('pending');
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Qté</span>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1));
                    setPaymentStatus('pending');
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 text-center focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Prix unitaire (FCFA)</span>
                <input
                  type="number"
                  step="5000"
                  value={unitPrice}
                  onChange={(e) => {
                    setUnitPrice(Math.max(0, parseInt(e.target.value) || 0));
                    setPaymentStatus('pending');
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Real-time OHADA Totals Box */}
            <div className="p-3.5 bg-slate-900 text-white rounded-xl grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Sous-total HT</div>
                <div className="font-heading font-extrabold text-xs sm:text-sm text-slate-100 mt-0.5">
                  {subtotal.toLocaleString('fr-FR')} FCFA
                </div>
              </div>
              <div className="border-x border-slate-800">
                <div className="text-[10px] text-cyan-400 uppercase font-bold">TVA UEMOA (18%)</div>
                <div className="font-heading font-extrabold text-xs sm:text-sm text-cyan-300 mt-0.5">
                  +{tvaAmount.toLocaleString('fr-FR')} FCFA
                </div>
              </div>
              <div>
                <div className="text-[10px] text-emerald-400 uppercase font-bold">Total Net TTC</div>
                <div className="font-heading font-black text-xs sm:text-base text-emerald-400 mt-0.5">
                  {totalTTC.toLocaleString('fr-FR')} FCFA
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Instant Payment Simulation (Wave & Orange Money) */}
          <div className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                3. Simuler un règlement mobile immédiat
              </label>
              {paymentStatus !== 'pending' && (
                <button
                  type="button"
                  onClick={() => setPaymentStatus('pending')}
                  className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Réinitialiser
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Wave Button */}
              <button
                type="button"
                disabled={isSimulating}
                onClick={() => handleSimulatePayment('wave')}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  paymentStatus === 'wave_paid'
                    ? 'border-cyan-500 bg-cyan-50/80 shadow-md ring-2 ring-cyan-400/30'
                    : 'border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/30 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <WaveLogo className="w-8 h-8 shrink-0 shadow-sm" />
                  <div className="text-left">
                    <div className="font-bold text-xs text-slate-900">Paiement Wave</div>
                    <div className="text-[10px] text-slate-500">Sans frais de transaction</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-cyan-500 text-white rounded-lg text-[10px] font-extrabold shadow-sm">
                  Simuler
                </span>
              </button>

              {/* Orange Money Button */}
              <button
                type="button"
                disabled={isSimulating}
                onClick={() => handleSimulatePayment('om')}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  paymentStatus === 'om_paid'
                    ? 'border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-400/30'
                    : 'border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <OrangeMoneyLogo className="w-8 h-8 shrink-0 shadow-sm" />
                  <div className="text-left">
                    <div className="font-bold text-xs text-slate-900">Orange Money</div>
                    <div className="text-[10px] text-slate-500">Code marchand &amp; QR</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-amber-500 text-white rounded-lg text-[10px] font-extrabold shadow-sm">
                  Simuler
                </span>
              </button>
            </div>

            {/* Status Alert Banner */}
            {paymentStatus === 'pending' ? (
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  Statut actuel : <strong className="text-slate-800">Facture en attente de règlement</strong>
                </span>
                <span className="text-[11px] font-semibold text-slate-400">#FAC-2025-0049</span>
              </div>
            ) : (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-800 animate-fade-in shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                    ✓
                  </div>
                  <div>
                    <div className="font-extrabold">
                      {paymentStatus === 'wave_paid' ? 'Paiement Wave de' : 'Paiement Orange Money de'}{' '}
                      {totalTTC.toLocaleString('fr-FR')} FCFA reçu instantanément !
                    </div>
                    <div className="text-[10px] text-emerald-600 font-medium">
                      Réf Transaction : {paymentStatus === 'wave_paid' ? 'WAVE_TX_984120' : 'OM_SN_441092'} · Facture marquée Payée ✓
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-600 text-white font-extrabold rounded-lg text-[10px]">
                  PAYÉE
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer: Direct Entry to Full Demo Dashboard */}
        <div className="p-4 sm:p-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <div className="font-heading font-extrabold text-xs sm:text-sm text-slate-900">
              Convaincu ? Explorez l'intégralité du SaaS
            </div>
            <div className="text-[11px] text-slate-500">
              Accédez au Dashboard complet avec graphiques, journal de TVA et 10 factures d'exemples.
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleLaunchFullDemo}
              disabled={isLaunchingDashboard}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-brand-600 via-sky-500 to-cyan-500 hover:from-brand-700 hover:to-cyan-600 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>{isLaunchingDashboard ? 'Chargement de l\'espace...' : 'Entrer dans la Démo Complète →'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
