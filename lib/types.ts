export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  companyName: string;
  ncc?: string; // Numéro de Compte Contribuable (SMEs in Africa)
  createdAt: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number; // 2 decimal precision
  unitPrice: number; // Integer FCFA
  totalPrice: number; // Integer FCFA
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. FAC-2026-0001
  client: Client;
  date: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number; // Integer FCFA
  tvaRate: number; // e.g. 18 (percent)
  tvaAmount: number; // Integer FCFA
  total: number; // Integer FCFA
  lineItems: LineItem[];
  companyId: string;
  createdAt: string;
}

export interface Quote {
  id: string;
  quoteNumber: string; // e.g. DEV-2026-0001
  client: Client;
  date: string; // YYYY-MM-DD
  validityDate: string; // YYYY-MM-DD
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  subtotal: number; // Integer FCFA
  tvaRate: number; // e.g. 18 (percent)
  tvaAmount: number; // Integer FCFA
  total: number; // Integer FCFA
  lineItems: LineItem[];
  companyId: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  email: string;
  phone: string;
  address: string;
  ncc?: string; // Numéro de Compte Contribuable
  rc?: string; // Registre de Commerce
  bankInfo?: string;
  defaultTvaRate: number; // e.g. 18
  currency: 'FCFA' | 'XOF' | 'XAF';
}

export interface DashboardStats {
  totalInvoiced: number; // Sum of all invoices (except draft/cancelled)
  totalPaid: number; // Sum of paid invoices
  totalPending: number; // Sum of sent invoices
  totalOverdue: number; // Sum of overdue invoices
  activeQuotesCount: number; // Count of active quotes
  recentInvoices: Invoice[];
  recentQuotes: Quote[];
}
