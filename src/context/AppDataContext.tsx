'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  Client,
  Expense,
  Invoice,
  Organization,
  Payment,
  ProductService,
  Quote,
  Subscription,
  SubscriptionPlan,
} from '@/types';
import {
  initialClients,
  initialExpenses,
  initialInvoices,
  initialOrganization,
  initialPayments,
  initialProducts,
  initialQuotes,
  initialSubscription,
} from '@/lib/initialData';
import {
  getSupabaseConfig,
  isSupabaseConfigured,
  saveSupabaseConfig,
  testSupabaseConnection,
  SupabaseConfig,
} from '@/lib/supabaseClient';
import { SupabaseService } from '@/lib/supabaseService';
import { useAuth } from './AuthContext';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

export type SupabaseStatus = 'connected' | 'syncing' | 'offline' | 'unconfigured' | 'error';

interface AppDataContextType {
  organization: Organization;
  updateOrganization: (updates: Partial<Organization>) => void;
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'created_at' | 'organization_id'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  products: ProductService[];
  addProduct: (product: Omit<ProductService, 'id' | 'created_at' | 'organization_id'>) => ProductService;
  updateProduct: (id: string, updates: Partial<ProductService>) => void;
  deleteProduct: (id: string) => void;
  invoices: Invoice[];
  createInvoice: (invoice: Omit<Invoice, 'id' | 'invoice_number' | 'created_at' | 'organization_id'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  markInvoiceAsPaid: (invoiceId: string, paymentData?: Partial<Payment>) => void;
  sendInvoice: (invoiceId: string, recipientEmail?: string) => void;
  quotes: Quote[];
  createQuote: (quote: Omit<Quote, 'id' | 'quote_number' | 'created_at' | 'organization_id'>) => Quote;
  convertQuoteToInvoice: (quoteId: string) => Invoice | null;
  deleteQuote: (id: string) => void;
  payments: Payment[];
  recordPayment: (payment: Omit<Payment, 'id' | 'created_at'>) => void;
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'organization_id' | 'created_at'>) => void;
  deleteExpense: (id: string) => void;
  subscription: Subscription;
  updateSubscription: (plan: SubscriptionPlan) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  resetAllData: () => void;
  loadDemoData: () => void;
  resetToCleanSlate: () => void;

  // Supabase Integration & Sync
  supabaseStatus: SupabaseStatus;
  supabaseConfig: SupabaseConfig;
  lastSyncedAt: string | null;
  isSyncing: boolean;
  updateSupabaseConfig: (config: Partial<SupabaseConfig>) => void;
  syncWithSupabase: (direction?: 'push' | 'pull') => Promise<{ success: boolean; message: string }>;
  testSupabase: (url?: string, anonKey?: string) => Promise<{ success: boolean; message: string; latencyMs?: number }>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  // Clean slate default organization
  const defaultOrg: Organization = {
    id: user ? `org-${user.id}` : 'org-default',
    name: user?.company_name || 'Mon Entreprise',
    legal_name: user?.company_name ? `${user.company_name} SARL` : 'Mon Entreprise SARL',
    address: 'Dakar, Sénégal',
    city: 'Dakar',
    country: 'Sénégal',
    currency: 'FCFA',
    tax_rate: 18,
    invoice_prefix: 'FAC-2025-',
    current_invoice_seq: 0,
    ninea_number: '',
    rccm_number: '',
    email: user?.email || '',
    phone: user?.phone || '',
    subscription_plan: 'starter',
    created_at: new Date().toISOString(),
  };

