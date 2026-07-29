"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ApplicationForm() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    area: "",
    services: [] as string[],
    experience: "",
  });

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call for MVP
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 rounded-3xl text-center"
      >
        <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-4">Application Received!</h2>
        <p className="text-slate-300 mb-8 max-w-md mx-auto">
          Thank you for applying to become a PetSaathi. Our trust & safety team will review your application and contact you for a phone screen within 48 hours.
        </p>
        <Link href="/" className="inline-flex bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-colors">
          Return Home
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="glass-card p-6 md:p-10 rounded-3xl">
      {/* Progress Bar */}
      <div className="mb-8 relative">
        <div className="flex justify-between mb-2">
          {["Basic Info", "Services", "Experience"].map((label, i) => (
            <div key={label} className={`text-xs font-medium ${step >= i + 1 ? "text-primary-400" : "text-slate-500"}`}>
              {label}
            </div>
          ))}
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary-500"
            initial={{ width: "33%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Let&apos;s start with the basics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Amit Verma"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="amit@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Mumbai"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-white mb-6">What services can you provide?</h3>
              
              <div className="space-y-3">
                {[
                  { id: "WALKING", label: "Dog Walking", desc: "Regular 30 or 60 minute walks" },
                  { id: "SITTING", label: "Pet Sitting", desc: "Home visits or house sitting" },
                  { id: "BOARDING", label: "In-Home Boarding", desc: "Host pets overnight in your home" },
                ].map((service) => (
                  <label
                    key={service.id}
                    className={`flex items-start p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.services.includes(service.id)
                        ? "bg-primary-500/10 border-primary-500"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex h-5 items-center mt-0.5">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-white/20 text-primary-500 focus:ring-primary-500 bg-white/10"
                        checked={formData.services.includes(service.id)}
                        onChange={() => handleServiceToggle(service.id)}
                      />
                    </div>
                    <div className="ml-3">
                      <span className="block text-white font-medium">{service.label}</span>
                      <span className="block text-slate-400 text-sm mt-1">{service.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Tell us about your experience</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Why do you want to be a PetSaathi?</label>
                <textarea
                  required
                  rows={4}
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="Tell us about any past experience with pets, your availability, and why you love animals..."
                />
              </div>
              
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-200">
                  <strong>Trust & Safety Note:</strong> All accepted applicants must pass a phone screen, safety quiz, and identity verification before accepting bookings.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex justify-between items-center">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>
          ) : (
            <div></div>
          )}
          
          <button
            type="submit"
            disabled={isLoading || (step === 2 && formData.services.length === 0)}
            className="flex items-center bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : step === 3 ? (
              "Submit Application"
            ) : (
              <>Continue <ChevronRight className="w-4 h-4 ml-1" /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
