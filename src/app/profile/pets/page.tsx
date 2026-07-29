"use client";

import { useState } from "react";
import { Plus, Info, Dog } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PetsPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight">My Pets</h1>
          <p className="text-slate-400 mt-2">Manage profiles for your furry family members.</p>
        </div>
        {!showAddForm && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center bg-primary-600 hover:bg-primary-500 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Pet
          </motion.button>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
      {showAddForm ? (
        <motion.div 
          key="form"
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="glass-card rounded-3xl border border-white/10 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Add a New Pet</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Pet Name</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500" placeholder="e.g. Max" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Species</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 [&>option]:bg-slate-900">
                  <option>Dog</option>
                  <option>Cat</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Breed</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500" placeholder="e.g. Golden Retriever" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Age (Years)</label>
                <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500" placeholder="3" />
              </div>
            </div>
            
            <hr className="border-white/10" />
            
            <div className="space-y-4">
              <h3 className="font-bold text-white text-lg">Health & Safety</h3>
              <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 p-4 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">Please be honest about bite history and medical conditions. This ensures we match you with an appropriately experienced sitter.</p>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <input type="checkbox" className="w-5 h-5 rounded border-white/20 text-primary-500 bg-white/10 mt-0.5" />
                  <div>
                    <span className="block font-medium text-white">Bite History</span>
                    <span className="block text-sm text-slate-400">Has this pet ever bitten a person or another animal?</span>
                  </div>
                </label>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-slate-300">Medical Conditions & Behavior Notes</label>
                <textarea rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500 resize-none" placeholder="Separation anxiety, allergies, medication needs..."></textarea>
              </div>
            </div>

            <div className="flex gap-4 justify-end pt-4 border-t border-white/10 mt-6 pt-6">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-3 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-3 rounded-xl font-bold bg-primary-600 hover:bg-primary-500 text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                Save Pet Profile
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        <motion.div 
          key="empty"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl border border-white/10 p-12 text-center"
        >
          <div className="w-24 h-24 bg-white/5 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
            <Dog className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No pets added yet</h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">Create a profile for your pet to start booking trusted sitters and walkers.</p>
          <button 
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Your First Pet
          </button>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
