'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
    { name: 'My Tasks', href: '/dashboard/tasks', icon: CheckSquare },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">TeamFlow</div>
      <nav style={{ flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="nav-link"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}
