import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
  accessToken?: string;
}

const STORAGE_CONFIG_KEY = 'facturapro_supabase_config';

/**
 * Retrieves the active Supabase configuration from environment variables or localStorage.
 */
export function getSupabaseConfig(): SupabaseConfig {
  let envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let envAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  let envToken = process.env.SUPABASE_ACCESS_TOKEN || '';

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_CONFIG_KEY);
      if (stored && typeof stored === 'string') {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            if (parsed.url) envUrl = parsed.url;
            if (parsed.anonKey) envAnonKey = parsed.anonKey;
            if (parsed.serviceRoleKey) envToken = parsed.serviceRoleKey;
            if (parsed.accessToken) envToken = parsed.accessToken;
          }
        } catch {
          localStorage.removeItem(STORAGE_CONFIG_KEY);
        }
      }
    } catch {
      // ignore
    }
  }

  return {
    url: envUrl,
    anonKey: envAnonKey,
    accessToken: envToken,
  };
}

/**
 * Saves Supabase credentials locally in the browser
 */
export function saveSupabaseConfig(config: Partial<SupabaseConfig>): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSupabaseConfig();
    const updated = { ...existing, ...config };
    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(updated));
    _cachedClient = null; // Invalidate cached instance
  } catch (e) {
    console.error('Failed to save Supabase config to localStorage', e);
  }
}

let _cachedClient: SupabaseClient<Database> | null = null;
let _cachedUrl = '';
let _cachedKey = '';

/**
 * Returns an initialized Supabase client if configured, otherwise null.
 */
export function getSupabaseClient(customConfig?: Partial<SupabaseConfig>): SupabaseClient<Database> | null {
  const config = { ...getSupabaseConfig(), ...customConfig };

  if (!config.url || !config.anonKey) {
    return null;
  }

  // Validate format
  try {
    new URL(config.url);
  } catch {
    return null;
  }

  if (
    _cachedClient &&
    _cachedUrl === config.url &&
    _cachedKey === config.anonKey &&
    !customConfig
  ) {
    return _cachedClient;
  }

  try {
    const client = createClient<Database>(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      db: {
        schema: 'public',
      },
    });

    if (!customConfig) {
      _cachedClient = client;
      _cachedUrl = config.url;
      _cachedKey = config.anonKey;
    }

    return client;
  } catch (e) {
    console.error('Error initializing Supabase client:', e);
    return null;
  }
}

/**
 * Checks if Supabase connection credentials are present.
 */
export function isSupabaseConfigured(): boolean {
  const cfg = getSupabaseConfig();
  return Boolean(cfg.url && cfg.anonKey && cfg.url.startsWith('http'));
}

/**
 * Live test to verify Supabase connection and schema accessibility
 */
export async function testSupabaseConnection(
  url?: string,
  anonKey?: string
): Promise<{ success: boolean; message: string; latencyMs?: number }> {
  const targetUrl = url || getSupabaseConfig().url;
  const targetKey = anonKey || getSupabaseConfig().anonKey;

  if (!targetUrl || !targetKey) {
    return {
      success: false,
      message: "L'URL Supabase ou la Clé Anonyme (Anon Key) est manquante.",
    };
  }

  try {
    const start = performance.now();
    const client = createClient<Database>(targetUrl, targetKey);

    // Test a basic select on organizations or schema info
    const { error } = await client
      .from('organizations')
      .select('id', { count: 'exact', head: true });

    const latencyMs = Math.round(performance.now() - start);

    if (error) {
      // Check if table missing or invalid API key
      if (error.code === '42P01' || error.message.includes('relation "organizations" does not exist')) {
        return {
          success: false,
          message: `Connexion réussie mais les tables FacturaPro n'existent pas encore. Veuillez exécuter le script de migration SQL dans votre Dashboard Supabase. (Latence: ${latencyMs}ms)`,
          latencyMs,
        };
      }
      return {
        success: false,
        message: `Erreur Supabase: ${error.message} (Code: ${error.code || 'Inconnu'})`,
        latencyMs,
      };
    }

    return {
      success: true,
      message: `Connexion à Supabase établie avec succès ! (Latence: ${latencyMs}ms)`,
      latencyMs,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Impossible de joindre le serveur Supabase : ${message}`,
    };
  }
}
