"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Calendar, ChevronRight, Loader2, Dog, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface Booking {
  id: string;
  referenceId: string | null;
  serviceType: string;
  status: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  location: string | null;
  sitter: { name: string; email: string } | null;
}

const STATUS_COLORS: Record<string, string> = {
  NEW_LEAD: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  CONTACTED: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  SITTER_MATCHING: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  SITTER_ASSIGNED: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  PAYMENT_PENDING: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  CONFIRMED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  SERVICE_STARTED: "bg-green-500/20 text-green-300 border-green-500/30",
  SERVICE_COMPLETED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  CANCELLED: "bg-red-500/20 text-red-300 border-red-500/30",
  CLOSED: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

export default function ProfileDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/bookings?limit=5")
        .then((r) => r.json())
        .then((data) => setBookings(data.bookings || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}!
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Manage your pets, bookings, and account details here.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Book a Service CTA */}
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="glass-card p-8 rounded-3xl flex flex-col items-center justify-center text-center h-72 border border-white/10 hover:border-primary-500/50 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-20 h-20 bg-primary-500/20 text-primary-400 rounded-2xl flex items-center justify-center mb-6 border border-primary-500/30 group-hover:scale-110 transition-transform duration-500">
            <Plus className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Book a Service</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-[220px]">Find a trusted sitter or walker for your furry friend.</p>
          <Link href="/profile/bookings/new" className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl font-bold transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            Find a Sitter <ChevronRight className="w-5 h-5 ml-1" />
          </Link>
        </motion.div>

        {/* Recent Bookings — now from real data */}
        <motion.div whileHover={{ y: -5 }} className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col h-72">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white text-xl">Recent Bookings</h3>
            <Link href="/profile/bookings" className="text-primary-400 text-sm font-medium hover:text-primary-300 hover:underline transition-colors">
              View All
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
              </div>
            ) : bookings.length > 0 ? (
              bookings.map((booking) => (
                <div key={booking.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-white text-sm">{booking.serviceType} Walk</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {new Date(booking.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        {booking.sitter && <span> • {booking.sitter.name}</span>}
                      </div>
                      {booking.location && (
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {booking.location}
                        </div>
                      )}
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold border ${STATUS_COLORS[booking.status] || "bg-slate-500/20 text-slate-300 border-slate-500/30"}`}>
                      {booking.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Calendar className="w-10 h-10 text-slate-600 mb-3" />
                <p className="text-slate-500 text-sm">No bookings yet</p>
                <p className="text-slate-600 text-xs">Book your first service to get started!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
