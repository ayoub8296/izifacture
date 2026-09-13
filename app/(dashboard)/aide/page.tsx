'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Send, 
  ChevronDown, 
  ExternalLink, 
  ShieldCheck, 
  FileText, 
  Receipt, 
  Users, 
  Sparkles, 
  LifeBuoy, 
  ArrowRight, 
  Check,
  Building2,
  Zap
} from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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

interface FAQItem {
  id: string;
  category: 'facturation' | 'devis' | 'clients' | 'fiscalite' | 'general';
  question: string;
  answer: string;
  tags: string[];
}

const FAQ_LIST: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'facturation',
    question: 'Comment créer et numéroter une facture conforme ?',
    answer: 'Pour créer une facture, cliquez sur le bouton "+ Nouvelle Facture" dans le menu ou la barre supérieure. Le numéro de facture est généré automatiquement selon le format standard (ex: FAC-2026-0001). Renseignez le client, ajoutez vos lignes de prestations ou produits avec les prix unitaires en FCFA, puis validez. Vous pourrez ensuite l\'imprimer ou la télécharger directement.',
    tags: ['créer', 'numérotation', 'nouvelle', 'facture', 'format']
  },
  {
    id: 'faq-2',
    category: 'devis',
    question: 'Comment convertir un devis accepté en facture en 1 clic ?',
    answer: 'Rendez-vous dans "Facturation > Devis", ouvrez le devis concerné (ayant le statut Accepté ou Envoyé), et cliquez sur le bouton "Convertir en Facture" situé en haut à droite. Izi Facture génère instantanément une nouvelle facture pré-remplie avec tous les éléments du devis (client, prestations, montants et TVA).',
    tags: ['devis', 'convertir', 'transformation', 'accepté', '1 clic']
  },
  {
    id: 'faq-3',
    category: 'fiscalite',
    question: 'Comment fonctionne la TVA (18%) et les mentions fiscales (NCC / RC) ?',
    answer: 'Izi Facture applique par défaut le taux normal de TVA de 18% en vigueur dans la zone UEMOA (Côte d\'Ivoire, Sénégal, etc.). Vous pouvez personnaliser ce taux ou appliquer 0% (ex: exportations ou régime non assujetti) dans les Paramètres de l\'application ou directement lors de la création d\'une facture. Pensez également à renseigner votre NCC (Numéro de Compte Contribuable) et RC (Registre de Commerce) dans Paramètres.',
    tags: ['tva', '18%', 'ncc', 'rc', 'fiscalité', 'impôts', 'exonération']
  },
  {
    id: 'faq-4',
    category: 'facturation',
    question: 'Comment imprimer ou exporter ma facture en format PDF ?',
    answer: 'Depuis la page de détails d\'une facture ou d\'un devis, cliquez sur le bouton "Imprimer". La mise en page est optimisée pour l\'impression et vous permet également de choisir "Enregistrer au format PDF" dans la boîte de dialogue de votre navigateur pour obtenir un document haute résolution propre et prêt à envoyer.',
    tags: ['pdf', 'impression', 'imprimer', 'télécharger', 'export']
  },
  {
    id: 'faq-5',
    category: 'general',
    question: 'Comment ajouter les coordonnées de paiement Mobile Money (Wave, Orange Money) ?',
    answer: 'Rendez-vous dans la section "Paramètres". Dans le champ "Coordonnées bancaires & Mobile Money", ajoutez vos numéros de compte Mobile Money (ex: Wave : +225 07..., Orange Money : +225 07...). Ces coordonnées apparaîtront automatiquement au bas de toutes vos factures pour faciliter le règlement de vos clients.',
    tags: ['mobile money', 'wave', 'orange money', 'mtn', 'paiement', 'virement']
  },
  {
    id: 'faq-6',
    category: 'clients',
    question: 'Puis-je créer un nouveau client directement lors de la saisie d\'une facture ?',
    answer: 'Oui ! Sur le formulaire de création de facture ou de devis, cliquez sur "Nouveau client" à côté du sélecteur. Une fenêtre modale vous permet d\'enregistrer le client sans quitter votre saisie. Le client sera automatiquement sélectionné et sauvegardé dans votre annuaire.',
    tags: ['client', 'annuaire', 'ajouter', 'nouveau', 'rapide']
  },
  {
    id: 'faq-7',
    category: 'general',
    question: 'Mes données sont-elles conservées si je ferme mon navigateur ?',
    answer: 'Oui, toutes vos données (clients, factures, devis et coordonnées d\'entreprise) sont automatiquement enregistrées et persistées en local sur votre poste de travail via le stockage sécurisé de votre navigateur.',
    tags: ['données', 'sauvegarde', 'sécurité', 'stockage', 'persistance']
  },
  {
    id: 'faq-8',
    category: 'facturation',
    question: 'Comment gérer les relances pour les factures impayées ou en retard ?',
    answer: 'Dans la liste des factures, un filtre "En retard" vous permet d\'isoler en un clin d\'œil les factures dont la date d\'échéance est dépassée. Le statut s\'actualise automatiquement et vous pouvez changer le statut en "Payée" dès réception du règlement.',
    tags: ['relance', 'impayé', 'retard', 'échéance', 'statut']
  }
];

