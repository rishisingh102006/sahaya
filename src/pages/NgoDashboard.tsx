import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AssistanceRequest, VolunteerMember } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { DashboardCharts } from '../components/DashboardCharts';
import { DownloadReportModal } from '../components/DownloadReportModal';
import { LiquidGlassCard, LiquidGlassBadge } from '../components/LiquidGlass';
import { 
  Building2, 
  ShieldAlert, 
  Users, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  UserCheck, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Check, 
  X,
  AlertTriangle,
  FileText,
  FileDown,
  Sparkles
} from 'lucide-react';

export const NgoDashboard: React.FC = () => {
  const { 
    currentUser, 
    requests, 
    volunteers, 
    assignVolunteer, 
    updateRequestStatus, 
    setSelectedTrackRequestId, 
    setActiveTab 
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'emergency' | 'pending' | 'in_progress' | 'completed'>('all');
  const [assignModalRequest, setAssignModalRequest] = useState<AssistanceRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Segregation
  const emergencyRequests = requests.filter(r => r.isEmergency && r.status !== 'completed');
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const inProgressRequests = requests.filter(r => r.status === 'in_progress');
  const completedRequests = requests.filter(r => r.status === 'completed');

  const filteredRequests = requests.filter(req => {
    if (activeFilter === 'emergency') return req.isEmergency;
    if (activeFilter === 'pending') return req.status === 'pending';
    if (activeFilter === 'in_progress') return req.status === 'in_progress';
    if (activeFilter === 'completed') return req.status === 'completed';
    return true;
  }).filter(req => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return req.id.toLowerCase().includes(q) || 
      req.title.toLowerCase().includes(q) || 
      req.seniorName.toLowerCase().includes(q) || 
      req.city.toLowerCase().includes(q);
  });

  const handleOpenAssign = (req: AssistanceRequest) => {
    setAssignModalRequest(req);
  };

  const handleConfirmAssignment = (volunteerId: string) => {
    if (!assignModalRequest) return;
    assignVolunteer(assignModalRequest.id, volunteerId);
    setAssignModalRequest(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* NGO Header: Liquid Glass Emerald Command Card */}
      <LiquidGlassCard
        variant="emerald"
        className="p-6 sm:p-8 shadow-[0_12px_40px_rgba(45,106,79,0.14)] border-[#52b788]/30"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#1b4332] to-[#2d6a4f] text-white flex items-center justify-center shrink-0 shadow-md border-2 border-white/60">
              <Building2 className="w-8 h-8 text-[#74c69d]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <LiquidGlassBadge variant="emerald">
                  Verified NGO Coordination Desk
                </LiquidGlassBadge>
                <span className="text-xs text-stone-500 font-mono font-medium">Reg: {currentUser.ngoRegistrationNo || 'NGO/DL/2018/009412'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1b4332] mt-1.5 tracking-tight">
                {currentUser.organizationName || 'CareIndia Elder Welfare Foundation'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Coordinator: <strong className="text-[#1b4332]">{currentUser.name}</strong> · Monitoring Senior Requests & Ground Volunteers
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-4 py-2.5 rounded-full btn-glass-secondary font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-[#40916c]" />
              <span>Download PDF Report</span>
            </button>

            <button
              onClick={() => setActiveFilter('emergency')}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                emergencyRequests.length > 0 
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white animate-pulse shadow-[0_4px_16px_rgba(225,29,72,0.35)]' 
                  : 'btn-glass-secondary text-stone-600'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Emergency Queue ({emergencyRequests.length})</span>
            </button>
          </div>
        </div>
      </LiquidGlassCard>

      {/* Metrics Stat Cards: 4 Liquid Glass Lenses with Interactive Filter Click */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <LiquidGlassCard 
          variant={activeFilter === 'pending' ? 'amber' : 'default'}
          onClick={() => setActiveFilter(activeFilter === 'pending' ? 'all' : 'pending')}
          className="p-5 sm:p-6 cursor-pointer hover:scale-[1.02] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Incoming Pending</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-3 font-mono">
            {pendingRequests.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-medium">Requires review & assignment</div>
        </LiquidGlassCard>

        <LiquidGlassCard 
          variant={activeFilter === 'emergency' ? 'rose' : 'default'}
          onClick={() => setActiveFilter(activeFilter === 'emergency' ? 'all' : 'emergency')}
          className="p-5 sm:p-6 cursor-pointer hover:scale-[1.02] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              Emergency Triage
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-3 font-mono">
            {emergencyRequests.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-medium">High priority active alerts</div>
        </LiquidGlassCard>

        <LiquidGlassCard 
          variant={activeFilter === 'in_progress' ? 'emerald' : 'default'}
          onClick={() => setActiveFilter(activeFilter === 'in_progress' ? 'all' : 'in_progress')}
          className="p-5 sm:p-6 cursor-pointer hover:scale-[1.02] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#40916c] uppercase tracking-wider">In-Progress Tasks</span>
            <div className="w-8 h-8 rounded-xl bg-[#f0fbf5] flex items-center justify-center text-[#2d6a4f]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1b4332] mt-3 font-mono">
            {inProgressRequests.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-medium">Volunteers actively deployed</div>
        </LiquidGlassCard>

        <LiquidGlassCard 
          variant={activeFilter === 'completed' ? 'emerald' : 'default'}
          onClick={() => setActiveFilter(activeFilter === 'completed' ? 'all' : 'completed')}
          className="p-5 sm:p-6 cursor-pointer hover:scale-[1.02] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#52b788] uppercase tracking-wider">Resolved Cases</span>
            <div className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center text-[#52b788]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#52b788] mt-3 font-mono">
            {completedRequests.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-medium">100% services delivered</div>
        </LiquidGlassCard>
      </div>

      {/* Interactive Visual Graph & Distribution Analytics */}
      <DashboardCharts 
        requests={requests} 
        title="Operations Analytics & Distribution Charts"
        subtitle="Interactive analysis of request categories, lifecycle status distribution, and weekly resolution velocity."
        defaultGraphType="bar"
      />

      {/* Emergency Section Priority Highlight: Liquid Glass Rose Accent */}
      {emergencyRequests.length > 0 && (
        <LiquidGlassCard
          variant="rose"
          className="p-6 sm:p-7 border-rose-300 shadow-[0_12px_36px_rgba(225,29,72,0.15)] space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-rose-950">
                  Critical Emergency Queue — Immediate Action Required
                </h2>
                <p className="text-xs text-rose-800 font-medium">
                  These requests involve acute distress, oxygen cylinder needs, or urgent hospital coordination.
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-700 bg-white/90 px-3.5 py-1 rounded-full border border-rose-300 self-start sm:self-auto shadow-xs">
              {emergencyRequests.length} Emergency Open
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyRequests.map((req) => (
              <LiquidGlassCard
                key={req.id}
                variant="default"
                className="p-5 flex flex-col justify-between space-y-3 border-rose-200"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">{req.id}</span>
                    <StatusBadge status={req.status} isEmergency={true} size="sm" />
                  </div>
                  <h3 className="font-extrabold text-stone-900 text-base mt-2.5">{req.title}</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">{req.description}</p>
                  
                  <div className="mt-3 text-xs text-stone-600 space-y-1 bg-[#f0fbf5]/60 p-2.5 rounded-xl border border-[#d8f3dc]">
                    <div>Senior: <strong>{req.seniorName}</strong> (Age {req.seniorAge}) · <a href={`tel:${req.seniorPhone}`} className="text-[#2d6a4f] font-bold underline">{req.seniorPhone}</a></div>
                    <div>Location: {req.seniorAddress}, {req.city}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2.5">
                  <button
                    onClick={() => handleOpenAssign(req)}
                    className="flex-1 py-2.5 px-4 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Prioritize & Assign Volunteer</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTrackRequestId(req.id);
                      setActiveTab('track');
                    }}
                    className="py-2.5 px-4 rounded-full btn-glass-secondary text-xs font-bold cursor-pointer"
                  >
                    Track
                  </button>
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        </LiquidGlassCard>
      )}

      {/* Main Request Queue & Management Table: Frosted Glass Container */}
      <LiquidGlassCard variant="default" className="overflow-hidden p-0 shadow-sm">
        
        {/* Table Controls Strip */}
        <div className="p-6 border-b border-[#d8f3dc] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40">
          <div>
            <h2 className="text-lg font-black text-[#1b4332]">
              Assistance Request Queue
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Review, verify senior needs, and dispatch volunteers based on location and proximity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input with Glass Styling */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search requests..."
                className="pl-9 pr-3.5 py-2 rounded-full input-glass text-xs font-medium w-48 sm:w-56"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-[#f0fbf5] p-1 rounded-full text-xs border border-[#d8f3dc]">
              {(['all', 'pending', 'in_progress', 'completed'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setActiveFilter(filterKey)}
                  className={`px-3 py-1 rounded-full font-bold capitalize transition-all cursor-pointer ${
                    activeFilter === filterKey 
                      ? 'bg-[#1b4332] text-white shadow-xs' 
                      : 'text-stone-600 hover:text-[#1b4332]'
                  }`}
                >
                  {filterKey.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500 font-medium">
            No assistance requests match the selected filter.
          </div>
        ) : (
          <div className="divide-y divide-[#d8f3dc]/60">
            {filteredRequests.map((req) => (
              <div 
                key={req.id} 
                className="p-6 hover:bg-[#f0fbf5]/40 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#1b4332] bg-[#f0fbf5] px-2.5 py-0.5 rounded-full border border-[#d8f3dc]">
                      {req.id}
                    </span>
                    <span className="text-xs text-stone-500 font-semibold capitalize">
                      · {req.type} Assistance
                    </span>
                    <StatusBadge 
                      status={req.status} 
                      priority={req.priority} 
                      isEmergency={req.isEmergency}
                      size="sm" 
                    />
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-[#1b4332]">
                      {req.title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                      {req.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1 font-medium">
                    <span className="font-bold text-stone-700">Senior: {req.seniorName} ({req.seniorPhone})</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#40916c]" />
                      {req.seniorAddress}, {req.city}
                    </span>
                    <span>·</span>
                    <span>Timing: {req.preferredTiming || 'ASAP'}</span>
                  </div>

                  {req.assignedVolunteerName && (
                    <div className="pt-1 text-xs text-stone-700 flex items-center gap-2 bg-white/70 p-2 rounded-xl border border-[#d8f3dc]">
                      <UserCheck className="w-4 h-4 text-[#52b788]" />
                      <span>Assigned to: <strong>{req.assignedVolunteerName}</strong> ({req.assignedVolunteerPhone})</span>
                    </div>
                  )}
                </div>

                {/* NGO Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  {req.status === 'pending' && (
                    <button
                      onClick={() => handleOpenAssign(req)}
                      className="px-5 py-2.5 rounded-full btn-glass-primary text-white font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <UserCheck className="w-4 h-4 text-[#74c69d]" />
                      <span>Assign Volunteer</span>
                    </button>
                  )}

                  {req.status === 'assigned' && (
                    <button
                      onClick={() => updateRequestStatus(req.id, 'in_progress', 'Volunteer en-route to senior residence.')}
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#40916c] to-[#2d6a4f] hover:from-[#52b788] hover:to-[#40916c] text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
                    >
                      Mark In-Progress
                    </button>
                  )}

                  {req.status === 'in_progress' && (
                    <button
                      onClick={() => updateRequestStatus(req.id, 'completed', 'Service completed successfully and senior acknowledged safely.')}
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#52b788] to-[#40916c] hover:from-[#74c69d] hover:to-[#52b788] text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>Verify Completion</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSelectedTrackRequestId(req.id);
                      setActiveTab('track');
                    }}
                    className="px-4 py-2.5 rounded-full btn-glass-secondary text-xs font-bold transition-all cursor-pointer"
                  >
                    View Timeline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </LiquidGlassCard>

      {/* Volunteer Assignment Modal: Liquid Glass Dialog */}
      {assignModalRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-xl w-full border border-white/80 shadow-[0_24px_64px_rgba(27,67,50,0.25)] overflow-hidden animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] text-white px-6 py-5 flex items-start justify-between border-b border-[#52b788]/30">
              <div>
                <span className="text-[10px] font-mono uppercase font-extrabold text-[#74c69d] bg-white/10 px-2 py-0.5 rounded">
                  Request {assignModalRequest.id}
                </span>
                <h3 className="text-lg font-black tracking-tight mt-1">
                  Assign Volunteer to Senior
                </h3>
                <p className="text-xs text-[#d8f3dc] mt-0.5 font-medium">
                  Senior: {assignModalRequest.seniorName} · {assignModalRequest.city}
                </p>
              </div>
              <button
                onClick={() => setAssignModalRequest(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
              <div className="p-4 rounded-2xl bg-[#f0fbf5] border border-[#d8f3dc] text-xs text-stone-700">
                <span className="font-extrabold text-[#1b4332] block mb-1">Task Requirement:</span>
                {assignModalRequest.title} — {assignModalRequest.description}
              </div>

              <div className="space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Select Verified Community Volunteer ({volunteers.length} Available)
                </div>

                <div className="space-y-2.5">
                  {volunteers.map((vol) => (
                    <div
                      key={vol.id}
                      className="p-4 rounded-2xl border border-stone-200/80 hover:border-[#52b788] transition-all bg-white/80 backdrop-blur-md flex items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[#1b4332] text-sm">{vol.name}</span>
                          <span className="text-[10px] font-bold text-[#1b4332] bg-[#f0fbf5] px-2 py-0.5 rounded-full border border-[#d8f3dc]">
                            Verified
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 font-medium">
                          {vol.city}, {vol.state} · Rating: <strong>{vol.rating} ★</strong> ({vol.completedTasks} completed)
                        </div>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {vol.skills.map((s, idx) => (
                            <span key={idx} className="text-[10px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md font-semibold">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleConfirmAssignment(vol.id)}
                        className="px-4 py-2 rounded-full btn-glass-primary text-white font-bold text-xs transition-all shrink-0 cursor-pointer shadow-xs"
                      >
                        Assign Task
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#f0fbf5]/60 border-t border-[#d8f3dc] flex justify-end">
              <button
                onClick={() => setAssignModalRequest(null)}
                className="px-5 py-2 rounded-full btn-glass-secondary text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Operations Performance & Audit Report Modal */}
      <DownloadReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        requests={requests}
        volunteers={volunteers}
        organizationName={currentUser.organizationName || 'CareIndia Elder Welfare Foundation'}
        coordinatorName={currentUser.name}
      />

    </div>
  );
};
