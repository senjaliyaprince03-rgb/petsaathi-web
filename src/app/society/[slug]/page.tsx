"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ShieldCheck, CheckCircle2, ChevronRight, MapPin, CalendarDays, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function SocietyLanding() {
  const params = useParams();
  const slug = params.slug as string;
  const societyName = slug ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "Your Society";
  
  const [joined, setJoined] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", service: "WALKING" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      setJoined(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col items-center pb-20">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

      {/* Header */}
      <div className="w-full max-w-6xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <Link href="/" className="font-display font-bold text-2xl text-white tracking-tight flex items-center gap-2">
          <span className="text-primary-500 text-3xl">🐾</span> PetSaathi
        </Link>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
           <Building2 className="w-4 h-4 text-slate-400" />
           <span className="text-sm font-bold text-slate-300">Partnered with {societyName}</span>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10 items-center">
        
        {/* Left Content */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Official Launch Partner
          </div>
          <h1 className="text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
            Premium Pet Care, exclusively for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-400">{societyName}</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            Your RWA has partnered with PetSaathi to bring verified, security-approved dog walkers and sitters directly to your community. 
          </p>

          <div className="space-y-4">
            {[
               "Sitter identity registered with main gate security.",
               "GPS tracked walks with photo updates & Report Cards.",
               "No-hassle repeat bookings with the same trusted sitter.",
               "Cleanliness and common-area rules strictly followed."
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Form */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="w-full max-w-md mx-auto lg:ml-auto">
          <AnimatePresence mode="wait">
            {!joined ? (
              <motion.div key="form" exit={{ opacity: 0, scale: 0.95 }} className="glass-card rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 to-emerald-500" />
                
                <h3 className="text-2xl font-display font-bold text-white mb-2">Claim your ₹99 Trial</h3>
                <p className="text-slate-400 text-sm mb-8">Join the exclusive pilot program for {societyName} residents. Spots are limited.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="First Last" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp Number</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interested In</label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className={`border rounded-xl p-3 text-center cursor-pointer transition-colors text-sm font-bold ${formData.service === 'WALKING' ? 'bg-primary-500/20 border-primary-500 text-primary-300' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                        <input type="radio" name="service" className="sr-only" checked={formData.service === 'WALKING'} onChange={() => setFormData({...formData, service: 'WALKING'})} />
                        Dog Walking
                      </label>
                      <label className={`border rounded-xl p-3 text-center cursor-pointer transition-colors text-sm font-bold ${formData.service === 'SITTING' ? 'bg-primary-500/20 border-primary-500 text-primary-300' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                        <input type="radio" name="service" className="sr-only" checked={formData.service === 'SITTING'} onChange={() => setFormData({...formData, service: 'SITTING'})} />
                        Pet Sitting
                      </label>
                    </div>
                  </div>
                  
                  <button type="submit" className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex justify-center items-center group mt-2">
                    Claim Offer <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-[10px] text-slate-500 text-center mt-4">By submitting, you agree to our Privacy Policy. We do not share your unit number or medical details with the RWA.</p>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-3xl p-10 border border-emerald-500/30 bg-emerald-500/5 text-center shadow-2xl">
                 <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                  <CheckCircle2 className="w-10 h-10" />
                 </div>
                 <h3 className="text-3xl font-display font-bold text-white mb-2">You&apos;re on the list!</h3>
                 <p className="text-slate-300 mb-8">We&apos;ve reserved your ₹99 trial slot for {societyName}. Our team will WhatsApp you the booking link shortly.</p>
                 <Link href="/" className="inline-block border border-white/20 hover:bg-white/10 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                    Return to Home
                 </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

    </div>
  );
}
