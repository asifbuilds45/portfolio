import Link from 'next/link';
import { User, BookOpen, Briefcase, FolderKanban, Award, Code2 } from 'lucide-react';

const SECTIONS = [
  { label: 'Profile', desc: 'Name, tagline, photo, CV', href: '/admin/profile', icon: User },
  { label: 'Education', desc: 'Degrees and institutions', href: '/admin/education', icon: BookOpen },
  { label: 'Experience', desc: 'Work history', href: '/admin/experience', icon: Briefcase },
  { label: 'Projects', desc: 'Portfolio projects', href: '/admin/projects', icon: FolderKanban },
  { label: 'Awards', desc: 'Honors and certificates', href: '/admin/awards', icon: Award },
  { label: 'Skills', desc: 'Technical skills', href: '/admin/skills', icon: Code2 },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-500 text-sm mt-1">Manage your portfolio content</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map(({ label, desc, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="bg-white border border-neutral-200 rounded-lg p-5 hover:border-neutral-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-900 transition-colors">
                <Icon size={15} className="text-neutral-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="font-semibold text-neutral-900">{label}</h2>
            </div>
            <p className="text-sm text-neutral-500">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}