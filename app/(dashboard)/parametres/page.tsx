'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Building, 
  CreditCard, 
  Save, 
  Check, 
  ShieldCheck, 
  Percent, 
  Coins 
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getCompanyProfile, updateCompanyProfile } from '@/lib/services/companies';
import { Company } from '@/lib/types';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 25 } },
};


export default function SettingsPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [ncc, setNcc] = useState('');
  const [rc, setRc] = useState('');
  const [bankInfo, setBankInfo] = useState('');
  const [defaultTvaRate, setDefaultTvaRate] = useState(18);
  const [currency, setCurrency] = useState<'FCFA' | 'XOF' | 'XAF'>('FCFA');

  useEffect(() => {
    async function loadCompany() {
      const comp = await getCompanyProfile();
      setCompany(comp);
      setName(comp.name);
      setEmail(comp.email);
      setPhone(comp.phone);
      setAddress(comp.address);
      setNcc(comp.ncc || '');
      setRc(comp.rc || '');
      setBankInfo(comp.bankInfo || "Société Générale Côte d'Ivoire • IBAN CI93 01234 56789 01234567890 12");
      setDefaultTvaRate(comp.defaultTvaRate || 18);
      setCurrency(comp.currency || 'FCFA');
    }
    loadCompany();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const updatedCompany: Company = {
      id: company?.id || 'comp-1111-2222',
      name,
      email,
      phone,
      address,
      ncc,
      rc,
      bankInfo,
      defaultTvaRate,
      currency,
    };

    const saved = await updateCompanyProfile(updatedCompany);
    setCompany(saved);
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-4xl mx-auto pb-12"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Paramètres & Configuration
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Personnalisez les coordonnées de votre entreprise et vos préférences de facturation.
          </p>
        </div>

        {/* Feedback alerts */}
        <AnimatePresence>
          {savedSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold shadow-sm"
            >
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Paramètres enregistrés dans Supabase !</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Profile Card */}
        <motion.div variants={itemVariants}>
          <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building className="w-4 h-4 text-brand-pink" />
                  <span>Identité de l’entreprise</span>
                </CardTitle>
                <CardDescription>Ces mentions légales figurent sur l’en-tête de vos factures et devis</CardDescription>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-navy to-slate-800 text-white font-outfit font-bold flex items-center justify-center shadow-md">
                AM
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Raison sociale / Nom commercial <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Email de facturation <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Téléphone professionnel
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Adresse physique & Ville
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Numéro de Compte Contribuable (NCC)
                  </label>
                  <input
                    type="text"
                    value={ncc}
                    onChange={(e) => setNcc(e.target.value)}
                    placeholder="Ex: 1809345 A"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Registre de Commerce (RC)
                  </label>
                  <input
                    type="text"
                    value={rc}
                    onChange={(e) => setRc(e.target.value)}
                    placeholder="Ex: CI-ABJ-2022-B-1234"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Billing & Tax Preferences */}
        <motion.div variants={itemVariants}>
          <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-pink" />
                <span>Paiements, TVA & Devise</span>
              </CardTitle>
              <CardDescription>Configuration monétaire et coordonnées bancaires par défaut</CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-slate-400" />
                    <span>Taux de TVA par défaut (%)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={defaultTvaRate}
                    onChange={(e) => setDefaultTvaRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink font-outfit transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-slate-400" />
                    <span>Devise d’affichage</span>
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as 'FCFA' | 'XOF' | 'XAF')}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink font-outfit transition-all"
                  >
                    <option value="FCFA" className="dark:bg-slate-900 dark:text-slate-100">FCFA (Franc CFA)</option>
                    <option value="XOF" className="dark:bg-slate-900 dark:text-slate-100">XOF (UEMOA)</option>
                    <option value="XAF" className="dark:bg-slate-900 dark:text-slate-100">XAF (CEMAC)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Coordonnées bancaires & Mobile Money (affichées en pied de facture)
                </label>
                <textarea
                  rows={3}
                  value={bankInfo}
                  onChange={(e) => setBankInfo(e.target.value)}
                  placeholder="RIB, nom de la banque, numéros Wave / Orange Money..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink font-mono transition-all"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data & Backup */}
        <motion.div variants={itemVariants}>
          <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Base de données Cloud Supabase</span>
              </CardTitle>
              <CardDescription>Vos données sont synchronisées en direct et sauvegardées sur PostgreSQL</CardDescription>
            </CardHeader>

            <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">Statut de la synchronisation : <span className="text-emerald-600 dark:text-emerald-400 font-bold">Connecté (Supabase EU-Frankfurt)</span></p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Toutes les modifications sur vos clients, factures et devis sont enregistrées en temps réel.</p>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Base Active</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Submit Bar */}
        <motion.div variants={itemVariants} className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="pinkPill"
            size="md"
            disabled={saving}
            className="flex items-center gap-2 px-6 shadow-lg shadow-brand-pink/25"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Enregistrement...' : 'Enregistrer les paramètres'}</span>
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
