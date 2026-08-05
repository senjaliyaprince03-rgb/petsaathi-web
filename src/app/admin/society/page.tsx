"use client";

import { motion } from "framer-motion";
import { 
  Building2, Users, CalendarCheck, Clock, Star, AlertCircle, FileText, CheckCircle2, Search
} from "lucide-react";
import { useState } from "react";
import type { ComponentType, SVGProps } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SocietyCommitteeDashboard() {
  const [selectedSociety, setSelectedSociety] = useState("Safal Parisar");
  
  const chartData = [
    { name: 'W1', walks: 12, sitting: 2 },
    { name: 'W2', walks: 18, sitting: 3 },
    { name: 'W3', walks: 24, sitting: 4 },
    { name: 'W4', walks: 28, sitting: 6 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative z-10 p-6 lg:p-0">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary-400" />
            Society Committee Dashboard
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Aggregate B2B reporting. Personal Identifiable Information (PII) is hidden as per DPDP Rules.</p>
        </motion.div>
        
        <div className="relative w-full md:w-64">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select 
            value={selectedSociety}
            onChange={(e) => setSelectedSociety(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white font-bold [&>option]:bg-slate-900"
          >
            <option value="Safal Parisar">Safal Parisar (Bopal)</option>
            <option value="Orchid Greens">Orchid Greens</option>
          </select>
        </div>
      </div>

      {/* DPDP Compliance Banner */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex items-start gap-4">
        <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400 mt-0.5">
           <ShieldIcon className="w-5 h-5" />
        </div>
        <div>
           <h3 className="text-blue-100 font-bold mb-1">Privacy Notice</h3>
           <p className="text-blue-200/70 text-sm">To comply with the Digital Personal Data Protection (DPDP) Act, individual resident phone numbers, apartment numbers, and pet medical records are restricted. This dashboard provides aggregate operational health data only.</p>
        </div>
      </motion.div>

      {/* Aggregate KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Registered Residents" value="32" icon={Users} color="text-primary-400" bg="bg-primary-500/10" border="border-primary-500/20" />
        <MetricCard title="Completed Services (30d)" value="86" icon={CalendarCheck} color="text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20" />
        <MetricCard title="On-time Rate" value="96%" icon={Clock} color="text-purple-400" bg="bg-purple-500/10" border="border-purple-500/20" />
        <MetricCard title="Average Rating" value="4.7" icon={Star} color="text-amber-400" bg="bg-amber-500/10" border="border-amber-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 glass-card rounded-3xl border border-white/10 p-6 flex flex-col h-[400px]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">Service Volume</h2>
          <div className="flex-1 w-full h-full min-h-0 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWalks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSitting" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="walks" name="Dog Walks" stroke="#3b82f6" fillOpacity={1} fill="url(#colorWalks)" />
                <Area type="monotone" dataKey="sitting" name="Pet Sitting" stroke="#10b981" fillOpacity={1} fill="url(#colorSitting)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Operational Health */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-6 flex flex-col">
          
          <div className="glass-card rounded-3xl border border-white/10 p-6">
             <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">Society Access Health</h2>
             
             <div className="space-y-4">
                <div className="flex justify-between items-center bg-white/5 border border-white/10 p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-500/20 text-amber-400 p-2 rounded-lg"><AlertCircle className="w-4 h-4" /></div>
                    <span className="text-sm font-bold text-slate-300">Open Access Issues</span>
                  </div>
                  <span className="text-xl font-display font-bold text-amber-400">1</span>
                </div>
                
                <div className="flex justify-between items-center bg-white/5 border border-white/10 p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg"><CheckCircle2 className="w-4 h-4" /></div>
                    <span className="text-sm font-bold text-slate-300">Critical Incidents</span>
                  </div>
                  <span className="text-xl font-display font-bold text-emerald-400">0</span>
                </div>

                <div className="flex justify-between items-center bg-white/5 border border-white/10 p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 text-blue-400 p-2 rounded-lg"><Users className="w-4 h-4" /></div>
                    <span className="text-sm font-bold text-slate-300">Approved Sitters</span>
                  </div>
                  <span className="text-xl font-display font-bold text-blue-400">4</span>
                </div>
             </div>
          </div>

        </motion.div>
      </div>

    </div>
  );
}

function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

type MetricCardProps = {
  title: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  border: string;
};

function MetricCard({ title, value, icon: Icon, color, bg, border }: MetricCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`glass-card p-6 rounded-3xl border border-white/10 relative overflow-hidden group`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${bg} blur-[50px] rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity`} />
      <div className="flex justify-between items-start relative z-10">
        <div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</div>
          <div className="text-4xl font-display font-bold text-white">{value}</div>
        </div>
        <div className={`${bg} ${color} ${border} border p-3 rounded-2xl`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}
