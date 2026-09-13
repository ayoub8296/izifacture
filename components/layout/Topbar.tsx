'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, Plus, HelpCircle, Bell, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import ThemeToggle from '../theme/ThemeToggle';
import { getCompanyProfile } from '@/lib/services/companies';
import { Company } from '@/lib/types';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    async function loadComp() {
      const comp = await getCompanyProfile();
      setCompany(comp);
    }
    loadComp();
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return 'IZ';
    const words = name.split(' ');
    if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(p => p);
    if (paths.length === 0) {
      return [{ label: 'Tableau de bord', href: '/' }];
    }

    const breadcrumbs = [{ label: 'Dashboard', href: '/' }];
    let currentPath = '';

    paths.forEach((path) => {
      currentPath += `/${path}`;
      let label = path.charAt(0).toUpperCase() + path.slice(1);
      
      if (path === 'facturation') label = 'Facturation';
      if (path === 'factures') label = 'Factures';
      if (path === 'devis') label = 'Devis';
      if (path === 'clients') label = 'Clients';
      if (path === 'parametres') label = 'Paramètres';
      if (path === 'aide') label = 'Aide & Support';
      if (path === 'nouvelle') label = 'Nouvelle Facture';
      if (path === 'nouveau') label = 'Nouveau Devis';
      if (path === 'modifier') label = 'Modifier';

      if (path.length > 10) {
        label = 'Détails';
      }

      breadcrumbs.push({ label, href: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800 shadow-sm/5 transition-colors duration-200">
      {/* Left side: Hamburger (mobile) & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          onClick={onMenuClick}
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800 touch-manipulation cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </motion.button>

        {/* Breadcrumbs */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <div key={crumb.href} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />}
                {isLast ? (
                  <span className="font-semibold text-slate-800 dark:text-slate-100 font-outfit px-2 py-0.5 bg-slate-100/60 dark:bg-slate-800 rounded-md">
                    {crumb.label}
                  </span>
                ) : (
                  <Link 
                    href={crumb.href} 
                    className="hover:text-brand-pink transition-colors font-medium hover:underline underline-offset-4"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Right side: Action button, theme switcher, credit badge, notifications, profile */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
        {/* Theme Toggle (Dark / Light Mode) */}
        <ThemeToggle />

        {/* Credits Badge */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 450, damping: 20 }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-brand-pink/5 rounded-xl border border-slate-200/60 dark:border-slate-700 hover:border-brand-pink/30 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-pink cursor-pointer select-none shadow-sm group touch-manipulation"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-pink transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
          <span>Cloud Supabase • Actif</span>
        </motion.div>

        {/* New Invoice Action Button */}
        <Button 
          variant="pinkPill" 
          size="sm"
          className="group flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs"
          onClick={() => router.push('/facturation/factures/nouvelle')}
        >
          <Plus className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90" />
          <span className="hidden sm:inline">Nouvelle Facture</span>
          <span className="sm:hidden">Facture</span>
        </Button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* Help icon */}
        <motion.button 
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          onClick={() => router.push('/aide')}
          className="p-2 text-slate-400 dark:text-slate-400 hover:text-brand-pink hover:bg-slate-100/80 dark:hover:bg-slate-800 rounded-xl hidden sm:block cursor-pointer touch-manipulation group"
          title="Aide et assistance"
        >
          <HelpCircle className="w-5 h-5 transition-transform duration-200 group-hover:-rotate-6" />
        </motion.button>

        {/* Notifications */}
        <motion.button 
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className="p-2 text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800 rounded-xl relative cursor-pointer touch-manipulation group"
          title="Notifications"
        >
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
          <Bell className="w-5 h-5 transition-transform duration-200 group-hover:rotate-12" />
        </motion.button>

        {/* User avatar / profile button */}
        <motion.button 
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          onClick={() => router.push('/parametres')}
          className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 text-white font-outfit text-xs font-bold border border-slate-200/80 dark:border-slate-700 hover:border-brand-pink/50 hover:shadow-md cursor-pointer touch-manipulation"
          title={`Profil : ${company?.name || 'Entreprise'}`}
        >
          {getInitials(company?.name)}
        </motion.button>
      </div>
    </header>
  );
}
