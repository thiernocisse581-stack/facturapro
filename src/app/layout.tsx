import type { Metadata } from 'next';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AppDataProvider } from '@/context/AppDataContext';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { MainLayoutClient } from '@/components/layout/MainLayoutClient';

export const metadata: Metadata = {
  title: 'FacturaPro — Facturation & Gestion SaaS pour Entreprises',
  description:
    'SaaS de facturation intelligent conforme OHADA, multi-devises (FCFA, EUR, USD) avec intégration Wave, Orange Money, Stripe et calcul automatique de TVA 18%.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-surface-50 text-slate-900 min-h-screen antialiased">
        <AuthProvider>
          <AppDataProvider>
            <MainLayoutClient>
              {children}
            </MainLayoutClient>
            <CommandPalette />
            <ToastContainer />
          </AppDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
