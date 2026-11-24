"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { FolderOpen, LayoutDashboard, PencilLine, Plus, Sparkles } from "lucide-react";

const navigation = [
  {
    label: "Home",
    href: "/studio",
    icon: LayoutDashboard,
  },
  {
    label: "All projects",
    href: "/studio/projects",
    icon: FolderOpen,
  },
  {
    label: "Design editor",
    href: "/studio/editor",
    icon: PencilLine,
  },
];

export default function StudioSidebar() {
  const pathname = usePathname();

  return (
    <aside className="studio-dashboard-sidebar">
      <Link
        href="/studio/editor?preset=instagramPortrait"
        className="studio-dashboard-primary studio-sidebar-create"
      >
        <Plus size={18} aria-hidden="true" />
        Create a design
      </Link>

      <p className="studio-dashboard-nav-label">Workspace</p>

      <nav aria-label="Studio navigation">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="studio-dashboard-nav-item"
            >
              <Icon size={19} aria-hidden="true" />

              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="studio-dashboard-sidebar-footer">
        <Sparkles size={16} aria-hidden="true" />
        Your private creative workspace
      </div>
    </aside>
  );
}
