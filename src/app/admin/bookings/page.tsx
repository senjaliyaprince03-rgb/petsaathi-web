"use client";

import { useState, useEffect } from "react";
import { Clock, MapPin, CheckCircle2, AlertTriangle, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BookingItem {
  id: string;
  referenceId: string | null;
  serviceType: string;
  status: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  location: string | null;
  parent?: {
    id: string;
    name: string;
    email: string;
  };
  sitter?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface SitterMatch {
  id: string;
  userId: string;
  level: string;
  rating: number;
  baseRate: number;
  user: {
    name: string;
    area: string | null;
    city: string | null;
  };
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [sitterMatches, setSitterMatches] = useState<SitterMatch[]>([]);
  const [loadingSitters, setLoadingSitters] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = statusFilter === "ALL" 
        ? "/api/admin/bookings?limit=50" 
        : `/api/admin/bookings?status=${statusFilter}&limit=50`;
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("You must be logged in as an Admin to view triage operations.");
        }
        throw new Error("Failed to load operations triage.");
      }
      const data = await res.json();
      setBookings(data.bookings || []);
      if (data.bookings && data.bookings.length > 0 && !selectedBookingId) {
        setSelectedBookingId(data.bookings[0].id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const selectedBooking = bookings.find((b) => b.id === selectedBookingId);

  // When a booking is selected, look for matches
  useEffect(() => {
    if (!selectedBooking) {
      setSitterMatches([]);
      return;
    }

    const fetchMatches = async () => {
      setLoadingSitters(true);
      try {
        const areaParam = selectedBooking.location ? `&area=${encodeURIComponent(selectedBooking.location)}` : "";
        const res = await fetch(`/api/match?service=${selectedBooking.serviceType}${areaParam}`);
        if (res.ok) {
          const data = await res.json();
          setSitterMatches(data.matches || []);
        } else {
          setSitterMatches([]);
        }
      } catch (err) {
        setSitterMatches([]);
      } finally {
        setLoadingSitters(false);
      }
    };

    fetchMatches();
  }, [selectedBookingId]);

  const handleAssignSitter = async (sitterUserId: string) => {
    if (!selectedBookingId) return;
    try {
      setActionLoading(true);
      const res = await fetch(`/api/bookings/${selectedBookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sitterId: sitterUserId,
          status: "SITTER_ASSIGNED",
        }),
      });
      if (res.ok) {
        await fetchBookings();
      } else {
        alert("Failed to assign sitter");
      }
    } catch (err) {
      alert("Error assigning sitter");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedBookingId) return;
    try {
      setActionLoading(true);
      const res = await fetch(`/api/bookings/${selectedBookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await fetchBookings();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      alert("Error updating status");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 h-full flex flex-col relative z-10 p-4 md:p-6 lg:p-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight">Operations Triage</h1>
          <p className="text-slate-400 mt-2 text-lg">Manage active bookings, triage inquiries, and assign sitters.</p>
        </motion.div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
          {["ALL", "NEW_LEAD", "SITTER_MATCHING", "SITTER_ASSIGNED", "CONFIRMED", "SERVICE_STARTED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === status
                  ? "bg-primary-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
        {/* Left Column: Triage List */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1 glass-card rounded-3xl border border-white/10 flex flex-col h-[700px] overflow-hidden">
          <div className="p-6 border-b border-white/10 bg-white/5 backdrop-blur-md flex justify-between items-center">
            <h2 className="font-bold text-white text-xl flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Triage Queue
            </h2>
            <span className="text-xs bg-white/10 text-white font-bold px-2.5 py-1 rounded-full">
              {bookings.length}
            </span>
          </div>

          <div className="overflow-y-auto flex-1 p-4 space-y-3 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <span>Loading triage queue...</span>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-40 text-emerald-400" />
                <p className="font-medium text-white">Queue Clear</p>
                <p className="text-xs mt-1">No bookings match the selected status filter.</p>
              </div>
            ) : (
              bookings.map((bk) => (
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  key={bk.id}
                  onClick={() => setSelectedBookingId(bk.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${
                    selectedBookingId === bk.id 
                      ? "bg-primary-500/20 border-primary-500/50 shadow-[0_0_15px_rgba(37,99,235,0.2)]" 
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {selectedBookingId === bk.id && <motion.div layoutId="activeTriage" className="absolute left-0 top-0 bottom-0 w-1 bg-primary-400" />}
                  
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-slate-400 tracking-wider">
                      {bk.referenceId || bk.id.substring(0, 8)}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      bk.status === "CONFIRMED" || bk.status === "SERVICE_COMPLETED"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : bk.status === "NEW_LEAD" || bk.status === "SITTER_MATCHING"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}>
                      {bk.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="font-bold text-white text-lg mb-1">{bk.serviceType}</div>
                  <div className="text-xs text-slate-300 mb-2">
                    Client: <span className="text-white font-medium">{bk.parent?.name || "Client"}</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-400 mb-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary-400" /> {bk.location || "Location unstated"}
                  </div>
                  <div className="flex items-center text-xs text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> {new Date(bk.startDate).toLocaleDateString()}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Right Column: Detail & Assignment View */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 glass-card rounded-3xl border border-white/10 p-8 h-[700px] overflow-y-auto custom-scrollbar relative">
          <AnimatePresence mode="wait">
          {selectedBooking ? (
            <motion.div key={selectedBooking.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-8 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-display font-bold text-white">
                    {selectedBooking.referenceId || `Booking #${selectedBooking.id.substring(0, 8)}`}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="bg-primary-500/20 text-primary-300 border border-primary-500/30 text-xs px-3 py-1 rounded-full font-bold tracking-wider uppercase">
                      Status: {selectedBooking.status.replace("_", " ")}
                    </span>
                    <span className="bg-slate-800 text-slate-300 border border-slate-700 text-xs px-3 py-1 rounded-full font-bold tracking-wider">
                      Price: ₹{selectedBooking.totalPrice}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {selectedBooking.status !== "CANCELLED" && (
                    <button 
                      onClick={() => handleUpdateStatus("CANCELLED")}
                      disabled={actionLoading}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      Cancel Booking
                    </button>
                  )}
                  {selectedBooking.status === "SITTER_ASSIGNED" && (
                    <button 
                      onClick={() => handleUpdateStatus("CONFIRMED")}
                      disabled={actionLoading}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 shadow-md"
                    >
                      Confirm Booking
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/5 rounded-2xl border border-white/10">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Service Type</div>
                  <div className="font-bold text-white text-lg">{selectedBooking.serviceType}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Schedule</div>
                  <div className="font-bold text-white text-lg">
                    {new Date(selectedBooking.startDate).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Client Contact</div>
                  <div className="text-sm font-medium text-white">{selectedBooking.parent?.name || "Client"}</div>
                  <div className="text-xs text-slate-400">{selectedBooking.parent?.email}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assigned Sitter</div>
                  <div className="text-sm font-medium text-white">
                    {selectedBooking.sitter?.name || "No sitter assigned yet"}
                  </div>
                  {selectedBooking.sitter?.email && (
                    <div className="text-xs text-slate-400">{selectedBooking.sitter.email}</div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
                  <span>Sitter Assignment Matching</span>
                  {selectedBooking.location && (
                    <span className="text-xs text-slate-400 font-normal">Location: {selectedBooking.location}</span>
                  )}
                </h3>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
                  
                  {loadingSitters ? (
                    <div className="flex items-center gap-3 py-6 text-blue-300">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="font-bold tracking-wide">Querying Matching Engine...</span>
                    </div>
                  ) : sitterMatches.length === 0 ? (
                    <div className="text-center py-6 text-slate-400">
                      <p className="font-medium text-white">No verified sitters found for this area & service.</p>
                      <p className="text-xs mt-1">Sitters must have L2/L3 verification and approved service capability.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 relative z-10">
                      {sitterMatches.map((match) => (
                        <motion.div whileHover={{ scale: 1.01 }} key={match.id} className="bg-slate-900/80 p-5 rounded-xl border border-white/10 flex justify-between items-center backdrop-blur-md">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-emerald-500/30 border flex items-center justify-center text-emerald-400">
                              <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="font-bold text-white text-lg flex items-center gap-3">
                                {match.user.name} 
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  {match.level}
                                </span>
                              </div>
                              <div className="text-sm text-slate-400 mt-1 font-medium">
                                {match.user.area || "Ahmedabad"} • ⭐ {match.rating.toFixed(1)} • Base: ₹{match.baseRate}
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleAssignSitter(match.userId)}
                            disabled={actionLoading || selectedBooking.sitter?.id === match.userId}
                            className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-50"
                          >
                            {selectedBooking.sitter?.id === match.userId ? "Assigned" : "Assign"}
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-slate-500">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <CheckCircle2 className="w-12 h-12 text-slate-600" />
              </div>
              <p className="text-lg font-medium text-white">Select a booking from the triage list to inspect and assign.</p>
            </motion.div>
          )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

