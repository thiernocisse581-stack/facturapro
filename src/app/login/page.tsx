'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAppData } from '@/context/AppDataContext';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInDemo, isLoading } = useAuth();
  const { addToast } = useAppData();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Veuillez saisir votre email et mot de passe');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const result = await signIn(email, password);

    if (result.error) {
      setErrorMsg(result.error);
      setIsSubmitting(false);
    } else {
      addToast({
        title: 'Connexion réussie',
        message: 'Bienvenue sur votre espace FacturaPro',
        type: 'success',
      });
      router.push('/dashboard');
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    await signInDemo();
    addToast({
      title: 'Accès Démo Activé',
      message: 'Bienvenue sur votre tableau de bord démo',
      type: 'success',
    });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Back to Home navigation */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6 relative z-10 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all group shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-cyan-400" />
          <span>Retour à l'accueil</span>
        </Link>
        <Link
          href="/register"
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Créer un compte →
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Logo & Tagline */}
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
                SaaS B2B Conforme OHADA
              </span>
            </div>
          </Link>
        </div>

        <h2 className="text-center text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Connectez-vous à votre espace
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Gérez vos factures, devis, encaissements Wave/OM et TVA en toute conformité.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl py-6 px-5 sm:py-8 sm:px-8 shadow-2xl rounded-3xl border border-slate-800">
          {/* Quick Demo Access Button */}
          <div className="mb-5 pb-5 border-b border-slate-800">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-brand-500/20 active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Accès Démo Rapide en 1 Clic</span>
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-1.5">
              Testez instantanément l'application sans créer de compte.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Standard Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Adresse Email professionnelle
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
                  placeholder="contact@entreprise.sn"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Mot de passe
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    addToast({
                      title: 'Récupération de mot de passe',
                      message: 'Un lien de réinitialisation sera envoyé à votre adresse email.',
                      type: 'info',
                    });
                  }}
                  className="text-[11px] font-medium text-brand-400 hover:text-brand-300 transition-colors"
                >
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
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

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded text-brand-600 bg-slate-800 border-slate-700 focus:ring-brand-500"
                />
                <span className="text-xs text-slate-400">Se souvenir de moi</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-600 hover:bg-brand-500 active:scale-95 text-white rounded-xl font-bold text-xs shadow-lg shadow-brand-600/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-5 text-center pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              Vous n'avez pas encore de compte ?{' '}
              <Link
                href="/register"
                className="font-bold text-brand-400 hover:text-brand-300 transition-colors"
              >
                Créer une entreprise
              </Link>
            </p>
          </div>
        </div>

        {/* Legal & Compliance Footer */}
        <div className="mt-6 flex items-center justify-center gap-4 text-slate-500 text-[11px]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Données chiffrées & RLS
          </span>
          <span>•</span>
          <span>Sénégal / UEMOA / OHADA</span>
          <span>•</span>
          <span>TVA 18%</span>
        </div>
      </div>
    </div>
  );
}
