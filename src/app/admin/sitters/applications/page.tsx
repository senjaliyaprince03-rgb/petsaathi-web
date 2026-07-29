"use client";

import { CheckCircle2, Search, ShieldAlert, AlertTriangle, ShieldCheck, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function ApplicationsPipeline() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 h-full flex flex-col relative z-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Sitter Verification Pipeline</h1>
        <p className="text-slate-400 mt-2 text-lg">Manage sitter applications from New (L0) to Trusted (L3).</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* L0: New Apps */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-3xl border border-white/10 flex flex-col h-[700px]">
          <div className="p-4 border-b border-white/10 bg-slate-900/50 rounded-t-3xl backdrop-blur-md">
            <h2 className="font-bold text-white flex items-center justify-between">
              New Apps (L0) <span className="bg-white/10 text-white text-xs px-2 py-1 rounded-full">3</span>
            </h2>
          </div>
          <div className="p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
            {[1, 2, 3].map((i) => (
              <motion.div whileHover={{ scale: 1.02 }} key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors">
                <div className="font-bold text-white mb-1">Rohan M.</div>
                <div className="text-xs text-slate-400 mb-3 font-medium">Applied 2 hrs ago</div>
                <button className="w-full bg-primary-600/20 text-primary-300 border border-primary-500/30 py-2 rounded-xl text-xs font-bold hover:bg-primary-500/40 transition-colors">Review Docs</button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* L1: Identity Verified */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-3xl border border-white/10 flex flex-col h-[700px]">
          <div className="p-4 border-b border-white/10 bg-blue-900/20 rounded-t-3xl backdrop-blur-md">
            <h2 className="font-bold text-blue-300 flex items-center justify-between">
              Identity Ver (L1) <span className="bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs px-2 py-1 rounded-full">2</span>
            </h2>
          </div>
          <div className="p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
             {[1, 2].map((i) => (
              <motion.div whileHover={{ scale: 1.02 }} key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                <div className="font-bold text-white mb-1 pl-2">Priya S.</div>
                <div className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 inline-block px-2 py-0.5 rounded uppercase font-bold tracking-wider mb-3 ml-2">Safety Quiz Pending</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* L2: Safety Verified */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-3xl border border-white/10 flex flex-col h-[700px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />
          <div className="p-4 border-b border-white/10 bg-emerald-900/20 rounded-t-3xl backdrop-blur-md relative z-10">
            <h2 className="font-bold text-emerald-300 flex items-center justify-between">
              Safety Ver (L2) <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs px-2 py-1 rounded-full">12</span>
            </h2>
          </div>
          <div className="p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar relative z-10">
             {[1, 2, 3, 4].map((i) => (
              <motion.div whileHover={{ scale: 1.02 }} key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">Anjali K.</span>
                </div>
                <div className="text-xs text-slate-400 mb-3 font-medium">Ready for Matching</div>
                <button className="w-full bg-white/5 text-slate-300 border border-white/10 py-2 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors">View Profile</button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* L3: Trusted */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-3xl border border-white/10 flex flex-col h-[700px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none" />
          <div className="p-4 border-b border-white/10 bg-purple-900/20 rounded-t-3xl backdrop-blur-md relative z-10">
            <h2 className="font-bold text-purple-300 flex items-center justify-between">
              Trusted (L3) <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs px-2 py-1 rounded-full">45</span>
            </h2>
          </div>
          <div className="p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar relative z-10">
             {[1, 2, 3].map((i) => (
              <motion.div whileHover={{ scale: 1.02 }} key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-white">Amit R.</span>
                </div>
                <div className="text-xs text-slate-400 font-medium">100+ Bookings • ⭐ 4.9</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
