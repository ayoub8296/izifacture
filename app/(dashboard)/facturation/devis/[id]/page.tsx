'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  ArrowLeft, 
  Printer, 
  Edit, 
  Trash2, 
  RefreshCw, 
  ChevronDown
} from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/billing/StatusBadge';
import { getQuote, updateQuoteStatus, deleteQuote, convertQuoteToInvoice } from '@/lib/services/quotes';
import { getCompanyProfile } from '@/lib/services/companies';
import { Quote, Company } from '@/lib/types';
import { formatFCFA, formatDate } from '@/lib/currency';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 25 } },
};


export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [converting, setConverting] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    const [q, comp] = await Promise.all([
      getQuote(id),
      getCompanyProfile(),
    ]);
    setQuote(q);
    setCompany(comp);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusChange = async (status: Quote['status']) => {
    if (!quote) return;
    const updated = await updateQuoteStatus(quote.id, status);
    if (updated) {
      setQuote({ ...updated });
    }
    setShowStatusMenu(false);
  };

  const handleConvert = async () => {
    if (!quote) return;
    setConverting(true);
    try {
      const newInvoice = await convertQuoteToInvoice(quote.id);
      if (newInvoice) {
        router.push(`/facturation/factures/${newInvoice.id}`);
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la conversion du devis en facture.');
      setConverting(false);
    }
  };

  const handleDelete = async () => {
    if (!quote) return;
    await deleteQuote(quote.id);
    router.push('/facturation/devis');
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
        <div className="h-10 w-48 bg-slate-200 rounded-xl"></div>
        <div className="h-[600px] bg-slate-100 rounded-2xl"></div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-800">Devis introuvable</h2>
        <p className="text-sm text-slate-500 mt-1">Le devis demandé n’existe pas ou a été supprimé.</p>
        <Link href="/facturation/devis" className="inline-block mt-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Retour aux devis
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-4xl mx-auto pb-12"
    >
      {/* Top Action Bar */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <Link 
            href="/facturation/devis" 
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm touch-manipulation"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-outfit font-bold text-slate-800 dark:text-white tracking-tight">
                {quote.quoteNumber}
              </h1>
              <StatusBadge status={quote.status} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Émis le {formatDate(quote.date)} • Valable jusqu’au {formatDate(quote.validityDate)}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Convert to Invoice Button */}
          <Button
            variant="pinkPill"
            size="sm"
            disabled={converting}
            onClick={handleConvert}
            className="flex items-center gap-1.5 px-3.5 shadow-md shadow-brand-pink/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${converting ? 'animate-spin' : ''}`} />
            <span>Convertir en facture</span>
          </Button>

          {/* Status changer dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="flex items-center gap-1.5"
            >
              <span>Statut : {quote.status.toUpperCase()}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </Button>

            <AnimatePresence>
              {showStatusMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 py-1.5 text-xs font-medium space-y-0.5"
                >
                  <button
                    onClick={() => handleStatusChange('accepted')}
                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Marquer comme Accepté</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange('sent')}
                    className="w-full px-3 py-2 text-left hover:bg-cyan-50 dark:hover:bg-cyan-950/40 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span>Marquer comme Envoyé</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange('rejected')}
                    className="w-full px-3 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Marquer comme Refusé</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange('draft')}
                    className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                  >
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span>Marquer comme Brouillon</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Edit button */}
          <Link href={`/facturation/devis/${quote.id}/modifier`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Edit className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Modifier</span>
            </Button>
          </Link>

          {/* Print button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.print()}
            className="flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Imprimer</span>
          </Button>

          {/* Delete button */}
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => setShowDeleteModal(true)}
            className="p-2"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Printable Quote Document */}
      <motion.div variants={itemVariants}>
        <Card className="border-slate-200/90 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900 p-8 sm:p-12 print-card hover:shadow-xl transition-shadow duration-300">
          {/* Quote Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pb-8 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-pink-gradientStart to-brand-pink-gradientEnd flex items-center justify-center text-white font-bold font-outfit shadow-md shadow-brand-pink/20">
                  izi
                </div>
                <span className="text-2xl font-outfit font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {company?.name || 'Assess Manager Africa'}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5 font-medium">
                <p>{company?.address || 'Cocody Riviera 2, Immeuble Horizon'}</p>
                <p>Abidjan, Côte d’Ivoire</p>
                <p>Email : {company?.email || 'contact@assess-manager.ci'} • Tél : {company?.phone || '+225 07 00 00 00 00'}</p>
                <p>NCC : <span className="font-semibold text-slate-700 dark:text-slate-300">{company?.ncc || '1809345 A'}</span> • RC : <span className="font-semibold text-slate-700 dark:text-slate-300">{company?.rc || 'CI-ABJ-2022-B-1234'}</span></p>
              </div>
            </div>

            <div className="sm:text-right">
              <h2 className="text-2xl font-outfit font-black text-brand-navy dark:text-slate-100 tracking-tight uppercase">
                DEVIS COMMERCIAL
              </h2>
              <p className="text-sm font-bold text-brand-pink font-outfit mt-0.5">
                N° {quote.quoteNumber}
              </p>
              <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 space-y-1 font-medium">
                <p>Date de proposition : <strong className="text-slate-700 dark:text-slate-300">{formatDate(quote.date)}</strong></p>
                <p>Date de validité : <strong className="text-slate-700 dark:text-slate-300">{formatDate(quote.validityDate)}</strong></p>
              </div>
            </div>
          </div>

          {/* Client Box */}
          <div className="my-8 p-5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row justify-between gap-6">
            <div>
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-outfit block mb-1.5">
                Proposé à :
              </span>
              <p className="text-base font-bold text-slate-900 dark:text-white font-outfit">
                {quote.client.name}
              </p>
              <p className="text-xs font-semibold text-brand-pink mt-0.5">
                {quote.client.companyName}
              </p>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                <p>{quote.client.address || 'Abidjan, Côte d’Ivoire'}</p>
                <p>{quote.client.email} • {quote.client.phone}</p>
              </div>
            </div>

            <div className="sm:text-right flex flex-col justify-end">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Statut de l’offre</span>
              <div className="mt-1">
                <StatusBadge status={quote.status} />
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto my-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider font-outfit">
                  <th className="py-3 px-4 w-1/2">Désignation des prestations</th>
                  <th className="py-3 px-4 text-center w-20">Qté</th>
                  <th className="py-3 px-4 text-right w-36">Prix unitaire</th>
                  <th className="py-3 px-4 text-right w-36">Montant HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {quote.lineItems.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {item.description}
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-slate-600 dark:text-slate-400">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-slate-600 dark:text-slate-400 font-outfit">
                      {formatFCFA(item.unitPrice)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white font-outfit">
                      {formatFCFA(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2 max-w-sm">
              <p className="font-semibold text-slate-800 dark:text-slate-200">Modalités d’acceptation :</p>
              <p className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/70 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                Pour valider cette proposition commerciale, merci de nous retourner ce devis signé et revêtu de la mention manuscrite « Bon pour accord ».
              </p>
            </div>

            <div className="w-full sm:w-72 space-y-2 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>Total Hors Taxes (HT)</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-outfit">{formatFCFA(quote.subtotal)}</span>
              </div>

              {quote.tvaRate > 0 && (
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>TVA ({quote.tvaRate}%)</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-outfit">{formatFCFA(quote.tvaAmount)}</span>
                </div>
              )}

              <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900 dark:text-white font-outfit">Total TTC Estimé</span>
                <span className="text-xl font-extrabold text-brand-pink font-outfit">
                  {formatFCFA(quote.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Signature Box */}
          <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-8 text-xs text-slate-500 dark:text-slate-400">
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">Pour l’émetteur :</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Assess Manager Africa</p>
              <div className="h-16 mt-2 border-b border-dashed border-slate-300 dark:border-slate-700"></div>
            </div>
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">Pour le client (Date et Signature) :</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Précédé de « Bon pour accord »</p>
              <div className="h-16 mt-2 border-b border-dashed border-slate-300 dark:border-slate-700"></div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm no-print">
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
                  <h3 className="text-lg font-outfit font-bold text-slate-800 dark:text-white">Supprimer le devis</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Cette action est irréversible.</p>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300">
                Êtes-vous sûr de vouloir supprimer définitivement le devis <strong className="text-slate-800 dark:text-white font-semibold">{quote.quoteNumber}</strong> ?
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowDeleteModal(false)}
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
