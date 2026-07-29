"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Users, CheckCircle2, AlertTriangle, 
  Clock, RefreshCcw, DollarSign, Activity, FileText
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("7D");

  const funnelData = [
    { name: 'Visitors', value: 1250 },
    { name: 'Requests', value: 320 },
    { name: 'Assigned', value: 290 },
    { name: 'Paid', value: 275 },
    { name: 'Completed', value: 260 },
  ];

  const revenueData = [
    { date: 'Mon', revenue: 1500, target: 1200 },
    { date: 'Tue', revenue: 2300, target: 1500 },
    { date: 'Wed', revenue: 3400, target: 2000 },
    { date: 'Thu', revenue: 2900, target: 2200 },
    { date: 'Fri', revenue: 4500, target: 2500 },
    { date: 'Sat', revenue: 6800, target: 4000 },
    { date: 'Sun', revenue: 7100, target: 4500 },
  ];

  const serviceData = [
    { name: 'Dog Walking', value: 75 },
    { name: 'Sitting', value: 20 },
    { name: 'Boarding (Beta)', value: 5 },
  ];
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  const metrics = [
    { title: "Completion Rate", value: "98.5%", target: "≥ 90%", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { title: "Sitter No-Show", value: "1.2%", target: "< 5%", icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { title: "Report Delivery", value: "96.4%", target: "≥ 95%", icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "Repeat Rate (30D)", value: "32%", target: "25-35%", icon: RefreshCcw, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative z-10 p-6 lg:p-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight">Phase 5 Command Center</h1>
          <p className="text-slate-400 mt-2 text-lg">Real-time operational validation and funnel analytics (Bopal Cohort).</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex bg-slate-900/50 backdrop-blur-md border border-white/10 p-1 rounded-xl">
          {["24H", "7D", "30D", "ALL"].map(range => (
            <button 
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                timeRange === range ? "bg-primary-600 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {range}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={i} 
            className="glass-card p-6 rounded-3xl border border-white/10 relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${metric.bg} blur-[50px] rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity`} />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{metric.title}</div>
                <div className="text-3xl font-display font-bold text-white">{metric.value}</div>
              </div>
              <div className={`${metric.bg} ${metric.color} ${metric.border} border p-3 rounded-2xl`}>
                <metric.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-slate-500 tracking-wider">
              Target: <span className="text-white ml-2 bg-white/10 px-2 py-0.5 rounded-full">{metric.target}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 glass-card rounded-3xl border border-white/10 p-6 flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-400" /> Conversion Funnel
            </h2>
          </div>
          <div className="flex-1 min-h-0 relative z-10 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]}>
                  {
                    funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(217, 90%, ${60 - index * 5}%)`} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Support SLA & Services Mix */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-6 flex flex-col">
          
          <div className="glass-card rounded-3xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-amber-400" /> Support SLA (Active Services)
            </h2>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm font-bold text-slate-400 mb-2">
                  <span>Median Response Time</span>
                  <span className="text-emerald-400">2.4 mins</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[24%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold text-slate-400 mb-2">
                  <span>90th Percentile (P90)</span>
                  <span className="text-amber-400">7.8 mins</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[78%]" />
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
              <p className="text-xs font-bold text-amber-300 leading-relaxed uppercase tracking-wider text-center">
                Target: P90 under 10 minutes
              </p>
            </div>
          </div>

          <div className="glass-card rounded-3xl border border-white/10 p-6 flex-1 flex flex-col">
             <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400" /> Service Demand Mix
            </h2>
            <div className="flex-1 w-full h-full min-h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {serviceData.map((entry, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  {entry.name}
                </div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
      
    </div>
  );
}
