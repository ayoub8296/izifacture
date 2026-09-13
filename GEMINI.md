# 🚀 GEMINI.md — Guide & Référentiel Technique : izi facture

> **Document de référence pour les agents IA et les développeurs.**
> Ce fichier résume l'architecture, les fonctionnalités implémentées, la structure du projet, les choix technologiques et les règles de conception d'**izi facture**.

---

## 📌 1. Vue d'Ensemble du Projet

**izi facture** est un logiciel SaaS moderne de facturation, devis et gestion financière spécialement conçu pour les entrepreneurs, indépendants et PME en **Afrique de l'Ouest et Centrale (zone OHADA / UEMOA / CEMAC)**.

### Problème résolu :
La plupart des logiciels de facturation occidentaux ne prennent pas en compte les réalités fiscales et commerciales africaines (montants en FCFA sans décimales, TVA à 18%, mentions légales NCC / RC, paiements Mobile Money, envoi WhatsApp). **izi facture** offre une interface ultra-rapide, élégante et parfaitement adaptée à ces besoins.

---

## 🛠️ 2. Stack Technologique & Dépendances

- **Framework** : [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Styling** : [Tailwind CSS v3.4](https://tailwindcss.com/) avec palette sur-mesure
- **Animations & Micro-interactions** : [Framer Motion v13](https://www.framer.com/motion/)
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Polices** : Google Fonts (`Inter` pour le corps du texte, `Outfit` pour les titres et montants)
- **Persistance des Données actuelle** : `localStorage` côté client avec hydratation automatique (`lib/mock-data/storage.ts`), prête pour une migration vers Supabase / PostgreSQL.

---

## 🎯 3. Fonctionnalités Implémentées

### A. 📊 Tableau de Bord (Dashboard) — `/`
- **Cartes d'indicateurs clés (StatCards)** :
  - Total Facturé (FCFA)
  - Total Encaissé (FCFA)
  - En attente de paiement (FCFA)
  - Factures en retard (FCFA)
  - Nombre de devis actifs
- **Graphique interactif d'évolution des revenus** (`RevenueChart.tsx`) avec comparatif mensuel et sélecteur de période.
- **Tableaux d'activités récentes** : Dernières factures et devis récents avec statut interactif.
- **Raccourcis d'actions rapides** : Création express de facture, devis ou client.

### B. 🧾 Gestion des Factures — `/facturation/factures`
- **Liste des factures** : Recherche en direct, filtrage par statut (`Toutes`, `Payée`, `Envoyée`, `En retard`, `Brouillon`), pagination et métriques récapitulatives.
- **Création de facture** (`/facturation/factures/nouvelle`) :
  - Génération automatique du numéro de facture (format `FAC-YYYY-0001`).
  - Sélection de client existant ou création rapide à la volée.
  - Lignes de facturation dynamiques avec calcul instantané : Quantité, Prix unitaire, Total ligne HT.
  - Calculs automatiques : Sous-total HT, TVA (18% paramétrable), Total TTC en FCFA.
  - Conditions de règlement et notes personnalisées.
- **Fiche détaillée & Document imprimable** (`/facturation/factures/[id]`) :
  - Modèle de facture conforme A4 professionnel avec logo, NCC, RC, coordonnées bancaires.
  - Changement de statut direct via menu déroulant (Payée, Envoyée, En retard, Brouillon).
  - Impression propre (`window.print()`) avec styles CSS dédiés (`@media print`).
  - Boutons de modification et de suppression sécurisée.
- **Modification de facture** (`/facturation/factures/[id]/modifier`) : Mise à jour complète de toute facture existante.

### C. 📑 Gestion des Devis — `/facturation/devis`
- **Liste des devis** : Recherche, filtres par statut (`Brouillon`, `Envoyé`, `Accepté`, `Refusé`, `Expiré`).
- **Création de devis** (`/facturation/devis/nouveau`) : Numérotation `DEV-YYYY-0001`, date de validité, lignes d'articles, TVA et conditions.
- **Fiche détaillée du devis** (`/facturation/devis/[id]`) : Vue document pro.
- **🔥 Conversion Devis ➔ Facture en 1 clic** : Génère automatiquement une nouvelle facture liée à partir du devis accepté.
- **Modification de devis** (`/facturation/devis/[id]/modifier`).

### D. 👥 Annuaire & Gestion des Clients — `/clients`
- Liste complète des clients avec recherche par nom, entreprise ou téléphone.
- Modal d'ajout de client : Nom, Email, Téléphone, Adresse, Raison sociale, **NCC (Numéro de Compte Contribuable)**.
- Indicateurs par client : Total facturé, nombre de factures émises.

### E. ⚙️ Paramètres de l'Entreprise — `/parametres`
- Configuration du profil émetteur :
  - Nom de l'entreprise & Logo
  - Coordonnées (Email, Téléphone, Adresse physique)
  - Identifiants légaux : **NCC** (Compte Contribuable) et **RC** (Registre de Commerce)
  - Coordonnées bancaires & RIB pour le règlement
  - Taux de TVA par défaut (ex: 18%)
  - Devise par défaut (`FCFA`, `XOF`, `XAF`)
- Sauvegarde instantanée dans le stockage local.

### F. ❓ Centre d'Aide & Support — `/aide`
- Base de connaissances, guide de démarrage, FAQ sur la conformité fiscale et coordonnées du support.

---

## 📁 4. Structure des Fichiers du Projet

```text
izi-facture-2/
├── app/
│   ├── (dashboard)/                     # Groupe de routes protégées (Dashboard)
│   │   ├── aide/
│   │   │   └── page.tsx                 # Centre d'aide et FAQ
│   │   ├── clients/
│   │   │   └── page.tsx                 # Annuaire & gestion des clients
│   │   ├── facturation/
│   │   │   ├── devis/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── modifier/
│   │   │   │   │   │   └── page.tsx     # Modification d'un devis
│   │   │   │   │   └── page.tsx         # Fiche & impression devis
│   │   │   │   ├── nouveau/
│   │   │   │   │   └── page.tsx         # Création d'un devis
│   │   │   │   └── page.tsx             # Liste des devis
│   │   │   └── factures/
│   │   │       ├── [id]/
│   │   │       │   ├── modifier/
│   │   │       │   │   └── page.tsx     # Modification d'une facture
│   │   │       │   └── page.tsx         # Fiche & impression facture
│   │   │       ├── nouvelle/
│   │   │       │   └── page.tsx         # Création d'une facture
│   │   │       └── page.tsx             # Liste des factures
│   │   ├── layout.tsx                   # Layout du dashboard (Sidebar + Topbar)
│   │   ├── page.tsx                     # Tableau de bord principal (Accueil)
│   │   └── parametres/
│   │       └── page.tsx                 # Paramètres de l'entreprise & TVA
│   ├── landing/                         # Emplacement pour la future Landing Page publique
│   ├── favicon.ico
│   ├── globals.css                      # Styles globaux & règles @media print
│   └── layout.tsx                       # Root Layout (Polices Inter & Outfit, StorageInitializer)
├── components/
│   ├── billing/
│   │   └── StatusBadge.tsx              # Badge de statut (Payée, Envoyée, etc.)
│   ├── dashboard/
│   │   ├── RevenueChart.tsx             # Graphique d'évolution du CA
│   │   └── StatCard.tsx                 # Carte KPI statistique
│   ├── landing/                         # Composants de la Landing Page
│   ├── layout/
│   │   ├── Sidebar.tsx                  # Barre de navigation latérale
│   │   └── Topbar.tsx                   # Barre supérieure (Profil, notifications, actions)
│   ├── ui/
│   │   ├── Badge.tsx                    # Composant Badge générique
│   │   ├── Button.tsx                   # Bouton universel (variants, sizes)
│   │   └── Card.tsx                     # Carte conteneur avec glassmorphism
│   └── StorageInitializer.tsx           # Initialise les seed data au 1er chargement
├── lib/
│   ├── calculations.ts                  # Calculs financiers (HT, TVA 18%, TTC)
│   ├── currency.ts                      # Formatage FCFA et dates en français
│   ├── mock-data/
│   │   ├── seed.ts                      # Données de démo réalistes (PME Abidjan/Dakar)
│   │   └── storage.ts                   # Helpers get/set localStorage
│   ├── services/
│   │   ├── clients.ts                   # CRUD clients
│   │   ├── companies.ts                 # Gestion profil entreprise
│   │   ├── dashboard.ts                 # Calcul des agrégats pour le dashboard
│   │   ├── invoices.ts                  # CRUD factures & génération N°
│   │   └── quotes.ts                    # CRUD devis & conversion en facture
│   └── types.ts                         # Interfaces TypeScript complètes
├── tailwind.config.ts                   # Configuration des couleurs de marque & polices
└── tsconfig.json                        # Configuration TypeScript
```

---

## 🎨 5. Charte Graphique & Design System

### Palette de Couleurs (`tailwind.config.ts`)
- **Brand Navy** (Autorité, Sérieux, Titres) :
  - Principal : `#0F172A` (`brand-navy` / `slate-900`)
  - Clair : `#1E293B`
  - Accent / Cyan : `#38BDF8`
- **Brand Pink / Rose Vif** (Énergie, Action, Identité IZI) :
  - Principal : `#EC4899` (`brand-pink`)
  - Dégradé CTA : `from-[#EC4899] to-[#E11D48]` (`brand-pink-gradientStart` / `gradientEnd`)
  - Fond doux : `#FDF2F8` (`brand-pink-light`)
- **Fonds & Cartes** :
  - Background général : `#F8FAFC` (`bg-slate-50`)
  - Cartes blanches : `#FFFFFF` avec bordure subtile `border-slate-200/80` et ombres douces `shadow-sm hover:shadow-md`.
- **Badges de Statuts** :
  - `Payée / Accepté` : Vert émeraude (`bg-emerald-50 text-emerald-700 border-emerald-200`)
  - `Envoyée` : Ambre / Jaune (`bg-amber-50 text-amber-700 border-amber-200`)
  - `En retard / Refusé` : Rouge rose (`bg-rose-50 text-rose-700 border-rose-200`)
  - `Brouillon` : Gris ardoise (`bg-slate-100 text-slate-700 border-slate-200`)

### Typographie
- **Titres & Montants** : `font-outfit` (`font-extrabold` ou `font-bold`)
- **Textes & Tableaux** : `font-sans` (`Inter`)

### Règle d'or pour les montants
- Toujours utiliser `formatFCFA(amount)` défini dans `lib/currency.ts`.
- Le FCFA s'affiche **sans décimales** avec des espaces comme séparateurs de milliers (ex: `1 500 000 FCFA`).

---

## 📋 6. Types TypeScript Principaux (`lib/types.ts`)

```typescript
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  companyName: string;
  ncc?: string; // Numéro de Compte Contribuable
  createdAt: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number; // Entier FCFA
  totalPrice: number; // Entier FCFA
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // ex: FAC-2026-0001
  client: Client;
  date: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  tvaRate: number; // ex: 18 (%)
  tvaAmount: number;
  total: number;
  lineItems: LineItem[];
  companyId: string;
  createdAt: string;
}

export interface Quote {
  id: string;
  quoteNumber: string; // ex: DEV-2026-0001
  client: Client;
  date: string;
  validityDate: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  subtotal: number;
  tvaRate: number;
  tvaAmount: number;
  total: number;
  lineItems: LineItem[];
  companyId: string;
  createdAt: string;
}
```

---

## 🤖 7. Instructions pour les Futurs Modèles IA / Développeurs

Lors de toute intervention sur cette base de code, vous **DEVEZ** respecter les règles suivantes :

1. **Cohérence du Design System** :
   - N'utilisez pas de couleurs brutes génériques (pas de rouge pur ou de bleu standard). Utilisez systématiquement `brand-pink`, `brand-navy`, ou la palette `slate-*`.
   - Appliquez toujours les composants réutilisables (`Card`, `Button`, `StatusBadge`).
2. **Gestion Monétaire FCFA** :
   - Ne jamais afficher de centimes ou de décimales pour les montants en FCFA.
   - Toujours importer `formatFCFA` depuis `@/lib/currency`.
3. **Architecture des Services** :
   - Ne modifiez pas directement le `localStorage` dans les composants UI.
   - Passez systématiquement par les fonctions dédiées dans `lib/services/invoices.ts`, `quotes.ts`, `clients.ts`, etc.
   - Lorsque le backend sera migré vers Supabase, seules les fonctions de `lib/services/` devront être adaptées sans casser les composants d'affichage.
4. **Impression & PDF** :
   - Préservez toujours les classes CSS `.no-print` pour masquer les boutons d'action lors de l'impression de factures ou devis.
5. **Formulaires** :
   - Les formulaires de factures et devis doivent toujours recalculer le Sous-total HT, le montant TVA et le Net à payer TTC en temps réel via `@/lib/calculations`.

---

## 🛣️ 8. Prochaines Étapes de Développement (Roadmap)

1. **Landing Page Publique** (`/landing`) : Page d'accueil marketing avec Hero, Démo, Témoignages, Tarifs FCFA et CTA.
2. **Export PDF Natif & Partage WhatsApp** : Téléchargement PDF 1-clic et envoi de message WhatsApp formaté via l'API `wa.me`.
3. **Authentification & Multi-tenant (Supabase Auth / NextAuth)** : Inscription, connexion et cloisonnement des données par entreprise.
4. **Base de Données Cloud (Supabase PostgreSQL)** : Remplacement de `localStorage` par une persistance SQL temps réel.
5. **Paiement Mobile Money & QR Code** : Intégration Wave, Orange Money, MTN Moov, CinetPay.
