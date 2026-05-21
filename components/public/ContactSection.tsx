'use client';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactSchema, type ContactFormValues } from '@/lib/validations/contact';

export function ContactSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) as any });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      toast.success('Message sent! I\'ll get back to you soon.');
      reset();
    } catch {
      toast.error('Failed to send. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-24 bg-neutral-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-neutral-900">Get in Touch</h2>
          <div className="w-12 h-0.5 bg-accent mt-3" />
          <p className="text-neutral-500 mt-4">
            Have a question or want to work together? Send me a message.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Name</label>
            <input
              {...register('name')}
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:border-accent transition-colors"
              placeholder="Your full name"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:border-accent transition-colors"
              placeholder="your@email.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Message</label>
            <textarea
              {...register('message')}
              rows={5}
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:border-accent transition-colors resize-none"
              placeholder="Write your message here..."
            />
            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={15} />
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}