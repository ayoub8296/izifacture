import { DashboardStats } from '../types';
import { listInvoices } from './invoices';
import { listQuotes } from './quotes';

export async function getDashboardStats(): Promise<DashboardStats> {
  const [invoices, quotes] = await Promise.all([
    listInvoices(),
    listQuotes(),
  ]);

  let totalInvoiced = 0;
  let totalPaid = 0;
  let totalPending = 0;
  let totalOverdue = 0;

  for (const inv of invoices) {
    if (inv.status !== 'draft' && inv.status !== 'cancelled') {
      totalInvoiced += inv.total;
    }
    if (inv.status === 'paid') {
      totalPaid += inv.total;
    } else if (inv.status === 'sent') {
      totalPending += inv.total;
    } else if (inv.status === 'overdue') {
      totalOverdue += inv.total;
    }
  }

  const activeQuotesCount = quotes.filter(
    q => q.status === 'sent' || q.status === 'accepted'
  ).length;

  return {
    totalInvoiced,
    totalPaid,
    totalPending,
    totalOverdue,
    activeQuotesCount,
    recentInvoices: invoices.slice(0, 5),
    recentQuotes: quotes.slice(0, 5),
  };
}
