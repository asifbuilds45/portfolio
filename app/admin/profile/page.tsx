'use client';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { getProfile, updateProfile, uploadAvatar, uploadCV } from '@/services/profile.service';
import type { Profile } from '@/types';

const profileSchema = z.object({
  name: z.string().min(2),
  tagline: z.string().min(2),
  intro: z.string().min(10),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema) as any});

  useEffect(() => {
    getProfile().then(p => {
      setProfile(p);
      if (p) reset({ name: p.name, tagline: p.tagline, intro: p.intro });
      setLoading(false);
    });
  }, [reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!profile) return;
    try {
      const updated = await updateProfile(profile.id, values);
      setProfile(updated);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);
    try {
      const url = await uploadAvatar(file);
      await updateProfile(profile.id, { avatar_url: url });
      setProfile(prev => prev ? { ...prev, avatar_url: url } : prev);
      toast.success('Profile photo updated!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);
    try {
      const url = await uploadCV(file);
      await updateProfile(profile.id, { cv_url: url });
      setProfile(prev => prev ? { ...prev, cv_url: url } : prev);
      toast.success('CV uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-sm text-neutral-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Profile</h1>

      {/* Image Upload */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">Profile Photo</h2>
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200">
            {profile?.avatar_url ? (
              <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-neutral-400">
                A
              </div>
            )}
          </div>
          <div>
            <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-60"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              Upload Photo
            </button>
            <p className="text-xs text-neutral-400 mt-1.5">JPG, PNG, WebP. Max 5MB.</p>
          </div>
        </div>
      </div>

      {/* CV Upload */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">CV / Resume</h2>
        <div className="flex items-center gap-4">
          {profile?.cv_url ? (
            <a href={profile.cv_url} target="_blank" rel="noopener noreferrer"
              className="text-sm text-accent hover:underline">
              View current CV →
            </a>
          ) : (
            <span className="text-sm text-neutral-400">No CV uploaded</span>
          )}
          <input ref={cvInputRef} type="file" accept=".pdf" onChange={handleCVUpload} className="hidden" />
          <button
            onClick={() => cvInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-60"
          >
            <Upload size={14} />
            {profile?.cv_url ? 'Replace CV' : 'Upload CV'}
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">Profile Information</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full Name</label>
            <input {...register('name')} className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent" />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Tagline</label>
            <input {...register('tagline')} className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent" />
            {errors.tagline && <p className="mt-1 text-xs text-red-500">{errors.tagline.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Short Introduction</label>
            <textarea {...register('intro')} rows={4} className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent resize-none" />
            {errors.intro && <p className="mt-1 text-xs text-red-500">{errors.intro.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}