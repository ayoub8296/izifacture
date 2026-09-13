import { Client, Invoice, Quote, Company } from '../types';

export const mockCompany: Company = {
  id: 'comp-1111-2222',
  name: 'Assess Manager Africa',
  email: 'contact@assessmanager-africa.com',
  phone: '+225 07 45 89 12 34',
  address: 'Boulevard de Marseille, Zone 4, Abidjan, Côte d\'Ivoire',
  ncc: 'NCC-2309485A',
  rc: 'RC-ABJ-2024-B-1294',
  bankInfo: 'Société Générale Côte d\'Ivoire • IBAN CI93 01234 56789 01234567890 12',
  defaultTvaRate: 18, // Standard WAEMU TVA rate
  currency: 'FCFA'
};

export const mockClients: Client[] = [
  {
    id: 'cli-001',
    name: 'Ronald Richards',
    companyName: 'Richards Global Services',
    email: 'ronald.richards@richards.ci',
    phone: '+225 05 66 77 88 99',
    address: 'Cocody Riviera 3, Abidjan',
    ncc: 'NCC-1029384B',
    createdAt: '2026-08-10'
  },
  {
    id: 'cli-002',
    name: 'Eleanor Pena',
    companyName: 'Pena Agro-Industries',
    email: 'eleanor.pena@pena.sn',
    phone: '+221 77 123 45 67',
    address: 'Mermoz, Dakar, Sénégal',
    ncc: 'NCC-5748392C',
    createdAt: '2026-08-12'
  },
  {
    id: 'cli-003',
    name: 'Antoine Richards',
    companyName: 'Orange Côte d\'Ivoire',
    email: 'antoine.richards@orange.ci',
    phone: '+225 07 88 99 00 11',
    address: 'Plateau, Immeuble Orange, Abidjan',
    ncc: 'NCC-9988776D',
    createdAt: '2026-08-14'
  },
  {
    id: 'cli-004',
    name: 'Fabrice Delalongchamp',
    companyName: 'BICIEC',
    email: 'f.delalongchamp@biciec.ci',
    phone: '+225 01 22 33 44 55',
    address: 'Plateau, Avenue Noguès, Abidjan',
    ncc: 'NCC-3344556E',
    createdAt: '2026-08-15'
  },
  {
    id: 'cli-005',
    name: 'Mamadou Diallo',
    companyName: 'Sahel Telecom',
    email: 'm.diallo@saheltelecom.ml',
    phone: '+223 66 77 88 99',
    address: 'ACI 2000, Bamako, Mali',
    ncc: 'NCC-8877665F',
    createdAt: '2026-08-18'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-1910-86',
    invoiceNumber: 'FAC-2026-0001',
    client: mockClients[0],
    date: '2026-08-20',
    dueDate: '2026-09-20',
    status: 'paid',
    subtotal: 1000000,
    tvaRate: 18,
    tvaAmount: 180000,
    total: 1180000,
    lineItems: [
      { id: 'li-1', description: 'Consulting en recrutement de cadres', quantity: 1, unitPrice: 1000000, totalPrice: 1000000 }
    ],
    companyId: mockCompany.id,
    createdAt: '2026-08-20'
  },
  {
    id: 'inv-1910-87',
    invoiceNumber: 'FAC-2026-0002',
    client: mockClients[1],
    date: '2026-08-22',
    dueDate: '2026-09-22',
    status: 'sent',
    subtotal: 2500000,
    tvaRate: 18,
    tvaAmount: 450000,
    total: 2950000,
    lineItems: [
      { id: 'li-2', description: 'Accompagnement RH digitalisé - Pack Blue', quantity: 1, unitPrice: 2500000, totalPrice: 2500000 }
    ],
    companyId: mockCompany.id,
    createdAt: '2026-08-22'
  },
  {
    id: 'inv-1910-88',
    invoiceNumber: 'FAC-2026-0003',
    client: mockClients[2],
    date: '2026-08-24',
    dueDate: '2026-09-24',
    status: 'paid',
    subtotal: 800000,
    tvaRate: 18,
    tvaAmount: 144000,
    total: 944000,
    lineItems: [
      { id: 'li-3', description: 'Formation Assess Manager - Pack Orange', quantity: 2, unitPrice: 400000, totalPrice: 800000 }
    ],
    companyId: mockCompany.id,
    createdAt: '2026-08-24'
  },
  {
    id: 'inv-1910-89',
    invoiceNumber: 'FAC-2026-0004',
    client: mockClients[3],
    date: '2026-08-25',
    dueDate: '2026-09-25',
    status: 'paid',
    subtotal: 1200000,
    tvaRate: 18,
    tvaAmount: 216000,
    total: 1416000,
    lineItems: [
      { id: 'li-4', description: 'Licences logicielles de recrutement', quantity: 12, unitPrice: 100000, totalPrice: 1200000 }
    ],
    companyId: mockCompany.id,
    createdAt: '2026-08-25'
  },
  {
    id: 'inv-1910-90',
    invoiceNumber: 'FAC-2026-0005',
    client: mockClients[1],
    date: '2026-08-26',
    dueDate: '2026-09-26',
    status: 'cancelled',
    subtotal: 300000,
    tvaRate: 18,
    tvaAmount: 54000,
    total: 354000,
    lineItems: [
      { id: 'li-5', description: 'Frais de déploiement et configuration', quantity: 1, unitPrice: 300000, totalPrice: 300000 }
    ],
    companyId: mockCompany.id,
    createdAt: '2026-08-26'
  },
  {
    id: 'inv-1910-91',
    invoiceNumber: 'FAC-2026-0006',
    client: mockClients[4],
    date: '2026-08-10',
    dueDate: '2026-08-20',
    status: 'overdue',
    subtotal: 1500000,
    tvaRate: 18,
    tvaAmount: 270000,
    total: 1770000,
    lineItems: [
      { id: 'li-6', description: 'Audit organisationnel & Processus RH', quantity: 1, unitPrice: 1500000, totalPrice: 1500000 }
    ],
    companyId: mockCompany.id,
    createdAt: '2026-08-10'
  },
  {
    id: 'inv-1910-92',
    invoiceNumber: 'FAC-2026-0007',
    client: mockClients[0],
    date: '2026-08-28',
    dueDate: '2026-09-28',
    status: 'draft',
    subtotal: 450000,
    tvaRate: 18,
    tvaAmount: 81000,
    total: 531000,
    lineItems: [
      { id: 'li-7', description: 'Abonnement mensuel Plateforme - 15 utilisateurs', quantity: 15, unitPrice: 30000, totalPrice: 450000 }
    ],
    companyId: mockCompany.id,
    createdAt: '2026-08-28'
  }
];

