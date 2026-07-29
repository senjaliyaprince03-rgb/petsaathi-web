import type { Metadata } from "next";
import Link from "next/link";
import { LogOut, Home, Calendar, Users, Dog, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard | PetSaathi",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-100">
          <Link href="/admin" className="text-2xl font-display font-bold text-primary-600">
            PetSaathi<span className="text-sm text-slate-500 font-normal ml-2">Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 text-primary-700 font-medium">
            <Home className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/bookings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 font-medium transition-colors">
            <Calendar className="w-5 h-5" />
            Bookings Tracker
          </Link>
          <Link href="/admin/sitters" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 font-medium transition-colors">
            <Users className="w-5 h-5" />
            Sitter Directory
          </Link>
          <Link href="/admin/customers" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 font-medium transition-colors">
            <Dog className="w-5 h-5" />
            Pets & Customers
          </Link>
          <Link href="/admin/reports" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 font-medium transition-colors">
            <FileText className="w-5 h-5" />
            Service Reports
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100">
          {/* A simple logout button. Real app would use NextAuth signOut */}
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-medium transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 md:hidden">
          <h1 className="font-display font-bold text-primary-600">PetSaathi Admin</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          {children}
        </div>
      </main>
    </div>
  );
}
