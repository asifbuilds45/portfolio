import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types';

const supabase = createClient();

export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .single();
  if (error) return null;
  return data;
}

export async function updateProfile(id: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profile')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function uploadAvatar(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const filename = `avatar-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from('avatars')
    .upload(filename, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('avatars').getPublicUrl(filename);
  return data.publicUrl;
}

export async function uploadCV(file: File): Promise<string> {
  const filename = `cv-${Date.now()}.pdf`;
  const { error } = await supabase.storage
    .from('cv')
    .upload(filename, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('cv').getPublicUrl(filename);
  return data.publicUrl;
}