"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, Info, Dog, Trash2, Edit, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  weight: number | null;
  vaccinationStatus: string | null;
  medicalConditions: string | null;
  behaviorNotes: string | null;
  biteHistory: boolean;
  escapeHistory: boolean;
  feedingInstructions: string | null;
  walkingInstructions: string | null;
  vetContact: string | null;
  createdAt: string;
}

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500";

export default function PetsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    species: "Dog",
    breed: "",
    age: "",
    weight: "",
    medicalConditions: "",
    behaviorNotes: "",
    biteHistory: false,
    escapeHistory: false,
    vetContact: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // Fetch pets from the real API
  const fetchPets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/pets");
      if (!res.ok) throw new Error("Failed to fetch pets");
      const data = await res.json();
      setPets(data.pets);
    } catch {
      setError("Failed to load your pets. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchPets();
    }
  }, [status, fetchPets]);

  // Create a new pet — sends data to the real API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Pet name is required.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          species: form.species,
          breed: form.breed.trim() || undefined,
          age: form.age ? parseInt(form.age) : undefined,
          weight: form.weight ? parseFloat(form.weight) : undefined,
          medicalConditions: form.medicalConditions.trim() || undefined,
          behaviorNotes: form.behaviorNotes.trim() || undefined,
          biteHistory: form.biteHistory,
          escapeHistory: form.escapeHistory,
          vetContact: form.vetContact.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add pet");
      }

      // Reset form and refetch
      setForm({ name: "", species: "Dog", breed: "", age: "", weight: "", medicalConditions: "", behaviorNotes: "", biteHistory: false, escapeHistory: false, vetContact: "" });
      setShowAddForm(false);
      await fetchPets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add pet");
    } finally {
      setSaving(false);
    }
  };

  // Delete a pet
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this pet?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/pets/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete pet");
      await fetchPets();
    } catch {
      setError("Failed to delete pet. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

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

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-xl">
          {error}
          <button onClick={() => setError("")} className="ml-2 underline">Dismiss</button>
        </div>
      )}

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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Pet Name *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="e.g. Max" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Species</label>
                  <select value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })} className={`${inputClass} [&>option]:bg-slate-900`}>
                    <option>Dog</option>
                    <option>Cat</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Breed</label>
                  <input type="text" value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} className={inputClass} placeholder="e.g. Golden Retriever" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Age (Years)</label>
                  <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className={inputClass} placeholder="3" />
                </div>
              </div>

              <hr className="border-white/10" />

              <div className="space-y-4">
                <h3 className="font-bold text-white text-lg">Health & Safety</h3>
                <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 p-4 rounded-xl flex items-start gap-3">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Please be honest about bite history and medical conditions. This ensures we match you with an appropriately experienced sitter.</p>
                </div>

                <label className="flex items-start gap-3 cursor-pointer p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <input type="checkbox" checked={form.biteHistory} onChange={(e) => setForm({ ...form, biteHistory: e.target.checked })} className="w-5 h-5 rounded border-white/20 text-primary-500 bg-white/10 mt-0.5" />
                  <div>
                    <span className="block font-medium text-white">Bite History</span>
                    <span className="block text-sm text-slate-400">Has this pet ever bitten a person or another animal?</span>
                  </div>
                </label>

                <div className="space-y-2 pt-2">
                  <label className="text-sm font-medium text-slate-300">Medical Conditions & Behavior Notes</label>
                  <textarea rows={3} value={form.behaviorNotes} onChange={(e) => setForm({ ...form, behaviorNotes: e.target.value })} className={`${inputClass} resize-none`} placeholder="Separation anxiety, allergies, medication needs..." />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Vet Contact</label>
                  <input type="text" value={form.vetContact} onChange={(e) => setForm({ ...form, vetContact: e.target.value })} className={inputClass} placeholder="Dr. Sharma — 9876543210" />
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-4 border-t border-white/10 mt-6">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-3 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-6 py-3 rounded-xl font-bold bg-primary-600 hover:bg-primary-500 text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-50 flex items-center">
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {saving ? "Saving..." : "Save Pet Profile"}
                </button>
              </div>
            </form>
          </motion.div>
        ) : pets.length > 0 ? (
          <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4">
            {pets.map((pet) => (
              <motion.div
                key={pet.id}
                layout
                className="glass-card rounded-2xl border border-white/10 p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary-500/10 text-primary-400 rounded-full flex items-center justify-center border border-primary-500/20">
                    <Dog className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{pet.name}</h3>
                    <p className="text-sm text-slate-400">
                      {pet.species} {pet.breed ? `• ${pet.breed}` : ""} {pet.age ? `• ${pet.age} yrs` : ""}
                    </p>
                    {pet.biteHistory && <span className="text-xs text-amber-400 font-medium">⚠ Bite history noted</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(pet.id)}
                    disabled={deletingId === pet.id}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    title="Delete pet"
                  >
                    {deletingId === pet.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
