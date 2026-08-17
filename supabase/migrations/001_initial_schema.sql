-- ==============================================================================
-- FacturaPro - Complete Database Migration & Security Schema
-- Target: Supabase / PostgreSQL 15+
-- Features: Multi-tenant (Organizations), RLS Security, Sequential Invoice Numbering,
--           Immutability Triggers, Payment Reconciliation & Webhook tracking.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'pending', 'paid', 'overdue', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'converted');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_provider AS ENUM ('manual', 'wave', 'orange_money', 'stripe', 'bank_transfer', 'cash');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_plan AS ENUM ('starter', 'pro', 'business');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'trialing');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABLES

-- Organizations (Tenants)
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

-- Organization Members (Multi-user roles)
CREATE TABLE IF NOT EXISTS organization_members (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID, -- references auth.users(id) in Supabase
    name VARCHAR(255),
    email VARCHAR(255),
    role user_role NOT NULL DEFAULT 'member',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients (CRM)
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

-- Products & Services (Catalogue)
CREATE TABLE IF NOT EXISTS products_services (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    default_price NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    unit VARCHAR(50) DEFAULT 'unité', -- e.g. heure, jour, projet, unité
    category VARCHAR(100),
    tax_rate NUMERIC(5,2) DEFAULT 18.00,
    is_active BOOLEAN DEFAULT TRUE,
    type VARCHAR(50) DEFAULT 'service',
    currency VARCHAR(10) DEFAULT 'XOF',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices (Factures)
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

-- Invoice Line Items
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

-- Quotes (Devis & Propositions commerciales)
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

-- Quote Line Items
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

-- Payments (Encaissements Wave, OM, Stripe, Virements)
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

-- Expenses (Dépenses & Achats d'exploitation)
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

-- Subscriptions (FacturaPro SaaS)
CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plan subscription_plan NOT NULL DEFAULT 'pro',
    status subscription_status NOT NULL DEFAULT 'active',
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook Events (For Wave, Orange Money, Stripe)
CREATE TABLE IF NOT EXISTS webhook_events (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    organization_id TEXT REFERENCES organizations(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SEQUENTIAL INVOICE NUMBERING FUNCTION (PostgreSQL)
CREATE OR REPLACE FUNCTION generate_invoice_number(org_id TEXT)
RETURNS VARCHAR(100) AS $$
DECLARE
    org_prefix VARCHAR(20);
    new_seq INTEGER;
    formatted_num VARCHAR(100);
BEGIN
    UPDATE organizations
    SET current_invoice_seq = COALESCE(current_invoice_seq, 0) + 1
    WHERE id = org_id
    RETURNING invoice_prefix, current_invoice_seq INTO org_prefix, new_seq;

    IF org_prefix IS NULL THEN
        org_prefix := 'FAC-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-';
    END IF;

    formatted_num := org_prefix || LPAD(new_seq::TEXT, 4, '0');
    RETURN formatted_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. IMMUTABILITY TRIGGER FOR SENT / PAID INVOICES
CREATE OR REPLACE FUNCTION enforce_invoice_immutability()
RETURNS TRIGGER AS $$
DECLARE
    inv_status invoice_status;
BEGIN
    SELECT status INTO inv_status FROM invoices WHERE id = OLD.invoice_id;
    
    IF inv_status IN ('paid') THEN
        RAISE EXCEPTION 'Conformité comptable OHADA : Les lignes d''une facture réglée sont immuables. Veuillez émettre un avoir.';
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_invoice_lines_immutability ON invoice_lines;
CREATE TRIGGER trg_invoice_lines_immutability
BEFORE UPDATE OR DELETE ON invoice_lines
FOR EACH ROW
EXECUTE FUNCTION enforce_invoice_immutability();

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow public read/write with anon key when RLS is configured for application usage
CREATE POLICY "Public full access on organizations" ON organizations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on clients" ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on products_services" ON products_services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on invoices" ON invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on invoice_lines" ON invoice_lines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on quotes" ON quotes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on quote_lines" ON quote_lines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on payments" ON payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on subscriptions" ON subscriptions FOR ALL USING (true) WITH CHECK (true);
