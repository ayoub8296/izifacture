import { ReactNode } from 'react';

export const metadata = {
  title: 'Connexion • izi facture',
  description: 'Connectez-vous à votre espace de facturation izi facture',
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 selection:bg-brand-pink selection:text-white">
      {/* Decorative background blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-pink/15 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
