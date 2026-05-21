import { Github, Linkedin, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import type { Contact, SocialLink } from '@/types';

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  github: <Github size={18} />,
  linkedin: <Linkedin size={18} />,
  instagram: <Instagram size={18} />,
  email: <Mail size={18} />,
};

interface FooterProps {
  contact: Contact | null;
  socialLinks: SocialLink[];
}

export function Footer({ contact, socialLinks }: FooterProps) {
  return (
    <footer id="footer" className="bg-neutral-900 text-neutral-400 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 mb-10">
          {/* Name + Tagline */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-2">Mohamed Asif Khan P</h3>
            <p className="text-sm text-neutral-500">Final Year CSE Student</p>
          </div>

          {/* Find Me */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-4">
              Find Me
            </p>
            <div className="space-y-2.5">
              {contact?.email && (
                <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 text-sm hover:text-white transition-colors">
                  <Mail size={14} />
                  {contact.email}
                </a>
              )}
              {contact?.phone && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Phone size={14} />
                  {contact.phone}
                </div>
              )}
              {contact?.location && (
                <div className="flex items-center gap-2.5 text-sm">
                  <MapPin size={14} />
                  {contact.location}
                </div>
              )}
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-4">
              Social
            </p>
            <div className="flex gap-3">
              {socialLinks.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                  aria-label={link.platform}
                >
                  {PLATFORM_ICONS[link.platform.toLowerCase()] ?? <Mail size={18} />}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-6 text-center text-xs text-neutral-600">
          © {new Date().getFullYear()} Mohamed Asif Khan P. All rights reserved.
        </div>
      </div>
    </footer>
  );
}