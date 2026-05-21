import { createClient } from '@/lib/supabase/client';
import type { SocialLink } from '@/types';

const supabase = createClient();

export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .from('social_links').select('*').order('sort_order', { ascending: true });
  if (error) return [];
  return data;
}

export async function updateSocialLink(id: string, url: string) {
  const { data, error } = await supabase
    .from('social_links').update({ url }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}