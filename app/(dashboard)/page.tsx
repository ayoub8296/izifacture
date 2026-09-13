'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { 
  DollarSign, 
  CheckCircle, 
  Clock, 
  FileText, 
  Receipt,
  ArrowRight, 
  Eye, 
  MoreVertical,
  Plus,
  UserPlus,
  Building,
  Printer
} from 'lucide-react';

import StatCard from '@/components/dashboard/StatCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { StatusBadge } from '@/components/billing/StatusBadge';
import { Button } from '@/components/ui/Button';
import { getDashboardStats } from '@/lib/services/dashboard';
import { DashboardStats } from '@/lib/types';
import { formatFCFA, formatDate } from '@/lib/currency';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 24,
    }
  },
};


export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const data = await getDashboardStats();
      setStats(data);
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded-xl"></div>
            <div className="h-4 w-64 bg-slate-200 rounded-lg"></div>
          </div>
          <div className="h-10 w-36 bg-slate-200 rounded-xl"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-100 rounded-2xl border border-slate-200/60"></div>
          ))}
        </div>

        {/* Charts & Actions Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-100 rounded-2xl border border-slate-200/60 lg:col-span-2"></div>
          <div className="h-64 bg-slate-100 rounded-2xl border border-slate-200/60"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Header */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-outfit font-bold text-slate-800 dark:text-white tracking-tight">
            Tableau de bord
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {"Ravi de vous revoir ! Voici un aperçu de l'activité de votre entreprise aujourd'hui."}
          </p>
        </div>
        
        <div className="flex gap-2.5">
          <Link href="/facturation/devis/nouveau" className="touch-manipulation">
            <Button variant="outline" size="sm" className="group flex items-center gap-1.5 hover:shadow-md">
              <Plus className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-brand-pink group-hover:rotate-90 transition-all duration-300" />
              <span>Nouveau Devis</span>
            </Button>
          </Link>
          <Link href="/facturation/factures/nouvelle" className="touch-manipulation">
            <Button variant="pinkPill" size="sm" className="group flex items-center gap-1.5 px-4 py-2">
              <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
              <span>Nouvelle Facture</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* KPI Stats Cards */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Facturé"
          value={formatFCFA(stats.totalInvoiced)}
          subtitle="Cumul hors brouillons"
          icon={DollarSign}
          iconColor="text-brand-pink"
          bgColor="bg-brand-pink/10"
          trend={{ value: '+14%', isPositive: true }}
        />
        <StatCard
          title="Total encaissé"
          value={formatFCFA(stats.totalPaid)}
          subtitle="Factures payées"
          icon={CheckCircle}
          iconColor="text-emerald-600 dark:text-emerald-400"
          bgColor="bg-emerald-500/10"
          trend={{ value: '+18.5%', isPositive: true }}
        />
        <StatCard
          title="En attente"
          value={formatFCFA(stats.totalPending)}
          subtitle="Factures envoyées"
          icon={Clock}
          iconColor="text-amber-600 dark:text-amber-400"
          bgColor="bg-amber-500/10"
          trend={{ value: '-2.4%', isPositive: false }}
        />
        <StatCard
          title="Devis en cours"
          value={`${stats.activeQuotesCount} Devis`}
          subtitle="Envoyés au client"
          icon={FileText}
          iconColor="text-cyan-600 dark:text-cyan-400"
          bgColor="bg-cyan-500/10"
        />
      </motion.div>

      {/* Charts & Quick Info Sections */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* SVG Curved Chart */}
        <RevenueChart />

        {/* Quick Actions / Activity */}
        <Card className="col-span-1 hover:shadow-xl hover:shadow-slate-200/80 dark:hover:shadow-black/50 transition-shadow duration-300">
          <CardHeader className="pb-3 border-none">
            <CardTitle>Raccourcis</CardTitle>
            <CardDescription>Actions rapides les plus utilisées</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02, x: 3 }}
              whileTap={{ scale: 0.94, y: 1 }}
              transition={{ type: 'spring', stiffness: 450, damping: 20 }}
              onClick={() => router.push('/clients')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 hover:border-brand-pink/40 dark:hover:border-brand-pink/40 hover:bg-brand-pink/5 dark:hover:bg-slate-800/60 text-left group active:bg-pink-50/50 shadow-sm cursor-pointer touch-manipulation"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-brand-pink transition-transform duration-200 group-hover:scale-110">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-brand-pink transition-colors">Ajouter un client</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Enregistrer un nouveau contact</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-pink transition-transform group-hover:translate-x-1.5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02, x: 3 }}
              whileTap={{ scale: 0.94, y: 1 }}
              transition={{ type: 'spring', stiffness: 450, damping: 20 }}
              onClick={() => router.push('/parametres')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:bg-indigo-50/40 dark:hover:bg-slate-800/60 text-left group active:bg-indigo-50/50 shadow-sm cursor-pointer touch-manipulation"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 transition-transform duration-200 group-hover:scale-110">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{"Profil de l'entreprise"}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Modifier logo, TVA, coordonnées</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-transform group-hover:translate-x-1.5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, x: 3 }}
              whileTap={{ scale: 0.94, y: 1 }}
              transition={{ type: 'spring', stiffness: 450, damping: 20 }}
              onClick={() => {
                window.print();
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/40 hover:bg-emerald-50/40 dark:hover:bg-slate-800/60 text-left group active:bg-emerald-50/50 shadow-sm cursor-pointer touch-manipulation"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 transition-transform duration-200 group-hover:scale-110">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Exporter rapport de ventes</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Imprimer le récapitulatif des factures</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-transform group-hover:translate-x-1.5" />
            </motion.button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Latest Invoices Table */}
      <motion.div variants={itemVariants}>
        <Card className="transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-200/80 dark:hover:shadow-black/50">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Dernières factures émises</CardTitle>
              <CardDescription>Liste des 5 dernières factures de vente</CardDescription>
            </div>
            <Link 
              href="/facturation/factures" 
              className="text-xs font-semibold text-brand-pink hover:text-brand-pink-dark flex items-center gap-1.5 transition-colors group touch-manipulation"
            >
              <span>Voir tout</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </CardHeader>
          
          <CardContent className="p-0">
            {stats.recentInvoices.length === 0 ? (
              <div className="py-12 px-6 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-brand-pink/10 flex items-center justify-center text-brand-pink mb-3">
                  <Receipt className="w-7 h-7" />
                </div>
                <h3 className="text-base font-outfit font-bold text-slate-800 dark:text-white mb-1">
                  Aucune facture émise pour le moment
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mb-4">
                  Votre base de données Supabase est prête et propre. Créez votre première facture réelle en quelques clics.
                </p>
                <Link href="/facturation/factures/nouvelle">
                  <Button variant="pinkPill" size="sm" className="flex items-center gap-1.5 px-4 shadow-md shadow-brand-pink/20">
                    <Plus className="w-4 h-4" />
                    <span>Créer ma première facture</span>
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/75 dark:bg-slate-900/90 border-y border-slate-200/70 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider font-outfit">
                      <th className="py-3 px-6">Date</th>
                      <th className="py-3 px-6">Numéro</th>
                      <th className="py-3 px-6">Collaborateurs / Client</th>
                      <th className="py-3 px-6">Nom du pack / Entreprise</th>
                      <th className="py-3 px-6 text-right">Montant</th>
                      <th className="py-3 px-6 text-center">Statut</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {stats.recentInvoices.map((inv) => (
                      <motion.tr 
                        key={inv.id} 
                        whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.04)' }}
                        whileTap={{ scale: 0.99 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="transition-colors group cursor-pointer touch-manipulation hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                        onClick={() => router.push(`/facturation/factures/${inv.id}`)}
                      >
                        <td className="py-3.5 px-6 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                          {formatDate(inv.date)}
                        </td>
                        <td className="py-3.5 px-6 font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap group-hover:text-brand-pink transition-colors">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-3.5 px-6 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
                          {inv.client.name}
                        </td>
                        <td className="py-3.5 px-6 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {inv.client.companyName}
                        </td>
                        <td className="py-3.5 px-6 font-bold text-slate-800 dark:text-white text-right whitespace-nowrap font-outfit">
                          {formatFCFA(inv.total)}
                        </td>
                        <td className="py-3.5 px-6 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <StatusBadge status={inv.status} />
                        </td>
                        <td className="py-3.5 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <motion.div
                              whileTap={{ scale: 0.8 }}
                              whileHover={{ scale: 1.15 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                            >
                              <Link 
                                href={`/facturation/factures/${inv.id}`}
                                className="p-1.5 text-slate-400 hover:text-brand-pink hover:bg-brand-pink/10 rounded-lg block touch-manipulation"
                                title="Voir les détails"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                            </motion.div>
                            <motion.button 
                              whileTap={{ scale: 0.8 }}
                              whileHover={{ scale: 1.15 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                              onClick={() => router.push(`/facturation/factures/${inv.id}/modifier`)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg touch-manipulation cursor-pointer"
                              title="Modifier"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}



