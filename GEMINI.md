# FacturaPro — Documentation Technique & Guide d'Architecture Full Stack

> **FacturaPro** est un SaaS de facturation B2B moderne, ultra-rapide et entièrement conforme aux normes comptables **OHADA** et fiscales ouest-africaines (**UEMOA / Sénégal**).  
> Ce document sert de référence technique et de guide permanent pour tout développeur ou modèle d'IA devant comprendre, maintenir ou faire évoluer le projet.

---

## 1. Vue d'Ensemble du Projet

### 1.1 Objectif
FacturaPro permet aux PME, agences, startups et indépendants d'Afrique de l'Ouest de :
- Créer un compte sécurisé et disposer d'un espace de travail d'entreprise **isolé et vierge (Clean Slate)** démarrant à zéro.
- Émettre des factures et devis certifiés conformes (mentions légales NINEA, RCCM, ventilation TVA 18.00%, devises FCFA/XOF, EUR, USD).
- Encaisser des paiements en ligne et mobiles via **Wave Mobile Money**, **Orange Money**, **Virements bancaires (BOA, CBAO, etc.)** et **Cartes bancaires (Stripe)**.
- Suivre les créances clients, les encaissements, les dépenses opérationnelles et la TVA collectée vs déductible.
- Bénéficier d'une expérience utilisateur réactive, esthétique (qualité Dribbble/Awwwards) et 100% optimisée pour tous les formats d'écrans (**Mobile First, Tablettes, Desktop**).

