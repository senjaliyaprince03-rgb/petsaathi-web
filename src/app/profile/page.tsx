"use client";

import Link from "next/link";
import { Plus, Calendar, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfileDashboard() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Welcome back!</h1>
        <p className="text-slate-400 mt-2 text-lg">Manage your pets, bookings, and account details here.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="glass-card p-8 rounded-3xl flex flex-col items-center justify-center text-center h-72 border border-white/10 hover:border-primary-500/50 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="w-20 h-20 bg-primary-500/20 text-primary-400 rounded-2xl flex items-center justify-center mb-6 border border-primary-500/30 group-hover:scale-110 transition-transform duration-500">
            <Plus className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Book a Service</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-[220px]">Find a trusted sitter or walker for your furry friend.</p>
          <Link href="/profile/bookings/new" className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl font-bold transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            Find a Sitter <ChevronRight className="w-5 h-5 ml-1" />
          </Link>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col h-72"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white text-xl">Upcoming Bookings</h3>
            <Link href="/profile/bookings" className="text-primary-400 text-sm font-medium hover:text-primary-300 hover:underline transition-colors">View All</Link>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
            
            {/* Completed Booking with Repeat Prompts */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-bold text-white">Dog Walking (30m)</div>
                  <div className="text-sm text-slate-400">Max • Today, 9:00 AM</div>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full uppercase tracking-wider font-bold border border-emerald-500/30">
                  Completed
                </span>
              </div>
              
              <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 mb-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">How did we do?</div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 py-2 rounded-lg text-sm font-bold border border-white/10 transition-colors">⭐⭐⭐⭐⭐</button>
                  <button className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 py-2 rounded-lg text-sm font-bold border border-white/10 transition-colors">Issue</button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Quick Actions</div>
                <button className="w-full bg-primary-600/20 hover:bg-primary-500/30 text-primary-400 py-2.5 rounded-xl text-sm font-bold border border-primary-500/30 transition-colors text-left px-4 flex justify-between items-center">
                  Book Rahul S. Again <ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl text-sm font-bold border border-white/10 transition-colors text-left px-4 flex justify-between items-center">
                  Join Weekly Walking Plan <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 uppercase tracking-wider">Beta</span>
                </button>
                <button className="w-full bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl text-sm font-bold border border-white/10 transition-colors text-left px-4 flex justify-between items-center">
                  Refer a Pet Parent (Earn ₹150)
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
