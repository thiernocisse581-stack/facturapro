import { getSupabaseClient } from './supabaseClient';
import {
  Client,
  Expense,
  Invoice,
  InvoiceLine,
  Organization,
  Payment,
  ProductService,
  Quote,
  Subscription,
} from '@/types';

export class SupabaseService {
  /**
   * Test if Supabase is connected
   */
  static isAvailable(): boolean {
    return getSupabaseClient() !== null;
  }

  // ==========================================
  // ORGANIZATION
  // ==========================================
  static async fetchOrganization(orgId: string): Promise<Organization | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .maybeSingle();

    if (error || !data) return null;
    const row = data as any;

    return {
      id: row.id,
      name: row.name,
      address: row.address || '',
      city: row.city || undefined,
      country: row.country || 'Sénégal',
      currency: row.currency || 'XOF',
      tax_rate: Number(row.tax_rate) || 18,
      invoice_prefix: row.invoice_prefix || 'FAC-2025-',
      current_invoice_seq: row.current_invoice_seq || 48,
      logo_url: row.logo_url || undefined,
      ninea_number: row.ninea_number || undefined,
      rccm_number: row.rccm_number || undefined,
      legal_name: row.legal_name || undefined,
      email: row.email || undefined,
      phone: row.phone || undefined,
      website: row.website || undefined,
      payment_instructions: row.payment_instructions || undefined,
      subscription_plan: (row.subscription_plan as any) || 'pro',
      created_at: row.created_at,
    };
  }

  static async upsertOrganization(org: Organization): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    const { error } = await supabase.from('organizations').upsert(
      {
        id: org.id,
        name: org.name,
        address: org.address,
        city: org.city || null,
        country: org.country,
        currency: org.currency,
        tax_rate: org.tax_rate,
        invoice_prefix: org.invoice_prefix,
        current_invoice_seq: org.current_invoice_seq,
        logo_url: org.logo_url || null,
        ninea_number: org.ninea_number || null,
        rccm_number: org.rccm_number || null,
        legal_name: org.legal_name || null,
        email: org.email || null,
        phone: org.phone || null,
        website: org.website || null,
        payment_instructions: org.payment_instructions || null,
        subscription_plan: org.subscription_plan || 'pro',
        created_at: org.created_at,
        updated_at: new Date().toISOString(),
      } as any,
      { onConflict: 'id' }
    );

    if (error) {
      console.error('Supabase: error upserting organization', error);
      return false;
    }
    return true;
  }

  // ==========================================
  // CLIENTS
  // ==========================================
  static async fetchClients(orgId: string): Promise<Client[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return (data as any[]).map((c) => ({
      id: c.id,
      organization_id: c.organization_id,
      name: c.name,
      email: c.email || '',
      phone: c.phone || '',
      address: c.address || '',
      city: c.city || undefined,
      country: c.country || 'Sénégal',
      tax_identifier: c.tax_identifier || undefined,
      notes: c.notes || undefined,
      created_at: c.created_at,
    }));
  }

  static async upsertClient(client: Client): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    const { error } = await supabase.from('clients').upsert(
      {
        id: client.id,
        organization_id: client.organization_id,
        name: client.name,
        email: client.email || null,
        phone: client.phone || null,
        address: client.address || null,
        city: client.city || null,
        country: client.country || 'Sénégal',
        tax_identifier: client.tax_identifier || null,
        notes: client.notes || null,
        created_at: client.created_at,
        updated_at: new Date().toISOString(),
      } as any,
      { onConflict: 'id' }
    );

    if (error) {
      console.error('Supabase: error upserting client', error);
      return false;
    }
    return true;
  }

  static async deleteClient(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    const { error } = await supabase.from('clients').delete().eq('id', id);
    return !error;
  }

  // ==========================================
  // PRODUCTS & SERVICES
  // ==========================================
  static async fetchProducts(orgId: string): Promise<ProductService[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('products_services')
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return (data as any[]).map((p) => ({
      id: p.id,
      organization_id: p.organization_id,
      name: p.name,
      description: p.description || '',
      default_price: Number(p.default_price),
      unit: p.unit || 'unité',
      category: p.category || 'Général',
      tax_rate: Number(p.tax_rate) || 18,
      is_active: p.is_active !== false,
      type: p.type || 'service',
      currency: p.currency || 'XOF',
      created_at: p.created_at,
    }));
  }

  static async upsertProduct(product: ProductService): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    const { error } = await supabase.from('products_services').upsert(
      {
        id: product.id,
        organization_id: product.organization_id,
        name: product.name,
        description: product.description || null,
        default_price: product.default_price,
        unit: product.unit || 'unité',
        category: product.category || 'Général',
        tax_rate: product.tax_rate,
        is_active: product.is_active,
        type: product.type || 'service',
        currency: product.currency || 'XOF',
        created_at: product.created_at,
        updated_at: new Date().toISOString(),
      } as any,
      { onConflict: 'id' }
    );

    if (error) {
      console.error('Supabase: error upserting product', error);
      return false;
    }
    return true;
  }

  static async deleteProduct(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    const { error } = await supabase.from('products_services').delete().eq('id', id);
    return !error;
  }

  // ==========================================
  // INVOICES & LINES
  // ==========================================
  static async fetchInvoices(orgId: string, clients: Client[] = []): Promise<Invoice[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data: invoicesData, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });

    if (error || !invoicesData) return [];

    const rawInvoices = invoicesData as any[];
    const invoiceIds = rawInvoices.map((i) => i.id);
    const linesMap: Record<string, InvoiceLine[]> = {};

    if (invoiceIds.length > 0) {
      const { data: linesData } = await supabase
        .from('invoice_lines')
        .select('*')
        .in('invoice_id', invoiceIds);

      if (linesData) {
        (linesData as any[]).forEach((l) => {
          if (!linesMap[l.invoice_id]) linesMap[l.invoice_id] = [];
          linesMap[l.invoice_id].push({
            id: l.id,
            invoice_id: l.invoice_id,
            product_service_id: l.product_service_id || undefined,
            description: l.description,
            quantity: Number(l.quantity),
            unit_price: Number(l.unit_price),
            tax_rate: Number(l.tax_rate) || 18,
            line_total: Number(l.line_total),
          });
        });
      }
    }

    return rawInvoices.map((inv) => {
      const client = clients.find((c) => c.id === inv.client_id);
      return {
        id: inv.id,
        organization_id: inv.organization_id,
        client_id: inv.client_id,
        client,
        invoice_number: inv.invoice_number,
        status: inv.status as any,
        issue_date: inv.issue_date,
        due_date: inv.due_date,
        subtotal: Number(inv.subtotal),
        tax_amount: Number(inv.tax_amount),
        discount_amount: inv.discount_amount ? Number(inv.discount_amount) : undefined,
        total: Number(inv.total),
        amount_paid: Number(inv.amount_paid) || 0,
        currency: inv.currency || 'XOF',
        notes: inv.notes || undefined,
        terms_conditions: inv.terms_conditions || undefined,
        lines: linesMap[inv.id] || [],
        created_at: inv.created_at,
        sent_at: inv.sent_at || undefined,
        paid_at: inv.paid_at || undefined,
      };
    });
  }

  static async upsertInvoice(invoice: Invoice): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    // 1. Upsert Invoice header
    const { error: invError } = await supabase.from('invoices').upsert(
      {
        id: invoice.id,
        organization_id: invoice.organization_id,
        client_id: invoice.client_id,
        invoice_number: invoice.invoice_number,
        status: invoice.status,
        issue_date: invoice.issue_date,
        due_date: invoice.due_date,
        subtotal: invoice.subtotal,
        tax_amount: invoice.tax_amount,
        discount_amount: invoice.discount_amount || 0,
        total: invoice.total,
        amount_paid: invoice.amount_paid || 0,
        currency: invoice.currency,
        notes: invoice.notes || null,
        terms_conditions: invoice.terms_conditions || null,
        created_at: invoice.created_at,
        sent_at: invoice.sent_at || null,
        paid_at: invoice.paid_at || null,
        updated_at: new Date().toISOString(),
      } as any,
      { onConflict: 'id' }
    );

    if (invError) {
      console.error('Supabase: error upserting invoice', invError);
      return false;
    }

    // 2. Upsert Lines
    if (invoice.lines && invoice.lines.length > 0) {
      await supabase.from('invoice_lines').delete().eq('invoice_id', invoice.id);

      const linesToInsert = invoice.lines.map((l) => ({
        id: l.id.startsWith('line-') ? undefined : l.id,
        invoice_id: invoice.id,
        product_service_id: l.product_service_id || null,
        description: l.description,
        quantity: l.quantity,
        unit_price: l.unit_price,
        tax_rate: l.tax_rate,
        line_total: l.line_total,
        created_at: new Date().toISOString(),
      }));

      await supabase.from('invoice_lines').insert(linesToInsert as any);
    }

    return true;
  }

  static async deleteInvoice(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    await supabase.from('invoice_lines').delete().eq('invoice_id', id);
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    return !error;
  }

  // ==========================================
  // QUOTES & LINES
  // ==========================================
  static async fetchQuotes(orgId: string, clients: Client[] = []): Promise<Quote[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data: quotesData, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });

    if (error || !quotesData) return [];

    const rawQuotes = quotesData as any[];
    const quoteIds = rawQuotes.map((q) => q.id);
    const linesMap: Record<string, InvoiceLine[]> = {};

    if (quoteIds.length > 0) {
      const { data: linesData } = await supabase
        .from('quote_lines')
        .select('*')
        .in('quote_id', quoteIds);

      if (linesData) {
        (linesData as any[]).forEach((l) => {
          if (!linesMap[l.quote_id]) linesMap[l.quote_id] = [];
          linesMap[l.quote_id].push({
            id: l.id,
            product_service_id: l.product_service_id || undefined,
            description: l.description,
            quantity: Number(l.quantity),
            unit_price: Number(l.unit_price),
            tax_rate: Number(l.tax_rate) || 18,
            line_total: Number(l.line_total),
          });
        });
      }
    }

    return rawQuotes.map((q) => {
      const client = clients.find((c) => c.id === q.client_id);
      return {
        id: q.id,
        organization_id: q.organization_id,
        client_id: q.client_id,
        client,
        quote_number: q.quote_number,
        status: q.status as any,
        issue_date: q.issue_date,
        expiry_date: q.expiry_date,
        subtotal: Number(q.subtotal),
        tax_amount: Number(q.tax_amount),
        total: Number(q.total),
        currency: q.currency || 'XOF',
        notes: q.notes || undefined,
        lines: linesMap[q.id] || [],
        created_at: q.created_at,
      };
    });
  }

  static async upsertQuote(quote: Quote): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    const { error: quoteError } = await supabase.from('quotes').upsert(
      {
        id: quote.id,
        organization_id: quote.organization_id,
        client_id: quote.client_id,
        quote_number: quote.quote_number,
        status: quote.status,
        issue_date: quote.issue_date,
        expiry_date: quote.expiry_date,
        subtotal: quote.subtotal,
        tax_amount: quote.tax_amount,
        total: quote.total,
        currency: quote.currency,
        notes: quote.notes || null,
        created_at: quote.created_at,
        updated_at: new Date().toISOString(),
      } as any,
      { onConflict: 'id' }
    );

    if (quoteError) {
      console.error('Supabase: error upserting quote', quoteError);
      return false;
    }

    if (quote.lines && quote.lines.length > 0) {
      await supabase.from('quote_lines').delete().eq('quote_id', quote.id);

      const linesToInsert = quote.lines.map((l) => ({
        id: l.id.startsWith('line-') ? undefined : l.id,
        quote_id: quote.id,
        product_service_id: l.product_service_id || null,
        description: l.description,
        quantity: l.quantity,
        unit_price: l.unit_price,
        tax_rate: l.tax_rate,
        line_total: l.line_total,
        created_at: new Date().toISOString(),
      }));

      await supabase.from('quote_lines').insert(linesToInsert as any);
    }

    return true;
  }

  static async deleteQuote(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    await supabase.from('quote_lines').delete().eq('quote_id', id);
    const { error } = await supabase.from('quotes').delete().eq('id', id);
    return !error;
  }

  // ==========================================
  // PAYMENTS
  // ==========================================
  static async fetchPayments(orgId: string): Promise<Payment[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('organization_id', orgId)
      .order('paid_at', { ascending: false });

    if (error || !data) return [];

    return (data as any[]).map((p) => ({
      id: p.id,
      organization_id: p.organization_id,
      invoice_id: p.invoice_id || undefined,
      invoice_number: p.invoice_number || undefined,
      client_name: p.client_name || undefined,
      amount: Number(p.amount),
      currency: p.currency || 'XOF',
      provider: p.provider as any,
      status: p.status as any,
      reference: p.reference || undefined,
      transaction_id: p.transaction_id || undefined,
      paid_at: p.paid_at,
      created_at: p.created_at,
    }));
  }

  static async upsertPayment(payment: Payment): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    const { error } = await supabase.from('payments').upsert(
      {
        id: payment.id,
        organization_id: payment.organization_id,
        invoice_id: payment.invoice_id || null,
        invoice_number: payment.invoice_number || null,
        client_name: payment.client_name || null,
        amount: payment.amount,
        currency: payment.currency || 'XOF',
        provider: payment.provider,
        status: payment.status,
        reference: payment.reference || null,
        transaction_id: payment.transaction_id || null,
        paid_at: payment.paid_at,
        created_at: payment.created_at,
      } as any,
      { onConflict: 'id' }
    );

    if (error) {
      console.error('Supabase: error upserting payment', error);
      return false;
    }
    return true;
  }

  // ==========================================
  // EXPENSES
  // ==========================================
  static async fetchExpenses(orgId: string): Promise<Expense[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('organization_id', orgId)
      .order('expense_date', { ascending: false });

    if (error || !data) return [];

    return (data as any[]).map((e) => ({
      id: e.id,
      organization_id: e.organization_id,
      category: e.category,
      amount: Number(e.amount),
      description: e.description,
      vendor: e.vendor || undefined,
      currency: e.currency || 'XOF',
      receipt_url: e.receipt_url || undefined,
      expense_date: e.expense_date,
      created_at: e.created_at,
    }));
  }

  static async upsertExpense(expense: Expense): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    const { error } = await supabase.from('expenses').upsert(
      {
        id: expense.id,
        organization_id: expense.organization_id,
        category: expense.category,
        amount: expense.amount,
        description: expense.description,
        vendor: expense.vendor || null,
        currency: expense.currency || 'XOF',
        receipt_url: expense.receipt_url || null,
        expense_date: expense.expense_date,
        created_at: expense.created_at,
        updated_at: new Date().toISOString(),
      } as any,
      { onConflict: 'id' }
    );

    if (error) {
      console.error('Supabase: error upserting expense', error);
      return false;
    }
    return true;
  }

  static async deleteExpense(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    const { error } = await supabase.from('expenses').delete().eq('id', id);
    return !error;
  }

  // ==========================================
  // FULL BI-DIRECTIONAL SYNC
  // ==========================================
  static async syncAllToSupabase(data: {
    organization: Organization;
    clients: Client[];
    products: ProductService[];
    invoices: Invoice[];
    quotes: Quote[];
    payments: Payment[];
    expenses: Expense[];
    subscription: Subscription;
  }): Promise<{ success: boolean; syncedCount: number; errors: string[] }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, syncedCount: 0, errors: ['Supabase non configuré'] };
    }

    let syncedCount = 0;
    const errors: string[] = [];

    // 1. Org
    const orgOk = await this.upsertOrganization(data.organization);
    if (orgOk) syncedCount++;
    else errors.push('Organisation');

    // 2. Clients
    for (const c of data.clients) {
      const ok = await this.upsertClient(c);
      if (ok) syncedCount++;
      else errors.push(`Client: ${c.name}`);
    }

    // 3. Products
    for (const p of data.products) {
      const ok = await this.upsertProduct(p);
      if (ok) syncedCount++;
      else errors.push(`Produit: ${p.name}`);
    }

    // 4. Invoices
    for (const inv of data.invoices) {
      const ok = await this.upsertInvoice(inv);
      if (ok) syncedCount++;
      else errors.push(`Facture: ${inv.invoice_number}`);
    }

    // 5. Quotes
    for (const q of data.quotes) {
      const ok = await this.upsertQuote(q);
      if (ok) syncedCount++;
      else errors.push(`Devis: ${q.quote_number}`);
    }

    // 6. Payments
    for (const pay of data.payments) {
      const ok = await this.upsertPayment(pay);
      if (ok) syncedCount++;
      else errors.push(`Paiement: ${pay.id}`);
    }

    // 7. Expenses
    for (const exp of data.expenses) {
      const ok = await this.upsertExpense(exp);
      if (ok) syncedCount++;
      else errors.push(`Dépense: ${exp.description}`);
    }

    return {
      success: errors.length === 0,
      syncedCount,
      errors,
    };
  }

  static async pullAllFromSupabase(orgId: string): Promise<{
    organization: Organization | null;
    clients: Client[];
    products: ProductService[];
    invoices: Invoice[];
    quotes: Quote[];
    payments: Payment[];
    expenses: Expense[];
  } | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const [org, clients, products, payments, expenses] = await Promise.all([
      this.fetchOrganization(orgId),
      this.fetchClients(orgId),
      this.fetchProducts(orgId),
      this.fetchPayments(orgId),
      this.fetchExpenses(orgId),
    ]);

    const invoices = await this.fetchInvoices(orgId, clients);
    const quotes = await this.fetchQuotes(orgId, clients);

    return {
      organization: org,
      clients,
      products,
      invoices,
      quotes,
      payments,
      expenses,
    };
  }
}
