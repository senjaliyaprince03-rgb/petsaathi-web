"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Users,
  ArrowRight,
  RefreshCcw,
  Loader2,
  Calendar,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  PawPrint,
} from "lucide-react";
import { motion } from "framer-motion";

interface AnalyticsStats {
  totalBookings: number;
  pendingBookings: number;
  activeBookings: number;
  completedBookings: number;
  totalRevenue: number;
  totalSitters: number;
  verifiedSitters: number;
  totalPets: number;
  totalUsers: number;
  sittersToAssign: number;
}

interface BookingRow {
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
    pets?: { name: string; species: string }[];
  };
  sitter?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [analyticsRes, bookingsRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/admin/bookings?limit=10"),
      ]);

      if (!analyticsRes.ok) {
        if (analyticsRes.status === 401) {
          throw new Error("Admin authorization required. Please login with an admin account.");
        }
        throw new Error("Failed to load platform analytics.");
      }

      if (!bookingsRes.ok) {
        throw new Error("Failed to load recent bookings.");
      }

      const analyticsData = await analyticsRes.json();
      const bookingsData = await bookingsRes.json();

      setStats(analyticsData);
      setRecentBookings(bookingsData.bookings || []);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
      case "SERVICE_COMPLETED":
      case "CLOSED":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "NEW_LEAD":
      case "SITTER_MATCHING":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "SERVICE_STARTED":
      case "PAYMENT_PENDING":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "CANCELLED":
      case "REFUNDED":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative z-10">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-primary-500/20 text-primary-300 border border-primary-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              Concierge Operations
            </span>
            <span className="text-slate-500 text-xs">• Live Mission Control</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight">
            Admin Overview Dashboard
          </h1>
          <p className="text-slate-400 mt-1 text-lg">
            Real-time operations dispatch, sitter assignment triage, and revenue flow.
          </p>
        </motion.div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-slate-300 transition-colors disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            href="/admin/bookings"
            className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-2"
          >
            <span>Open Triage Queue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Error Boundary / Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 bg-red-500/10 border border-red-500/25 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-red-200"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-base text-white">Data Fetch Encountered an Issue</p>
              <p className="text-xs text-red-300/80">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 rounded-xl text-xs font-bold transition-colors"
          >
            Retry Fetch
          </button>
        </motion.div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Pending Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card p-6 rounded-3xl border border-white/10 relative overflow-hidden group bg-slate-900/60"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-all" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pending Requests
            </span>
            <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-2xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <Loader2 className="w-8 h-8 animate-spin text-slate-500 my-2" />
          ) : (
            <h3 className="text-4xl font-display font-bold text-white tracking-tight">
              {stats?.pendingBookings ?? 0}
            </h3>
          )}
          <p className="text-slate-400 text-xs mt-2 font-medium">
            Inquiries awaiting quote or confirmation
          </p>
        </motion.div>

        {/* KPI 2: Sitters to Assign */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 rounded-3xl border border-white/10 relative overflow-hidden group bg-slate-900/60"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-amber-500/20 transition-all" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Sitters to Assign
            </span>
            <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <Loader2 className="w-8 h-8 animate-spin text-slate-500 my-2" />
          ) : (
            <h3 className="text-4xl font-display font-bold text-white tracking-tight">
              {stats?.sittersToAssign ?? stats?.pendingBookings ?? 0}
            </h3>
          )}
          <p className="text-slate-400 text-xs mt-2 font-medium">
            Bookings needing verified sitter dispatch
          </p>
        </motion.div>

        {/* KPI 3: Completed Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6 rounded-3xl border border-white/10 relative overflow-hidden group bg-slate-900/60"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Completed Bookings
            </span>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <Loader2 className="w-8 h-8 animate-spin text-slate-500 my-2" />
          ) : (
            <h3 className="text-4xl font-display font-bold text-white tracking-tight">
              {stats?.completedBookings ?? 0}
            </h3>
          )}
          <p className="text-slate-400 text-xs mt-2 font-medium">
            Walks & sitting sessions delivered
          </p>
        </motion.div>

        {/* KPI 4: Total Volume (INR) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-3xl border border-white/10 relative overflow-hidden group bg-slate-900/60"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-all" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Volume (INR)
            </span>
            <div className="p-3 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-2xl">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <Loader2 className="w-8 h-8 animate-spin text-slate-500 my-2" />
          ) : (
            <h3 className="text-4xl font-display font-bold text-white tracking-tight">
              ₹{(stats?.totalRevenue ?? 0).toLocaleString()}
            </h3>
          )}
          <p className="text-slate-400 text-xs mt-2 font-medium">
            Gross customer transaction volume
          </p>
        </motion.div>
      </div>

      {/* Dynamic Recent Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card rounded-3xl border border-white/10 bg-slate-900/70 overflow-hidden shadow-xl"
      >
        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 backdrop-blur-md">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-400" />
              Recent Bookings & Triage Stream
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live inquiries across Ahmedabad pilot societies
            </p>
          </div>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 font-bold text-sm transition-colors"
          >
            <span>Go to Full Triage Queue</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-primary-400 mb-2" />
              <p className="text-sm font-medium">Loading live booking feed...</p>
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-40 text-emerald-400" />
              <p className="font-bold text-white text-lg">No Bookings Found</p>
              <p className="text-xs text-slate-400 mt-1">
                When parents book walks or sitting sessions, they will be listed here.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900/90 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Booking / Reference</th>
                  <th className="px-6 py-4">Customer & Pet</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Assigned Sitter</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {recentBookings.map((bk) => {
                  const petName = bk.parent?.pets?.[0]?.name;
                  const petSpecies = bk.parent?.pets?.[0]?.species || "Pet";

                  return (
                    <tr
                      key={bk.id}
                      className="hover:bg-white/[0.04] transition-colors group"
                    >
                      {/* Booking / Ref ID */}
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-300">
                        <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 text-white">
                          {bk.referenceId || bk.id.substring(0, 8)}
                        </span>
                        <span className="block text-[11px] text-slate-500 font-sans mt-1">
                          {new Date(bk.startDate).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Customer & Pet */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {bk.parent?.name || "Client"}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <PawPrint className="w-3 h-3 text-primary-400" />
                          <span>
                            {petName ? `${petName} (${petSpecies})` : "General Care"}
                          </span>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-200">
                          {bk.serviceType}
                        </span>
                        {bk.location && (
                          <span className="block text-xs text-slate-500 truncate max-w-[140px]">
                            {bk.location}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getStatusBadge(
                            bk.status
                          )}`}
                        >
                          {bk.status.replace("_", " ")}
                        </span>
                      </td>

                      {/* Assigned Sitter */}
                      <td className="px-6 py-4">
                        {bk.sitter ? (
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span className="font-semibold text-white">
                              {bk.sitter.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-amber-400/90 font-medium text-xs bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <Link
                          href="/admin/bookings"
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary-400 hover:text-primary-300 bg-primary-500/10 hover:bg-primary-500/20 px-3 py-1.5 rounded-xl border border-primary-500/20 transition-colors"
                        >
                          <span>Triage</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}
