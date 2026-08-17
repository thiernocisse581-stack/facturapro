'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabaseClient';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  company_name: string;
  phone?: string;
  role?: string;
  created_at: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (data: {
    email: string;
    password: string;
    fullName: string;
    companyName: string;
    phone?: string;
  }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  signInDemo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'facturapro_auth_user';
const AUTH_SESSION_KEY = 'facturapro_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const supabase = getSupabaseClient();

        if (supabase) {
          try {
            const { data } = await supabase.auth.getSession();
            if (data?.session && data.session.user) {
              const su = data.session.user;
              const profile: UserProfile = {
                id: su.id,
                email: su.email || '',
                full_name: su.user_metadata?.full_name || su.email?.split('@')[0] || 'Utilisateur',
                company_name: su.user_metadata?.company_name || 'Mon Entreprise',
                phone: su.user_metadata?.phone || '',
                role: su.user_metadata?.role || 'owner',
                created_at: su.created_at || new Date().toISOString(),
              };
              if (isMounted) {
                setSession(data.session);
                setUser(profile);
                setIsLoading(false);
                return;
              }
            }
          } catch {
            // fallback to local storage
          }

          // Listen to auth changes
          const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            if (currentSession?.user) {
              const su = currentSession.user;
              const profile: UserProfile = {
                id: su.id,
                email: su.email || '',
                full_name: su.user_metadata?.full_name || su.email?.split('@')[0] || 'Utilisateur',
                company_name: su.user_metadata?.company_name || 'Mon Entreprise',
                phone: su.user_metadata?.phone || '',
                role: su.user_metadata?.role || 'owner',
                created_at: su.created_at || new Date().toISOString(),
              };
              setUser(profile);
              setSession(currentSession);
            } else {
              setUser(null);
              setSession(null);
            }
          });

          return () => {
            authListener?.subscription?.unsubscribe();
          };
        }

        // Fallback / Local stored session
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem(AUTH_USER_KEY);
          if (storedUser) {
            try {
              const parsed = JSON.parse(storedUser);
              if (parsed && parsed.id) {
                setUser(parsed);
                setSession({ user: parsed, access_token: 'local_demo_token' });
              }
            } catch {
              localStorage.removeItem(AUTH_USER_KEY);
            }
          }
        }
      } catch (err) {
        console.warn('Auth initialization error:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sign In function
  const signIn = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      setIsLoading(true);
      const supabase = getSupabaseClient();

      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { error: error.message };
        }

        if (data?.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: data.user.user_metadata?.full_name || email.split('@')[0],
            company_name: data.user.user_metadata?.company_name || 'Mon Entreprise',
            phone: data.user.user_metadata?.phone || '',
            role: 'owner',
            created_at: data.user.created_at || new Date().toISOString(),
          };
          setUser(profile);
          setSession(data.session);
          if (typeof window !== 'undefined') {
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
          }
          return {};
        }
      }

      // Offline / Demo fallback authentication
      const demoProfile: UserProfile = {
        id: `user-${Date.now()}`,
        email,
        full_name: email.split('@')[0].toUpperCase(),
        company_name: 'Entreprise ' + email.split('@')[0],
        role: 'owner',
        created_at: new Date().toISOString(),
      };
      setUser(demoProfile);
      setSession({ user: demoProfile, access_token: 'mock_token' });
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(demoProfile));
      }
      return {};
    } catch (e: any) {
      return { error: e?.message || 'Erreur lors de la connexion' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign Up function
  const signUp = useCallback(
    async (data: {
      email: string;
      password: string;
      fullName: string;
      companyName: string;
      phone?: string;
    }): Promise<{ error?: string }> => {
      try {
        setIsLoading(true);
        const supabase = getSupabaseClient();

        if (supabase) {
          const { data: authData, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              data: {
                full_name: data.fullName,
                company_name: data.companyName,
                phone: data.phone || '',
              },
            },
          });

          if (error) {
            return { error: error.message };
          }

          if (authData?.user) {
            const profile: UserProfile = {
              id: authData.user.id,
              email: authData.user.email || data.email,
              full_name: data.fullName,
              company_name: data.companyName,
              phone: data.phone || '',
              role: 'owner',
              created_at: authData.user.created_at || new Date().toISOString(),
            };

            // Provision tenant organization & member records in Supabase PostgreSQL
            const orgId = `org-${authData.user.id}`;
            try {
              await supabase.from('organizations').upsert({
                id: orgId,
                name: data.companyName,
                legal_name: data.companyName,
                email: data.email,
                phone: data.phone || null,
                country: 'Sénégal',
                currency: 'XOF',
                tax_rate: 18.00,
                invoice_prefix: 'FAC-2025-',
                current_invoice_seq: 0,
                subscription_plan: 'pro',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              } as any);

              await supabase.from('organization_members').upsert({
                id: `member-${authData.user.id}`,
                organization_id: orgId,
                user_id: authData.user.id,
                name: data.fullName,
                email: data.email,
                role: 'owner',
                created_at: new Date().toISOString(),
              } as any);
            } catch (dbErr) {
              console.warn('Supabase DB provision warning:', dbErr);
            }

            setUser(profile);
            setSession(authData.session || { user: profile });
            if (typeof window !== 'undefined') {
              localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
            }
            return {};
          }
        }

        // Offline / Fallback signup
        const profile: UserProfile = {
          id: `user-${Date.now()}`,
          email: data.email,
          full_name: data.fullName,
          company_name: data.companyName,
          phone: data.phone || '',
          role: 'owner',
          created_at: new Date().toISOString(),
        };
        setUser(profile);
        setSession({ user: profile, access_token: 'mock_token' });
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
        }
        return {};
      } catch (e: any) {
        return { error: e?.message || "Erreur lors de l'inscription" };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Quick Demo login
  const signInDemo = useCallback(async () => {
    const demoProfile: UserProfile = {
      id: 'demo-user-01',
      email: 'directeur@entreprise.sn',
      full_name: 'Mamadou Diop',
      company_name: 'Diop & Associés SARL',
      phone: '+221 77 123 45 67',
      role: 'owner',
      created_at: new Date().toISOString(),
    };
    setUser(demoProfile);
    setSession({ user: demoProfile, access_token: 'demo_token' });
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(demoProfile));
    }
  }, []);

  // Sign Out function
  const signOut = useCallback(async () => {
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase.auth.signOut().catch(() => {});
      }
      setUser(null);
      setSession(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_USER_KEY);
        localStorage.removeItem(AUTH_SESSION_KEY);
      }
      router.push('/login');
    } catch (e) {
      console.warn('Sign out error:', e);
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        signInDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
