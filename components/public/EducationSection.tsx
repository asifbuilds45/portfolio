'use client';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import type { Education } from '@/types';

interface EducationSectionProps {
  items: Education[];
}

export function EducationSection({ items }: EducationSectionProps) {
  return (
    <section id="education" className="py-24 bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-neutral-900">Education</h2>
          <div className="w-12 h-0.5 bg-accent mt-3" />
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-neutral-200 md:-translate-x-px" />

          <div className="space-y-8">
            {items.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`relative flex ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  } items-start gap-4 md:gap-0`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-accent -translate-x-1/2 mt-1.5 border-2 border-white z-10" />

                  {/* Content */}
                  <div className={`ml-10 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-10' : 'md:pl-10'}`}>
                    <div className="bg-white rounded-lg p-5 border border-neutral-200 hover:border-neutral-300 transition-colors">
                      <div className="flex items-start gap-3 mb-2">
                        <GraduationCap size={18} className="text-accent mt-0.5 shrink-0" />
                        <div>
                          <h3 className="font-semibold text-neutral-900">{item.degree}</h3>
                          <p className="text-sm text-neutral-600">{item.institution}</p>
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
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}