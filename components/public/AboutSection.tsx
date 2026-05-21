'use client';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import type { About, Skill } from '@/types';

interface AboutSectionProps {
  about: About | null;
  skills: Skill[];
}

const SKILL_CATEGORIES = ['Languages & Frameworks', 'Tools & Infrastructure', 'Focus Areas'];

export function AboutSection({ about, skills }: AboutSectionProps) {
  const grouped = SKILL_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat).map(s => s.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-neutral-900">About Me</h2>
          <div className="w-12 h-0.5 bg-accent mt-3" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <p className="text-neutral-600 leading-relaxed text-base mb-8">
              {about?.content ?? 'I am a final-year Computer Science Engineering student passionate about building meaningful software.'}
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 transition-colors"
            >
              <FileText size={15} />
              View CV
            </a>
          </motion.div>

          {/* Right — Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-6"
          >
            {SKILL_CATEGORIES.map(cat => (
              grouped[cat]?.length > 0 && (
                <div key={cat}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2.5">
                    {cat}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {grouped[cat].map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1 text-sm bg-neutral-100 text-neutral-700 rounded-md border border-neutral-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}