import { createClient } from '@/lib/supabase/client';
import type { Project } from '@/types';

const supabase = createClient();

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return [];
  return data;
}

export async function createProject(item: Omit<Project, 'id'>) {
  const { data, error } = await supabase.from('projects').insert(item).select().single();
  if (error) throw error;
  return data;
}

export async function updateProject(id: string, updates: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadProjectImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const filename = `project-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from('projects').upload(filename, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('projects').getPublicUrl(filename);
  return data.publicUrl;
}