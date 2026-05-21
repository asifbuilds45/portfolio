import { createClient } from '@/lib/supabase/client';
import type { Skill } from '@/types';

const supabase = createClient();

export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills').select('*').order('sort_order', { ascending: true });
  if (error) return [];
  return data;
}

export async function createSkill(item: Omit<Skill, 'id'>) {
  const { data, error } = await supabase.from('skills').insert(item).select().single();
  if (error) throw error;
  return data;
}

export async function deleteSkill(id: string) {
  const { error } = await supabase.from('skills').delete().eq('id', id);
  if (error) throw error;
}