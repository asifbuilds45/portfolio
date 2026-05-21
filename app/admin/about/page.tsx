'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';

const schema = z.object({ content: z.string().min(20) });

type FormValues = z.infer<typeof schema>;

export default function AdminAboutPage() {
  const supabase = createClient();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) as any });

  useEffect(() => {
    supabase.from('about').select('*').single().then(({ data }) => {
      if (data) reset({ content: data.content });
    });
  }, []);

  const onSubmit = async ({ content }: FormValues) => {
    const { data } = await supabase.from('about').select('id').single();
    if (!data) return;
    const { error } = await supabase.from('about').update({ content }).eq('id', data.id);
    if (error) toast.error('Failed to update');
    else toast.success('About updated!');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">About Me</h1>
      <div className="bg-white border border-neutral-200 rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              About Content
            </label>
            <textarea
              {...register('content')}
              rows={10}
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent resize-none"
            />
            {errors.content && (
              <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>
            )}
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