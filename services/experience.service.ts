import { createClient } from '@/lib/supabase/client';
import type { Experience } from '@/types';

const supabase = createClient();

export async function getExperience(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return [];
  return data;
}

export async function createExperience(item: Omit<Experience, 'id'>) {
  const { data, error } = await supabase.from('experience').insert(item).select().single();
  if (error) throw error;
  return data;
}

export async function updateExperience(id: string, updates: Partial<Experience>) {
  const { data, error } = await supabase
    .from('experience').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteExperience(id: string) {
  const { error } = await supabase.from('experience').delete().eq('id', id);
  if (error) throw error;
}