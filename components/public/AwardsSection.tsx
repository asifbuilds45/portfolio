'use client';
import { motion } from 'framer-motion';
import { Award, FileText } from 'lucide-react';
import type { Award as AwardType } from '@/types';

interface AwardsSectionProps {
  awards: AwardType[];
}

export function AwardsSection({ awards }: AwardsSectionProps) {
  if (!awards.length) return null;

  return (
    <section id="awards" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-neutral-900">Honors & Awards</h2>
          <div className="w-12 h-0.5 bg-accent mt-3" />
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {awards.map((award, i) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-neutral-50 rounded-lg p-5 border border-neutral-200 hover:border-neutral-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                  <Award size={16} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 mb-1">{award.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-3">
                    {award.description}
                  </p>
                  {award.certificate_url && (
                    <a
                      href={award.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
                    >
                      <FileText size={13} />
                      View Certificate
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}