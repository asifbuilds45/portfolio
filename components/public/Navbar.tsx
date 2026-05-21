'use client';
import { useState, useEffect } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Awards', href: '#awards' },
  { label: 'Contact', href: '#contact' },
];

interface NavbarProps {
  cvUrl?: string | null;
}

export function Navbar({ cvUrl }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = NAV_ITEMS.map(item => item.href.replace('#', ''));
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(section);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-sm border-b border-neutral-200 shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNav('#home')}
            className="font-semibold text-neutral-900 text-sm tracking-tight hover:text-accent transition-colors"
          >
            Asif Khan
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.href}
                onClick={() => handleNav(item.href)}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-md transition-colors',
                  active === item.href.replace('#', '')
                    ? 'text-accent font-medium'
                    : 'text-neutral-600 hover:text-neutral-900'
                )}
              >
                {item.label}
              </button>
            ))}
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium bg-neutral-900 text-white rounded-md hover:bg-neutral-700 transition-colors"
              >
                <FileText size={14} />
                View CV
              </a>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-neutral-600"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 py-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.href}
              onClick={() => handleNav(item.href)}
              className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-colors"
            >
              {item.label}
            </button>
          ))}
          {cvUrl && (
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-accent"
            >
              <FileText size={14} />
              View CV
            </a>
          )}
        </div>
      )}
    </nav>
  );
}