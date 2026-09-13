import { Quote, Invoice, LineItem, Client } from '../types';
import { supabase } from '../supabase/client';
import { createInvoice, generateNextInvoiceNumber } from './invoices';

interface DbClientRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company_name: string;
  ncc?: string | null;
  created_at?: string;
}

interface DbLineItemRow {
  id: string;
  description: string;
  quantity: number | string;
  unit_price: number | string;
  total_price: number | string;
}

interface DbQuoteRow {
  id: string;
  quote_number: string;
  date: string;
  validity_date: string;
  status: string;
  subtotal: number | string;
  tva_rate: number | string;
  tva_amount: number | string;
  total: number | string;
  company_id?: string;
  created_at?: string;
  client?: DbClientRow | null;
  line_items?: DbLineItemRow[] | null;
}

function mapDbQuoteToQuote(row: DbQuoteRow): Quote {
  const client: Client = row.client
    ? {
        id: row.client.id,
        name: row.client.name,
        email: row.client.email,
        phone: row.client.phone,
        address: row.client.address,
        companyName: row.client.company_name,
        ncc: row.client.ncc || undefined,
        createdAt: row.client.created_at ? row.client.created_at.split('T')[0] : '',
      }
    : {
        id: 'unknown',
        name: 'Client Inconnu',
        email: '',
        phone: '',
        address: '',
        companyName: '',
        createdAt: '',
      };

  const lineItems: LineItem[] = (row.line_items || []).map((li: DbLineItemRow) => ({
    id: li.id,
    description: li.description,
    quantity: Number(li.quantity),
    unitPrice: Number(li.unit_price),
    totalPrice: Number(li.total_price),
  }));

  return {
    id: row.id,
    quoteNumber: row.quote_number,
    client,
    date: row.date,
    validityDate: row.validity_date,
    status: row.status as Quote['status'],
    subtotal: Number(row.subtotal),
    tvaRate: Number(row.tva_rate),
    tvaAmount: Number(row.tva_amount),
    total: Number(row.total),
    lineItems,
    companyId: row.company_id || 'comp-1111-2222',
    createdAt: row.created_at ? row.created_at.split('T')[0] : row.date,
  };
}

export async function listQuotes(): Promise<Quote[]> {
  const { data, error } = await supabase
    .from('quotes')
    .select(`
      *,
      client:clients(*),
      line_items:quote_line_items(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error listing quotes from Supabase:', error);
    return [];
  }

  return (data || []).map((d) => mapDbQuoteToQuote(d as unknown as DbQuoteRow));
}

export async function getQuote(id: string): Promise<Quote | null> {
  const { data, error } = await supabase
    .from('quotes')
    .select(`
      *,
      client:clients(*),
      line_items:quote_line_items(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    console.error('Error fetching quote from Supabase:', error);
    return null;
  }

  return mapDbQuoteToQuote(data as unknown as DbQuoteRow);
}

export async function generateNextQuoteNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const { count } = await supabase
    .from('quotes')
    .select('*', { count: 'exact', head: true });

  const nextCount = (count || 0) + 1;
  return `DEV-${year}-${String(nextCount).padStart(4, '0')}`;
}

export async function createQuote(quote: Omit<Quote, 'id' | 'createdAt'>): Promise<Quote> {
  const newId = `dev-${Date.now()}`;
  const now = new Date().toISOString();

  // 1. Insert quote header
  const { error: quoteError } = await supabase
    .from('quotes')
    .insert({
      id: newId,
      company_id: quote.companyId || 'comp-1111-2222',
      client_id: quote.client.id,
      quote_number: quote.quoteNumber,
      date: quote.date,
      validity_date: quote.validityDate,
      status: quote.status,
      subtotal: quote.subtotal,
      tva_rate: quote.tvaRate,
      tva_amount: quote.tvaAmount,
      total: quote.total,
      created_at: now,
    });

  if (quoteError) {
    console.error('Error creating quote in Supabase:', quoteError);
    throw quoteError;
  }

  // 2. Insert line items
  if (quote.lineItems && quote.lineItems.length > 0) {
    const lineItemsData = quote.lineItems.map((item, index) => ({
      id: item.id || `q-li-${Date.now()}-${index}`,
      quote_id: newId,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice,
      order_index: index,
    }));

    const { error: itemsError } = await supabase
      .from('quote_line_items')
      .insert(lineItemsData);

    if (itemsError) {
      console.error('Error inserting quote line items in Supabase:', itemsError);
    }
  }

  const created = await getQuote(newId);
  if (!created) {
    throw new Error('Failed to retrieve newly created quote');
  }

  return created;
}

export async function updateQuote(id: string, updatedData: Partial<Quote>): Promise<Quote | null> {
  const updatePayload: Record<string, string | number | null> = {};

  if (updatedData.quoteNumber !== undefined) updatePayload.quote_number = updatedData.quoteNumber;
  if (updatedData.client !== undefined) updatePayload.client_id = updatedData.client.id;
  if (updatedData.date !== undefined) updatePayload.date = updatedData.date;
  if (updatedData.validityDate !== undefined) updatePayload.validity_date = updatedData.validityDate;
  if (updatedData.status !== undefined) updatePayload.status = updatedData.status;
  if (updatedData.subtotal !== undefined) updatePayload.subtotal = updatedData.subtotal;
  if (updatedData.tvaRate !== undefined) updatePayload.tva_rate = updatedData.tvaRate;
  if (updatedData.tvaAmount !== undefined) updatePayload.tva_amount = updatedData.tvaAmount;
  if (updatedData.total !== undefined) updatePayload.total = updatedData.total;

  if (Object.keys(updatePayload).length > 0) {
    const { error } = await supabase
      .from('quotes')
      .update(updatePayload)
      .eq('id', id);

    if (error) {
      console.error('Error updating quote header in Supabase:', error);
      return null;
    }
  }

  // If line items are updated, replace them
  if (updatedData.lineItems) {
    await supabase
      .from('quote_line_items')
      .delete()
      .eq('quote_id', id);

    const lineItemsData = updatedData.lineItems.map((item, index) => ({
      id: item.id || `q-li-${Date.now()}-${index}`,
      quote_id: id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice,
      order_index: index,
    }));

    await supabase
      .from('quote_line_items')
      .insert(lineItemsData);
  }

  return getQuote(id);
}

export async function updateQuoteStatus(id: string, status: Quote['status']): Promise<Quote | null> {
  const { error } = await supabase
    .from('quotes')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating quote status in Supabase:', error);
    return null;
  }

  return getQuote(id);
}

export async function convertQuoteToInvoice(quoteId: string): Promise<Invoice | null> {
  const quote = await getQuote(quoteId);
  if (!quote) return null;

  // 1. Mark quote as accepted
  await updateQuoteStatus(quoteId, 'accepted');

  // 2. Generate new invoice number
  const invoiceNumber = await generateNextInvoiceNumber();

  const dateStr = new Date().toISOString().split('T')[0];
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);
  const dueDateStr = dueDate.toISOString().split('T')[0];

  // 3. Create linked invoice in Supabase
  const newInvoice = await createInvoice({
    invoiceNumber,
    client: quote.client,
    date: dateStr,
    dueDate: dueDateStr,
    status: 'draft',
    subtotal: quote.subtotal,
    tvaRate: quote.tvaRate,
    tvaAmount: quote.tvaAmount,
    total: quote.total,
    lineItems: quote.lineItems.map(item => ({
      ...item,
      id: `li-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    })),
    companyId: quote.companyId,
  });

  return newInvoice;
}

export async function deleteQuote(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('quotes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting quote from Supabase:', error);
    return false;
  }

  return true;
}
