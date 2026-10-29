import React, { useState } from 'react';
import { AssistanceRequest } from '../types';
import { LiquidGlassCard, LiquidGlassBadge } from './LiquidGlass';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Stethoscope, 
  Car, 
  ShoppingBag, 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Sparkles,
  Layers
} from 'lucide-react';

interface DashboardChartsProps {
  requests: AssistanceRequest[];
  title?: string;
  subtitle?: string;
  defaultGraphType?: 'bar' | 'donut' | 'trend';
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  requests,
  title = "Operations & Assistance Distribution",
  subtitle = "Real-time visual breakdown of assistance categories, lifecycle states, and completion throughput.",
  defaultGraphType = 'bar'
}) => {
  const [graphType, setGraphType] = useState<'bar' | 'donut' | 'trend'>(defaultGraphType);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const total = requests.length || 1;

  // 1. Category Calculations
  const categoryCounts = {
    medical: requests.filter(r => r.type === 'medical').length,
    transport: requests.filter(r => r.type === 'transport').length,
    grocery: requests.filter(r => r.type === 'grocery').length,
    documentation: requests.filter(r => r.type === 'documentation').length,
    emergency: requests.filter(r => r.type === 'emergency').length,
  };

  const categories = [
    { id: 'medical', label: 'Medical Assistance', count: categoryCounts.medical, color: '#10b981', bg: 'bg-emerald-500', icon: Stethoscope },
    { id: 'transport', label: 'Transportation', count: categoryCounts.transport, color: '#3b82f6', bg: 'bg-blue-500', icon: Car },
    { id: 'grocery', label: 'Grocery & Essentials', count: categoryCounts.grocery, color: '#f59e0b', bg: 'bg-amber-500', icon: ShoppingBag },
    { id: 'documentation', label: 'Documentation Help', count: categoryCounts.documentation, color: '#8b5cf6', bg: 'bg-purple-500', icon: FileText },
    { id: 'emergency', label: 'Emergency Support', count: categoryCounts.emergency, color: '#e11d48', bg: 'bg-rose-600', icon: ShieldAlert },
  ];

  // 2. Status Calculations
  const statusCounts = {
    pending: requests.filter(r => r.status === 'pending').length,
    assigned: requests.filter(r => r.status === 'assigned').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  const statuses = [
    { id: 'completed', label: 'Completed', count: statusCounts.completed, color: '#52b788', text: 'text-[#40916c]' },
    { id: 'in_progress', label: 'In Progress', count: statusCounts.in_progress, color: '#1b4332', text: 'text-[#1b4332]' },
    { id: 'assigned', label: 'Volunteer Assigned', count: statusCounts.assigned, color: '#3b82f6', text: 'text-blue-600' },
    { id: 'pending', label: 'Pending Review', count: statusCounts.pending, color: '#f59e0b', text: 'text-amber-600' },
  ];

  const completionRate = Math.round((statusCounts.completed / total) * 100);

  // 3. 7-Day Trend Mock Data aligned with real total
  const weekDays = [
    { day: 'Mon', requests: Math.max(1, Math.round(total * 0.12)), resolved: Math.max(0, Math.round(total * 0.10)) },
    { day: 'Tue', requests: Math.max(2, Math.round(total * 0.18)), resolved: Math.max(1, Math.round(total * 0.15)) },
    { day: 'Wed', requests: Math.max(1, Math.round(total * 0.15)), resolved: Math.max(1, Math.round(total * 0.14)) },
    { day: 'Thu', requests: Math.max(3, Math.round(total * 0.22)), resolved: Math.max(2, Math.round(total * 0.19)) },
    { day: 'Fri', requests: Math.max(2, Math.round(total * 0.16)), resolved: Math.max(1, Math.round(total * 0.15)) },
    { day: 'Sat', requests: Math.max(2, Math.round(total * 0.20)), resolved: Math.max(2, Math.round(total * 0.18)) },
    { day: 'Sun', requests: Math.max(1, Math.round(total * 0.10)), resolved: Math.max(1, Math.round(total * 0.09)) },
  ];

  const maxTrendVal = Math.max(...weekDays.map(d => Math.max(d.requests, d.resolved)), 5);

  // SVG Calculations for Donut
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <LiquidGlassCard variant="default" className="p-6 sm:p-8 space-y-6">
      
      {/* Chart Header & Graph Type Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-900/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#f0fbf5] text-[#1b4332] border border-[#b7e4c7] shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#52b788]" />
            </span>
            <h3 className="text-base sm:text-lg font-black text-[#1b4332] tracking-tight">
              {title}
            </h3>
          </div>
          <p className="text-xs text-stone-500">
            {subtitle}
          </p>
        </div>

        {/* Graph Type Switcher Controls */}
        <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-xs p-1 rounded-2xl border border-stone-200 shadow-2xs self-start sm:self-auto">
          <button
            onClick={() => setGraphType('bar')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              graphType === 'bar'
                ? 'bg-[#1b4332] text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Category Bar</span>
          </button>

          <button
            onClick={() => setGraphType('donut')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              graphType === 'donut'
                ? 'bg-[#1b4332] text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Lifecycle Donut</span>
          </button>

          <button
            onClick={() => setGraphType('trend')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              graphType === 'trend'
                ? 'bg-[#1b4332] text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Weekly Trend</span>
          </button>
        </div>
      </div>

      {/* GRAPH VIEW 1: CATEGORY BAR CHART */}
      {graphType === 'bar' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const pct = Math.round((cat.count / total) * 100);
              const isHovered = hoveredCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  onMouseEnter={() => setHoveredCategory(cat.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`p-4 rounded-2xl border transition-all ${
                    isHovered 
                      ? 'border-[#52b788] bg-[#f0fbf5] shadow-xs scale-102' 
                      : 'border-stone-200 bg-[#fbfdfb] hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 shadow-2xs">
                      <Icon className="w-4 h-4 text-[#1b4332]" />
                    </span>
                    <span className="font-mono font-bold text-xs text-[#1b4332]">
                      {pct}%
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="text-xl sm:text-2xl font-black text-[#1b4332] font-mono">
                      {cat.count}
                    </div>
                    <div className="text-xs font-bold text-stone-700 truncate mt-0.5">
                      {cat.label}
                    </div>
                  </div>

                  {/* Progress fill bar */}
                  <div className="w-full bg-stone-100 rounded-full h-2 mt-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${cat.bg}`} 
                      style={{ width: `${Math.max(pct, 6)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual Stacked Proportional Bar */}
          <div className="p-4 rounded-2xl bg-[#f7fbf8] border border-[#d8f3dc] space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-600 font-semibold">
              <span>Overall Category Distribution Ratio</span>
              <span>Total Volume: <strong className="text-[#1b4332] font-mono">{requests.length} Requests</strong></span>
            </div>
            
            <div className="w-full h-4 rounded-full overflow-hidden flex bg-stone-200 shadow-2xs">
              {categories.map((cat) => {
                const widthPct = (cat.count / total) * 100;
                if (widthPct === 0) return null;
                return (
                  <div
                    key={cat.id}
                    style={{ width: `${widthPct}%`, backgroundColor: cat.color }}
                    title={`${cat.label}: ${cat.count} (${Math.round(widthPct)}%)`}
                    className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full cursor-pointer hover:opacity-90"
                  />
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] pt-1">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-stone-600">{cat.label} ({cat.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GRAPH VIEW 2: LIFECYCLE STATUS DONUT */}
      {graphType === 'donut' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-in fade-in duration-200">
          
          {/* SVG Donut Circle */}
          <div className="flex flex-col items-center justify-center relative py-2">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                {/* Background track circle */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#e2e8f0"
                  strokeWidth="18"
                  fill="transparent"
                />

                {/* Render colored donut segments */}
                {statuses.map((st) => {
                  const pct = st.count / total;
                  const strokeDasharray = `${pct * circumference} ${circumference}`;
                  const strokeDashoffset = -accumulatedOffset;
                  accumulatedOffset += pct * circumference;

                  return (
                    <circle
                      key={st.id}
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke={st.color}
                      strokeWidth="18"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      fill="transparent"
                      strokeLinecap="round"
                      className="transition-all duration-700 hover:opacity-80 cursor-pointer"
                    />
                  );
                })}
              </svg>

              {/* Center Donut Hole Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs uppercase tracking-wider font-bold text-stone-400">Resolution</span>
                <span className="text-3xl sm:text-4xl font-black text-[#1b4332] font-mono mt-0.5">
                  {completionRate}%
                </span>
                <span className="text-[11px] font-semibold text-[#52b788]">
                  {statusCounts.completed} of {total} Done
                </span>
              </div>
            </div>
          </div>

          {/* Legend and Status Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Assistance Lifecycle Stage Breakdown
            </h4>

            <div className="space-y-2.5">
              {statuses.map((st) => {
                const pct = Math.round((st.count / total) * 100);
                return (
                  <div key={st.id} className="p-3 rounded-2xl bg-[#f7fbf8] border border-stone-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: st.color }} />
                      <span className="font-semibold text-stone-800">{st.label}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-stone-200 rounded-full h-2 overflow-hidden hidden sm:block">
                        <div 
                          className="h-full rounded-full" 
                          style={{ width: `${pct}%`, backgroundColor: st.color }}
                        />
                      </div>
                      <span className="font-mono font-bold text-stone-700 w-12 text-right">
                        {st.count} <span className="text-stone-400 font-normal">({pct}%)</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-2xl bg-[#f0fbf5] border border-[#d8f3dc] flex items-center justify-between text-xs text-[#1b4332]">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#52b788]" />
                <span>Overall Turnaround Efficiency: High</span>
              </div>
              <span className="font-mono font-bold text-xs bg-white px-2 py-0.5 rounded border border-[#d8f3dc]">
                Avg 42m Triage
              </span>
            </div>
          </div>

        </div>
      )}

      {/* GRAPH VIEW 3: WEEKLY ACTIVITY TREND CURVE */}
      {graphType === 'trend' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="text-stone-600">
              Weekly Assistance Intake vs Completion Velocity (Daily Throughput)
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#1b4332]" />
                <span>New Intake</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#52b788]" />
                <span>Resolved & Delivered</span>
              </div>
            </div>
          </div>

          {/* SVG Trend Chart */}
          <div className="w-full bg-[#f7fbf8] border border-[#d8f3dc] rounded-2xl p-4 sm:p-6">
            <div className="h-44 sm:h-52 w-full flex items-end justify-between gap-2 pt-6">
              {weekDays.map((item, idx) => {
                const reqHeightPct = Math.round((item.requests / maxTrendVal) * 85);
                const resHeightPct = Math.round((item.resolved / maxTrendVal) * 85);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      {/* Intake Bar */}
                      <div 
                        style={{ height: `${reqHeightPct}%` }}
                        className="w-3 sm:w-5 bg-[#1b4332] rounded-t-lg transition-all duration-500 hover:brightness-110 relative group-hover:scale-105"
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-[#1b4332] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-1.5 py-0.5 rounded shadow-xs border border-stone-200">
                          {item.requests} in
                        </span>
                      </div>

                      {/* Resolved Bar */}
                      <div 
                        style={{ height: `${resHeightPct}%` }}
                        className="w-3 sm:w-5 bg-[#52b788] rounded-t-lg transition-all duration-500 hover:brightness-110 relative group-hover:scale-105"
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-[#40916c] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-1.5 py-0.5 rounded shadow-xs border border-stone-200">
                          {item.resolved} out
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-stone-500 uppercase">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-3 rounded-2xl border border-stone-200 bg-white">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Peak Inflow Day</span>
              <strong className="text-[#1b4332] text-sm font-bold">Thursday (22% of Volume)</strong>
            </div>
            <div className="p-3 rounded-2xl border border-stone-200 bg-white">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Volunteer Resolution Velocity</span>
              <strong className="text-[#40916c] text-sm font-bold">92.4% Same-Day Dispatch</strong>
            </div>
            <div className="p-3 rounded-2xl border border-stone-200 bg-white">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Emergency SLA Adherence</span>
              <strong className="text-emerald-700 text-sm font-bold">100% within 60 Mins</strong>
            </div>
          </div>
        </div>
      )}

    </LiquidGlassCard>
  );
};