  const [organization, setOrganization] = useState<Organization>(defaultOrg);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<ProductService[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [subscription, setSubscription] = useState<Subscription>(initialSubscription);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Supabase State
  const [supabaseConfig, setSupabaseConfigState] = useState<SupabaseConfig>(getSupabaseConfig());
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus>(
    isSupabaseConfigured() ? 'connected' : 'unconfigured'
  );
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Dynamic user-scoped storage key
  const storageKey = user ? `facturapro_user_${user.id}_data` : 'facturapro_saas_guest_data';

  // Toast Helpers
  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Load user data on user switch or initial load
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(storageKey);
        if (stored && typeof stored === 'string') {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && typeof parsed === 'object') {
              if (parsed.organization) setOrganization(parsed.organization);
              if (parsed.clients && Array.isArray(parsed.clients)) setClients(parsed.clients);
              if (parsed.products && Array.isArray(parsed.products)) setProducts(parsed.products);
              if (parsed.invoices && Array.isArray(parsed.invoices)) setInvoices(parsed.invoices);
              if (parsed.quotes && Array.isArray(parsed.quotes)) setQuotes(parsed.quotes);
              if (parsed.payments && Array.isArray(parsed.payments)) setPayments(parsed.payments);
              if (parsed.expenses && Array.isArray(parsed.expenses)) setExpenses(parsed.expenses);
              if (parsed.subscription) setSubscription(parsed.subscription);
              if (parsed.lastSyncedAt) setLastSyncedAt(parsed.lastSyncedAt);
            }
          } catch (parseErr) {
            console.warn('Corrupted state, resetting:', parseErr);
            localStorage.removeItem(storageKey);
          }
        } else if (user) {
          // If fresh user with no stored data, initialize with clean company info
          setOrganization((prev) => ({
            ...prev,
            id: `org-${user.id}`,
            name: user.company_name || 'Mon Entreprise',
            legal_name: user.company_name ? `${user.company_name} SARL` : 'Mon Entreprise SARL',
            email: user.email,
            phone: user.phone || '',
          }));
          setClients([]);
          setProducts([]);
          setInvoices([]);
          setQuotes([]);
          setPayments([]);
          setExpenses([]);
        }
      }
    } catch (e) {
      console.warn('Could not read user state:', e);
    } finally {
      setIsLoaded(true);
    }
  }, [user, storageKey]);

  // Save to localStorage on state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            organization,
            clients,
            products,
            invoices,
            quotes,
            payments,
            expenses,
            subscription,
            lastSyncedAt,
          })
        );
      }
    } catch (e) {
      console.warn('Could not save user state to localStorage:', e);
    }
  }, [
    isLoaded,
    storageKey,
    organization,
    clients,
    products,
    invoices,
    quotes,
    payments,
    expenses,
    subscription,
    lastSyncedAt,
  ]);

  // Initial background Supabase check
  useEffect(() => {
    if (!isLoaded) return;
    const cfg = getSupabaseConfig();
    setSupabaseConfigState(cfg);

    if (cfg.url && cfg.anonKey) {
      testSupabaseConnection(cfg.url, cfg.anonKey).then((res) => {
        if (res.success) {
          setSupabaseStatus('connected');
        } else {
          setSupabaseStatus('error');
        }
      });
    } else {
      setSupabaseStatus('unconfigured');
    }
  }, [isLoaded]);

  // Supabase Config update
  const updateSupabaseConfig = (configUpdates: Partial<SupabaseConfig>) => {
    saveSupabaseConfig(configUpdates);
    const updated = getSupabaseConfig();
    setSupabaseConfigState(updated);
    if (updated.url && updated.anonKey) {
      setSupabaseStatus('connected');
      addToast({
        type: 'success',
        title: 'Configuration Supabase enregistrée',
        message: 'Les paramètres de connexion à votre base PostgreSQL sont actifs.',
      });
    } else {
      setSupabaseStatus('unconfigured');
    }
  };

  // Test Supabase Live
  const testSupabase = async (url?: string, anonKey?: string) => {
    const res = await testSupabaseConnection(url, anonKey);
    if (res.success) {
      setSupabaseStatus('connected');
    } else if (url && anonKey) {
      setSupabaseStatus('error');
    }
    return res;
  };

  // Sync with Supabase
  const syncWithSupabase = async (direction: 'push' | 'pull' = 'push') => {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: "Supabase n'est pas encore configuré (URL ou Anon Key manquante).",
      };
    }

    setIsSyncing(true);
    setSupabaseStatus('syncing');

    try {
      if (direction === 'push') {
        const result = await SupabaseService.syncAllToSupabase({
          organization,
          clients,
          products,
          invoices,
          quotes,
          payments,
          expenses,
          subscription,
        });

        const syncTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        setLastSyncedAt(syncTime);
        setSupabaseStatus('connected');
        setIsSyncing(false);

        if (result.success) {
          addToast({
            type: 'success',
            title: 'Synchronisation Supabase réussie',
            message: `${result.syncedCount} enregistrements synchronisés avec la base Cloud PostgreSQL.`,
          });
          return {
            success: true,
            message: `Synchronisation réussie (${result.syncedCount} éléments envoyés).`,
          };
        } else {
          addToast({
            type: 'warning',
            title: 'Synchronisation partielle',
            message: `${result.syncedCount} synchronisés. ${result.errors.length} erreurs.`,
          });
          return {
            success: false,
            message: `Erreurs lors de la synchronisation : ${result.errors.join(', ')}`,
          };
        }
      } else {
        // Pull from Supabase
        const remoteData = await SupabaseService.pullAllFromSupabase(organization.id);
        setIsSyncing(false);
        setSupabaseStatus('connected');

        if (!remoteData) {
          return { success: false, message: 'Aucune donnée trouvée sur Supabase ou erreur de lecture.' };
        }

        if (remoteData.organization) setOrganization(remoteData.organization);
        if (remoteData.clients.length > 0) setClients(remoteData.clients);
        if (remoteData.products.length > 0) setProducts(remoteData.products);
        if (remoteData.invoices.length > 0) setInvoices(remoteData.invoices);
        if (remoteData.quotes.length > 0) setQuotes(remoteData.quotes);
        if (remoteData.payments.length > 0) setPayments(remoteData.payments);
        if (remoteData.expenses.length > 0) setExpenses(remoteData.expenses);

        const syncTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        setLastSyncedAt(syncTime);

        addToast({
          type: 'success',
          title: 'Données importées depuis Supabase',
          message: 'Votre état local a été synchronisé avec la base Cloud.',
        });

        return { success: true, message: 'Données récupérées avec succès.' };
      }
    } catch (e: any) {
      setIsSyncing(false);
      setSupabaseStatus('error');
      return { success: false, message: e.message || 'Erreur inconnue de synchronisation' };
    }
  };

  // Organization
  const updateOrganization = (updates: Partial<Organization>) => {
    const updated = { ...organization, ...updates };
    setOrganization(updated);

    // Sync to Supabase in background
    if (isSupabaseConfigured()) {
      SupabaseService.upsertOrganization(updated).catch(console.error);
    }

    addToast({
      type: 'success',
      title: 'Paramètres mis à jour',
      message: 'Les informations de votre organisation ont été enregistrées.',
    });
  };

  // Clients
  const addClient = (clientData: Omit<Client, 'id' | 'created_at' | 'organization_id'>): Client => {
    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now()}`,
      organization_id: organization.id,
      created_at: new Date().toISOString(),
    };
    setClients((prev) => [newClient, ...prev]);

    // Sync to Supabase
    if (isSupabaseConfigured()) {
      SupabaseService.upsertClient(newClient).catch(console.error);
    }

    addToast({
      type: 'success',
      title: 'Client ajouté',
      message: `${newClient.name} a été ajouté avec succès.`,
    });
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...updates };
          if (isSupabaseConfigured()) {
            SupabaseService.upsertClient(updated).catch(console.error);
          }
          return updated;
        }
        return c;
      })
    );
    addToast({
      type: 'success',
      title: 'Client mis à jour',
      message: 'Les coordonnées du client ont été mises à jour.',
    });
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
    if (isSupabaseConfigured()) {
      SupabaseService.deleteClient(id).catch(console.error);
    }
    addToast({
      type: 'info',
      title: 'Client supprimé',
      message: 'Le client a été retiré.',
    });
  };

  // Products
  const addProduct = (prodData: Omit<ProductService, 'id' | 'created_at' | 'organization_id'>): ProductService => {
    const newProd: ProductService = {
      ...prodData,
      id: `prod-${Date.now()}`,
      organization_id: organization.id,
      created_at: new Date().toISOString(),
    };
    setProducts((prev) => [newProd, ...prev]);

    if (isSupabaseConfigured()) {
      SupabaseService.upsertProduct(newProd).catch(console.error);
    }

    addToast({
      type: 'success',
      title: 'Produit/Service créé',
      message: `${newProd.name} est disponible dans votre catalogue.`,
    });
    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<ProductService>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          if (isSupabaseConfigured()) {
            SupabaseService.upsertProduct(updated).catch(console.error);
          }
          return updated;
        }
        return p;
      })
    );
    addToast({
      type: 'success',
      title: 'Article mis à jour',
      message: 'Les détails du produit ou service ont été actualisés.',
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (isSupabaseConfigured()) {
      SupabaseService.deleteProduct(id).catch(console.error);
    }
    addToast({
      type: 'info',
      title: 'Article supprimé',
      message: "L'article a été supprimé du catalogue.",
    });
  };

  // Invoices
  const createInvoice = (
    invoiceData: Omit<Invoice, 'id' | 'invoice_number' | 'created_at' | 'organization_id'>
  ): Invoice => {
    const newSeq = (organization.current_invoice_seq || 48) + 1;
    const formattedNum = `${organization.invoice_prefix || 'FAC-2025-'}${String(newSeq).padStart(4, '0')}`;

    // Update organization sequence
    setOrganization((prev) => ({ ...prev, current_invoice_seq: newSeq }));

    const client = clients.find((c) => c.id === invoiceData.client_id);

    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv-${newSeq}`,
      organization_id: organization.id,
      invoice_number: formattedNum,
      client,
      created_at: new Date().toISOString(),
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    if (isSupabaseConfigured()) {
      SupabaseService.upsertInvoice(newInvoice).catch(console.error);
      SupabaseService.upsertOrganization({ ...organization, current_invoice_seq: newSeq }).catch(console.error);
    }

    addToast({
      type: 'success',
      title: 'Facture créée',
      message: `La facture ${formattedNum} d'un montant de ${newInvoice.total.toLocaleString()} ${newInvoice.currency} a été générée.`,
    });
    return newInvoice;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          const updatedClient = updates.client_id
            ? clients.find((c) => c.id === updates.client_id)
            : inv.client;
          const updated = { ...inv, ...updates, client: updatedClient || inv.client };
          if (isSupabaseConfigured()) {
            SupabaseService.upsertInvoice(updated).catch(console.error);
          }
          return updated;
        }
        return inv;
      })
    );
    addToast({
      type: 'success',
      title: 'Facture mise à jour',
      message: 'Les modifications ont été enregistrées.',
    });
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    if (isSupabaseConfigured()) {
      SupabaseService.deleteInvoice(id).catch(console.error);
    }
    addToast({
      type: 'info',
      title: 'Facture supprimée',
      message: 'La facture a été supprimée.',
    });
  };

  const markInvoiceAsPaid = (invoiceId: string, paymentData?: Partial<Payment>) => {
    const targetInvoice = invoices.find((i) => i.id === invoiceId);
    if (!targetInvoice) return;

    const paidAt = new Date().toISOString();
    const amountToPay = targetInvoice.total - (targetInvoice.amount_paid || 0);

    // Update Invoice
    const updatedInvoice: Invoice = {
      ...targetInvoice,
      status: 'paid',
      amount_paid: targetInvoice.total,
      paid_at: paidAt,
    };

    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? updatedInvoice : inv))
    );

    // Create Payment Record
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      organization_id: organization.id,
      invoice_id: targetInvoice.id,
      invoice_number: targetInvoice.invoice_number,
      client_name: targetInvoice.client?.name || 'Client',
      amount: paymentData?.amount || amountToPay,
      provider: paymentData?.provider || 'wave',
      status: 'completed',
      reference: paymentData?.reference || `PAY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      transaction_id: paymentData?.transaction_id || `WAVE_TX_${Math.floor(10000000 + Math.random() * 90000000)}`,
      paid_at: paidAt,
      created_at: paidAt,
    };

    setPayments((prev) => [newPayment, ...prev]);

    if (isSupabaseConfigured()) {
      SupabaseService.upsertInvoice(updatedInvoice).catch(console.error);
      SupabaseService.upsertPayment(newPayment).catch(console.error);
    }

    addToast({
      type: 'success',
      title: 'Paiement enregistré',
      message: `La facture ${targetInvoice.invoice_number} est désormais marquée comme Payée.`,
    });
  };

  const sendInvoice = (invoiceId: string, recipientEmail?: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          const updated: Invoice = {
            ...inv,
            status: inv.status === 'draft' ? 'sent' : inv.status,
            sent_at: new Date().toISOString(),
          };
          if (isSupabaseConfigured()) {
            SupabaseService.upsertInvoice(updated).catch(console.error);
          }
          return updated;
        }
        return inv;
      })
    );
    addToast({
      type: 'success',
      title: 'Facture envoyée',
      message: recipientEmail
        ? `Facture transmise avec succès à ${recipientEmail}`
        : 'La facture a été marquée comme envoyée au client.',
    });
  };

  // Quotes
  const createQuote = (
    quoteData: Omit<Quote, 'id' | 'quote_number' | 'created_at' | 'organization_id'>
  ): Quote => {
    const seq = quotes.length + 12;
    const formattedNum = `DEV-2025-${String(seq).padStart(4, '0')}`;
    const client = clients.find((c) => c.id === quoteData.client_id);

    const newQuote: Quote = {
      ...quoteData,
      id: `quo-${Date.now()}`,
      organization_id: organization.id,
      quote_number: formattedNum,
      client,
      created_at: new Date().toISOString(),
    };

    setQuotes((prev) => [newQuote, ...prev]);

    if (isSupabaseConfigured()) {
      SupabaseService.upsertQuote(newQuote).catch(console.error);
    }

    addToast({
      type: 'success',
      title: 'Devis créé',
      message: `Le devis ${formattedNum} a été créé avec succès.`,
    });
    return newQuote;
  };

  const convertQuoteToInvoice = (quoteId: string): Invoice | null => {
    const quote = quotes.find((q) => q.id === quoteId);
    if (!quote) return null;

    const newInvoice = createInvoice({
      client_id: quote.client_id,
      client: quote.client,
      status: 'pending',
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      subtotal: quote.subtotal,
      tax_amount: quote.tax_amount,
      total: quote.total,
      amount_paid: 0,
      currency: quote.currency,
      notes: `Converti depuis le devis ${quote.quote_number}. ${quote.notes || ''}`,
      lines: quote.lines,
    });

    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === quoteId) {
          const updated: Quote = { ...q, status: 'converted' };
          if (isSupabaseConfigured()) {
            SupabaseService.upsertQuote(updated).catch(console.error);
          }
          return updated;
        }
        return q;
      })
    );

    addToast({
      type: 'success',
      title: 'Devis converti en Facture !',
      message: `La facture ${newInvoice.invoice_number} a été générée depuis le devis ${quote.quote_number}.`,
    });

    return newInvoice;
  };

  const deleteQuote = (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
    if (isSupabaseConfigured()) {
      SupabaseService.deleteQuote(id).catch(console.error);
    }
    addToast({
      type: 'info',
      title: 'Devis supprimé',
      message: 'Le devis a été retiré.',
    });
  };

  // Payments
  const recordPayment = (
    paymentData: Omit<Payment, 'id' | 'created_at' | 'organization_id'>
  ): Payment => {
    const newPayment: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      organization_id: organization.id,
      created_at: new Date().toISOString(),
    };

    setPayments((prev) => [newPayment, ...prev]);

    if (paymentData.invoice_id) {
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id === paymentData.invoice_id) {
            const newPaidAmount = (inv.amount_paid || 0) + paymentData.amount;
            const isFull = newPaidAmount >= inv.total;
            const updated: Invoice = {
              ...inv,
              amount_paid: newPaidAmount,
              status: isFull ? 'paid' : inv.status,
              paid_at: isFull ? new Date().toISOString() : inv.paid_at,
            };
            if (isSupabaseConfigured()) {
              SupabaseService.upsertInvoice(updated).catch(console.error);
            }
            return updated;
          }
          return inv;
        })
      );
    }

    if (isSupabaseConfigured()) {
      SupabaseService.upsertPayment(newPayment).catch(console.error);
    }

    addToast({
      type: 'success',
      title: 'Paiement enregistré',
      message: `Règlement de ${paymentData.amount.toLocaleString()} FCFA reçu via ${paymentData.provider.toUpperCase()}.`,
    });

    return newPayment;
  };

  // Expenses
  const addExpense = (
    expData: Omit<Expense, 'id' | 'created_at' | 'organization_id'>
  ): Expense => {
    const newExpense: Expense = {
      ...expData,
      id: `exp-${Date.now()}`,
      organization_id: organization.id,
      created_at: new Date().toISOString(),
    };
    setExpenses((prev) => [newExpense, ...prev]);

    if (isSupabaseConfigured()) {
      SupabaseService.upsertExpense(newExpense).catch(console.error);
    }

    addToast({
      type: 'success',
      title: 'Dépense enregistrée',
      message: `Dépense de ${expData.amount.toLocaleString()} FCFA ajoutée (${expData.category}).`,
    });
    return newExpense;
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    if (isSupabaseConfigured()) {
      SupabaseService.deleteExpense(id).catch(console.error);
    }
    addToast({
      type: 'info',
      title: 'Dépense supprimée',
      message: 'La dépense a été retirée de la comptabilité.',
    });
  };

  // Subscription
  const updateSubscription = (plan: 'starter' | 'pro' | 'business') => {
    setSubscription((prev) => ({ ...prev, plan, status: 'active' }));
    addToast({
      type: 'success',
      title: 'Abonnement mis à jour',
      message: `Votre organisation bénéficie maintenant du forfait FacturaPro ${plan.toUpperCase()} !`,
    });
  };

  // Load rich demo dataset for preview
  const loadDemoData = () => {
    setClients(initialClients);
    setProducts(initialProducts);
    setInvoices(initialInvoices);
    setQuotes(initialQuotes);
    setPayments(initialPayments);
    setExpenses(initialExpenses);
    setSubscription(initialSubscription);
    setLastSyncedAt(null);
    addToast({
      type: 'success',
      title: 'Données de démonstration chargées',
      message: 'Un jeu complet de factures, clients et paiements a été injecté pour tester.',
    });
  };

  // Reset current user space to clean 0 slate
  const resetToCleanSlate = () => {
    setClients([]);
    setProducts([]);
    setInvoices([]);
    setQuotes([]);
    setPayments([]);
    setExpenses([]);
    setLastSyncedAt(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
    addToast({
      type: 'info',
      title: 'Espace remis à zéro',
      message: 'Toutes les données ont été effacées (0 FCFA, 0 facture).',
    });
  };

  // Reset demo data
  const resetAllData = () => {
    resetToCleanSlate();
  };

  return (
    <AppDataContext.Provider
      value={{
        organization,
        updateOrganization,
        clients,
        addClient,
        updateClient,
        deleteClient,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        invoices,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        markInvoiceAsPaid,
        sendInvoice,
        quotes,
        createQuote,
        convertQuoteToInvoice,
        deleteQuote,
        payments,
        recordPayment,
        expenses,
        addExpense,
        deleteExpense,
        subscription,
        updateSubscription,
        toasts,
        addToast,
        removeToast,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        resetAllData,
        loadDemoData,
        resetToCleanSlate,

        // Supabase
        supabaseStatus,
        supabaseConfig,
        lastSyncedAt,
        isSyncing,
        updateSupabaseConfig,
        syncWithSupabase,
        testSupabase,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
