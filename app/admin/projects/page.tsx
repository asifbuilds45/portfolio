'use client';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Github, ExternalLink, Upload } from 'lucide-react';
import { getProjects, createProject, updateProject, deleteProject, uploadProjectImage } from '@/services/projects.service';
import { projectSchema, type ProjectFormValues } from '@/lib/validations/project';
import type { Project } from '@/types';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<ProjectFormValues>({ resolver: zodResolver(projectSchema) as any });
  const load = async () => {
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditProject(null);
    setImageUrl('');
    reset({ name: '', description: '', tech_stack: '', github_url: '', live_url: '', sort_order: projects.length });
    setShowForm(true);
  };

  const openEdit = (p: Project) => {
    setEditProject(p);
    setImageUrl(p.image_url ?? '');
    reset({
      name: p.name,
      description: p.description,
      tech_stack: p.tech_stack.join(', '),
      github_url: p.github_url ?? '',
      live_url: p.live_url ?? '',
      sort_order: p.sort_order,
    });
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadProjectImage(file);
      setImageUrl(url);
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: ProjectFormValues) => {
    const techArray = values.tech_stack.split(',').map(t => t.trim()).filter(Boolean);
    const payload = {
      name: values.name,
      description: values.description,
      tech_stack: techArray,
      github_url: values.github_url || null,
      live_url: values.live_url || null,
      image_url: imageUrl || null,
      sort_order: values.sort_order ?? 0,
    };
    try {
      if (editProject) {
        await updateProject(editProject.id, payload);
        toast.success('Project updated!');
      } else {
        await createProject(payload as Omit<Project, 'id'>);
        toast.success('Project added!');
      }
      setShowForm(false);
      load();
    } catch {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Projects</h1>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 transition-colors">
          <Plus size={15} />
          Add Project
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 py-8 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl my-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-neutral-900">{editProject ? 'Edit Project' : 'Add Project'}</h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-neutral-500" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Project Name</label>
                <input {...register('name')} className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent" />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
                <textarea {...register('description')} rows={3} className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent resize-none" />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Tech Stack (comma separated)</label>
                <input {...register('tech_stack')} className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent" placeholder="React, TypeScript, Supabase" />
                {errors.tech_stack && <p className="mt-1 text-xs text-red-500">{errors.tech_stack.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">GitHub URL</label>
                <input {...register('github_url')} type="url" className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent" placeholder="https://github.com/..." />
                {errors.github_url && <p className="mt-1 text-xs text-red-500">{errors.github_url.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Live Demo URL (optional)</label>
                <input {...register('live_url')} type="url" className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent" placeholder="https://yourproject.com" />
                {errors.live_url && <p className="mt-1 text-xs text-red-500">{errors.live_url.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Project Image (optional)</label>
                <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <button type="button" onClick={() => imageInputRef.current?.click()} disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-60">
                  <Upload size={14} />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
                {imageUrl && <p className="text-xs text-green-600 mt-1">✓ Image uploaded</p>}
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
      ) : (
        <div className="space-y-3">
          {projects.map(p => (
            <div key={p.id} className="bg-white border border-neutral-200 rounded-lg p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-medium text-neutral-900">{p.name}</p>
                <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.tech_stack.map(t => (
                    <span key={t} className="px-2 py-0.5 text-xs bg-neutral-100 text-neutral-600 rounded border border-neutral-200">{t}</span>
                  ))}
                </div>
                <div className="flex gap-3 mt-2">
                  {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700"><Github size={12} />GitHub</a>}
                  {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700"><ExternalLink size={12} />Live</a>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(p)} className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}