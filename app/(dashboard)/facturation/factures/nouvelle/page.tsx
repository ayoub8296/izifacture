'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Calendar, 
  User, 
  Save, 
  Send
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { listClients } from '@/lib/services/clients';
import { createInvoice, generateNextInvoiceNumber } from '@/lib/services/invoices';
import { calculateLineTotal, calculateTotals } from '@/lib/calculations';
import { formatFCFA } from '@/lib/currency';
import { Client, LineItem } from '@/lib/types';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 25 } },
};


export default function NewInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  
  // Default due date: +30 days
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  const [tvaRate] = useState(18);
  const [applyTva, setApplyTva] = useState<boolean>(true);

  // Line items state
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: `item-${Date.now()}-1`,
      description: 'Prestation de conseil & accompagnement stratégique',
      quantity: 1,
      unitPrice: 500000,
      totalPrice: 500000,
    },
  ]);

  useEffect(() => {
    async function init() {
      const clientList = await listClients();
      setClients(clientList);
      if (clientList.length > 0) {
        setSelectedClientId(clientList[0].id);
      }
      const nextNum = await generateNextInvoiceNumber();
      setInvoiceNumber(nextNum);
      setLoading(false);
    }
    init();
  }, []);

  const selectedClient = clients.find(c => c.id === selectedClientId);

  // Handle line item changes
  const handleLineChange = (id: string, field: 'description' | 'quantity' | 'unitPrice', value: string | number) => {
    setLineItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      
      const qty = field === 'quantity' ? Number(value) : item.quantity;
      const price = field === 'unitPrice' ? Number(value) : item.unitPrice;
      updated.totalPrice = calculateLineTotal(qty, price);
      return updated;
    }));
  };

  const addLineItem = () => {
    const newItem: LineItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    };
    setLineItems(prev => [...prev, newItem]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length <= 1) return;
    setLineItems(prev => prev.filter(i => i.id !== id));
  };

  // Calculate totals
  const effectiveTva = applyTva ? tvaRate : 0;
  const totals = calculateTotals(lineItems, effectiveTva);

  const handleSubmit = async (status: 'draft' | 'sent') => {
    if (!selectedClient) {
      alert('Veuillez sélectionner un client.');
      return;
    }

    if (lineItems.some(item => !item.description.trim())) {
      alert('Veuillez renseigner une description pour chaque ligne.');
      return;
    }

    setSubmitting(true);

    try {
      const newInv = await createInvoice({
        invoiceNumber,
        client: selectedClient,
        date,
        dueDate,
        status,
        subtotal: totals.subtotal,
        tvaRate: effectiveTva,
        tvaAmount: totals.tvaAmount,
        total: totals.total,
        lineItems,
        companyId: 'comp-1',
      });

      router.push(`/facturation/factures/${newInv.id}`);
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue lors de la création de la facture.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-5xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 rounded-xl"></div>
        <div className="h-64 bg-slate-100 rounded-2xl"></div>
        <div className="h-96 bg-slate-100 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-5xl mx-auto pb-12"
    >
      {/* Header with back button */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/facturation/factures" className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm touch-manipulation">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-outfit font-bold text-slate-800 dark:text-white tracking-tight">
              Nouvelle Facture
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Numéro de document : <strong className="text-brand-pink font-semibold">{invoiceNumber}</strong>
            </p>
          </div>
        </div>

        {/* Top Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={submitting}
            onClick={() => handleSubmit('draft')}
            className="flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Sauvegarder en brouillon</span>
          </Button>

          <Button
            variant="pinkPill"
            size="sm"
            disabled={submitting}
            onClick={() => handleSubmit('sent')}
            className="flex items-center gap-1.5 px-4 shadow-md shadow-brand-pink/25"
          >
            <Send className="w-4 h-4" />
            <span>Créer & Envoyer</span>
          </Button>
        </div>
      </motion.div>

      {/* Main Grid: Client & Document info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Client Selection Card */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-none">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-brand-pink" />
                <span>Destinataire (Client)</span>
              </CardTitle>
              <CardDescription>Sélectionnez le client à facturer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Client / Entreprise <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} • {c.companyName}
                    </option>
                  ))}
                </select>
              </div>

              {selectedClient && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
                >
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 font-medium block">Contact</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedClient.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 font-medium block">Entreprise</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedClient.companyName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 font-medium block">Email</span>
                    <span className="font-medium text-slate-600 dark:text-slate-300">{selectedClient.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 font-medium block">Téléphone / Adresse</span>
                    <span className="font-medium text-slate-600 dark:text-slate-300">{selectedClient.phone} • {selectedClient.address}</span>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Invoice Dates Card */}
        <motion.div variants={itemVariants}>
          <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-none">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-pink" />
                <span>Dates & Conditions</span>
              </CardTitle>
              <CardDescription>Période de facturation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Date d’émission <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Date d’échéance <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={applyTva}
                    onChange={(e) => setApplyTva(e.target.checked)}
                    className="w-4 h-4 text-brand-pink rounded border-slate-300 dark:border-slate-700 focus:ring-brand-pink"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Appliquer la TVA (18%)</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Line Items Table Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <CardTitle className="text-base">Prestations & Lignes de facture</CardTitle>
              <CardDescription>Détaillez les produits ou services vendus</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLineItem}
              className="flex items-center gap-1 text-xs border-brand-pink/40 text-brand-pink hover:bg-brand-pink/5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter une ligne</span>
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200/70 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider font-outfit">
                    <th className="py-3 px-6 w-1/2">Description de la prestation</th>
                    <th className="py-3 px-4 text-center w-24">Quantité</th>
                    <th className="py-3 px-4 text-right w-44">Prix unitaire (FCFA)</th>
                    <th className="py-3 px-6 text-right w-44">Total ligne</th>
                    <th className="py-3 px-4 text-center w-14"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  <AnimatePresence initial={false}>
                    {lineItems.map((item) => (
                      <motion.tr 
                        key={item.id} 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                      >
                        <td className="py-3 px-6">
                          <input
                            type="text"
                            placeholder="Ex: Création de site web, audit, formation..."
                            value={item.description}
                            onChange={(e) => handleLineChange(item.id, 'description', e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-pink focus:border-brand-pink focus:bg-white dark:focus:bg-slate-900 transition-all"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={item.quantity}
                            onChange={(e) => handleLineChange(item.id, 'quantity', Math.max(1, Number(e.target.value)))}
                            className="w-20 px-2 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-100 text-center focus:outline-none focus:ring-1 focus:ring-brand-pink focus:border-brand-pink focus:bg-white dark:focus:bg-slate-900 transition-all"
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            value={item.unitPrice}
                            onChange={(e) => handleLineChange(item.id, 'unitPrice', Math.max(0, Number(e.target.value)))}
                            className="w-36 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 text-right focus:outline-none focus:ring-1 focus:ring-brand-pink focus:border-brand-pink focus:bg-white dark:focus:bg-slate-900 transition-all font-outfit"
                          />
                        </td>
                        <td className="py-3 px-6 text-right font-bold text-slate-800 dark:text-white font-outfit text-sm whitespace-nowrap">
                          {formatFCFA(item.totalPrice)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            type="button"
                            onClick={() => removeLineItem(item.id)}
                            disabled={lineItems.length <= 1}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
                            title="Supprimer la ligne"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Totals Breakdown Section */}
            <div className="p-6 bg-slate-50/70 dark:bg-slate-950/60 border-t border-slate-200/70 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="text-xs text-slate-500 dark:text-slate-400 max-w-md space-y-1.5">
                <p className="font-semibold text-slate-700 dark:text-slate-300">Conditions de règlement :</p>
                <p>Paiement par virement bancaire ou Mobile Money (Wave / Orange Money) à réception de facture.</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Toutes les sommes sont exprimées en Francs CFA (XOF), nettes de retenue.</p>
              </div>

              <div className="w-full md:w-80 space-y-2.5 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>Sous-total HT</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-outfit">{formatFCFA(totals.subtotal)}</span>
                </div>

                {applyTva && (
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span>TVA ({tvaRate}%)</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-outfit">{formatFCFA(totals.tvaAmount)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 font-outfit">Total TTC</span>
                  <motion.span 
                    key={totals.total}
                    initial={{ scale: 1.1, color: '#EC4899' }}
                    animate={{ scale: 1, color: '#EC4899' }}
                    className="text-xl font-extrabold text-brand-pink font-outfit"
                  >
                    {formatFCFA(totals.total)}
                  </motion.span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Save Bar */}
      <motion.div variants={itemVariants} className="flex items-center justify-end gap-3 pt-2">
        <Link href="/facturation/factures">
          <Button variant="ghost" size="md">
            Annuler
          </Button>
        </Link>

        <Button
          variant="outline"
          size="md"
          disabled={submitting}
          onClick={() => handleSubmit('draft')}
          className="flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>Sauvegarder en brouillon</span>
        </Button>

        <Button
          variant="pinkPill"
          size="md"
          disabled={submitting}
          onClick={() => handleSubmit('sent')}
          className="flex items-center gap-1.5 px-6 shadow-md shadow-brand-pink/25"
        >
          <Send className="w-4 h-4" />
          <span>Créer & Envoyer</span>
        </Button>
      </motion.div>
    </motion.div>
  );
}

