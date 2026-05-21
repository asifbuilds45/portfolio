import { createClient } from '@/lib/supabase/client';
import type { Contact } from '@/types';

const supabase = createClient();

export async function getContact(): Promise<Contact | null> {
  const { data, error } = await supabase.from('contact').select('*').single();
  if (error) return null;
  return data;
}

export async function updateContact(id: string, updates: Partial<Contact>) {
  const { data, error } = await supabase
    .from('contact').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}