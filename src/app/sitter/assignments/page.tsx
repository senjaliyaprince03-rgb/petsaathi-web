"use client";

import { useState } from "react";
import { CheckCircle2, Clock, MapPin, Camera, AlertTriangle, FileText, Send, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SitterAssignments() {
  const [activeTab, setActiveTab] = useState("UPCOMING");
  const [showReportForm, setShowReportForm] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 md:p-10 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">My Assignments</h1>
        <p className="text-slate-400 mt-2 text-lg">Manage your scheduled services and submit reports.</p>
      </motion.div>

      <div className="flex gap-2 border-b border-white/10 relative z-10">
        {["UPCOMING", "ACTIVE", "COMPLETED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-bold transition-all relative ${
              activeTab === tab 
                ? "text-primary-400" 
                : "text-slate-500 hover:text-white"
            }`}
          >
            {activeTab === tab && (
              <motion.div layoutId="tabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400" />
            )}
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
      {activeTab === "ACTIVE" && !showReportForm && (
        <motion.div key="active" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card border border-primary-500/30 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(37,99,235,0.1)] relative z-10">
          <div className="bg-primary-600/20 border-b border-primary-500/30 p-6 md:p-8 flex justify-between items-center backdrop-blur-md">
            <div>
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/10">In Progress</span>
              <h2 className="text-3xl font-display font-bold text-white mt-4">Dog Walking • Max</h2>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-primary-300 uppercase tracking-wider">Elapsed Time</div>
              <div className="text-3xl font-display font-bold text-white tracking-widest mt-1">00:42:15</div>
            </div>
          </div>
          
          <div className="p-6 md:p-8 space-y-8 bg-slate-900/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                <div className="text-xs text-amber-400 font-bold uppercase mb-2 tracking-wider">Customer Notes</div>
                <p className="text-slate-300">Max pulls on the leash when he sees squirrels. Use the harness provided.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                <div className="text-xs text-red-400 font-bold uppercase mb-2 tracking-wider">Emergency Info</div>
                <p className="text-slate-300">Vet: Happy Paws Clinic (022-12345678)</p>
              </div>
            </div>

            <div className="flex gap-4">
              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setShowReportForm(true)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex justify-center items-center gap-2"
              >
                <CheckCircle2 className="w-6 h-6" /> Complete Service
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 px-6 rounded-2xl font-bold transition-colors flex flex-col justify-center items-center gap-1 backdrop-blur-md">
                <AlertTriangle className="w-6 h-6" />
                <span className="text-xs uppercase tracking-wider">SOS</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {showReportForm && (
        <motion.div key="report" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-card rounded-3xl border border-white/10 p-6 md:p-8 relative z-10">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
            <div className="w-12 h-12 bg-primary-500/20 rounded-2xl flex items-center justify-center border border-primary-500/30">
              <FileText className="w-6 h-6 text-primary-400" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white">Service Report Card</h2>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">Bathroom</label>
                <div className="flex gap-4">
                  <label className="flex-1 text-center bg-white/5 border border-white/10 rounded-2xl py-4 cursor-pointer hover:bg-white/10 transition-colors">
                    <input type="checkbox" className="sr-only" /> 
                    <span className="text-2xl block mb-1">💦</span>
                    <span className="text-white font-bold">Pee</span>
                  </label>
                  <label className="flex-1 text-center bg-white/5 border border-white/10 rounded-2xl py-4 cursor-pointer hover:bg-white/10 transition-colors">
                    <input type="checkbox" className="sr-only" /> 
                    <span className="text-2xl block mb-1">💩</span>
                    <span className="text-white font-bold">Poop</span>
                  </label>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">Mood</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 [&>option]:bg-slate-900">
                  <option>Happy & Energetic</option>
                  <option>Calm & Relaxed</option>
                  <option>Anxious / Scared</option>
                  <option>Lethargic</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">Photos (Optional)</label>
              <div className="border-2 border-dashed border-white/20 bg-white/5 rounded-3xl p-10 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-white/10 hover:border-white/30 transition-colors">
                <Camera className="w-10 h-10 mb-3 text-slate-500" />
                <span className="font-bold">Tap to upload photos</span>
                <span className="text-sm mt-1 text-slate-500">Share the fun with the customer</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">Report Note</label>
              <textarea 
                rows={4} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="How did the walk go? Did they meet any friends?"
              ></textarea>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowReportForm(false);
                setActiveTab("COMPLETED");
              }}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex justify-center items-center gap-2"
            >
              <Send className="w-6 h-6" /> Submit Report to Customer
            </motion.button>
          </div>
        </motion.div>
      )}

      {activeTab === "UPCOMING" && (
        <motion.div key="upcoming" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card border border-white/10 rounded-3xl p-16 text-center text-slate-500 relative z-10">
          <Calendar className="w-16 h-16 mx-auto mb-6 text-slate-600" />
          <h3 className="text-2xl font-bold text-white mb-2">No upcoming assignments</h3>
          <p className="text-lg">You have no scheduled services at this time.</p>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}


