import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { LayoutDashboard, ClipboardList, Globe, Upload, LogOut } from 'lucide-react';

const NAV = [
  { href: '/admin/pending', label: 'Pending Approvals', icon: ClipboardList },
  { href: '/admin/seo-pages', label: 'SEO Pages', icon: Globe },
  { href: '/admin/bulk-import', label: 'Bulk Import', icon: Upload },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) redirect('/admin/login');
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && session.user.email !== adminEmail) redirect('/');
  }
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-60 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="px-6 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2"><LayoutDashboard size={20} className="text-indigo-400" /><span className="font-bold text-lg">VC Admin</span></div>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
              <Icon size={16} />{label}
            </Link>
          ))}
        </nav>
        <form action="/api/admin/logout" method="POST" className="px-4 py-4 border-t border-gray-800">
          <button type="submit" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"><LogOut size={15} /> Sign out</button>
        </form>
      </aside>
      <main className="flex-1 overflow-auto"><div className="max-w-6xl mx-auto px-6 py-8">{children}</div></main>
    </div>
  );
}
