"use client";

import { useState } from "react";
import { Clock, Search, MapPin, CheckCircle2, AlertTriangle, ShieldCheck, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminBookings() {
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const bookings = [
    {
      id: "BK-1029",
      pet: "Max (Golden Retriever)",
      service: "Walking",
      date: "Today, 5:00 PM",
      status: "REQUESTED",
      area: "Bandra West",
      risk: "UNASSESSED"
    },
    {
      id: "BK-1030",
      pet: "Bella (Persian Cat)",
      service: "Sitting",
      date: "Tomorrow, 10:00 AM",
      status: "MATCHING",
      area: "Andheri",
      risk: "LOW"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 h-full flex flex-col relative z-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Operations Triage</h1>
        <p className="text-slate-400 mt-2 text-lg">Manage active bookings and assign verified sitters.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
        
        {/* Left Column: Triage List */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1 glass-card rounded-3xl border border-white/10 flex flex-col h-[700px] overflow-hidden">
          <div className="p-6 border-b border-white/10 bg-white/5 backdrop-blur-md">
            <h2 className="font-bold text-white text-xl flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Action Required
            </h2>
          </div>
          <div className="overflow-y-auto flex-1 p-4 space-y-3 custom-scrollbar">
            {bookings.map((bk) => (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                key={bk.id}
                onClick={() => setSelectedBooking(bk.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${
                  selectedBooking === bk.id 
                    ? "bg-primary-500/20 border-primary-500/50 shadow-[0_0_15px_rgba(37,99,235,0.2)]" 
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                {selectedBooking === bk.id && <motion.div layoutId="activeTriage" className="absolute left-0 top-0 bottom-0 w-1 bg-primary-400" />}
                
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-slate-400 tracking-wider">{bk.id}</span>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
                    bk.status === "REQUESTED" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  }`}>
                    {bk.status}
                  </span>
                </div>
                <div className="font-bold text-white text-lg mb-2">{bk.service} • {bk.pet}</div>
                <div className="flex items-center text-xs text-slate-400 mb-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 mr-1.5" /> {bk.area}
                </div>
                <div className="flex items-center text-xs text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5 mr-1.5" /> {bk.date}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Detail & Assignment View */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 glass-card rounded-3xl border border-white/10 p-8 h-[700px] overflow-y-auto custom-scrollbar relative">
          <AnimatePresence mode="wait">
          {selectedBooking ? (
            <motion.div key="details" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-8 relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-display font-bold text-white">Booking {selectedBooking}</h2>
                  <div className="flex gap-3 mt-3">
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-3 py-1.5 rounded-full font-bold tracking-wider uppercase">Status: REQUESTED</span>
                    <span className="bg-slate-800 text-slate-300 border border-slate-700 text-xs px-3 py-1.5 rounded-full font-bold tracking-wider uppercase">Risk: UNASSESSED</span>
                  </div>
                </div>
                <button className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
                  Cancel Booking
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 p-6 bg-white/5 rounded-2xl border border-white/10">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Service</div>
                  <div className="font-bold text-white text-lg">Dog Walking (60m)</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Schedule</div>
                  <div className="font-bold text-white text-lg">Today, 5:00 PM</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Customer Instructions</div>
                  <div className="text-sm text-slate-300 bg-slate-900/50 p-4 rounded-xl border border-white/10 italic">
                    &quot;Max pulls on the leash when he sees squirrels. Please use the harness provided near the door.&quot;
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Sitter Assignment Matching</h3>
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
                  
                  <div className="flex items-center gap-3 mb-6 text-blue-300">
                    <Search className="w-5 h-5 animate-pulse" />
                    <span className="font-bold tracking-wide">Querying Matching Engine (Phase 3 API)...</span>
                  </div>
                  
                  <div className="space-y-4 relative z-10">
                    {[
                      { name: "Rahul S.", level: "L3 Trusted", dist: "1.2 km", rating: "4.9", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30" },
                      { name: "Neha R.", level: "L2 Verified", dist: "2.5 km", rating: "4.7", icon: User, color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30" }
                    ].map((sitter, i) => (
                      <motion.div whileHover={{ scale: 1.02 }} key={i} className="bg-slate-900/80 p-5 rounded-xl border border-white/10 flex justify-between items-center backdrop-blur-md">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full ${sitter.bg} ${sitter.border} border flex items-center justify-center ${sitter.color}`}>
                            <sitter.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-lg flex items-center gap-3">
                              {sitter.name} 
                              <span className={`text-[10px] ${sitter.bg} ${sitter.color} ${sitter.border} border px-2 py-1 rounded-full uppercase tracking-wider`}>{sitter.level}</span>
                            </div>
                            <div className="text-sm text-slate-400 mt-1 font-medium">{sitter.dist} away • ⭐ {sitter.rating} (12 Bookings)</div>
                          </div>
                        </div>
                        <button className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                          Assign
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-slate-500">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <CheckCircle2 className="w-12 h-12 text-slate-600" />
              </div>
              <p className="text-lg font-medium">Select a booking from the triage list to manage it.</p>
            </motion.div>
          )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
