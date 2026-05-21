'use client';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import { getAwards, createAward, updateAward, deleteAward, uploadCertificate } from '@/services/awards.service';
import { awardSchema, type AwardFormValues } from '@/lib/validations/award';
import type { Award } from '@/types';

export default function AdminAwardsPage() {
  const [items, setItems] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Award | null>(null);
  const [certUrl, setCertUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const certInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<AwardFormValues>({ resolver: zodResolver(awardSchema) as any });

  const load = async () => {
    const data = await getAwards();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditItem(null);
    setCertUrl('');
    reset({ title: '', description: '', sort_order: items.length });
    setShowForm(true);
  };

  const openEdit = (item: Award) => {
    setEditItem(item);
    setCertUrl(item.certificate_url ?? '');
    reset({
      title: item.title,
      description: item.description,
      sort_order: item.sort_order,
    });
    setShowForm(true);
  };

  const handleCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadCertificate(file);
      setCertUrl(url);
      toast.success('Certificate uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: AwardFormValues) => {
    const payload = {
      title: values.title,
      description: values.description,
      sort_order: values.sort_order ?? 0,
      certificate_url: certUrl || null,
    };
    try {
      if (editItem) {
        await updateAward(editItem.id, payload);
        toast.success('Updated!');
      } else {
        await createAward(payload as Omit<Award, 'id'>);
        toast.success('Added!');
      }
      setShowForm(false);
      load();
    } catch {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this award?')) return;
    try {
      await deleteAward(id);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Honors & Awards</h1>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 transition-colors">
          <Plus size={15} />
          Add Award
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-neutral-900">
                {editItem ? 'Edit Award' : 'Add Award'}
              </h2>
              <button onClick={() => setShowForm(false)}>
                <X size={18} className="text-neutral-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Title</label>
                <input {...register('title')}
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent"
                  placeholder="e.g. Best Project Award" />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
                <textarea {...register('description')} rows={3}
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent resize-none"
                  placeholder="Brief description..." />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Certificate PDF (optional)
                </label>
                <input ref={certInputRef} type="file" accept=".pdf" onChange={handleCertUpload} className="hidden" />
                <button type="button" onClick={() => certInputRef.current?.click()} disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-60">
                  <Upload size={14} />
                  {uploading ? 'Uploading...' : 'Upload Certificate'}
                </button>
                {certUrl && <p className="text-xs text-green-600 mt-1">✓ Certificate uploaded</p>}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-60 transition-colors">
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-neutral-300 text-sm rounded-lg hover:bg-neutral-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-neutral-500">Loading...</p>
      ) : items.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-10 text-center">
          <p className="text-neutral-500 text-sm">No awards yet.</p>
          <button onClick={openAdd} className="mt-3 text-sm text-accent hover:underline">
            Add your first award →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white border border-neutral-200 rounded-lg p-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-neutral-900">{item.title}</p>
                <p className="text-sm text-neutral-500 mt-1">{item.description}</p>
                {item.certificate_url && (
                  <a href={item.certificate_url} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-accent hover:underline mt-1 inline-block">
                    View Certificate →
                  </a>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(item)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}