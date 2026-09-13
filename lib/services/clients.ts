import { Client } from '../types';
import { supabase } from '../supabase/client';

export async function listClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching clients from Supabase:', error);
    return [];
  }

  return (data || []).map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    companyName: row.company_name,
    ncc: row.ncc || undefined,
    createdAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
  }));
}

export async function getClient(id: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    companyName: data.company_name,
    ncc: data.ncc || undefined,
    createdAt: data.created_at ? data.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
  };
}

export async function createClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
  const newId = `cli-${Date.now()}`;
  const createdAt = new Date().toISOString();

  const { data, error } = await supabase
    .from('clients')
    .insert({
      id: newId,
      company_id: 'comp-1111-2222',
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      company_name: client.companyName,
      ncc: client.ncc || null,
      created_at: createdAt,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating client in Supabase:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    companyName: data.company_name,
    ncc: data.ncc || undefined,
    createdAt: data.created_at.split('T')[0],
  };
}

export async function updateClient(
  id: string,
  updatedData: Partial<Omit<Client, 'id' | 'createdAt'>>
): Promise<Client | null> {
  const updatePayload: Record<string, string | null> = {};

  if (updatedData.name !== undefined) updatePayload.name = updatedData.name;
  if (updatedData.email !== undefined) updatePayload.email = updatedData.email;
  if (updatedData.phone !== undefined) updatePayload.phone = updatedData.phone;
  if (updatedData.address !== undefined) updatePayload.address = updatedData.address;
  if (updatedData.companyName !== undefined) updatePayload.company_name = updatedData.companyName;
  if (updatedData.ncc !== undefined) updatePayload.ncc = updatedData.ncc || null;

  const { data, error } = await supabase
    .from('clients')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error || !data) {
    console.error('Error updating client in Supabase:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    companyName: data.company_name,
    ncc: data.ncc || undefined,
    createdAt: data.created_at ? data.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
  };
}

export async function deleteClient(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting client from Supabase:', error);
    return false;
  }

  return true;
}
