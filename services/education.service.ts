import { createClient } from '@/lib/supabase/client';
import type { Education } from '@/types';

const supabase = createClient();

export async function getEducation(): Promise<Education[]> {
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return [];
  return data;
}

export async function createEducation(item: Omit<Education, 'id'>) {
  const { data, error } = await supabase
    .from('education')
    .insert(item)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateEducation(id: string, updates: Partial<Education>) {
  const { data, error } = await supabase
    .from('education')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteEducation(id: string) {
  const { error } = await supabase.from('education').delete().eq('id', id);
  if (error) throw error;
}