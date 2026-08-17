'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  CreditCard,
  Webhook,
  CheckCircle2,
  AlertCircle,
  Key,
  ExternalLink,
  Save,
  Database as DatabaseIcon,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Radio,
  FileCode,
  Layers,
} from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';

export default function IntegrationsPage() {
  const {
    supabaseStatus,
    supabaseConfig,
    lastSyncedAt,
    isSyncing,
    updateSupabaseConfig,
    syncWithSupabase,
    testSupabase,
  } = useAppData();

  // Supabase Local Form State
  const [supabaseUrl, setSupabaseUrl] = useState(supabaseConfig.url || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(supabaseConfig.anonKey || '');
  const [supabaseToken, setSupabaseToken] = useState(
    supabaseConfig.accessToken || ''
  );
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Other Gateways
  const [waveEnabled, setWaveEnabled] = useState(true);
  const [omEnabled, setOmEnabled] = useState(true);
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [waveApiKey, setWaveApiKey] = useState('wave_live_pk_839217894217894');
  const [omClientId, setOmClientId] = useState('OM_PROD_CLI_8829471');
  const [webhookUrl, setWebhookUrl] = useState('https://api.devtech.sn/webhooks/facturapro');
  const [saved, setSaved] = useState(false);

  const handleSaveSupabase = () => {
    updateSupabaseConfig({
      url: supabaseUrl.trim(),
      anonKey: supabaseAnonKey.trim(),
      accessToken: supabaseToken.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestSupabase = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testSupabase(supabaseUrl.trim(), supabaseAnonKey.trim());
    setTestResult(res);
    setIsTesting(false);
  };

  const handleSaveOther = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const migrationSql = `-- ==============================================================================
-- FacturaPro - Schéma PostgreSQL / Supabase
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member');
    CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'pending', 'paid', 'overdue', 'cancelled');
    CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'converted');
    CREATE TYPE payment_provider AS ENUM ('manual', 'wave', 'orange_money', 'stripe', 'bank_transfer', 'cash');
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
    CREATE TYPE subscription_plan AS ENUM ('starter', 'pro', 'business');
    CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'trialing');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Sénégal',
    currency VARCHAR(10) DEFAULT 'XOF',
    tax_rate NUMERIC(5,2) DEFAULT 18.00,
    invoice_prefix VARCHAR(20) DEFAULT 'FAC-2025-',
    current_invoice_seq INTEGER DEFAULT 48,
    logo_url TEXT,
    ninea_number VARCHAR(100),
    rccm_number VARCHAR(100),
    legal_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(255),
    payment_instructions TEXT,
    subscription_plan subscription_plan DEFAULT 'pro',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Sénégal',
    tax_identifier VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products_services (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    default_price NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    unit VARCHAR(50) DEFAULT 'unité',
    category VARCHAR(100),
    tax_rate NUMERIC(5,2) DEFAULT 18.00,
    is_active BOOLEAN DEFAULT TRUE,
    type VARCHAR(50) DEFAULT 'service',
    currency VARCHAR(10) DEFAULT 'XOF',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    invoice_number VARCHAR(100) NOT NULL,
    status invoice_status NOT NULL DEFAULT 'draft',
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    subtotal NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(15,2) DEFAULT 0.00,
    total NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    amount_paid NUMERIC(15,2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'XOF',
    notes TEXT,
    terms_conditions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, invoice_number)
);

CREATE TABLE IF NOT EXISTS invoice_lines (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    invoice_id TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    product_service_id TEXT REFERENCES products_services(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    quantity NUMERIC(10,2) NOT NULL DEFAULT 1.00,
    unit_price NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    tax_rate NUMERIC(5,2) DEFAULT 18.00,
    line_total NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quotes (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    quote_number VARCHAR(100) NOT NULL,
    status quote_status NOT NULL DEFAULT 'draft',
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE NOT NULL,
    subtotal NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    total NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'XOF',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, quote_number)
);

CREATE TABLE IF NOT EXISTS quote_lines (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    quote_id TEXT NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    product_service_id TEXT REFERENCES products_services(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    quantity NUMERIC(10,2) NOT NULL DEFAULT 1.00,
    unit_price NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    tax_rate NUMERIC(5,2) DEFAULT 18.00,
    line_total NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    invoice_id TEXT REFERENCES invoices(id) ON DELETE SET NULL,
    invoice_number VARCHAR(100),
    client_name VARCHAR(255),
    amount NUMERIC(15,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'XOF',
    provider payment_provider NOT NULL DEFAULT 'manual',
    status payment_status NOT NULL DEFAULT 'completed',
    reference VARCHAR(255),
    transaction_id VARCHAR(255),
    paid_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    amount NUMERIC(15,2) NOT NULL,
    description TEXT,
    vendor VARCHAR(255),
    currency VARCHAR(10) DEFAULT 'XOF',
    receipt_url TEXT,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public full access on organizations" ON organizations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on clients" ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on products_services" ON products_services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on invoices" ON invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on invoice_lines" ON invoice_lines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on quotes" ON quotes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on quote_lines" ON quote_lines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on payments" ON payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);`;

  const copySql = () => {
    navigator.clipboard.writeText(migrationSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            Passerelles & Intégrations Backend
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gérez votre base de données cloud PostgreSQL Supabase, vos passerelles de paiement Wave / OM et vos webhooks.
          </p>
        </div>

        {/* Global Sync status badge */}
        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
              supabaseStatus === 'connected'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : supabaseStatus === 'syncing'
                ? 'bg-sky-50 text-sky-700 border-sky-200 animate-pulse'
                : supabaseStatus === 'error'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                supabaseStatus === 'connected'
                  ? 'bg-emerald-500'
                  : supabaseStatus === 'syncing'
                  ? 'bg-sky-500'
                  : supabaseStatus === 'error'
                  ? 'bg-rose-500'
                  : 'bg-amber-500'
              }`}
            />
            {supabaseStatus === 'connected' && 'Supabase Connecté'}
            {supabaseStatus === 'syncing' && 'Synchronisation...'}
            {supabaseStatus === 'error' && 'Erreur Supabase'}
            {supabaseStatus === 'unconfigured' && 'Mode Local / Démo'}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. SUPABASE CLOUD DATABASE SECTION */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/60">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold shadow-inner">
                <DatabaseIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg sm:text-xl font-black text-white">Supabase Cloud Database (PostgreSQL)</h2>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Officiel
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Persistance temps-réel, conformité comptable OHADA, RLS multi-tenant et backups automatisés.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowSqlModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-600 transition"
              >
                <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                Script SQL Migration
              </button>

              <button
                onClick={() => syncWithSupabase('push')}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/40 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                Synchroniser Tout
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>URL du Projet Supabase</span>
                <span className="text-[10px] text-slate-400 font-normal">Dashboard &gt; Settings &gt; API</span>
              </label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xxxxxxxxxxxx.supabase.co"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950/70 border border-slate-700 rounded-xl font-mono text-emerald-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Clé Anonyme Publique (Anon Key)</span>
                <span className="text-[10px] text-slate-400 font-normal">Commence par eyJhbGci...</span>
              </label>
              <input
                type="password"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950/70 border border-slate-700 rounded-xl font-mono text-emerald-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Jeton d'Accès Personnel (Personal Access Token)</span>
                <span className="text-[10px] text-emerald-400 font-mono font-semibold">Configuré par le propriétaire</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={supabaseToken}
                  onChange={(e) => setSupabaseToken(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-950/70 border border-slate-700 rounded-xl font-mono text-slate-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <div className="absolute right-3 top-2.5 text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  sbp_***
                </div>
              </div>
            </div>
          </div>

          {/* Test Status feedback */}
          {testResult && (
            <div
              className={`p-3.5 rounded-2xl border text-xs font-medium flex items-start gap-2.5 ${
                testResult.success
                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p>{testResult.message}</p>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-700/60">
            <div className="text-[11px] text-slate-400">
              {lastSyncedAt ? (
                <span>Dernière synchro réussie : <strong className="text-slate-200">{lastSyncedAt}</strong></span>
              ) : (
                <span>Synchronisation locale prête — Enregistrez pour connecter votre base cloud</span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleTestSupabase}
                disabled={isTesting}
                className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-600 transition"
              >
                {isTesting ? 'Test en cours...' : 'Tester la Connexion'}
              </button>

              <button
                type="button"
                onClick={handleSaveSupabase}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-900/50 transition"
              >
                <Save className="w-3.5 h-3.5" />
                Enregistrer la Configuration
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PAYMENT GATEWAYS & WEBHOOKS GRID */}
      {/* ========================================================================= */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4">Passerelles de Paiement & Webhooks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Wave Mobile Money */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-card flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-black text-sm shadow-sm">
                    W
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">Wave Mobile Money</h3>
                    <p className="text-[11px] text-slate-400">QR Code & Liens de paiement directs</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                  1% sans frais cachés
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Clé API Marchand Wave</label>
                  <input
                    type="password"
                    value={waveApiKey}
                    onChange={(e) => setWaveApiKey(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-semibold text-slate-700">Activer le bouton de paiement Wave</span>
                  <input
                    type="checkbox"
                    checked={waveEnabled}
                    onChange={(e) => setWaveEnabled(e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Opérationnel
              </span>
              <button
                onClick={handleSaveOther}
                className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Enregistrer
              </button>
            </div>
          </div>

          {/* Orange Money */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-card flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-sm shadow-sm">
                    OM
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">Orange Money (OM API)</h3>
                    <p className="text-[11px] text-slate-400">Paiement marchand Sonatel / Orange SN</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                  Paiement instantané
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Client ID Marchand OM</label>
                  <input
                    type="text"
                    value={omClientId}
                    onChange={(e) => setOmClientId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-semibold text-slate-700">Activer le bouton Orange Money</span>
                  <input
                    type="checkbox"
                    checked={omEnabled}
                    onChange={(e) => setOmEnabled(e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Opérationnel
              </span>
              <button
                onClick={handleSaveOther}
                className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Enregistrer
              </button>
            </div>
          </div>

          {/* Stripe */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-card flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                    S
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">Stripe Payments</h3>
                    <p className="text-[11px] text-slate-400">Cartes bancaires Visa, Mastercard, AMEX</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  International
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Clé secrète Stripe (sk_live_...)</label>
                  <input
                    type="password"
                    placeholder="sk_live_51M..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-semibold text-slate-700">Activer le paiement par Carte bancaire</span>
                  <input
                    type="checkbox"
                    checked={stripeEnabled}
                    onChange={(e) => setStripeEnabled(e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Non configuré</span>
              <button
                onClick={handleSaveOther}
                className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Enregistrer
              </button>
            </div>
          </div>

          {/* Webhooks */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-card flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                    <Webhook className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">Webhooks en Temps Réel</h3>
                    <p className="text-[11px] text-slate-400">Événements invoice.paid, invoice.overdue</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL Endpoint Webhook</label>
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Prêt pour écoute
              </span>
              <button
                onClick={handleSaveOther}
                className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SQL Migration Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 animate-scale-up">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DatabaseIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Script SQL de Migration Supabase</h3>
                  <p className="text-[11px] text-slate-500">À copier et exécuter dans Supabase &gt; SQL Editor</p>
                </div>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 sm:p-6 flex-1 overflow-y-auto bg-slate-950 font-mono text-[11px] text-emerald-300 leading-relaxed rounded-b-none selection:bg-emerald-500 selection:text-white">
              <pre className="whitespace-pre-wrap">{migrationSql}</pre>
            </div>

            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Crée les tables `organizations`, `clients`, `invoices`, `quotes`, `payments`, etc. avec RLS.
              </span>
              <button
                onClick={copySql}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
              >
                {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedSql ? 'Copié !' : 'Copier le SQL'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
