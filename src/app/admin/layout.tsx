import type { Metadata } from "next";
import Link from "next/link";
import {
  LogOut,
  Home,
  Calendar,
  Users,
  Dog,
  FileText,
  BarChart3,
  Building2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard | PetSaathi",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-white/10 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <Link
            href="/admin"
            className="text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2"
          >
            PetSaathi
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary-400 bg-primary-500/10 px-2.5 py-0.5 rounded-full border border-primary-500/20">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-500/20 text-primary-300 border border-primary-500/30 font-semibold transition-colors"
          >
            <Home className="w-5 h-5 text-primary-400" />
            Dashboard
          </Link>
          <Link
            href="/admin/bookings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium transition-colors"
          >
            <Calendar className="w-5 h-5 text-slate-400" />
            Operations Triage
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium transition-colors"
          >
            <BarChart3 className="w-5 h-5 text-slate-400" />
            Analytics & SLA
          </Link>
          <Link
            href="/admin/sitters/applications"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium transition-colors"
          >
            <Users className="w-5 h-5 text-slate-400" />
            Sitter Applications
          </Link>
          <Link
            href="/admin/society"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white font-medium transition-colors"
          >
            <Building2 className="w-5 h-5 text-slate-400" />
            Society Committee
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 font-medium transition-colors border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-slate-900 border-b border-white/10 flex items-center justify-between px-6 md:hidden">
          <h1 className="font-display font-bold text-white text-lg">
            PetSaathi Admin
          </h1>
          <Link
            href="/admin/bookings"
            className="text-xs font-bold text-primary-400"
          >
            Triage
          </Link>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950">
          {children}
        </div>
      </main>
    </div>
  );
}
