export type InvoiceStatus = 'draft' | 'sent' | 'pending' | 'paid' | 'overdue' | 'cancelled';
export type PaymentProvider = 'manual' | 'wave' | 'orange_money' | 'stripe' | 'bank_transfer' | 'cash';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type UserRole = 'owner' | 'admin' | 'member';
export type SubscriptionPlan = 'starter' | 'pro' | 'business';

export interface Organization {
  id: string;
  name: string;
  address: string;
  city?: string;
  country: string;
  currency: string;
  tax_rate: number;
  invoice_prefix: string;
  current_invoice_seq: number;
  logo_url?: string;
  ninea_number?: string;
  rccm_number?: string;
  legal_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  payment_instructions?: string;
  subscription_plan?: SubscriptionPlan;
  created_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Client {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  country: string;
  tax_identifier?: string; // NINEA / TVA Client
  notes?: string;
  created_at: string;
}

export interface ProductService {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  default_price: number;
  unit: string;
  category: string;
  tax_rate: number;
  is_active: boolean;
  type?: 'service' | 'product';
  currency?: string;
  created_at: string;
}

export interface InvoiceLine {
  id: string;
  invoice_id?: string;
  product_service_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  line_total: number;
}

export interface Invoice {
  id: string;
  organization_id: string;
  client_id: string;
  client?: Client;
  invoice_number: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_amount: number;
  discount_amount?: number;
  total: number;
  amount_paid: number;
  currency: string;
  notes?: string;
  terms_conditions?: string;
  lines: InvoiceLine[];
  created_at: string;
  sent_at?: string;
  paid_at?: string;
}

export interface Quote {
  id: string;
  organization_id: string;
  client_id: string;
  client?: Client;
  quote_number: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'converted';
  issue_date: string;
  expiry_date: string;
  subtotal: number;
  tax_amount: number;
  total: number;
  currency: string;
  notes?: string;
  lines: InvoiceLine[];
  created_at: string;
}

export interface Payment {
  id: string;
  organization_id: string;
  invoice_id?: string;
  invoice_number?: string;
  client_name?: string;
  amount: number;
  currency?: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  reference?: string;
  transaction_id?: string;
  paid_at: string;
  created_at: string;
}

export interface Expense {
  id: string;
  organization_id: string;
  category: string;
  amount: number;
  description: string;
  vendor?: string;
  currency?: string;
  receipt_url?: string;
  expense_date: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  organization_id: string;
  plan: SubscriptionPlan;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface RevenueDataPoint {
  date: string;
  label: string;
  revenue: number;
  formattedRevenue: string;
}

export interface DashboardStats {
  revenue: {
    total: number;
    growth: number;
    currency: string;
  };
  paidInvoices: {
    total: number;
    count: number;
    growth: number;
  };
  pendingInvoices: {
    total: number;
    count: number;
    growth: number;
  };
  overdueInvoices: {
    total: number;
    count: number;
    growth: number;
  };
  statusDistribution: {
    total: number;
    paid: { count: number; percentage: number; amount: number };
    pending: { count: number; percentage: number; amount: number };
    overdue: { count: number; percentage: number; amount: number };
  };
}
