import { Clock, CheckCircle2, AlertCircle, IndianRupee } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Phase 2: Concierge Pilot</h1>
          <p className="text-slate-500 mt-2">Manual operations overview and tracking.</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-primary-600/20">
          + New Manual Booking
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-900">12</h3>
          <p className="text-slate-500 font-medium">Pending Requests</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-900">5</h3>
          <p className="text-slate-500 font-medium">Sitters to Assign</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-900">28</h3>
          <p className="text-slate-500 font-medium">Completed Bookings</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-900">14k</h3>
          <p className="text-slate-500 font-medium">Total Volume</p>
        </div>
      </div>

      {/* Recent Activity Table (Mockup for Phase 2) */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Recent Manual Bookings</h2>
          <button className="text-primary-600 font-medium text-sm hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-500 text-sm font-medium">
              <tr>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Customer & Pet</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Assigned Sitter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {[
                { id: "BK-001", customer: "Rahul S.", pet: "Bruno (Dog)", service: "Walking", status: "SITTER_MATCHING", sitter: "Unassigned" },
                { id: "BK-002", customer: "Priya M.", pet: "Luna (Cat)", service: "Sitting", status: "CONFIRMED", sitter: "Amit V." },
                { id: "BK-003", customer: "Karan D.", pet: "Max (Dog)", service: "Walking", status: "PAYMENT_PENDING", sitter: "Neha R." },
                { id: "BK-004", customer: "Sneha P.", pet: "Simba (Dog)", service: "Boarding", status: "NEW_LEAD", sitter: "Unassigned" },
              ].map((booking, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{booking.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{booking.customer}</div>
                    <div className="text-slate-500 text-xs">{booking.pet}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{booking.service}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === "SITTER_MATCHING" ? "bg-amber-100 text-amber-700" :
                      booking.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                      booking.status === "PAYMENT_PENDING" ? "bg-blue-100 text-blue-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {booking.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{booking.sitter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
