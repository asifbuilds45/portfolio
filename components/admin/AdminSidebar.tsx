'use client';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  User, Info, BookOpen, Briefcase, FolderKanban,
  Award, Phone, Share2, LayoutDashboard, LogOut, Code2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Profile', href: '/admin/profile', icon: User },
  { label: 'About', href: '/admin/about', icon: Info },
  { label: 'Skills', href: '/admin/skills', icon: Code2 },
  { label: 'Education', href: '/admin/education', icon: BookOpen },
  { label: 'Experience', href: '/admin/experience', icon: Briefcase },
  { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { label: 'Awards', href: '/admin/awards', icon: Award },
  { label: 'Contact', href: '/admin/contact', icon: Phone },
  { label: 'Social Links', href: '/admin/social', icon: Share2 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-neutral-200 flex flex-col hidden md:flex">
      <div className="p-5 border-b border-neutral-200">
        <p className="font-semibold text-neutral-900 text-sm">Portfolio CMS</p>
        <p className="text-xs text-neutral-500 mt-0.5">Mohamed Asif Khan P</p>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <a
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors',
              pathname === href
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            )}
          >
            <Icon size={15} />
            {label}
          </a>
        ))}
      </nav>

      <div className="p-3 border-t border-neutral-200">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 rounded-md transition-colors"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}