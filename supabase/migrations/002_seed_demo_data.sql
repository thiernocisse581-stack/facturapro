-- ==============================================================================
-- FacturaPro - Seed Demo Data for Supabase
-- Target: Supabase / PostgreSQL 15+
-- ==============================================================================

-- 1. Organization
INSERT INTO organizations (
    id, name, legal_name, address, city, country, currency, tax_rate,
    invoice_prefix, current_invoice_seq, ninea_number, rccm_number,
    email, phone, website, payment_instructions, subscription_plan
) VALUES (
    'org-devtech-sn',
    'DevTech Solutions SARL',
    'DevTech Solutions SARL au capital de 10 000 000 FCFA',
    '12 Avenue Hassan II, Plateau',
    'Dakar',
    'Sénégal',
    'XOF',
    18.00,
    'FAC-2025-',
    48,
    '004892341 2V3',
    'SN-DKR-2021-B-14529',
    'contact@devtech.sn',
    '+221 33 821 45 00',
    'https://devtech.sn',
    'Paiements acceptés : Wave (+221 77 123 45 67) / Orange Money (+221 78 987 65 43) / Virement bancaire BOA SN : SN084 01001 12345678901 45',
    'pro'
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Clients
INSERT INTO clients (id, organization_id, name, email, phone, address, city, country, tax_identifier) VALUES
('cli-1', 'org-devtech-sn', 'Sénégal Digital Agency', 'comptabilite@sendigital.sn', '+221 77 450 12 34', 'Route des Almadies, Immeuble Horizon', 'Dakar', 'Sénégal', '008923451 2V4'),
('cli-2', 'org-devtech-sn', 'Baobab Logistics SA', 'facturation@baobab-logistics.com', '+221 33 832 90 00', 'Zone Portuaire, Môle 3', 'Dakar', 'Sénégal', '003214567 1B2'),
('cli-3', 'org-devtech-sn', 'Teranga Fintech Hub', 'finance@terangahub.sn', '+221 78 120 89 76', 'Point E, Rue 5 x Boulevard de l''Est', 'Dakar', 'Sénégal', '005432198 3C9'),
('cli-4', 'org-devtech-sn', 'Kirene Agro-Business', 'achats@kirene-agro.sn', '+221 33 867 00 11', 'Km 24 Route de Rufisque', 'Diamniadio', 'Sénégal', '009876543 4D8'),
('cli-5', 'org-devtech-sn', 'Dakar Mobility Services', 'admin@dakarmobility.sn', '+221 77 890 12 00', 'Villas Sacré Cœur 3', 'Dakar', 'Sénégal', '001239874 5E1')
ON CONFLICT (id) DO NOTHING;

-- 3. Products
INSERT INTO products_services (id, organization_id, name, description, default_price, unit, category, tax_rate, is_active, type, currency) VALUES
('prod-1', 'org-devtech-sn', 'Audit & Architecture Cloud AWS/GCP', 'Audit d''infrastructure, sécurité, scalabilité et rapport de conformité', 1500000.00, 'prestation', 'Audit & Conseil', 18.00, true, 'service', 'XOF'),
('prod-2', 'org-devtech-sn', 'Développement Web SaaS Fullstack', 'Développement applicatif Next.js, Node.js, API REST et Webhooks', 450000.00, 'jour/homme', 'Ingénierie Logicielle', 18.00, true, 'service', 'XOF'),
('prod-3', 'org-devtech-sn', 'Intégration Passerelle Wave & Orange Money', 'Module d''encaissement automatisé, webhooks et réconciliation', 850000.00, 'projet', 'Paiements & Fintech', 18.00, true, 'service', 'XOF'),
('prod-4', 'org-devtech-sn', 'Maintenance & Support Dédié SLA 99.9%', 'Supervision 24/7, correctifs prioritaires et sauvegardes quotidiennes', 350000.00, 'mois', 'Support & DevOps', 18.00, true, 'service', 'XOF'),
('prod-5', 'org-devtech-sn', 'Formation Équipes DevOps & CI/CD', 'Session intensive de 3 jours : Docker, Kubernetes, GitLab CI', 1200000.00, 'session', 'Formation', 18.00, true, 'service', 'XOF')
ON CONFLICT (id) DO NOTHING;

-- 4. Invoices
INSERT INTO invoices (
    id, organization_id, client_id, invoice_number, status,
    issue_date, due_date, subtotal, tax_amount, total, amount_paid,
    currency, paid_at
) VALUES
('inv-48', 'org-devtech-sn', 'cli-1', 'FAC-2025-0048', 'paid', CURRENT_DATE - 7, CURRENT_DATE + 8, 3800000.00, 684000.00, 4484000.00, 4484000.00, 'XOF', CURRENT_DATE - 2),
('inv-47', 'org-devtech-sn', 'cli-2', 'FAC-2025-0047', 'paid', CURRENT_DATE - 12, CURRENT_DATE + 3, 2700000.00, 486000.00, 3186000.00, 3186000.00, 'XOF', CURRENT_DATE - 5),
('inv-46', 'org-devtech-sn', 'cli-3', 'FAC-2025-0046', 'pending', CURRENT_DATE - 4, CURRENT_DATE + 11, 2350000.00, 423000.00, 2773000.00, 0.00, 'XOF', null),
('inv-45', 'org-devtech-sn', 'cli-4', 'FAC-2025-0045', 'pending', CURRENT_DATE - 2, CURRENT_DATE + 13, 1200000.00, 216000.00, 1416000.00, 0.00, 'XOF', null),
('inv-44', 'org-devtech-sn', 'cli-5', 'FAC-2025-0044', 'overdue', CURRENT_DATE - 30, CURRENT_DATE - 15, 600000.00, 108000.00, 708000.00, 0.00, 'XOF', null)
ON CONFLICT (id) DO NOTHING;

-- 5. Invoice Lines
INSERT INTO invoice_lines (id, invoice_id, product_service_id, description, quantity, unit_price, tax_rate, line_total) VALUES
('line-48-1', 'inv-48', 'prod-1', 'Audit de sécurité et conformité infrastructure cloud', 1, 1500000.00, 18.00, 1500000.00),
('line-48-2', 'inv-48', 'prod-2', 'Développement du portail client et API webhooks (5 jours)', 5, 450000.00, 18.00, 2250000.00),
('line-48-3', 'inv-48', null, 'Frais de déploiement et configuration DNS sécurisé', 1, 50000.00, 18.00, 50000.00),
('line-47-1', 'inv-47', 'prod-3', 'Intégration passerelle de paiement Wave & Orange Money', 1, 850000.00, 18.00, 850000.00),
('line-47-2', 'inv-47', 'prod-2', 'Développement applicatif logistique et traçabilité (4 jours)', 4, 450000.00, 18.00, 1800000.00),
('line-47-3', 'inv-47', null, 'Configuration des alertes SMS et notifications push', 1, 50000.00, 18.00, 50000.00)
ON CONFLICT (id) DO NOTHING;

-- 6. Payments
INSERT INTO payments (id, organization_id, invoice_id, invoice_number, client_name, amount, provider, status, reference, transaction_id, paid_at) VALUES
('pay-1', 'org-devtech-sn', 'inv-48', 'FAC-2025-0048', 'Sénégal Digital Agency', 4484000.00, 'wave', 'completed', 'PAY-2025-0089', 'WAVE_SN_984102941', CURRENT_DATE - 2),
('pay-2', 'org-devtech-sn', 'inv-47', 'FAC-2025-0047', 'Baobab Logistics SA', 3186000.00, 'orange_money', 'completed', 'PAY-2025-0088', 'OM_SN_489210492', CURRENT_DATE - 5)
ON CONFLICT (id) DO NOTHING;

-- 7. Expenses
INSERT INTO expenses (id, organization_id, category, amount, description, vendor, currency, expense_date) VALUES
('exp-1', 'org-devtech-sn', 'Logiciels & SaaS', 185000.00, 'Abonnements AWS Cloud, Vercel Pro et GitHub Enterprise', 'Amazon Web Services', 'XOF', CURRENT_DATE - 3),
('exp-2', 'org-devtech-sn', 'Bureaux & Coworking', 350000.00, 'Loyer espace de travail Dakar Plateau', 'Immobilière du Cap-Vert', 'XOF', CURRENT_DATE - 10),
('exp-3', 'org-devtech-sn', 'Télécom & Fibre', 65000.00, 'Fibre optique Pro Sonatel 300 Mbps', 'Orange Sonatel', 'XOF', CURRENT_DATE - 15),
('exp-4', 'org-devtech-sn', 'Honoraires & Juridique', 250000.00, 'Honoraires comptables et déclaration fiscale mensuelle', 'Cabinet Conseil & Audit SN', 'XOF', CURRENT_DATE - 20)
ON CONFLICT (id) DO NOTHING;
