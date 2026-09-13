'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Receipt, 
  FileText, 
  Users, 
  Settings, 
  HelpCircle,
  X, 
  TrendingUp,
  LogOut
} from 'lucide-react';
import { Company } from '@/lib/types';
import { getCompanyProfile } from '@/lib/services/companies';
import { supabase } from '@/lib/supabase/client';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navigation = [
    {
      category: 'Principal',
      items: [
        { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
      ]
    },
    {
      category: 'Facturation',
      items: [
        { name: 'Factures', href: '/facturation/factures', icon: Receipt },
        { name: 'Devis', href: '/facturation/devis', icon: FileText },
      ]
    },
    {
      category: 'Annuaire',
      items: [
        { name: 'Clients', href: '/clients', icon: Users },
      ]
    },
    {
      category: 'Configuration',
      items: [
        { name: 'Paramètres', href: '/parametres', icon: Settings },
      ]
    },
    {
      category: 'Assistance',
      items: [
        { name: 'Aide & Support', href: '/aide', icon: HelpCircle },
      ]
    }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'IZ';
    const words = name.split(' ');
    if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-brand-navy border-r border-slate-800 transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Header / Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800/80">
          <Link 
            href="/" 
            className="flex items-center gap-2.5 group select-none touch-manipulation" 
            onClick={onClose}
          >
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.15 }}
              whileTap={{ rotate: -15, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-pink-gradientStart to-brand-pink-gradientEnd shadow-lg shadow-brand-pink/20"
            >
              <TrendingUp className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-outfit font-bold text-white tracking-wide">
              izi <span className="text-brand-pink font-extrabold drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]">facture</span>
            </span>
          </Link>
          <motion.button 
            whileTap={{ scale: 0.88 }}
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white lg:hidden rounded-lg hover:bg-slate-800 cursor-pointer touch-manipulation"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-7">
          {navigation.map((group) => (
            <div key={group.category} className="space-y-2">
              <span className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest block font-outfit">
                {group.category}
              </span>
              <ul className="space-y-1.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="block touch-manipulation"
                      >
                        <motion.div
                          whileHover={{ x: 5, scale: 1.02 }}
                          whileTap={{ scale: 0.94 }}
                          transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group relative select-none ${
                            active
                              ? 'bg-brand-pink/15 text-white font-semibold shadow-inner shadow-brand-pink/10'
                              : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'
                          }`}
                        >
                          {active && (
                            <div className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r bg-brand-pink shadow-[0_0_10px_#EC4899]" />
                          )}
                          <item.icon className={`w-5 h-5 transition-transform ${
                            active 
                              ? 'text-brand-pink scale-105' 
                              : 'text-slate-400 group-hover:text-brand-pink group-hover:scale-110'
                          }`} />
                          <span>{item.name}</span>
                        </motion.div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer info (Live Company Context & Logout) */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-2">
          <Link 
            href="/parametres" 
            className="block touch-manipulation"
          >
            <motion.div 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 450, damping: 20 }}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/80 hover:border-slate-700/80 border border-transparent group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 border border-slate-700 flex items-center justify-center font-outfit font-bold text-white shadow-md">
                {getInitials(company?.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate group-hover:text-brand-pink transition-colors">
                  {company?.name || 'Entreprise'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {company?.address ? company.address.split(',')[0] : 'Afrique'}
                </p>
              </div>
            </motion.div>
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors border border-slate-800/60"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}
