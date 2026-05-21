'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from '@/services/experience.service';
import { experienceSchema, type ExperienceFormValues } from '@/lib/validations/experience';
import type { Experience } from '@/types';

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Experience | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<ExperienceFormValues>({ resolver: zodResolver(experienceSchema) as any });

  const load = async () => {
    const data = await getExperience();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditItem(null);
    reset({ job_title: '', company: '', start_date: '', end_date: '', description: '', sort_order: items.length });
    setShowForm(true);
  };

  const openEdit = (item: Experience) => {
    setEditItem(item);
    reset({
      job_title: item.job_title,
      company: item.company,
      start_date: item.start_date,
      end_date: item.end_date,
      description: item.description ?? '',
      sort_order: item.sort_order,
    });
    setShowForm(true);
  };

  const onSubmit = async (values: ExperienceFormValues) => {
    const payload = {
      job_title: values.job_title,
      company: values.company,
      start_date: values.start_date,
      end_date: values.end_date,
      description: values.description ?? null,
      sort_order: values.sort_order ?? 0,
    };
    try {
      if (editItem) {
        await updateExperience(editItem.id, payload);
        toast.success('Updated!');
      } else {
        await createExperience(payload as Omit<Experience, 'id'>);
        toast.success('Added!');
      }
      setShowForm(false);
      load();
    } catch {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    try {
      await deleteExperience(id);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Experience</h1>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 transition-colors">
          <Plus size={15} />
          Add Experience
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-neutral-900">
                {editItem ? 'Edit Experience' : 'Add Experience'}
              </h2>
              <button onClick={() => setShowForm(false)}>
                <X size={18} className="text-neutral-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Job Title</label>
                <input {...register('job_title')}
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent"
                  placeholder="e.g. Frontend Developer Intern" />
                {errors.job_title && <p className="mt-1 text-xs text-red-500">{errors.job_title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Company</label>
                <input {...register('company')}
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent"
                  placeholder="Company name" />
                {errors.company && <p className="mt-1 text-xs text-red-500">{errors.company.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Start Date</label>
                  <input {...register('start_date')}
                    className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent"
                    placeholder="Jun 2024" />
                  {errors.start_date && <p className="mt-1 text-xs text-red-500">{errors.start_date.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">End Date</label>
                  <input {...register('end_date')}
                    className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent"
                    placeholder="Aug 2024 or Present" />
                  {errors.end_date && <p className="mt-1 text-xs text-red-500">{errors.end_date.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description (optional)</label>
                <textarea {...register('description')} rows={3}
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent resize-none"
                  placeholder="What did you do there..." />
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
          <p className="text-neutral-500 text-sm">No experience entries yet.</p>
          <button onClick={openAdd} className="mt-3 text-sm text-accent hover:underline">
            Add your first experience →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white border border-neutral-200 rounded-lg p-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-neutral-900">{item.job_title}</p>
                <p className="text-sm text-neutral-600">{item.company}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{item.start_date} — {item.end_date}</p>
                {item.description && (
                  <p className="text-sm text-neutral-500 mt-1.5 line-clamp-2">{item.description}</p>
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