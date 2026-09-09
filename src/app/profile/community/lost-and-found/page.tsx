"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, MapPin, Clock, ShieldAlert, Plus, Phone, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function LostAndFound() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative z-10 p-6 lg:p-0">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-rose-500" />
            Lost Pet Alerts
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Community support for missing resident pets in Safal Parisar.</p>
        </motion.div>
        
        <button 
          onClick={() => setShowForm(true)}
          className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)] flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Report Lost Pet
        </button>
      </div>

      <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-start gap-4">
        <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
        <p className="text-rose-200/80 text-sm leading-relaxed">
          <strong>Privacy Protected:</strong> Your direct phone number and apartment number will never be publicly displayed. All communication is routed securely. This system is for resident pets only, not for community animal (stray) reporting.
        </p>
      </div>

      {/* Alert Feed */}
      <div className="space-y-4">
        {/* Mock Alert */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-3xl border border-rose-500/30 bg-rose-500/5 flex flex-col md:flex-row gap-6 items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 blur-[50px] rounded-full pointer-events-none" />
          
          <div className="w-full md:w-48 h-48 bg-slate-800 rounded-2xl overflow-hidden flex-shrink-0 relative border border-white/10">
            <Image
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400&h=400"
              alt="Lost Beagle"
              width={400}
              height={400}
              className="w-full h-full object-cover"
              priority={false}
            />
            <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-lg animate-pulse">
              Missing
            </div>
          </div>
          
          <div className="flex-1 space-y-4 w-full">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Buddy (Beagle)</h2>
              <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-400">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-rose-400" /> Tower C / Main Gate</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-rose-400" /> Today, 10:30 AM</span>
              </div>
            </div>
            
            <p className="text-slate-300">Wearing a blue collar with a bone-shaped tag. Very friendly but might be scared. Please do not chase.</p>
            
            <div className="flex gap-3 pt-2">
              <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 border border-white/10">
                <ShieldAlert className="w-4 h-4" /> I spotted Buddy
              </button>
              <button className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 border border-rose-500/30">
                <Phone className="w-4 h-4" /> Contact Owner
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-lg glass-card rounded-3xl border border-white/10 p-8 shadow-2xl relative">
              
              {!submitted ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-white">Report Lost Pet</h3>
                    <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white transition-colors">&times;</button>
                  </div>
                  
                  <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Pet Name</label>
                      <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-rose-500" placeholder="e.g. Max" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Last Seen Location</label>
                      <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-rose-500" placeholder="e.g. Near Club House" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Description / Collar</label>
                      <textarea required rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-rose-500 resize-none" placeholder="Red collar, easily scared..." />
                    </div>
                    <div className="pt-4">
                      <button type="submit" className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)]">
                        Publish Alert Securely
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Alert Published</h3>
                  <p className="text-slate-400 mb-8">Your alert has been sent to Safal Parisar residents and security. Your phone number is hidden.</p>
                  <button onClick={() => { setShowForm(false); setSubmitted(false); }} className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold px-8 py-3 rounded-xl transition-colors">
                    Close
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
