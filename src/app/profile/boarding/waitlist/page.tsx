"use client";

import { useState } from "react";
import { ArrowLeft, Home, Sparkles, Send } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function BoardingWaitlist() {
  const [joined, setJoined] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setJoined(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 relative z-10">
      <Link href="/profile/bookings/new" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Booking
      </Link>

      <AnimatePresence mode="wait">
        {!joined ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="glass-card p-10 rounded-3xl border border-white/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/30">
                <Home className="w-8 h-8" />
              </div>
              
              <h1 className="text-4xl font-display font-bold text-white mb-4">Premium In-Home Boarding</h1>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                We&apos;re designing a safer, cage-free boarding experience. To ensure the highest quality of care during our Phase 5 launch, boarding is currently <strong className="text-amber-400">invite-only</strong>.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-white block mb-2">Join the Beta Waitlist</label>
                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-slate-500"
                    />
                    <button 
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-400 text-amber-950 px-6 py-3 rounded-xl font-bold transition-all flex items-center shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                    >
                      Join <Send className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium">We&apos;ll notify you as soon as spots open up in Bopal, Ahmedabad.</p>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center rounded-3xl border border-amber-500/30 bg-amber-500/5 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full" />
            <div className="relative z-10">
              <Sparkles className="w-16 h-16 text-amber-400 mx-auto mb-6" />
              <h2 className="text-3xl font-display font-bold text-white mb-4">You&apos;re on the list!</h2>
              <p className="text-amber-200/70 mb-8">
                Thanks for your interest in PetSaathi Boarding. You are position <strong className="text-white">#42</strong> in the queue.
              </p>
              <Link href="/profile" className="inline-block bg-white hover:bg-slate-100 text-amber-950 px-8 py-3 rounded-xl font-bold transition-colors">
                Return Home
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