export const mockQuotes: Quote[] = [
  {
    id: 'dev-2026-0001',
    quoteNumber: 'DEV-2026-0001',
    client: mockClients[0],
    date: '2026-08-15',
    validityDate: '2026-09-15',
    status: 'accepted',
    subtotal: 1500000,
    tvaRate: 18,
    tvaAmount: 270000,
    total: 1770000,
    lineItems: [
      { id: 'q-li-1', description: 'Pack Audit & Stratégie Recrutement', quantity: 1, unitPrice: 1500000, totalPrice: 1500000 }
    ],
    companyId: mockCompany.id,
    createdAt: '2026-08-15'
  },
  {
    id: 'dev-2026-0002',
    quoteNumber: 'DEV-2026-0002',
    client: mockClients[2],
    date: '2026-08-22',
    validityDate: '2026-09-22',
    status: 'sent',
    subtotal: 3500000,
    tvaRate: 18,
    tvaAmount: 630000,
    total: 4130000,
    lineItems: [
      { id: 'q-li-2', description: 'Mise en place SIRH complet + Formation', quantity: 1, unitPrice: 3500000, totalPrice: 3500000 }
    ],
    companyId: mockCompany.id,
    createdAt: '2026-08-22'
  },
  {
    id: 'dev-2026-0003',
    quoteNumber: 'DEV-2026-0003',
    client: mockClients[3],
    date: '2026-08-23',
    validityDate: '2026-09-23',
    status: 'draft',
    subtotal: 1200000,
    tvaRate: 18,
    tvaAmount: 216000,
    total: 1416000,
    lineItems: [
      { id: 'q-li-3', description: 'Campagne de marque employeur digitale', quantity: 1, unitPrice: 1200000, totalPrice: 1200000 }
    ],
    companyId: mockCompany.id,
    createdAt: '2026-08-23'
  },
  {
    id: 'dev-2026-0004',
    quoteNumber: 'DEV-2026-0004',
    client: mockClients[4],
    date: '2026-08-01',
    validityDate: '2026-08-31',
    status: 'expired',
    subtotal: 900000,
    tvaRate: 18,
    tvaAmount: 162000,
    total: 1062000,
    lineItems: [
      { id: 'q-li-4', description: 'Recherche Profil Senior Fullstack Dev', quantity: 1, unitPrice: 900000, totalPrice: 900000 }
    ],
    companyId: mockCompany.id,
    createdAt: '2026-08-01'
  }
];
