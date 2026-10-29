import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { DashboardCharts } from '../components/DashboardCharts';
import { DownloadReportModal } from '../components/DownloadReportModal';
import { LiquidGlassCard, LiquidGlassBadge } from '../components/LiquidGlass';
import { 
  UserCheck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Award, 
  Check, 
  Send, 
  ArrowRight, 
  FileDown, 
  HandHelping, 
  AlertCircle, 
  RefreshCw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const VolunteerDashboard: React.FC = () => {
  const { 
    currentUser, 
    requests, 
    updateRequestStatus, 
    assignVolunteer,
    fetchRequests,
    setSelectedTrackRequestId, 
    setActiveTab, 
    showToast 
  } = useApp();

  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [activeNoteText, setActiveNoteText] = useState<Record<string, string>>({});
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Poll for fresh requests every 5 seconds so newly raised requests pop up automatically
  useEffect(() => {
    fetchRequests().catch(() => {});
    const interval = setInterval(() => {
      fetchRequests().catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchRequests().catch(() => {});
    setIsRefreshing(false);
    showToast('Community requests feed refreshed!', 'info');
  };

  // Tasks specifically assigned to THIS volunteer
  const myAssignedTasks = requests.filter(r => 
    (r.assignedVolunteerId === currentUser.id || r.assignedVolunteerName === currentUser.name) &&
    (r.status === 'assigned' || r.status === 'in_progress')
  );

  // Pending open requests that haven't been assigned to any volunteer yet
  const openRequests = requests.filter(r => 
    r.status === 'pending' && !r.assignedVolunteerId
  );

  const completedTasks = requests.filter(r => 
    r.status === 'completed' && 
    (r.assignedVolunteerName === currentUser.name || r.assignedVolunteerId === currentUser.id)
  );

  const handleStartTask = (requestId: string) => {
    updateRequestStatus(requestId, 'in_progress', 'Volunteer has started traveling to senior citizen residence.');
  };

  const handleAddNote = (requestId: string) => {
    const note = activeNoteText[requestId];
    if (!note || !note.trim()) return;
    updateRequestStatus(requestId, 'in_progress', note.trim());
    setActiveNoteText(prev => ({ ...prev, [requestId]: '' }));
    showToast('Field progress note logged successfully!', 'success');
  };

  const handleMarkCompleted = (requestId: string) => {
    updateRequestStatus(requestId, 'completed', 'Service successfully concluded. Senior safely verified.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Volunteer Profile Banner: Liquid Glass Emerald Card */}
      <LiquidGlassCard
        variant="emerald"
        className="p-6 sm:p-8 shadow-[0_12px_40px_rgba(45,106,79,0.14)] border-[#52b788]/30"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#1b4332] to-[#2d6a4f] text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-md border-2 border-white/60">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <LiquidGlassBadge variant="emerald">
                  Verified Volunteer Portal
                </LiquidGlassBadge>
                <span className="text-xs text-stone-500 font-mono font-medium">ID: {currentUser.id}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1b4332] mt-1.5 tracking-tight">
                {currentUser.name}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Location: <strong>{currentUser.city}, {currentUser.state}</strong> · Skills: {currentUser.skills ? currentUser.skills.join(', ') : 'Medical OPD Escort, First Aid'}
              </p>
            </div>
          </div>

          {/* Duty Toggle & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-4 py-2.5 rounded-full btn-glass-secondary font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-[#40916c]" />
              <span>Download PDF Report</span>
            </button>

            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-[#d8f3dc] shadow-xs">
              <div className="text-right">
                <div className="text-xs font-black text-[#1b4332]">
                  {isAvailable ? 'Active for Duty' : 'Off-Duty / Unavailable'}
                </div>
                <div className="text-[11px] text-stone-500 font-medium">
                  {isAvailable ? 'Ready for dispatches' : 'Paused dispatches'}
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAvailable(!isAvailable);
                  showToast(isAvailable ? 'You are now off-duty.' : 'You are now active for assignments.', 'info');
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  isAvailable ? 'bg-[#52b788]' : 'bg-stone-300'
                }`}
              >
                <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs ${
                  isAvailable ? 'left-6.5' : 'left-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </LiquidGlassCard>

      {/* Volunteer Stats: 4 Liquid Glass Lenses */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <LiquidGlassCard variant="emerald" className="p-5 sm:p-6 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2d6a4f] uppercase tracking-wider">Assigned to Me</span>
            <div className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center text-[#2d6a4f]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1b4332] mt-3 font-mono">
            {myAssignedTasks.length}
          </div>
          <div className="text-[11px] text-[#40916c] mt-1 font-medium">Active commitments</div>
        </LiquidGlassCard>

        <LiquidGlassCard variant="amber" className="p-5 sm:p-6 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Open Requests</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <HandHelping className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-3 font-mono">
            {openRequests.length}
          </div>
          <div className="text-[11px] text-amber-800/80 mt-1 font-medium">Awaiting volunteer match</div>
        </LiquidGlassCard>

        <LiquidGlassCard variant="default" className="p-5 sm:p-6 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Completed Tasks</span>
            <div className="w-8 h-8 rounded-xl bg-[#f0fbf5] flex items-center justify-center text-[#52b788]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#52b788] mt-3 font-mono">
            {completedTasks.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-medium">Elders supported safely</div>
        </LiquidGlassCard>

        <LiquidGlassCard variant="default" className="p-5 sm:p-6 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Volunteer Rating</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1b4332] mt-3 font-mono">
            {currentUser.rating || 4.9} ★
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-medium">Verified citizen reviews</div>
        </LiquidGlassCard>
      </div>

      {/* Interactive Visual Graph & Care Distribution */}
      <DashboardCharts 
        requests={requests} 
        title="Volunteer Service Impact & Resolution Flow"
        subtitle="Visual distribution of active volunteer assignments and regional service completion times."
        defaultGraphType="bar"
      />

      {/* My Active Task Assignments */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-[#1b4332] tracking-tight flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#52b788]" />
          <span>My Active Task Assignments ({myAssignedTasks.length})</span>
        </h2>

        {myAssignedTasks.length === 0 ? (
          <LiquidGlassCard variant="default" className="p-8 sm:p-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#52b788] mx-auto opacity-80" />
            <h3 className="text-base font-bold text-[#1b4332]">No active tasks assigned to you right now</h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
              Check the open requests feed below to accept an elder assistance task in your neighborhood.
            </p>
          </LiquidGlassCard>
        ) : (
          <div className="space-y-4">
            {myAssignedTasks.map((task) => (
              <LiquidGlassCard
                key={task.id}
                variant="emerald"
                className="p-6 space-y-5 shadow-md border-[#52b788]/40"
              >
                {/* Task Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#d8f3dc]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1b4332] bg-[#f0fbf5] px-3 py-1 rounded-full border border-[#d8f3dc]">
                        {task.id}
                      </span>
                      <StatusBadge 
                        status={task.status} 
                        priority={task.priority} 
                        isEmergency={task.isEmergency}
                        size="md" 
                      />
                    </div>
                    <h3 className="text-lg font-black text-[#1b4332] mt-2">
                      {task.title}
                    </h3>
                  </div>

                  {task.seniorPhone && (
                    <a
                      href={`tel:${task.seniorPhone}`}
                      className="px-4 py-2.5 rounded-full btn-glass-primary text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-xs self-start sm:self-auto cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#74c69d]" />
                      <span>Call Senior: {task.seniorPhone}</span>
                    </a>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-[#d8f3dc] space-y-2">
                    <span className="font-extrabold uppercase tracking-wider text-[#40916c] block text-[11px]">
                      Senior Citizen & Location
                    </span>
                    <div className="text-sm font-bold text-[#1b4332]">
                      {task.seniorName} (Age {task.seniorAge})
                    </div>
                    <div className="text-stone-700 flex items-start gap-1.5 font-medium">
                      <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                      <span>
                        {task.seniorAddress}, {task.city}, {task.state}
                        {task.landmark && ` (Near ${task.landmark})`}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-[#d8f3dc] space-y-2">
                    <span className="font-extrabold uppercase tracking-wider text-[#40916c] block text-[11px]">
                      Task Description & Timing
                    </span>
                    <div className="text-stone-800 leading-relaxed font-medium">
                      {task.description}
                    </div>
                    <div className="text-stone-500 font-semibold pt-1">
                      Preferred Arrival: <strong className="text-[#1b4332]">{task.preferredTiming || 'ASAP'}</strong>
                    </div>
                  </div>
                </div>

                {/* Existing notes */}
                {task.volunteerNotes && task.volunteerNotes.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      Past Field Notes on Record:
                    </span>
                    <div className="space-y-1.5">
                      {task.volunteerNotes.map((note, idx) => (
                        <div key={idx} className="p-3 rounded-2xl bg-white/90 border border-[#d8f3dc] text-xs text-stone-700 flex items-center justify-between font-medium">
                          <span>{note.text}</span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Log a field note */}
                <div className="pt-2 border-t border-[#d8f3dc] flex gap-2">
                  <input
                    type="text"
                    value={activeNoteText[task.id] || ''}
                    onChange={(e) => setActiveNoteText(prev => ({ ...prev, [task.id]: e.target.value }))}
                    placeholder="Log a field update note (e.g., 'Met senior at gate', 'Purchased medicines')..."
                    className="flex-1 px-4 py-2.5 rounded-full input-glass text-xs font-medium"
                  />
                  <button
                    onClick={() => handleAddNote(task.id)}
                    className="px-5 py-2.5 rounded-full btn-glass-primary text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                  >
                    <Send className="w-3.5 h-3.5 text-[#74c69d]" />
                    <span>Post Note</span>
                  </button>
                </div>

                {/* Action buttons */}
                <div className="pt-3 border-t border-[#d8f3dc] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {task.status === 'assigned' && (
                      <button
                        onClick={() => handleStartTask(task.id)}
                        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#40916c] to-[#2d6a4f] hover:from-[#52b788] hover:to-[#40916c] text-white font-extrabold text-xs transition-all cursor-pointer shadow-xs"
                      >
                        Start Assistance (En Route)
                      </button>
                    )}

                    <button
                      onClick={() => handleMarkCompleted(task.id)}
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#52b788] to-[#40916c] hover:from-[#74c69d] hover:to-[#52b788] text-white font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Check className="w-4 h-4" />
                      <span>Mark Task Completed</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTrackRequestId(task.id);
                      setActiveTab('track');
                    }}
                    className="text-xs text-[#2d6a4f] hover:text-[#1b4332] font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View Public Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </LiquidGlassCard>
            ))}
          </div>
        )}
      </div>

      {/* Open Community Assistance Requests */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-[#1b4332] tracking-tight flex items-center gap-2">
              <HandHelping className="w-5 h-5 text-[#40916c]" />
              <span>Open Community Requests ({openRequests.length})</span>
            </h2>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-1 rounded-full btn-glass-secondary font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#40916c] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Feed'}</span>
            </button>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Unassigned elder requests awaiting volunteer support
          </span>
        </div>

        {openRequests.length === 0 ? (
          <LiquidGlassCard variant="default" className="p-10 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#52b788] mx-auto opacity-80" />
            <h3 className="text-base font-bold text-[#1b4332]">No open requests right now</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              All current requests have been assigned. Check back later for new community requests.
            </p>
          </LiquidGlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {openRequests.map((req) => (
              <LiquidGlassCard
                key={req.id}
                variant={req.isEmergency ? 'rose' : 'default'}
                className="p-6 space-y-4 hover:border-[#52b788] transition-all shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#1b4332] bg-[#f0fbf5] px-2.5 py-0.5 rounded-full border border-[#d8f3dc]">
                      {req.id}
                    </span>
                    <StatusBadge 
                      status={req.status} 
                      priority={req.priority} 
                      isEmergency={req.isEmergency}
                      size="sm" 
                    />
                  </div>
                  {req.isEmergency && (
                    <span className="text-[10px] font-extrabold uppercase text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 animate-pulse">
                      Emergency
                    </span>
                  )}
                </div>

                <h4 className="text-base font-extrabold text-[#1b4332]">{req.title}</h4>
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{req.description}</p>

                <div className="text-xs text-stone-600 space-y-1 bg-white/70 backdrop-blur-md p-3 rounded-2xl border border-[#d8f3dc]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#40916c]" />
                    <span>{req.seniorAddress}, {req.city}, {req.state}</span>
                  </div>
                  <div className="font-medium">
                    Senior: <strong className="text-[#1b4332]">{req.seniorName}</strong> · Age: {req.seniorAge}
                  </div>
                  <div className="font-medium">
                    Category: <strong className="capitalize">{req.type}</strong> · Priority: <strong className="capitalize">{req.priority}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2.5">
                  <button
                    onClick={() => {
                      assignVolunteer(req.id, currentUser.id);
                      showToast(`You have accepted request ${req.id}. Please contact the senior citizen.`, 'success');
                    }}
                    className="flex-1 py-2.5 px-4 rounded-full btn-glass-primary text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <UserCheck className="w-4 h-4 text-[#74c69d]" />
                    <span>Accept & Assist This Senior</span>
                  </button>
                  {req.seniorPhone && (
                    <a
                      href={`tel:${req.seniorPhone}`}
                      className="px-3.5 py-2 rounded-full btn-glass-secondary text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#40916c]" />
                      <span>{req.seniorPhone}</span>
                    </a>
                  )}
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks Records */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-[#1b4332] tracking-tight flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#52b788]" />
          <span>Completed Task Records ({completedTasks.length})</span>
        </h2>

        <LiquidGlassCard variant="default" className="overflow-hidden p-0 divide-y divide-[#d8f3dc]/60">
          {completedTasks.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500 font-medium">
              No completed tasks on record yet.
            </div>
          ) : (
            completedTasks.map((t) => (
              <div key={t.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#f0fbf5]/40 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">{t.id}</span>
                    <StatusBadge status={t.status} size="sm" />
                  </div>
                  <h4 className="font-extrabold text-[#1b4332] text-sm mt-1">{t.title}</h4>
                  <p className="text-xs text-stone-500 font-medium">
                    Senior: {t.seniorName} · {t.city} · Completed on {t.completedAt ? new Date(t.completedAt).toLocaleDateString() : 'Recent'}
                  </p>
                </div>

                {t.feedback && (
                  <div className="text-xs text-amber-800 bg-amber-50/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-200/80 flex items-center gap-2 shadow-2xs">
                    <span className="font-bold">★ {t.feedback.rating}/5</span>
                    <span className="text-stone-700 italic truncate max-w-xs">"{t.feedback.comment}"</span>
                  </div>
                )}
              </div>
            ))
          )}
        </LiquidGlassCard>
      </div>

      {/* Volunteer Field Service Log & Audit Report Modal */}
      <DownloadReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        requests={requests}
        reportTitle="Volunteer Field Service Log & Performance Audit"
        organizationName="Sahaya Volunteer Community Wing"
        coordinatorName={currentUser.name}
      />

    </div>
  );
};
