export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          city: string | null;
          country: string | null;
          currency: string | null;
          tax_rate: number | null;
          invoice_prefix: string | null;
          current_invoice_seq: number | null;
          logo_url: string | null;
          ninea_number: string | null;
          rccm_number: string | null;
          legal_name: string | null;
          email: string | null;
          phone: string | null;
          website: string | null;
          payment_instructions: string | null;
          subscription_plan: 'starter' | 'pro' | 'business' | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          currency?: string | null;
          tax_rate?: number | null;
          invoice_prefix?: string | null;
          current_invoice_seq?: number | null;
          logo_url?: string | null;
          ninea_number?: string | null;
          rccm_number?: string | null;
          legal_name?: string | null;
          email?: string | null;
          phone?: string | null;
          website?: string | null;
          payment_instructions?: string | null;
          subscription_plan?: 'starter' | 'pro' | 'business' | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>;
      };
      organization_members: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member';
          name: string | null;
          email: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role?: 'owner' | 'admin' | 'member';
          name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['organization_members']['Insert']>;
      };
      clients: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          country: string | null;
          tax_identifier: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          tax_identifier?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['clients']['Insert']>;
      };
      products_services: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          description: string | null;
          default_price: number;
          unit: string | null;
          category: string | null;
          tax_rate: number | null;
          is_active: boolean | null;
          type: 'service' | 'product' | null;
          currency: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          description?: string | null;
          default_price?: number;
          unit?: string | null;
          category?: string | null;
          tax_rate?: number | null;
          is_active?: boolean | null;
          type?: 'service' | 'product' | null;
          currency?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['products_services']['Insert']>;
      };
      invoices: {
        Row: {
          id: string;
          organization_id: string;
          client_id: string;
          invoice_number: string;
          status: 'draft' | 'sent' | 'pending' | 'paid' | 'overdue' | 'cancelled';
          issue_date: string;
          due_date: string;
          subtotal: number;
          tax_amount: number;
          discount_amount: number | null;
          total: number;
          amount_paid: number | null;
          currency: string | null;
          notes: string | null;
          terms_conditions: string | null;
          created_at: string;
          sent_at: string | null;
          paid_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          client_id: string;
          invoice_number: string;
          status?: 'draft' | 'sent' | 'pending' | 'paid' | 'overdue' | 'cancelled';
          issue_date?: string;
          due_date: string;
          subtotal?: number;
          tax_amount?: number;
          discount_amount?: number | null;
          total?: number;
          amount_paid?: number | null;
          currency?: string | null;
          notes?: string | null;
          terms_conditions?: string | null;
          created_at?: string;
          sent_at?: string | null;
          paid_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>;
      };
      invoice_lines: {
        Row: {
          id: string;
          invoice_id: string;
          product_service_id: string | null;
          description: string;
          quantity: number;
          unit_price: number;
          tax_rate: number | null;
          line_total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          product_service_id?: string | null;
          description: string;
          quantity?: number;
          unit_price?: number;
          tax_rate?: number | null;
          line_total?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['invoice_lines']['Insert']>;
      };
      quotes: {
        Row: {
          id: string;
          organization_id: string;
          client_id: string;
          quote_number: string;
          status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'converted';
          issue_date: string;
          expiry_date: string;
          subtotal: number;
          tax_amount: number;
          total: number;
          currency: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          client_id: string;
          quote_number: string;
          status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'converted';
          issue_date?: string;
          expiry_date: string;
          subtotal?: number;
          tax_amount?: number;
          total?: number;
          currency?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['quotes']['Insert']>;
      };
      quote_lines: {
        Row: {
          id: string;
          quote_id: string;
          product_service_id: string | null;
          description: string;
          quantity: number;
          unit_price: number;
          tax_rate: number | null;
          line_total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          quote_id: string;
          product_service_id?: string | null;
          description: string;
          quantity?: number;
          unit_price?: number;
          tax_rate?: number | null;
          line_total?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['quote_lines']['Insert']>;
      };
      payments: {
        Row: {
          id: string;
          organization_id: string;
          invoice_id: string | null;
          invoice_number: string | null;
          client_name: string | null;
          amount: number;
          currency: string | null;
          provider: 'manual' | 'wave' | 'orange_money' | 'stripe' | 'bank_transfer' | 'cash';
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          reference: string | null;
          transaction_id: string | null;
          paid_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          invoice_id?: string | null;
          invoice_number?: string | null;
          client_name?: string | null;
          amount: number;
          currency?: string | null;
          provider?: 'manual' | 'wave' | 'orange_money' | 'stripe' | 'bank_transfer' | 'cash';
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          reference?: string | null;
          transaction_id?: string | null;
          paid_at?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['payments']['Insert']>;
      };
      expenses: {
        Row: {
          id: string;
          organization_id: string;
          category: string;
          amount: number;
          description: string;
          vendor: string | null;
          currency: string | null;
          receipt_url: string | null;
          expense_date: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          category: string;
          amount: number;
          description: string;
          vendor?: string | null;
          currency?: string | null;
          receipt_url?: string | null;
          expense_date?: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['expenses']['Insert']>;
      };
      subscriptions: {
        Row: {
          id: string;
          organization_id: string;
          plan: 'starter' | 'pro' | 'business';
          status: 'active' | 'past_due' | 'canceled' | 'trialing';
          current_period_end: string;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          plan?: 'starter' | 'pro' | 'business';
          status?: 'active' | 'past_due' | 'canceled' | 'trialing';
          current_period_end: string;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
      };
    };
  };
}
