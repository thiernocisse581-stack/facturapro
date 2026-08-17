'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FileText,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Building,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAppData } from '@/context/AppDataContext';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plan');

  const { signUp, isLoading } = useAuth();
  const { addToast, updateOrganization } = useAppData();

  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [legalForm, setLegalForm] = useState('SARL');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPlanLabel =
    planParam === 'starter'
      ? 'Starter (0 FCFA/mois)'
      : planParam === 'business'
      ? 'Entreprise (15 000 FCFA/mois)'
      : 'Professionnel (5 000 FCFA/mois)';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !fullName || !email || !password) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Le mot de passe doit comporter au moins 6 caractères');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const result = await signUp({
      email,
      password,
      fullName,
      companyName,
      phone,
    });

    if (result.error) {
      setErrorMsg(result.error);
      setIsSubmitting(false);
    } else {
      // Update local organization with newly provided company details
      updateOrganization({
        name: companyName,
        legal_name: `${companyName} ${legalForm}`,
        email,
        phone,
        currency: 'FCFA',
        tax_rate: 18,
        subscription_plan: (planParam as any) || 'pro',
      });

      addToast({
        title: 'Compte créé avec succès !',
        message: `Bienvenue sur FacturaPro, ${companyName}`,
        type: 'success',
      });
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Back to Home navigation */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg mb-6 relative z-10 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all group shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-cyan-400" />
          <span>Retour à l'accueil</span>
        </Link>
        <Link
          href="/login"
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Déjà un compte ? Se connecter →
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-brand-500/30 ring-4 ring-brand-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-white tracking-tight">
                Factura<span className="text-cyan-400">Pro</span>
              </span>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Créer votre espace entreprise
              </span>
            </div>
          </Link>
        </div>

        <h2 className="text-center text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Commencez à facturer en toute conformité
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Configurez votre espace en 30 secondes. Données isolées et sécurisées.
        </p>

        {planParam && (
          <div className="mt-3 mx-auto flex items-center justify-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-300 text-xs font-bold w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Forfait sélectionné : {selectedPlanLabel}</span>
          </div>
        )}
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl py-6 px-5 sm:py-8 sm:px-8 shadow-2xl rounded-3xl border border-slate-800">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Company Name & Legal Form */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Raison sociale / Nom entreprise <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Building className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ex: Sahel Innovations"
                    className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Forme juridique
                </label>
                <select
                  value={legalForm}
                  onChange={(e) => setLegalForm(e.target.value)}
                  className="block w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                >
                  <option value="SARL">SARL</option>
                  <option value="SUARL">SUARL</option>
                  <option value="SAS">SAS</option>
                  <option value="SA">SA</option>
                  <option value="GIE">GIE</option>
                  <option value="Freelance">Indépendant</option>
                </select>
              </div>
            </div>

            {/* Manager Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nom &amp; Prénom du dirigeant <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Amadou Diallo"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email professionnel <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amadou@sahel.sn"
                    className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Téléphone
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+221 77 000 00 00"
                    className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mot de passe <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Features Included List */}
            <div className="py-2.5 px-3 bg-slate-800/50 rounded-xl border border-slate-700/60 space-y-1.5">
              <p className="text-[11px] font-bold text-slate-300">Votre compte inclut :</p>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Factures &amp; Devis OHADA
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Wave &amp; Orange Money
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Suivi TVA 18%
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Export PDF illimité
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 active:scale-95 text-white rounded-xl font-bold text-xs shadow-lg shadow-brand-600/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Créer mon entreprise sur FacturaPro</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-5 text-center pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              Vous avez déjà un compte ?{' '}
              <Link
                href="/login"
                className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
