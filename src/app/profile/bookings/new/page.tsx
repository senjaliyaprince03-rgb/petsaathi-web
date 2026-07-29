"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, CreditCard, ChevronRight, Loader2, Dog, Clock, CalendarDays, MapPin, Building2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FEATURE_FLAGS, isAreaActive } from "@/lib/flags";

export default function NewBooking() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [isFirstWalk, setIsFirstWalk] = useState(true); // Simulate new customer
  
  const [booking, setBooking] = useState({
    pet: "",
    service: "",
    date: "",
    duration: "",
    instructions: "",
    city: "Ahmedabad",
    area: "",
    society: "",
  });

  const getPrice = () => {
    if (booking.service === "WALKING") return isFirstWalk ? 99 : 149;
    if (booking.service === "SITTING") return isFirstWalk ? 249 : 299;
    return 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      // Simulate API submission and mock payment checkout
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
      }, 2000);
    }
  };

  if (isSuccess) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto glass-card rounded-3xl border border-white/10 p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full" />
        <div className="relative z-10">
          <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-display font-bold text-white mb-4">Payment Successful!</h2>
          <p className="text-slate-300 mb-10 text-lg">
            Your booking request has been confirmed. Our team is matching you with the perfect sitter. You&apos;ll receive a notification once assigned.
          </p>
          <Link href="/profile" className="inline-flex items-center bg-white hover:bg-slate-100 text-emerald-900 px-8 py-4 rounded-xl font-bold transition-colors shadow-lg">
            Return to Dashboard
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/profile" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Link>
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Request a Service</h1>
      </div>

      <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-white/5 p-6 border-b border-white/10 flex gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 relative">
              <div className="h-2 rounded-full mb-2 bg-white/10 overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: step >= s ? "100%" : "0%" }}
                    className="h-full bg-primary-500"
                    transition={{ duration: 0.5 }}
                 />
              </div>
              <div className={`text-xs font-bold uppercase tracking-wider ${step >= s ? "text-primary-400" : "text-slate-500"}`}>
                {s === 1 ? "Details" : s === 2 ? "Review" : "Payment"}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 relative">
          <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-white">Which pet needs care?</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all hover:-translate-y-1 ${booking.pet === "Max" ? "border-primary-500 bg-primary-500/20 shadow-[0_0_15px_rgba(37,99,235,0.3)]" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                    <input type="radio" name="pet" className="sr-only" onChange={() => setBooking({...booking, pet: "Max"})} checked={booking.pet === "Max"} />
                    <Dog className={`w-6 h-6 mr-3 ${booking.pet === "Max" ? "text-primary-400" : "text-slate-400"}`} />
                    <span className="font-bold text-white">Max (Golden Retriever)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-white flex justify-between">
                  Service Type
                  {isFirstWalk && <span className="text-emerald-400 text-xs bg-emerald-500/10 px-2 py-0.5 rounded-full">First-Time Offer Available!</span>}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["WALKING", "SITTING"].map((srv) => (
                    <label key={srv} className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all hover:-translate-y-1 ${booking.service === srv ? "border-primary-500 bg-primary-500/20 shadow-[0_0_15px_rgba(37,99,235,0.3)]" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                      <div className="flex items-center">
                        <input type="radio" name="service" className="sr-only" onChange={() => setBooking({...booking, service: srv})} checked={booking.service === srv} />
                        <span className="font-bold text-white capitalize">{srv.toLowerCase()}</span>
                      </div>
                      {isFirstWalk && (
                        <div className="mt-2 text-xs font-bold text-emerald-400">
                          Trial: ₹{srv === "WALKING" ? "99" : "249"} <span className="line-through text-slate-500 ml-1">₹{srv === "WALKING" ? "149" : "299"}</span>
                        </div>
                      )}
                    </label>
                  ))}
                  
                  {/* Boarding Disabled (Phase 5 Beta) */}
                  <label className="flex flex-col p-4 rounded-xl border border-white/5 bg-white/5 opacity-60 cursor-not-allowed">
                     <div className="flex justify-between items-center w-full">
                       <span className="font-bold text-slate-400">Boarding</span>
                       <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-bold uppercase tracking-wider">Beta</span>
                     </div>
                     <Link href="/profile/boarding/waitlist" className="mt-2 text-xs text-primary-400 hover:underline z-10 pointer-events-auto">Join Waitlist &rarr;</Link>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-white flex justify-between">
                    Service Area
                    {booking.area && !isAreaActive(booking.city, booking.area) && <span className="text-red-400 text-xs">Currently unavailable in this area</span>}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                    <select required value={booking.area} onChange={(e) => setBooking({...booking, area: e.target.value, society: ""})} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white [&>option]:bg-slate-900">
                      <option value="">Select your area...</option>
                      <option value="Bopal">Bopal (Active Launch Area)</option>
                      <option value="Satellite">Satellite</option>
                      <option value="Vastrapur">Vastrapur</option>
                      <option value="Thaltej">Thaltej</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-white flex justify-between">
                    Society (Optional)
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                    <select disabled={booking.area !== "Bopal"} value={booking.society} onChange={(e) => setBooking({...booking, society: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white disabled:opacity-50 [&>option]:bg-slate-900">
                      <option value="">None / Independent House</option>
                      {booking.area === "Bopal" && (
                        <>
                          <option value="Safal Parisar">Safal Parisar</option>
                          <option value="Orchid Greens">Orchid Greens</option>
                        </>
                      )}
                    </select>
                  </div>
                  {booking.society === "Safal Parisar" && (
                    <div className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg mt-1 inline-flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Society Access Rules Apply
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white">Date & Time</label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                    <input type="datetime-local" required value={booking.date} onChange={(e) => setBooking({...booking, date: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white [&::-webkit-calendar-picker-indicator]:invert" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white">Duration</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                    <select required value={booking.duration} onChange={(e) => setBooking({...booking, duration: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white [&>option]:bg-slate-900">
                      <option value="">Select duration</option>
                      <option value="30m">30 Minutes</option>
                      <option value="60m">60 Minutes</option>
                      <option value="overnight">Overnight</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white">Special Instructions</label>
                <textarea rows={3} value={booking.instructions} onChange={(e) => setBooking({...booking, instructions: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500 resize-none" placeholder="Gate code, feeding instructions, etc..." />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <h3 className="text-2xl font-bold text-white">Review Booking Details</h3>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex justify-between pb-4 border-b border-white/10">
                  <span className="text-slate-400">Service</span>
                  <span className="font-bold text-white capitalize">{booking.service.toLowerCase()}</span>
                </div>
                <div className="flex justify-between pb-4 border-b border-white/10">
                  <span className="text-slate-400">Pet</span>
                  <span className="font-bold text-white">{booking.pet}</span>
                </div>
                <div className="flex justify-between pb-4 border-b border-white/10">
                  <span className="text-slate-400">Date</span>
                  <span className="font-bold text-white">{new Date(booking.date).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration</span>
                  <span className="font-bold text-white">{booking.duration}</span>
                </div>
              </div>
              
              <div className="bg-primary-500/20 p-6 rounded-2xl border border-primary-500/30 flex justify-between items-center shadow-[0_0_30px_rgba(37,99,235,0.1)]">
                <div>
                  <span className="font-bold text-white text-lg block">Estimated Total</span>
                  {isFirstWalk && <span className="text-xs text-emerald-400 font-bold">First-Time Discount Applied</span>}
                </div>
                <span className="text-4xl font-display font-bold text-primary-400">₹{getPrice()}</span>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <h3 className="text-2xl font-bold text-white">Checkout</h3>
              
              <div className="bg-white/5 p-10 rounded-3xl border border-white/10 text-center space-y-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 blur-3xl" />
                <CreditCard className="w-16 h-16 text-primary-400 mx-auto relative z-10" />
                <div className="relative z-10">
                  <div className="font-bold text-white text-xl">Mock Payment Integration</div>
                  <div className="text-slate-400 mt-2">This simulates the Razorpay checkout flow.</div>
                </div>
                
                <motion.div whileHover={{ scale: 1.05 }} className="bg-white/10 border border-white/20 rounded-2xl p-5 max-w-sm mx-auto flex items-center justify-between relative z-10 backdrop-blur-md">
                  <div className="flex items-center">
                    <div className="w-12 h-8 bg-blue-600 rounded mr-4 flex items-center justify-center shadow-inner">
                      <span className="text-white text-[10px] font-bold italic">VISA</span>
                    </div>
                    <span className="font-mono text-white tracking-widest">•••• 4242</span>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </motion.div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>

          <div className="mt-10 pt-8 border-t border-white/10 flex justify-between relative z-10">
            {step > 1 ? (
              <button type="button" onClick={() => setStep(s => s - 1)} className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                Back
              </button>
            ) : <div></div>}
            
            <button 
              type="submit" 
              disabled={isLoading || (step === 1 && (!booking.pet || !booking.service || !booking.date || !booking.duration || !isAreaActive(booking.city, booking.area)))}
              className="flex items-center bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : step === 3 ? `Pay ₹${getPrice()}` : <>Continue <ChevronRight className="w-5 h-5 ml-1" /></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
