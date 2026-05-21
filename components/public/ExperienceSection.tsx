'use client';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import type { Experience } from '@/types';

interface ExperienceSectionProps {
  items: Experience[];
}

export function ExperienceSection({ items }: ExperienceSectionProps) {
  if (!items.length) return null;

  return (
    <section id="experience" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-neutral-900">Experience</h2>
          <div className="w-12 h-0.5 bg-accent mt-3" />
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-neutral-200" />

          <div className="space-y-8">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative flex items-start gap-4"
              >
                <div className="absolute left-4 w-3 h-3 rounded-full bg-accent -translate-x-1/2 mt-1.5 border-2 border-white z-10" />

                <div className="ml-10 bg-neutral-50 rounded-lg p-5 border border-neutral-200 hover:border-neutral-300 transition-colors flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <Briefcase size={18} className="text-accent mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-neutral-900">{item.job_title}</h3>
                      <p className="text-sm text-neutral-600">{item.company}</p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 mb-2">
                    {item.start_date} — {item.end_date}
                  </p>
                  {item.description && (
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}