const GUIDES = [
  {
    icon: Building2,
    title: '1. Paramétrer votre entreprise',
    desc: 'Configurez votre raison sociale, logo, NCC, RC et coordonnées Mobile Money.',
    link: '/parametres',
    actionText: 'Accéder aux paramètres'
  },
  {
    icon: Users,
    title: '2. Créer votre fichier clients',
    desc: 'Ajoutez vos clients professionnels et particuliers avec leurs coordonnées complètes.',
    link: '/clients',
    actionText: 'Gérer les clients'
  },
  {
    icon: FileText,
    title: '3. Rédiger un devis clair',
    desc: 'Établissez des devis détaillés et convertissez-les en factures dès accord du client.',
    link: '/facturation/devis/nouveau',
    actionText: 'Créer un devis'
  },
  {
    icon: Receipt,
    title: '4. Émettre et encaisser',
    desc: 'Générez des factures professionnelles et suivez les règlements en temps réel.',
    link: '/facturation/factures/nouvelle',
    actionText: 'Créer une facture'
  }
];

export default function HelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('tous');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCategory, setFormCategory] = useState('facturation');
  const [formUrgency, setFormUrgency] = useState('normal');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{ id: string; date: string } | null>(null);

  // Filter FAQ items based on search query and category
  const filteredFaqs = useMemo(() => {
    return FAQ_LIST.filter((item) => {
      const matchesCategory = activeCategory === 'tous' || item.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesSearch = 
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => prev === id ? null : id);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMessage.trim() || !formEmail.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const ticketId = 'TICK-' + Math.floor(1000 + Math.random() * 9000);
      setSubmittedTicket({
        id: ticketId,
        date: new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      });
      setIsSubmitting(false);
      setFormMessage('');
    }, 800);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-10 pb-16"
    >
      {/* 1. Hero Search Section */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy via-slate-900 to-slate-950 p-8 sm:p-12 text-white shadow-xl border border-slate-800">
          {/* Background subtle glowing radial lights */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-brand-pink/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-brand-pink font-outfit shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-pink" />
              <span>Centre d&apos;Assistance &amp; Documentation Izi Facture</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-outfit tracking-tight text-white">
              Comment pouvons-nous vous <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent">aider ?</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-medium max-w-xl mx-auto">
              Retrouvez nos guides pratiques, réponses aux questions fréquentes ou contactez notre équipe support basée à Abidjan.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto pt-2">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Rechercher une question, TVA, facture, devis, Mobile Money..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm sm:text-base font-medium shadow-2xl focus:outline-none focus:ring-4 focus:ring-brand-pink/40 border border-slate-200 dark:border-slate-700 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md cursor-pointer"
                  >
                    Effacer
                  </button>
                )}
              </div>

              {/* Quick tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
                <span className="text-slate-400 font-medium">Suggestions :</span>
                {[
                  'Créer facture', 
                  'Devis en facture', 
                  'TVA 18% & NCC', 
                  'Mobile Money', 
                  'Export PDF'
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-brand-pink/20 hover:text-white text-slate-300 transition-colors border border-white/10 touch-manipulation cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Direct Support Channels (WhatsApp, Téléphone, Email) */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-outfit text-slate-900 dark:text-slate-100 tracking-tight">
              Canaux de support direct
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Une question urgente ? Notre équipe est à votre disposition.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Support actif &amp; disponible
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* WhatsApp Card */}
          <Card className="p-6 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                7j/7 direct
              </span>
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base font-outfit">Assistance WhatsApp</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Échangez en direct avec un conseiller pour une aide rapide sur vos factures.
              </p>
            </div>
            <div className="mt-6">
              <a
                href="https://wa.me/2250700000000?text=Bonjour%20Izi%20Facture,%20j'ai%20besoin%20d'aide%20sur%20l'application"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
              >
                <span>Discuter sur WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>

          {/* Email Support Card */}
          <Card className="p-6 border-slate-200/80 dark:border-slate-800 hover:border-brand-pink/40 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-brand-pink/10 text-brand-pink flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-brand-pink bg-pink-50 dark:bg-pink-950/40 px-2.5 py-0.5 rounded-full">
                Délai &lt; 2h
              </span>
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base font-outfit">Support par Email</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pour vos demandes comptables spécifiques, personnalisations et requêtes techniques.
              </p>
            </div>
            <div className="mt-6">
              <a
                href="mailto:support@izifacture.com?subject=Demande%20d'assistance%20Izi%20Facture"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-md"
              >
                <span>support@izifacture.com</span>
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>

          {/* Phone Call Card */}
          <Card className="p-6 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-full">
                Lun - Ven (8h-18h)
              </span>
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base font-outfit">Ligne Téléphonique</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Contactez notre permanence téléphonique pour un échange vocal direct.
              </p>
            </div>
            <div className="mt-6">
              <a
                href="tel:+2250700000000"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
              >
                <span>+225 07 00 00 00 00</span>
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* 3. Guide de démarrage rapide */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div>
          <h2 className="text-xl font-bold font-outfit text-slate-900 dark:text-slate-100 tracking-tight">
            Guide de prise en main en 4 étapes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Maîtrisez Izi Facture pas à pas pour booster votre productivité.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GUIDES.map((guide, idx) => (
            <Card 
              key={idx} 
              className="p-5 flex flex-col justify-between border-slate-200/80 dark:border-slate-800 hover:shadow-md hover:border-brand-pink/30 transition-all duration-200 group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-brand-pink group-hover:text-white transition-colors flex items-center justify-center font-bold">
                  <guide.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-outfit text-slate-900 dark:text-slate-100 group-hover:text-brand-pink transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {guide.desc}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link 
                  href={guide.link}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-pink hover:text-brand-pink-dark transition-colors"
                >
                  <span>{guide.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* 4. FAQ Section & Contact Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Interactive FAQ (7 cols) */}
        <motion.div variants={itemVariants} className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-outfit text-slate-900 dark:text-slate-100 tracking-tight">
                  Foire Aux Questions (FAQ)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {filteredFaqs.length} réponse{filteredFaqs.length > 1 ? 's' : ''} disponible{filteredFaqs.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5 mt-4 p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700">
              {[
                { id: 'tous', label: 'Toutes' },
                { id: 'facturation', label: 'Factures' },
                { id: 'devis', label: 'Devis' },
                { id: 'clients', label: 'Clients' },
                { id: 'fiscalite', label: 'Fiscalité & TVA' },
                { id: 'general', label: 'Paiements & Général' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all touch-manipulation cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion FAQ list */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <Card className="p-8 text-center bg-slate-50/50 dark:bg-slate-900/50 border-dashed border-slate-200 dark:border-slate-800">
                <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Aucun résultat trouvé pour votre recherche.</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Essayez un autre mot-clé ou envoyez-nous un message ci-contre.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('tous');
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </Card>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <Card 
                    key={faq.id} 
                    className={`overflow-hidden border transition-all duration-200 ${
                      isOpen 
                        ? 'border-brand-pink/40 shadow-sm bg-white dark:bg-slate-900' 
                        : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 select-none touch-manipulation cursor-pointer"
                    >
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100 font-outfit">
                        {faq.question}
                      </span>
                      <div className={`p-1 rounded-lg text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-pink bg-pink-50 dark:bg-pink-950/40' : 'bg-slate-100 dark:bg-slate-800'}`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                            <p>{faq.answer}</p>
                            <div className="flex flex-wrap gap-1.5 mt-3 pt-2">
                              {faq.tags.map(tag => (
                                <span key={tag} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md font-medium">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Right column: Interactive Ticket / Contact Form (5 cols) */}
        <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
          <Card className="p-6 sm:p-7 border-slate-200/90 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900 relative overflow-hidden">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-brand-pink/10 text-brand-pink flex items-center justify-center font-bold">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-outfit text-slate-900 dark:text-slate-100">
                  Ouvrir un ticket d&apos;assistance
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Envoyez votre message directement à notre équipe technique.
                </p>
              </div>
            </div>

            {submittedTicket ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-md">
                  <Check className="w-7 h-7 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold font-outfit text-slate-900 dark:text-slate-100">Ticket envoyé avec succès !</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Référence : <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{submittedTicket.id}</span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                    Nous avons bien reçu votre demande le {submittedTicket.date}. Un conseiller vous répondra par email dans les plus brefs délais.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSubmittedTicket(null)}
                  className="mt-4"
                >
                  Envoyer une autre demande
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="mt-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Votre Nom &amp; Prénoms</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Kouassi Jean"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Adresse Email de contact</label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: contact@entreprise.ci"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Catégorie</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/90 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all"
                    >
                      <option value="facturation" className="dark:bg-slate-900 dark:text-slate-100">Facturation &amp; Devis</option>
                      <option value="clients" className="dark:bg-slate-900 dark:text-slate-100">Gestion Clients</option>
                      <option value="technique" className="dark:bg-slate-900 dark:text-slate-100">Bug / Technique</option>
                      <option value="suggestion" className="dark:bg-slate-900 dark:text-slate-100">Idée d&apos;amélioration</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Niveau d&apos;urgence</label>
                    <select
                      value={formUrgency}
                      onChange={(e) => setFormUrgency(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/90 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all"
                    >
                      <option value="normal" className="dark:bg-slate-900 dark:text-slate-100">Normal</option>
                      <option value="urgent" className="dark:bg-slate-900 dark:text-slate-100">Urgent</option>
                      <option value="critique" className="dark:bg-slate-900 dark:text-slate-100">Critique (Bloquant)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description détaillée de votre besoin</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Expliquez-nous votre problème ou posez votre question..."
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="pinkPill"
                  size="md"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 text-xs shadow-md shadow-brand-pink/25"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmettre ma demande d&apos;aide</span>
                    </>
                  )}
                </Button>
              </form>
            )}
          </Card>

          {/* System status box */}
          <Card className="p-5 bg-slate-900 dark:bg-slate-950 text-white border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold font-outfit uppercase tracking-wider text-emerald-400">
                  Système 100% Opérationnel
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">v1.2.0 • Pro</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800/80 text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Moteur TVA UEMOA 18%</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Calculs instantanés FCFA</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
