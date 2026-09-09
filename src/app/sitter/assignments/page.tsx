"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  FileText,
  Send,
  Calendar,
  Play,
  Phone,
  ShieldAlert,
  Loader2,
  RefreshCcw,
  Sparkles,
  ArrowRight,
  PawPrint,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PetInfo {
  id: string;
  name: string;
  species: string;
  breed?: string | null;
  vetContact?: string | null;
  behaviorNotes?: string | null;
  walkingInstructions?: string | null;
  feedingInstructions?: string | null;
}

interface ReportInfo {
  id: string;
  mood?: string | null;
  toiletInfo?: string | null;
  sitterNote?: string | null;
  distance?: number | null;
  foodAndWater?: string | null;
  behavior?: string | null;
  healthConcern?: string | null;
  actualStartTime?: string | null;
  actualEndTime?: string | null;
  createdAt: string;
}

interface BookingAssignment {
  id: string;
  referenceId: string | null;
  serviceType: string;
  status: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  location: string | null;
  parent?: {
    id?: string;
    name: string;
    email: string;
    phone?: string | null;
    pets?: PetInfo[];
  };
  reports?: ReportInfo[];
}

export default function SitterAssignments() {
  const [activeTab, setActiveTab] = useState<"UPCOMING" | "ACTIVE" | "COMPLETED">("UPCOMING");
  const [bookings, setBookings] = useState<BookingAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Report Form state
  const [reportingBooking, setReportingBooking] = useState<BookingAssignment | null>(null);
  const [peeChecked, setPeeChecked] = useState(false);
  const [poopChecked, setPoopChecked] = useState(false);
  const [mood, setMood] = useState("Happy & Energetic");
  const [distance, setDistance] = useState("1.8");
  const [sitterNote, setSitterNote] = useState("");
  const [foodAndWater, setFoodAndWater] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [showSosModal, setShowSosModal] = useState<BookingAssignment | null>(null);

  // Active Timer state
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/bookings");
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("You must be logged in as a sitter to view assignments.");
        }
        throw new Error("Failed to load assignments");
      }
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Timer for active sessions
  useEffect(() => {
    const hasActive = bookings.some((b) => b.status === "SERVICE_STARTED");
    if (!hasActive) return;

    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [bookings]);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Start Service
  const handleStartService = async (bookingId: string) => {
    try {
      setActionLoading(bookingId);
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SERVICE_STARTED" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to start service");
      }

      await fetchAssignments();
      setSecondsElapsed(0);
      setActiveTab("ACTIVE");
    } catch (err: any) {
      alert(err.message || "Failed to start service");
    } finally {
      setActionLoading(null);
    }
  };

  // Submit Report
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingBooking) return;

    try {
      setSubmittingReport(true);
      setReportError(null);

      const toiletInfo = [
        peeChecked ? "Pee" : null,
        poopChecked ? "Poop" : null,
      ]
        .filter(Boolean)
        .join(", ") || "None";

      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: reportingBooking.id,
          toiletInfo,
          mood,
          distance: parseFloat(distance) || 0,
          sitterNote,
          foodAndWater: foodAndWater || undefined,
          actualEndTime: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit service report");
      }

      // Reset state and switch to completed
      setReportingBooking(null);
      setPeeChecked(false);
      setPoopChecked(false);
      setSitterNote("");
      setFoodAndWater("");
      await fetchAssignments();
      setActiveTab("COMPLETED");
    } catch (err: any) {
      setReportError(err.message || "Error submitting report");
    } finally {
      setSubmittingReport(false);
    }
  };

  // Filter Bookings by Tab
  const upcomingBookings = bookings.filter(
    (b) => b.status === "SITTER_ASSIGNED" || b.status === "CONFIRMED"
  );
  const activeBookings = bookings.filter(
    (b) => b.status === "SERVICE_STARTED"
  );
  const completedBookings = bookings.filter(
    (b) =>
      b.status === "SERVICE_COMPLETED" ||
      b.status === "CLOSED" ||
      b.status === "REPORT_SENT" ||
      b.status === "REVIEW_REQUESTED"
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-primary-500/20 text-primary-300 border border-primary-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                Sitter Portal
              </span>
              <span className="text-slate-500 text-xs">• Verified Operations</span>
            </div>
            <h1 className="text-4xl font-display font-bold text-white tracking-tight">
              Service Assignments
            </h1>
            <p className="text-slate-400 mt-1 text-lg">
              Manage your upcoming walks, active sessions, and client report cards.
            </p>
          </motion.div>

          <button
            onClick={fetchAssignments}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-slate-300 transition-colors disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-white/10 relative">
          {(["UPCOMING", "ACTIVE", "COMPLETED"] as const).map((tab) => {
            const count =
              tab === "UPCOMING"
                ? upcomingBookings.length
                : tab === "ACTIVE"
                ? activeBookings.length
                : completedBookings.length;

            return (
              <button
                key={tab}
                onClick={() => {
                  setReportingBooking(null);
                  setActiveTab(tab);
                }}
                className={`px-5 py-3 text-sm font-bold transition-all relative flex items-center gap-2 ${
                  activeTab === tab
                    ? "text-primary-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab
                      ? "bg-primary-500/20 text-primary-300 border border-primary-500/30"
                      : "bg-white/5 text-slate-400"
                  }`}
                >
                  {count}
                </span>
                {activeTab === tab && (
                  <motion.div
                    layoutId="tabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Loading Spinner */}
        {loading && bookings.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-primary-400 mb-3" />
            <p className="font-bold text-lg text-white">Loading assignments...</p>
            <p className="text-sm text-slate-500">Connecting to PetSaathi Dispatch Engine</p>
          </div>
        )}

        {/* Tab 1: UPCOMING */}
        {!loading && activeTab === "UPCOMING" && !reportingBooking && (
          <motion.div
            key="tab-upcoming"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {upcomingBookings.length === 0 ? (
              <div className="glass-card border border-white/10 rounded-3xl p-16 text-center text-slate-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <h3 className="text-2xl font-bold text-white mb-2">No Upcoming Assignments</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  You do not have any scheduled services pending right now. New bookings assigned by the operations concierge will appear here.
                </p>
              </div>
            ) : (
              upcomingBookings.map((bk) => {
                const pet = bk.parent?.pets?.[0];
                return (
                  <motion.div
                    key={bk.id}
                    whileHover={{ scale: 1.005 }}
                    className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 bg-slate-900/60 relative overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-primary-400 tracking-wider">
                            {bk.referenceId || bk.id.substring(0, 8)}
                          </span>
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            {bk.status.replace("_", " ")}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                          <PawPrint className="w-6 h-6 text-primary-400" />
                          {bk.serviceType} • {pet ? `${pet.name} (${pet.species}${pet.breed ? ` - ${pet.breed}` : ""})` : "Pet Care"}
                        </h2>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 pt-1">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Clock className="w-4 h-4 text-amber-400" />
                            {new Date(bk.startDate).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1.5 font-medium">
                            <MapPin className="w-4 h-4 text-primary-400" />
                            {bk.location || "Client Residence"}
                          </span>
                          <span className="font-bold text-emerald-400">
                            Earnings: ₹{bk.totalPrice}
                          </span>
                        </div>
                        {pet?.walkingInstructions && (
                          <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300">
                            <strong className="text-white">Care Note:</strong> {pet.walkingInstructions}
                          </div>
                        )}
                      </div>

                      <div>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleStartService(bk.id)}
                          disabled={actionLoading === bk.id}
                          className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3.5 rounded-2xl font-bold text-base transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-2 disabled:opacity-50"
                        >
                          {actionLoading === bk.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Play className="w-5 h-5 fill-current" />
                          )}
                          <span>Start Service</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}

        {/* Tab 2: ACTIVE */}
        {!loading && activeTab === "ACTIVE" && !reportingBooking && (
          <motion.div
            key="tab-active"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {activeBookings.length === 0 ? (
              <div className="glass-card border border-white/10 rounded-3xl p-16 text-center text-slate-500">
                <Clock className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <h3 className="text-2xl font-bold text-white mb-2">No Service Currently In Progress</h3>
                <p className="text-slate-400 max-w-md mx-auto mb-6">
                  Ready to begin a walk or sitting session? Go to the Upcoming tab and tap "Start Service".
                </p>
                {upcomingBookings.length > 0 && (
                  <button
                    onClick={() => setActiveTab("UPCOMING")}
                    className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all"
                  >
                    View Upcoming Assignments
                  </button>
                )}
              </div>
            ) : (
              activeBookings.map((bk) => {
                const pet = bk.parent?.pets?.[0];
                return (
                  <div
                    key={bk.id}
                    className="glass-card border border-primary-500/40 rounded-3xl overflow-hidden shadow-[0_0_35px_rgba(37,99,235,0.15)] relative"
                  >
                    {/* Live Header Banner */}
                    <div className="bg-primary-600/20 border-b border-primary-500/30 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 backdrop-blur-md">
                      <div>
                        <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Live In-Progress
                        </span>
                        <h2 className="text-3xl font-display font-bold text-white mt-3 flex items-center gap-3">
                          {bk.serviceType} • {pet?.name || "Client's Pet"}
                        </h2>
                        <p className="text-sm text-slate-300 mt-1">
                          Client: {bk.parent?.name} {bk.parent?.phone ? `• ${bk.parent.phone}` : ""}
                        </p>
                      </div>
                      <div className="text-left md:text-right bg-black/40 px-5 py-3 rounded-2xl border border-white/10">
                        <div className="text-xs font-bold text-primary-300 uppercase tracking-wider">
                          Active Elapsed Time
                        </div>
                        <div className="text-3xl font-mono font-bold text-white tracking-widest mt-1">
                          {formatTimer(secondsElapsed)}
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 md:p-8 space-y-6 bg-slate-900/60">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Notes */}
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
                          <div className="text-xs text-amber-400 font-bold uppercase mb-2 tracking-wider">
                            Customer Instructions & Behavior
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {pet?.walkingInstructions ||
                              pet?.behaviorNotes ||
                              pet?.feedingInstructions ||
                              "No special behavioral caveats noted. Follow standard leash safety."}
                          </p>
                        </div>

                        {/* Emergency Vet Contact */}
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />
                          <div className="text-xs text-red-400 font-bold uppercase mb-2 tracking-wider">
                            Emergency Vet Contact
                          </div>
                          <p className="text-white font-bold text-base mb-1">
                            {pet?.vetContact || "Happy Paws Hospital & Emergency"}
                          </p>
                          <p className="text-slate-400 text-xs">
                            Dedicated 24/7 Hotline: +91 98250 12345
                          </p>
                          <a
                            href={`tel:${pet?.vetContact || "+919825012345"}`}
                            className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-red-400 hover:text-red-300"
                          >
                            <Phone className="w-3.5 h-3.5" /> Call Emergency Vet
                          </a>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setReportingBooking(bk)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] flex justify-center items-center gap-2"
                        >
                          <CheckCircle2 className="w-6 h-6" />
                          <span>Complete Service & Fill Report Card</span>
                        </motion.button>

                        <button
                          onClick={() => setShowSosModal(bk)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 px-6 py-4 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2"
                        >
                          <ShieldAlert className="w-6 h-6" />
                          <span>Emergency SOS</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        )}

        {/* Tab 3: COMPLETED */}
        {!loading && activeTab === "COMPLETED" && !reportingBooking && (
          <motion.div
            key="tab-completed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {completedBookings.length === 0 ? (
              <div className="glass-card border border-white/10 rounded-3xl p-16 text-center text-slate-500">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <h3 className="text-2xl font-bold text-white mb-2">No Completed Sessions Yet</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  Completed walks and sessions with their finalized report cards will be archived here.
                </p>
              </div>
            ) : (
              completedBookings.map((bk) => {
                const latestReport = bk.reports?.[0];
                const pet = bk.parent?.pets?.[0];

                return (
                  <div
                    key={bk.id}
                    className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 bg-slate-900/60 relative overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-400">
                            {bk.referenceId || bk.id.substring(0, 8)}
                          </span>
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            COMPLETED
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mt-1">
                          {bk.serviceType} • {pet?.name || "Client's Pet"}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Customer: {bk.parent?.name} • Completed on{" "}
                          {latestReport?.createdAt
                            ? new Date(latestReport.createdAt).toLocaleDateString()
                            : new Date(bk.endDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block font-medium">
                          Payout / Volume
                        </span>
                        <span className="text-2xl font-display font-bold text-emerald-400">
                          ₹{bk.totalPrice}
                        </span>
                      </div>
                    </div>

                    {/* Report Summary Card */}
                    {latestReport ? (
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-primary-400 uppercase tracking-wider">
                          <FileText className="w-4 h-4" /> Finalized Report Card
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-1">
                          <div>
                            <span className="text-xs text-slate-400 block font-medium">Mood</span>
                            <span className="text-white font-bold">{latestReport.mood || "Happy"}</span>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 block font-medium">Bathroom</span>
                            <span className="text-white font-bold">{latestReport.toiletInfo || "Normal"}</span>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 block font-medium">Distance Walked</span>
                            <span className="text-white font-bold">{latestReport.distance ? `${latestReport.distance} km` : "1.8 km"}</span>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 block font-medium">Parent Status</span>
                            <span className="text-emerald-400 font-bold">Report Delivered 📬</span>
                          </div>
                        </div>

                        {latestReport.sitterNote && (
                          <div className="pt-2 border-t border-white/5 text-sm text-slate-300 italic">
                            "{latestReport.sitterNote}"
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        Session marked completed by concierge dispatcher.
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </motion.div>
        )}

        {/* Report Card Submission Modal / Form */}
        <AnimatePresence>
          {reportingBooking && (
            <motion.div
              key="report-modal"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 25 }}
              className="glass-card rounded-3xl border border-primary-500/40 p-6 md:p-10 relative z-20 shadow-2xl bg-slate-900/95"
            >
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-2xl flex items-center justify-center border border-primary-500/30">
                    <FileText className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-bold text-white">
                      Service Report Card
                    </h2>
                    <p className="text-slate-400 text-sm mt-0.5">
                      Filing report for {reportingBooking.parent?.pets?.[0]?.name || "Client's Pet"} (Ref:{" "}
                      {reportingBooking.referenceId || reportingBooking.id.substring(0, 8)})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setReportingBooking(null)}
                  className="text-slate-400 hover:text-white px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-bold"
                >
                  Cancel
                </button>
              </div>

              {reportError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl flex items-center gap-3 text-sm">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span>{reportError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitReport} className="space-y-8">
                {/* Bathroom & Mood */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Bathroom Check */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Bathroom Check (Tap to toggle)
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setPeeChecked(!peeChecked)}
                        className={`flex-1 text-center border rounded-2xl py-4 transition-all ${
                          peeChecked
                            ? "bg-primary-600/30 border-primary-500 text-white shadow-lg"
                            : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-2xl block mb-1">💦</span>
                        <span className="font-bold text-sm">Pee {peeChecked ? "✓" : ""}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPoopChecked(!poopChecked)}
                        className={`flex-1 text-center border rounded-2xl py-4 transition-all ${
                          poopChecked
                            ? "bg-amber-600/30 border-amber-500 text-white shadow-lg"
                            : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-2xl block mb-1">💩</span>
                        <span className="font-bold text-sm">Poop {poopChecked ? "✓" : ""}</span>
                      </button>
                    </div>
                  </div>

                  {/* Mood Selector */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Pet Mood
                    </label>
                    <select
                      value={mood}
                      onChange={(e) => setMood(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Happy & Energetic">🌟 Happy & Energetic</option>
                      <option value="Calm & Relaxed">😌 Calm & Relaxed</option>
                      <option value="Anxious / Scared">🥺 Anxious / Scared</option>
                      <option value="Lethargic">😴 Lethargic</option>
                    </select>
                  </div>
                </div>

                {/* Distance & Water */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Distance Walked (Kilometers)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g. 2.4"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Food & Water Given
                    </label>
                    <input
                      type="text"
                      value={foodAndWater}
                      onChange={(e) => setFoodAndWater(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g. Fresh bowl of water provided, 1 treat given"
                    />
                  </div>
                </div>

                {/* Report Note */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Sitter Walk Note (Visible to Pet Parent)
                  </label>
                  <textarea
                    rows={4}
                    value={sitterNote}
                    onChange={(e) => setSitterNote(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder="Describe how the walk went! E.g. Max was in high spirits today, stopped to sniff the trees, drank plenty of water afterward."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submittingReport}
                  className="w-full bg-primary-600 hover:bg-primary-500 text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)] flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {submittingReport ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Send className="w-6 h-6" />
                  )}
                  <span>Submit Report to Customer</span>
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SOS Modal */}
        <AnimatePresence>
          {showSosModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-slate-900 border border-red-500/50 p-8 rounded-3xl max-w-lg w-full space-y-6 text-center"
              >
                <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/40">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Emergency Response Protocol</h3>
                  <p className="text-slate-400 text-sm mt-2">
                    If the pet is in medical distress or escaped, immediately notify the emergency dispatcher and the pet parent.
                  </p>
                </div>

                <div className="space-y-3 text-left">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-xs text-slate-400 block font-bold">24/7 Operations Concierge</span>
                    <span className="text-white font-mono font-bold text-lg">+91 80000 72284</span>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-xs text-slate-400 block font-bold">Parent Emergency Contact</span>
                    <span className="text-white font-mono font-bold text-lg">
                      {showSosModal.parent?.phone || "Phone provided in dispatch portal"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowSosModal(null)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold text-sm"
                >
                  Dismiss
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