### 1.2 Spécifications Légales & Métier
- **Devise par défaut :** FCFA (`XOF`) avec séparateurs de milliers formatés (ex: `12 450 000 FCFA`).
- **Taux de TVA standard :** `18.00%` (calculé dynamiquement à partir de la base Hors Taxes).
- **Numérotation séquentielle :** Préfixe personnalisable avec incrémentation continue sans trou (ex: `FAC-2025-0001`).
- **Identifiants légaux intégrés :** `NINEA` (Numéro d'Identification Nationale des Entreprises et Associations) et `RCCM` (Registre du Commerce et du Crédit Mobilier).

---

## 2. Fonctionnalités & Routes Implémentées

| Module | Route(s) | Description détaillée |
| :--- | :--- | :--- |
| **Authentification & Connexion** | `/login` | Page de connexion SaaS pro avec bascule démo 1-clic, validation Supabase Auth et redirection intelligente. |
| **Inscription & Onboarding** | `/register` | Inscription d'entreprise multi-champs (Raison sociale, Forme juridique, Dirigeant, Email, Mot de passe) avec initialisation de l'espace à zéro. |
| **Tableau de Bord** | `/dashboard`, `/` | 4 StatCards KPI connectées aux métriques réelles (*CA encaissé, Factures payées, Factures en attente, Factures en retard*), graphique Recharts Area, Donut chart de répartition des statuts, bandeau d'accueil onboarding 3 étapes et tableau dynamique. |
| **Facturation** | `/factures` | Liste complète avec recherche multi-critères, badges de statut, filtres par onglets (*Toutes, Payées, En attente, En retard, Brouillons*), métriques financières en temps réel et vue adaptée en cartes mobiles sur petit écran. |
| **Créateur de Facture** | `/factures/nouvelle` | Constructeur interactif avec génération automatique du numéro de séquence, sélection directe des articles du catalogue, ajout de lignes dynamiques, calcul en direct de la TVA 18% et du TTC, et modale d'ajout rapide de client intégrée. |
| **Fiche Facture & PDF** | `/factures/[id]` | Vue détaillée de la facture avec chronologie de statut, module de génération et téléchargement de **PDF haute résolution conforme OHADA**, impression directe, modal d'encaissement et modal d'envoi par email ou WhatsApp direct. |
| **Devis & Propositions** | `/devis` | Création et suivi des offres commerciales avec validité calendaire et bouton de **conversion en facture en 1 clic**. |
| **CRM Clients** | `/clients` | Répertoire complet des clients, adresses, emails, téléphones, NINEA, historique d'encours et solde en attente de règlement. |
| **Catalogue Articles** | `/produits` | Gestion des services et produits physiques avec grilles tarifaires par défaut, unités de mesure (*heure, jour, mois, prestation*) et taux de TVA. |
| **Gestion des Dépenses** | `/depenses` | Saisie des charges et achats d'exploitation par catégorie (*Logiciels, Bureau, Télécom, Transport, Honoraires*) pour le suivi du résultat net. |
| **Journal des Paiements** | `/paiements` | Registre des transactions avec badges de passerelles (**Wave**, **Orange Money**, **Stripe**, **Virement**, **Espèces**), références de transaction et dates d'encaissement. |
| **Rapports Financiers** | `/rapports` | Graphique Recharts BarChart comparant les revenus encaissés aux dépenses, marge nette d'exploitation en pourcentage et export des données au format CSV. |
| **Fiscalité & Déclaration TVA** | `/taxes` | Tableau de bord fiscal récapitulant la TVA collectée sur ventes, la TVA déductible sur charges et la TVA nette due au Trésor Public (DGID) avec rappel des échéances au 15 du mois. |
| **Plans & Abonnements SaaS** | `/abonnements` | Grille tarifaire des forfaits *Starter*, *Professionnel* et *Entreprise* avec toggle mensuel/annuel (-20%) et mise à niveau réactive. |
| **Paramètres d'Organisation** | `/parametres` | Configuration de la raison sociale, forme juridique, NINEA, RCCM, logo, coordonnées, préfixe de facture et gestion des membres de l'équipe avec rôles. |
| **Passerelles & Intégrations** | `/integrations` | Configuration des clés API pour Wave Mobile Money, Orange Money API, Stripe, Supabase Cloud et endpoints Webhooks d'écoute en temps réel. |
| **Command Palette (`⌘K`)** | Global (`Ctrl+K` / `⌘K`) | Recherche globale ultra-rapide permettant de naviguer instantanément vers n'importe quelle facture, client, devis ou action rapide. |
| **Système de Notifications** | Topbar | Tiroir de notifications interactif alertant sur les réceptions de paiements Wave/OM, les consultations de factures et les dépassements d'échéance. |
| **Navigation Mobile Native** | `MobileBottomNav` | Barre d'onglets inférieure façon app native iOS/Android pour un accès direct au pouce (Accueil, Factures, + Nouvelle, Clients, Menu). |

---

## 3. Architecture Full Stack & Multi-Tenant

### 3.1 Gestion d'Authentification (`AuthContext.tsx`)
- Intégration de l'authentification Supabase avec tokens de session.
- Mode fallback local automatique pour le développement et la démo en 1-clic.
- Séparation stricte des utilisateurs avec `user.id`.

### 3.2 Isolation des Données & Espace Vierge (`AppDataContext.tsx`)
- Chaque utilisateur possède une clé de persistance dédiée (`facturapro_user_${user.id}_data`).
- À la création d'un compte ou première connexion, l'espace démarre à **0 FCFA, 0 facture, 0 client, 0 dépense**.
- Des fonctions d'aide sont fournies : `loadDemoData()` pour injecter instantanément des données de test et `resetToCleanSlate()` pour réinitialiser le compte à blanc.

### 3.3 Synchronisation Supabase Cloud
- Service adaptateur bi-directionnel (`supabaseService.ts`).
- Synchronisation ascendante (Push) et descendante (Pull) des entités.
- Support du schéma PostgreSQL complet dans `supabase/migrations/001_initial_schema.sql` avec politiques RLS basées sur `auth.uid()`.

---

## 4. Structure des Fichiers

```
FacturaPro/
├── GEMINI.md                             # Documentation permanente et guide d'architecture
├── package.json                          # Dépendances et scripts de build/dev
├── tsconfig.json                         # Configuration TypeScript & alias path '@/...'
├── tailwind.config.ts                    # Palette de couleurs, ombres, rayons de bordure
├── test_routes.mjs                       # Suite de tests automatisés validant les 17 routes HTTP
├── .env.local                            # Configuration des clés Supabase et token
├── .env.example                          # Modèle de variables d'environnement
│
├── scripts/
│   └── supabase-helper.mjs               # Script de diagnostic et validation Supabase
│
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql        # Schéma PostgreSQL complet avec tables, RLS et triggers
│       └── 002_seed_demo_data.sql        # Script de peuplement des données démo pour Supabase
│
├── src/
│   ├── app/                              # Next.js 14 App Router (Pages & Layouts)
│   │   ├── layout.tsx                    # Root layout avec AuthProvider, AppDataProvider et ToastContainer
│   │   ├── page.tsx                      # Redirection / vue du Dashboard principal
│   │   ├── login/
│   │   │   └── page.tsx                  # Page de connexion SaaS & Accès Démo 1-Clic
│   │   ├── register/
│   │   │   └── page.tsx                  # Inscription & Onboarding entreprise
│   │   ├── dashboard/
│   │   │   └── page.tsx                  # Page Dashboard avec métriques réelles, charts et bandeau onboarding
│   │   ├── factures/
│   │   │   ├── page.tsx                  # Liste des factures avec recherche et filtres
│   │   │   ├── nouvelle/
│   │   │   │   └── page.tsx              # Formulaire de création de facture dynamique
│   │   │   └── [id]/
│   │   │       └── page.tsx              # Vue détaillée, statut, timeline et export PDF
│   │   ├── devis/
│   │   │   └── page.tsx                  # Gestion des devis et conversion en facture
│   │   ├── clients/
│   │   │   └── page.tsx                  # CRM Clients avec solde et total facturé
│   │   ├── produits/
│   │   │   └── page.tsx                  # Catalogue des produits et prestations de services
│   │   ├── depenses/
│   │   │   └── page.tsx                  # Suivi des dépenses et charges d'exploitation
│   │   ├── paiements/
│   │   │   └── page.tsx                  # Journal des encaissements et réconciliation
│   │   ├── rapports/
│   │   │   └── page.tsx                  # Graphiques de rentabilité et export CSV
│   │   ├── taxes/
│   │   │   └── page.tsx                  # Déclaration de TVA (collectée vs déductible)
│   │   ├── abonnements/
│   │   │   └── page.tsx                  # Tarifs des plans Starter, Pro, Business
│   │   ├── parametres/
│   │   │   └── page.tsx                  # Paramètres d'organisation, NINEA, RCCM et équipe
│   │   └── integrations/
│   │       └── page.tsx                  # Passerelles Wave, Orange Money, Stripe, Supabase & Webhooks
│   │
│   ├── components/
│   │   ├── layout/                       # Éléments structurels de navigation
│   │   │   ├── Sidebar.tsx               # Barre latérale avec profil utilisateur connecté et bouton Déconnexion
│   │   │   ├── Topbar.tsx                # Barre supérieure avec menu compte, recherche, notifications, synchro
│   │   │   ├── MobileBottomNav.tsx       # Barre de navigation tactile inférieure (Mobile)
│   │   │   ├── CommandPalette.tsx        # Modale de recherche globale ⌘K
│   │   │   └── MainLayoutClient.tsx      # Enveloppe client avec protection de routes
│   │   │
│   │   ├── dashboard/                    # Composants modulaires du tableau de bord
│   │   │   ├── StatCard.tsx              # KPI Card (CA, Payées, En attente, En retard)
│   │   │   ├── RevenueChart.tsx          # Graphique Recharts Area réactif
│   │   │   ├── StatusDonutChart.tsx      # Donut Chart Recharts (Répartition des factures)
│   │   │   ├── QuickActions.tsx          # Boutons d'actions rapides
│   │   │   ├── StatusInvoicesTable.tsx   # Tableau / Cartes des factures par statut avec CTA d'état vide
│   │   │   ├── RecentInvoices.tsx        # Widget liste des factures récentes
│   │   │   └── RecentPayments.tsx        # Widget liste des paiements reçus
│   │   │
│   │   ├── invoices/                     # Composants liés aux factures
│   │   │   ├── InvoiceStatusBadge.tsx    # Pastille de statut avec couleur et point indicateur
│   │   │   ├── InvoicePDFPreview.tsx     # Canvas imprimable et export PDF conforme OHADA
│   │   │   ├── PaymentModal.tsx          # Modale d'enregistrement de paiement multi-canaux
│   │   │   └── SendInvoiceModal.tsx      # Modale d'envoi par Email et lien direct WhatsApp
│   │   │
│   │   └── ui/
│   │       └── ToastContainer.tsx        # Gestionnaire visuel de notifications toast
│   │
│   ├── context/
│   │   ├── AuthContext.tsx               # Contexte global d'authentification Supabase & session
│   │   └── AppDataContext.tsx            # State central React multi-tenant avec persistance et Supabase
│   │
│   ├── lib/
│   │   ├── database.types.ts             # Schéma de types TypeScript pour Supabase PostgreSQL
│   │   ├── supabaseClient.ts             # Initialisation dynamique du client Supabase et tests de latence
│   │   ├── supabaseService.ts            # Adaptateur de service CRUD & synchronisation Cloud
│   │   ├── formatters.ts                 # Utilitaires de formatage de devise FCFA, dates et statuts
│   │   └── initialData.ts                # Jeu de données réaliste conforme à la capture d'écran
│   │
│   ├── styles/
│   │   └── globals.css                   # Styles CSS de base, animations, safe-areas iOS et print
│   │
│   └── types/
│       └── index.ts                      # Définitions des types TypeScript du modèle de données
```

---

## 5. Instructions de Développement & Commandes

1. **Lancement en mode Développement :**
   ```powershell
   npm.cmd run dev
   ```
   L'application est disponible sur `http://localhost:3000`.

2. **Validation & Compilation Production :**
   ```powershell
   npm.cmd run build
   ```

3. **Suite de Tests des Routes :**
   ```powershell
   node test_routes.mjs
   ```
   *Résultat attendu : 17/17 routes vérifiées 100% fonctionnelles.*

---
*Document mis à jour et certifié conforme pour le projet **FacturaPro**.*
