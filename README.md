# 🧾 izi facture

> **Logiciel SaaS moderne de facturation, devis et gestion financière pour entrepreneurs, indépendants et PME en Afrique de l'Ouest et Centrale (zone OHADA / UEMOA / CEMAC).**

---

## ✨ Points Forts & Fonctionnalités

- 💰 **Adapté aux devises locales** : Prise en charge native du **FCFA (XOF / XAF)** sans décimales avec formatage conforme.
- 🏛️ **Conformité Fiscale & Légale** : Mentions légales obligatoires (**NCC - Numéro de Compte Contribuable**, **RC - Registre du Commerce**), TVA paramétrable (18%).
- ⚡ **Gestion des Factures & Devis** :
  - Création ultra-rapide avec calcul automatique HT / TVA / TTC.
  - Numérotation intelligente séquentielle (`FAC-2026-0001`, `DEV-2026-0001`).
  - Conversion de Devis en Facture en **1 clic**.
  - Impression A4 professionnelle et modèle prêt à l'export.
- 👥 **Annuaire Clients** : Gestion complète des contacts, historique des facturations et coordonnées fiscales.
- 📊 **Tableau de Bord Financier** : Indicateurs clés de performance (Total facturé, Total encaissé, En attente, En retard) et graphique interactif d'évolution du CA.
- ⚙️ **Paramétrage Entreprise** : Personnalisation du logo, informations légales, RIB bancaire et devise.

---

## 🛠️ Stack Technologique

- **Framework** : [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/) avec design system sur-mesure
- **Animations** : [Framer Motion](https://www.framer.com/motion/)
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Typographie** : Inter & Outfit (Google Fonts)
- **Backend / Persistance** : Client-side hydraté & intégration prête pour Supabase

---

## 🚀 Démarrage Rapide

### Prérequis

- [Node.js](https://nodejs.org/) (v18.17 ou supérieur)
- `npm` ou `yarn` / `pnpm`

### Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/<votre-nom-utilisateur>/izi-facture.git
cd izi-facture
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer le serveur de développement :
```bash
npm run dev
```

4. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 📁 Structure du Projet

```text
├── app/                  # Routes Next.js App Router (Dashboard, Factures, Devis, Clients, Paramètres)
├── components/           # Composants UI réutilisables (Cartes, Tableaux, Sidebar, Topbar)
├── lib/                  # Logique métier, calculs financiers, stockage et services
│   ├── calculations.ts   # Calculs HT, TVA 18%, TTC
│   ├── currency.ts       # Formatage FCFA & dates
│   └── services/         # CRUD Factures, Devis, Clients, Entreprise
└── tailwind.config.ts    # Palette de marque & tokens de style
```

---

## 📄 Licence

Ce projet est sous licence propriétaire. Tous droits réservés.
