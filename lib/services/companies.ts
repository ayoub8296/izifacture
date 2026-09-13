import { Company } from '../types';
import { supabase } from '../supabase/client';

export async function getCompanyProfile(): Promise<Company> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .limit(1)
    .single();

  if (error || !data) {
    // Fallback default
    return {
      id: 'comp-1111-2222',
      name: 'Assess Manager Africa',
      email: 'contact@assessmanager-africa.com',
      phone: '+225 07 45 89 12 34',
      address: "Boulevard de Marseille, Zone 4, Abidjan, Côte d'Ivoire",
      ncc: 'NCC-2309485A',
      rc: 'RC-ABJ-2024-B-1294',
      bankInfo: "Société Générale Côte d'Ivoire • IBAN CI93 01234 56789 01234567890 12",
      defaultTvaRate: 18,
      currency: 'FCFA',
    };
  }

  return {
    id: data.id,
    name: data.name,
    logoUrl: data.logo_url || undefined,
    email: data.email,
    phone: data.phone,
    address: data.address,
    ncc: data.ncc || undefined,
    rc: data.rc || undefined,
    bankInfo: data.bank_info || undefined,
    defaultTvaRate: Number(data.default_tva_rate) || 18,
    currency: (data.currency as Company['currency']) || 'FCFA',
  };
}

export async function updateCompanyProfile(profile: Partial<Company>): Promise<Company> {
  const current = await getCompanyProfile();
  const updated: Company = {
    ...current,
    ...profile,
  };

  const dbData = {
    id: updated.id,
    name: updated.name,
    logo_url: updated.logoUrl || null,
    email: updated.email,
    phone: updated.phone,
    address: updated.address,
    ncc: updated.ncc || null,
    rc: updated.rc || null,
    bank_info: updated.bankInfo || null,
    default_tva_rate: updated.defaultTvaRate,
    currency: updated.currency,
  };

  const { error } = await supabase
    .from('companies')
    .upsert(dbData);

  if (error) {
    console.error('Error updating company profile in Supabase:', error);
  }

  return updated;
}
