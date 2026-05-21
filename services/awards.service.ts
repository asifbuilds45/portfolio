import { createClient } from '@/lib/supabase/client';
import type { Award } from '@/types';

const supabase = createClient();

export async function getAwards(): Promise<Award[]> {
  const { data, error } = await supabase
    .from('awards').select('*').order('sort_order', { ascending: true });
  if (error) return [];
  return data;
}

export async function createAward(item: Omit<Award, 'id'>) {
  const { data, error } = await supabase.from('awards').insert(item).select().single();
  if (error) throw error;
  return data;
}

export async function updateAward(id: string, updates: Partial<Award>) {
  const { data, error } = await supabase
    .from('awards').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteAward(id: string) {
  const { error } = await supabase.from('awards').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadCertificate(file: File): Promise<string> {
  const filename = `cert-${Date.now()}.pdf`;
  const { error } = await supabase.storage
    .from('certificates').upload(filename, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('certificates').getPublicUrl(filename);
  return data.publicUrl;
}