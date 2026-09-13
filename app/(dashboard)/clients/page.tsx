'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Plus, 
  Search, 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Trash2, 
  X, 
  Users,
  FileText
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { listClients, createClient, updateClient, deleteClient } from '@/lib/services/clients';
import { listInvoices } from '@/lib/services/invoices';
import { Client, Invoice } from '@/lib/types';
import { formatFCFA } from '@/lib/currency';

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


export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  // Form inputs
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [ncc, setNcc] = useState('');

  const loadData = async () => {
    const [clientList, invoiceList] = await Promise.all([
      listClients(),
      listInvoices(),
    ]);
    setClients(clientList);
    setInvoices(invoiceList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingClient(null);
    setName('');
    setCompanyName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setNcc('');
    setIsModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setName(client.name);
    setCompanyName(client.companyName);
    setEmail(client.email);
    setPhone(client.phone);
    setAddress(client.address);
    setNcc(client.ncc || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !companyName.trim()) {
      alert('Veuillez renseigner le nom et l’entreprise.');
      return;
    }

    if (editingClient) {
      await updateClient(editingClient.id, {
        name,
        companyName,
        email,
        phone,
        address,
        ncc,
      });
    } else {
      await createClient({
        name,
        companyName,
        email,
        phone,
        address,
        ncc,
      });
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async () => {
    if (!clientToDelete) return;
    await deleteClient(clientToDelete.id);
    setClientToDelete(null);
    loadData();
  };

  // Filter clients
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Invoiced amount per client
  const getClientInvoicedTotal = (clientId: string) => {
    return invoices
      .filter(inv => inv.client.id === clientId)
      .reduce((sum, inv) => sum + inv.total, 0);
  };

  const getClientInvoiceCount = (clientId: string) => {
    return invoices.filter(inv => inv.client.id === clientId).length;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-44 bg-slate-100 rounded-2xl"></div>
          <div className="h-44 bg-slate-100 rounded-2xl"></div>
          <div className="h-44 bg-slate-100 rounded-2xl"></div>
        </div>
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
          <h1 className="text-3xl font-outfit font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Annuaire des Clients
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Gérez vos clients, contacts d’entreprises et coordonnées de facturation.
          </p>
        </div>

        <Button 
          variant="pinkPill" 
          size="md" 
          onClick={openAddModal}
          className="group shadow-lg shadow-brand-pink/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
          <span>Ajouter un client</span>
        </Button>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200/70 dark:border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase font-outfit">Total Clients</p>
              <p className="text-2xl font-bold font-outfit text-slate-800 dark:text-slate-100 mt-0.5">{clients.length}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-brand-pink">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/70 dark:border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase font-outfit">Entreprises Actives</p>
              <p className="text-2xl font-bold font-outfit text-indigo-600 dark:text-indigo-400 mt-0.5">{new Set(clients.map(c => c.companyName)).size}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Building className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/70 dark:border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase font-outfit">Factures Émises</p>
              <p className="text-2xl font-bold font-outfit text-emerald-600 dark:text-emerald-400 mt-0.5">{invoices.length}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search Bar */}
      <motion.div variants={itemVariants} className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, entreprise, email, téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Clients Cards Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => {
          const totalInvoiced = getClientInvoicedTotal(client.id);
          const invoiceCount = getClientInvoiceCount(client.id);
          const initials = client.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

          return (
            <motion.div
              key={client.id}
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 450, damping: 20 }}
              className="touch-manipulation"
            >
              <Card className="h-full border-slate-200/80 dark:border-slate-800 hover:border-brand-pink/40 hover:shadow-xl hover:shadow-slate-200/80 dark:hover:shadow-black/50 transition-shadow duration-300 flex flex-col justify-between">
                <CardContent className="p-5 space-y-4">
                  {/* Top info with avatar */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-navy to-slate-800 text-white font-outfit font-bold text-sm flex items-center justify-center shadow-md shadow-brand-navy/10 border border-slate-700">
                        {initials}
                      </div>
                      <div>
                        <h3 className="font-outfit font-bold text-base text-slate-800 dark:text-slate-100 tracking-tight">
                          {client.name}
                        </h3>
                        <p className="text-xs font-semibold text-brand-pink">
                          {client.companyName}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => openEditModal(client)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors cursor-pointer"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setClientToDelete(client)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Contact details */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{client.address}</span>
                    </div>
                    {client.ncc && (
                      <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                        <span>NCC : <strong className="text-slate-600 dark:text-slate-300">{client.ncc}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Billing stats pill */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold block font-outfit">Total facturé</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100 font-outfit text-sm">{formatFCFA(totalInvoiced)}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/70 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 text-[11px] shadow-2xs">
                      {invoiceCount} factures
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Add / Edit Client Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-pink-50 dark:bg-pink-950/40 text-brand-pink rounded-xl">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-outfit font-bold text-slate-800 dark:text-slate-100">
                      {editingClient ? 'Modifier le client' : 'Ajouter un nouveau client'}
                    </h3>
                    <p className="text-xs text-slate-400">Coordonnées et informations de facturation</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Nom du contact <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Jean Kouassi"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Nom de l’entreprise <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Orange CI, Wave SA..."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      placeholder="contact@entreprise.ci"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Numéro de téléphone
                    </label>
                    <input
                      type="text"
                      placeholder="+225 07 00 00 00 00"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Adresse physique / Ville
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Plateau, Rue du Commerce, Abidjan"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Numéro de Compte Contribuable (NCC)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 1904582 X"
                    value={ncc}
                    onChange={(e) => setNcc(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="pinkPill"
                    size="sm"
                    className="px-5 shadow-md shadow-brand-pink/25"
                  >
                    {editingClient ? 'Mettre à jour' : 'Enregistrer le client'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {clientToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-600">
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-outfit font-bold text-slate-800 dark:text-slate-100">Supprimer le client</h3>
                  <p className="text-xs text-slate-400">Cette action supprimera le contact de l’annuaire.</p>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300">
                Êtes-vous sûr de vouloir supprimer le client <strong className="text-slate-800 dark:text-white font-semibold">{clientToDelete.name}</strong> ({clientToDelete.companyName}) ?
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setClientToDelete(null)}
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
