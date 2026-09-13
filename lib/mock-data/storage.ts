import { Client, Invoice, Quote, Company, DashboardStats } from '../types';
import { mockCompany, mockClients, mockInvoices, mockQuotes } from './seed';

const IS_SERVER = typeof window === 'undefined';

// Simple key names for localStorage
const KEYS = {
  COMPANY: 'izi_facture_company',
  CLIENTS: 'izi_facture_clients',
  INVOICES: 'izi_facture_invoices',
  QUOTES: 'izi_facture_quotes',
};

// Standard safe getter/setter
function getItem<T>(key: string, defaultValue: T): T {
  if (IS_SERVER) return defaultValue;
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (IS_SERVER) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

// Initial seed function
export function initializeStorage() {
  if (IS_SERVER) return;
  if (!localStorage.getItem(KEYS.COMPANY)) {
    localStorage.setItem(KEYS.COMPANY, JSON.stringify(mockCompany));
  }
  if (!localStorage.getItem(KEYS.CLIENTS)) {
    localStorage.setItem(KEYS.CLIENTS, JSON.stringify(mockClients));
  }
  if (!localStorage.getItem(KEYS.INVOICES)) {
    localStorage.setItem(KEYS.INVOICES, JSON.stringify(mockInvoices));
  }
  if (!localStorage.getItem(KEYS.QUOTES)) {
    localStorage.setItem(KEYS.QUOTES, JSON.stringify(mockQuotes));
  }
}

// Company API
export function getStoredCompany(): Company {
  return getItem<Company>(KEYS.COMPANY, mockCompany);
}

export function saveStoredCompany(company: Company): void {
  setItem(KEYS.COMPANY, company);
}

// Clients API
export function getStoredClients(): Client[] {
  return getItem<Client[]>(KEYS.CLIENTS, mockClients);
}

export function saveStoredClients(clients: Client[]): void {
  setItem(KEYS.CLIENTS, clients);
}

// Invoices API
export function getStoredInvoices(): Invoice[] {
  return getItem<Invoice[]>(KEYS.INVOICES, mockInvoices);
}

export function saveStoredInvoices(invoices: Invoice[]): void {
  setItem(KEYS.INVOICES, invoices);
}

// Quotes API
export function getStoredQuotes(): Quote[] {
  return getItem<Quote[]>(KEYS.QUOTES, mockQuotes);
}

export function saveStoredQuotes(quotes: Quote[]): void {
  setItem(KEYS.QUOTES, quotes);
}

// Dashboard statistics aggregator
export function getStoredDashboardStats(): DashboardStats {
  const invoices = getStoredInvoices();
  const quotes = getStoredQuotes();
  
  // Exclude draft/cancelled from total invoiced
  const totalInvoiced = invoices
    .filter(inv => inv.status !== 'draft' && inv.status !== 'cancelled')
    .reduce((sum, inv) => sum + inv.total, 0);
    
  const totalPaid = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
    
  const totalPending = invoices
    .filter(inv => inv.status === 'sent')
    .reduce((sum, inv) => sum + inv.total, 0);
    
  const totalOverdue = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total, 0);
    
  const activeQuotesCount = quotes
    .filter(q => q.status === 'sent')
    .reduce((sum) => sum + 1, 0);

  return {
    totalInvoiced,
    totalPaid,
    totalPending,
    totalOverdue,
    activeQuotesCount,
    recentInvoices: [...invoices].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    recentQuotes: [...quotes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
  };
}
