'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { getContact, updateContact } from '@/services/contact.service';
import type { Contact } from '@/types';

const schema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AdminContactPage() {
  const [contact, setContact] = useState<Contact | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) as any});

  useEffect(() => {
    getContact().then(c => {
      setContact(c);
      if (c) reset({ email: c.email, phone: c.phone ?? '', location: c.location ?? '' });
    });
  }, [reset]);

  const onSubmit = async (values: FormValues) => {
    if (!contact) return;
    try {
      await updateContact(contact.id, values);
      toast.success('Contact details updated!');
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Contact Details</h1>
      <div className="bg-white border border-neutral-200 rounded-lg p-6 max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
            <input {...register('email')} type="email" className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent" />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone</label>
            <input {...register('phone')} className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Location</label>
            <input {...register('location')} className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent" placeholder="City, State, Country" />
          </div>
          <button type="submit" disabled={isSubmitting}
            className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-60 transition-colors">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}