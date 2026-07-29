"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Home, Calendar, Dog, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const navItems = [
    { href: "/profile", icon: Home, label: "Dashboard" },
    { href: "/profile/pets", icon: Dog, label: "My Pets" },
    { href: "/profile/bookings", icon: Calendar, label: "Bookings" },
    { href: "/profile/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none" />

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-64 border-r border-white/10 flex flex-col hidden md:flex relative z-10 glass-panel"
      >
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-blue-400">
            PetSaathi
          </Link>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="relative block group">
                {isActive && (
                  <motion.div 
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-primary-600/20 border border-primary-500/30 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive ? "text-primary-400" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}>
                  <item.icon className={`w-5 h-5 ${isActive ? "text-primary-400" : "text-slate-500 group-hover:text-white"}`} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 font-medium transition-colors border border-transparent hover:border-red-500/20">
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        <header className="h-16 border-b border-white/10 flex items-center px-8 md:hidden glass-panel">
          <h1 className="font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-blue-400">PetSaathi</h1>
        </header>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-1 overflow-y-auto p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
