'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getSocialLinks, updateSocialLink } from '@/services/social.service';
import type { SocialLink } from '@/types';

export default function AdminSocialPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    getSocialLinks().then(setLinks);
  }, []);

  const handleUpdate = async (id: string, url: string) => {
    setSaving(id);
    try {
      await updateSocialLink(id, url);
      toast.success('Updated!');
    } catch {
      toast.error('Failed to update');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Social Links</h1>
      <div className="bg-white border border-neutral-200 rounded-lg p-6 max-w-lg space-y-5">
        {links.map(link => (
          <div key={link.id}>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5 capitalize">{link.platform}</label>
            <div className="flex gap-2">
              <input
                defaultValue={link.url}
                id={`link-${link.id}`}
                className="flex-1 px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent"
              />
              <button
                onClick={() => {
                  const el = document.getElementById(`link-${link.id}`) as HTMLInputElement;
                  handleUpdate(link.id, el.value);
                }}
                disabled={saving === link.id}
                className="px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-60 transition-colors"
              >
                {saving === link.id ? '...' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}