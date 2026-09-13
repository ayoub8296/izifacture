import { Invoice, LineItem, Client } from '../types';
import { supabase } from '../supabase/client';

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

interface DbInvoiceRow {
  id: string;
  invoice_number: string;
  date: string;
  due_date: string;
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

function mapDbInvoiceToInvoice(row: DbInvoiceRow): Invoice {
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
    invoiceNumber: row.invoice_number,
    client,
    date: row.date,
    dueDate: row.due_date,
    status: row.status as Invoice['status'],
    subtotal: Number(row.subtotal),
    tvaRate: Number(row.tva_rate),
    tvaAmount: Number(row.tva_amount),
    total: Number(row.total),
    lineItems,
    companyId: row.company_id || 'comp-1111-2222',
    createdAt: row.created_at ? row.created_at.split('T')[0] : row.date,
  };
}

export async function listInvoices(): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      client:clients(*),
      line_items:invoice_line_items(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error listing invoices from Supabase:', error);
    return [];
  }

  return (data || []).map((d) => mapDbInvoiceToInvoice(d as unknown as DbInvoiceRow));
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      client:clients(*),
      line_items:invoice_line_items(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    console.error('Error fetching invoice from Supabase:', error);
    return null;
  }

  return mapDbInvoiceToInvoice(data as unknown as DbInvoiceRow);
}

export async function generateNextInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const { count } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true });

  const nextCount = (count || 0) + 1;
  return `FAC-${year}-${String(nextCount).padStart(4, '0')}`;
}

export async function createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt'>): Promise<Invoice> {
  const newId = `inv-${Date.now()}`;
  const now = new Date().toISOString();

  // 1. Insert invoice header
  const { error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      id: newId,
      company_id: invoice.companyId || 'comp-1111-2222',
      client_id: invoice.client.id,
      invoice_number: invoice.invoiceNumber,
      date: invoice.date,
      due_date: invoice.dueDate,
      status: invoice.status,
      subtotal: invoice.subtotal,
      tva_rate: invoice.tvaRate,
      tva_amount: invoice.tvaAmount,
      total: invoice.total,
      created_at: now,
    });

  if (invoiceError) {
    console.error('Error creating invoice in Supabase:', invoiceError);
    throw invoiceError;
  }

  // 2. Insert line items
  if (invoice.lineItems && invoice.lineItems.length > 0) {
    const lineItemsData = invoice.lineItems.map((item, index) => ({
      id: item.id || `li-${Date.now()}-${index}`,
      invoice_id: newId,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice,
      order_index: index,
    }));

    const { error: itemsError } = await supabase
      .from('invoice_line_items')
      .insert(lineItemsData);

    if (itemsError) {
      console.error('Error inserting line items in Supabase:', itemsError);
    }
  }

  const created = await getInvoice(newId);
  if (!created) {
    throw new Error('Failed to retrieve newly created invoice');
  }

  return created;
}

export async function updateInvoice(id: string, updatedData: Partial<Invoice>): Promise<Invoice | null> {
  const updatePayload: Record<string, string | number | null> = {};

  if (updatedData.invoiceNumber !== undefined) updatePayload.invoice_number = updatedData.invoiceNumber;
  if (updatedData.client !== undefined) updatePayload.client_id = updatedData.client.id;
  if (updatedData.date !== undefined) updatePayload.date = updatedData.date;
  if (updatedData.dueDate !== undefined) updatePayload.due_date = updatedData.dueDate;
  if (updatedData.status !== undefined) updatePayload.status = updatedData.status;
  if (updatedData.subtotal !== undefined) updatePayload.subtotal = updatedData.subtotal;
  if (updatedData.tvaRate !== undefined) updatePayload.tva_rate = updatedData.tvaRate;
  if (updatedData.tvaAmount !== undefined) updatePayload.tva_amount = updatedData.tvaAmount;
  if (updatedData.total !== undefined) updatePayload.total = updatedData.total;

  if (Object.keys(updatePayload).length > 0) {
    const { error } = await supabase
      .from('invoices')
      .update(updatePayload)
      .eq('id', id);

    if (error) {
      console.error('Error updating invoice header in Supabase:', error);
      return null;
    }
  }

  // If line items are updated, replace them
  if (updatedData.lineItems) {
    await supabase
      .from('invoice_line_items')
      .delete()
      .eq('invoice_id', id);

    const lineItemsData = updatedData.lineItems.map((item, index) => ({
      id: item.id || `li-${Date.now()}-${index}`,
      invoice_id: id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice,
      order_index: index,
    }));

    await supabase
      .from('invoice_line_items')
      .insert(lineItemsData);
  }

  return getInvoice(id);
}

export async function updateInvoiceStatus(id: string, status: Invoice['status']): Promise<Invoice | null> {
  const { error } = await supabase
    .from('invoices')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating invoice status in Supabase:', error);
    return null;
  }

  return getInvoice(id);
}

export async function deleteInvoice(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting invoice from Supabase:', error);
    return false;
  }

  return true;
}
