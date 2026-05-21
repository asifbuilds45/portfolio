'use client';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Mail } from 'lucide-react';
import Image from 'next/image';
import type { Profile } from '@/types';

interface HeroSectionProps {
  profile: Profile | null;
}

export function HeroSection({ profile }: HeroSectionProps) {
  const handleContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center pt-16 bg-neutral-50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid md:grid-cols-2 gap-12 md:gap-8 items-center py-20">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-medium text-accent mb-3 tracking-wide uppercase">
              Welcome
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 leading-tight mb-4">
              {profile?.name ?? 'Mohamed Asif Khan P'}
            </h1>
            <p className="text-xl text-neutral-600 font-medium mb-4">
              {profile?.tagline ?? 'Final Year Computer Science Student'}
            </p>
            <p className="text-neutral-500 text-base leading-relaxed mb-8 max-w-md">
              {profile?.intro ?? 'I build clean, functional software and enjoy solving real-world problems through technology.'}
            </p>
            <div className="flex flex-wrap gap-3">
              {profile?.cv_url && (
                <a
                  href={profile.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  <FileText size={15} />
                  View CV
                </a>
              )}
              <button
                onClick={handleContact}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-neutral-300 text-neutral-800 text-sm font-medium rounded-lg hover:border-neutral-400 transition-colors"
              >
                <Mail size={15} />
                Contact Me
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>

          {/* Right — Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex justify-center md:justify-end"
          >
            <div className="relative w-64 h-64 sm:w-72 sm:h-72">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.name}
                  fill
                  className="object-cover rounded-full border-4 border-white shadow-lg"
                  priority
                />
              ) : (
                <div className="w-full h-full rounded-full bg-neutral-200 border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-5xl font-bold text-neutral-400">A</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}