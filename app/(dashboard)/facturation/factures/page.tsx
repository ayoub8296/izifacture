'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  X
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/billing/StatusBadge';
import { listInvoices, deleteInvoice } from '@/lib/services/invoices';
import { Invoice } from '@/lib/types';
import { formatFCFA, formatDate } from '@/lib/currency';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 25 } },
};

export default function InvoicesListPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Invoice['status']>('all');
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  const loadData = async () => {
    const data = await listInvoices();
    setInvoices(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async () => {
    if (!invoiceToDelete) return;
    await deleteInvoice(invoiceToDelete.id);
    setInvoiceToDelete(null);
    loadData();
  };

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = 
      inv.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate quick stats
  const paidTotal = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
  const pendingTotal = invoices.filter(i => i.status === 'sent').reduce((sum, i) => sum + i.total, 0);
  const overdueTotal = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.total, 0);

  const statusTabs: { key: 'all' | Invoice['status']; label: string; count: number }[] = [
    { key: 'all', label: 'Toutes', count: invoices.length },
    { key: 'paid', label: 'Payées', count: invoices.filter(i => i.status === 'paid').length },
    { key: 'sent', label: 'Envoyées', count: invoices.filter(i => i.status === 'sent').length },
    { key: 'draft', label: 'Brouillons', count: invoices.filter(i => i.status === 'draft').length },
    { key: 'overdue', label: 'En retard', count: invoices.filter(i => i.status === 'overdue').length },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 rounded-xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-24 bg-slate-100 rounded-2xl"></div>
          <div className="h-24 bg-slate-100 rounded-2xl"></div>
          <div className="h-24 bg-slate-100 rounded-2xl"></div>
        </div>
        <div className="h-96 bg-slate-100 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-bold text-slate-800 dark:text-white tracking-tight">
            Factures de vente
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Gérez, suivez et exportez toutes vos factures émises en FCFA.
          </p>
        </div>

        <Link href="/facturation/factures/nouvelle" className="touch-manipulation">
          <Button variant="pinkPill" size="md" className="group shadow-lg shadow-brand-pink/20">
            <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
            <span>Créer une facture</span>
          </Button>
        </Link>
      </motion.div>

      {/* KPI Mini-cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200/70 dark:border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase font-outfit">Encaissé</p>
              <p className="text-xl font-bold font-outfit text-emerald-600 dark:text-emerald-400 mt-0.5">{formatFCFA(paidTotal)}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/70 dark:border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase font-outfit">En attente</p>
              <p className="text-xl font-bold font-outfit text-amber-600 dark:text-amber-400 mt-0.5">{formatFCFA(pendingTotal)}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/70 dark:border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase font-outfit">En retard</p>
              <p className="text-xl font-bold font-outfit text-rose-600 dark:text-rose-400 mt-0.5">{formatFCFA(overdueTotal)}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {statusTabs.map((tab) => (
            <motion.button
              key={tab.key}
              whileTap={{ scale: 0.94 }}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-manipulation cursor-pointer flex items-center gap-1.5 ${
                statusFilter === tab.key
                  ? 'bg-brand-navy dark:bg-brand-pink text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                statusFilter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                {tab.count}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher client, numéro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Invoices Table */}
      <motion.div variants={itemVariants}>
        <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-outfit font-bold text-slate-700 dark:text-slate-200">Aucune facture trouvée</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Essayez de modifier vos filtres ou termes de recherche.'
                  : 'Commencez par créer votre première facture de vente.'}
              </p>
              {!(searchQuery || statusFilter !== 'all') && (
                <Link href="/facturation/factures/nouvelle" className="inline-block mt-4">
                  <Button variant="pinkPill" size="sm">
                    <Plus className="w-3.5 h-3.5" />
                    Créer une facture
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 dark:bg-slate-900/90 border-b border-slate-200/70 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider font-outfit">
                    <th className="py-3 px-6">Numéro</th>
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-6">Client / Entreprise</th>
                    <th className="py-3 px-6">Échéance</th>
                    <th className="py-3 px-6 text-right">Montant TTC</th>
                    <th className="py-3 px-6 text-center">Statut</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {filteredInvoices.map((inv) => (
                    <motion.tr
                      key={inv.id}
                      whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.04)' }}
                      whileTap={{ scale: 0.995 }}
                      onClick={() => router.push(`/facturation/factures/${inv.id}`)}
                      className="cursor-pointer transition-colors group touch-manipulation hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                    >
                      <td className="py-3.5 px-6 font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap group-hover:text-brand-pink transition-colors">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-6 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap text-xs">
                        {formatDate(inv.date)}
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <p className="font-medium text-slate-800 dark:text-slate-200">{inv.client.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{inv.client.companyName}</p>
                      </td>
                      <td className="py-3.5 px-6 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs">
                        {formatDate(inv.dueDate)}
                      </td>
                      <td className="py-3.5 px-6 font-bold text-slate-800 dark:text-white text-right whitespace-nowrap font-outfit">
                        {formatFCFA(inv.total)}
                      </td>
                      <td className="py-3.5 px-6 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="py-3.5 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            whileHover={{ scale: 1.1 }}
                            onClick={() => router.push(`/facturation/factures/${inv.id}`)}
                            className="p-1.5 text-slate-400 hover:text-brand-pink hover:bg-brand-pink/10 rounded-lg transition-colors cursor-pointer"
                            title="Consulter"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            whileHover={{ scale: 1.1 }}
                            onClick={() => router.push(`/facturation/factures/${inv.id}/modifier`)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors cursor-pointer"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setInvoiceToDelete(inv)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {invoiceToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-outfit font-bold text-slate-800 dark:text-white">Supprimer la facture</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Cette action est irréversible.</p>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300">
                Êtes-vous sûr de vouloir supprimer la facture <strong className="text-slate-800 dark:text-white font-semibold">{invoiceToDelete.invoiceNumber}</strong> émise pour <strong className="text-slate-800 dark:text-white font-semibold">{invoiceToDelete.client.name}</strong> ?
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setInvoiceToDelete(null)}
                >
                  Annuler
                </Button>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={handleDelete}
                >
                  Confirmer la suppression
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
