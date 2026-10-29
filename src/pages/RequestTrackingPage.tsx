import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { LiquidGlassCard, LiquidGlassBadge } from '../components/LiquidGlass';
import { api } from '../services/api';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  UserCheck, 
  Building2, 
  AlertCircle, 
  Star, 
  ArrowRight,
  ShieldCheck,
  Send,
  Loader2,
  RefreshCw,
  Check,
  Sparkles
} from 'lucide-react';

export const RequestTrackingPage: React.FC = () => {
  const { 
    requests, 
    selectedTrackRequestId, 
    setSelectedTrackRequestId, 
    submitFeedback, 
    setActiveTab
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>(() => {
    return selectedTrackRequestId || requests[0]?.id || '';
  });
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [liveRequest, setLiveRequest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const lastFetchedIdRef = useRef<string>('');
  const requestsRef = useRef(requests);
  requestsRef.current = requests;

  // Local match from AppContext cache
  const activeQuery = searchQuery.trim().toLowerCase();
  const localMatch = activeQuery
    ? requests.find(r => r.id.toLowerCase() === activeQuery)
    : (selectedTrackRequestId ? requests.find(r => r.id === selectedTrackRequestId) : requests[0]);
  
  // Authoritative status: live-fetched data if matching query, else localMatch
  const currentRequest = (liveRequest && activeQuery && liveRequest.id.toLowerCase() === activeQuery)
    ? liveRequest
    : (liveRequest && !activeQuery ? liveRequest : localMatch);

  // Live search function: fetches from backend/Supabase without causing dependency cascading loops
  const fetchFromBackend = useCallback(async (query: string, isManual = false) => {
    if (!query || !query.trim()) return;
    const trimmed = query.trim();

    // Prevent duplicate calls for the same ID unless user requested manual refresh
    if (!isManual && lastFetchedIdRef.current.toLowerCase() === trimmed.toLowerCase()) {
      return;
    }
    lastFetchedIdRef.current = trimmed;

    // Only display full-card loading if we don't already have data to show
    const hasExistingData = requestsRef.current.some(r => r.id.toLowerCase() === trimmed.toLowerCase());
    if (!hasExistingData) {
      setIsLoading(true);
    }
    setSearchError(null);

    try {
      const result = await api.requests.getById(trimmed);
      if (result && result.id) {
        setLiveRequest(result);
        setSearchError(null);
      } else {
        setLiveRequest(null);
        if (!hasExistingData) {
          setSearchError('No request found with that Tracking ID.');
        }
      }
    } catch (err: any) {
      console.warn('Live tracking fetch notice:', err);
      const fallbackLocal = requestsRef.current.find(r => r.id.toLowerCase() === trimmed.toLowerCase());
      if (fallbackLocal) {
        setLiveRequest(fallbackLocal);
        setSearchError(null);
      } else {
        setLiveRequest(null);
        if (err?.status === 404) {
          setSearchError('No request found with that Tracking ID. Please verify and try again.');
        } else {
          setSearchError('Could not reach the server. Please verify your connection or try again.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync searchQuery when selectedTrackRequestId changes
  useEffect(() => {
    if (selectedTrackRequestId && selectedTrackRequestId.trim()) {
      setSearchQuery(selectedTrackRequestId.trim());
      fetchFromBackend(selectedTrackRequestId.trim(), true);
    } else if (searchQuery && searchQuery.trim() && !lastFetchedIdRef.current) {
      fetchFromBackend(searchQuery.trim(), false);
    }
  }, [selectedTrackRequestId, fetchFromBackend]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    setSelectedTrackRequestId(trimmed);
    fetchFromBackend(trimmed, true);
  };

  const handleSelectRequest = (id: string) => {
    setSearchQuery(id);
    setSelectedTrackRequestId(id);
    fetchFromBackend(id, true);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRequest) return;
    submitFeedback(currentRequest.id, feedbackRating, feedbackComment);
    setFeedbackComment('');
    setTimeout(() => {
      fetchFromBackend(currentRequest.id, true);
    }, 400);
  };

  const getTimelineStepStatus = (stepIndex: number, status: string) => {
    // When completed, all steps are done and verified!
    if (status === 'completed') return 'done';
    const order = ['pending', 'assigned', 'in_progress', 'completed'];
    const currentIndex = order.indexOf(status);
    if (currentIndex > stepIndex) return 'done';
    if (currentIndex === stepIndex) return 'current';
    return 'upcoming';
  };

  const timelineSteps = [
    {
      title: 'Request Raised',
      description: currentRequest ? `Submitted on ${new Date(currentRequest.createdAt).toLocaleDateString()} at ${new Date(currentRequest.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Broadcast to partner NGOs',
      stepIndex: 0
    },
    {
      title: 'NGO Review & Volunteer Assigned',
      description: currentRequest?.assignedVolunteerName ? `${currentRequest.assignedVolunteerName} assigned via ${currentRequest.assignedNgoName || 'Verified NGO Network'}` : 'Under verification by nearby NGO coordinator',
      stepIndex: 1
    },
    {
      title: 'Assistance in Progress',
      description: currentRequest?.startedAt 
        ? `Volunteer commenced service at ${new Date(currentRequest.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
        : (currentRequest?.status === 'completed' 
            ? 'Volunteer arrived on site and performed required assistance.' 
            : 'Volunteer is preparing/en route'),
      stepIndex: 2
    },
    {
      title: 'Service Completed',
      description: currentRequest?.completedAt 
        ? `Safely concluded on ${new Date(currentRequest.completedAt).toLocaleDateString()} at ${new Date(currentRequest.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
        : (currentRequest?.status === 'completed' 
            ? 'Safely concluded and verified.' 
            : 'Awaiting final task wrap-up'),
      stepIndex: 3
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Search Header wrapped in Emerald Liquid Glass */}
      <LiquidGlassCard variant="emerald" className="p-6 sm:p-8 text-center max-w-2xl mx-auto space-y-4 shadow-xl">
        <LiquidGlassBadge variant="emerald" size="sm">
          <Sparkles className="w-3.5 h-3.5 text-[#2d6a4f]" />
          <span>Real-time Transparent Telemetry</span>
        </LiquidGlassBadge>
        
        <h1 className="text-2xl sm:text-3xl font-black text-[#1b4332] tracking-tight">
          Track Your Assistance Request
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          Enter your unique Request Tracking ID (e.g., <code className="font-mono font-bold text-[#1b4332] bg-white/70 px-2 py-0.5 rounded border border-[#d8f3dc]">SHY-2026-482910</code>) to view live stage milestones, assigned volunteer phone, and progress notes.
        </p>

        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="pt-2 flex gap-2 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Request ID..."
              className="input-glass w-full pl-11 pr-4 py-3 rounded-full text-sm font-mono font-bold uppercase tracking-wider"
            />
          </div>
          <button
            type="submit"
            className="btn-glass-primary px-7 py-3 rounded-full text-sm cursor-pointer"
          >
            Track Live
          </button>
        </form>

        {/* Quick select pills */}
        {requests.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-xs">
            <span className="text-stone-500 font-semibold text-[11px]">Recent Inflow:</span>
            {requests.slice(0, 4).map(req => (
              <button
                key={req.id}
                onClick={() => handleSelectRequest(req.id)}
                className={`px-3 py-1 rounded-full font-mono text-[11px] border transition-all cursor-pointer ${
                  req.id === currentRequest?.id 
                    ? 'bg-[#1b4332] border-[#1b4332] text-white font-bold shadow-xs' 
                    : 'bg-white/80 border-stone-200 text-stone-700 hover:bg-white hover:border-[#52b788]'
                }`}
              >
                {req.id}
              </button>
            ))}
          </div>
        )}
      </LiquidGlassCard>

      {isLoading && !currentRequest ? (
        <LiquidGlassCard variant="default" className="p-12 text-center space-y-4 shadow-sm">
          <Loader2 className="w-10 h-10 text-[#52b788] mx-auto animate-spin" />
          <h2 className="text-lg font-bold text-stone-800">Searching for Request…</h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Looking up tracking ID "{searchQuery}" in our database. Please wait.
          </p>
        </LiquidGlassCard>
      ) : !currentRequest ? (
        <LiquidGlassCard variant="default" className="p-12 text-center space-y-4 shadow-sm">
          <AlertCircle className="w-10 h-10 text-stone-400 mx-auto" />
          <h2 className="text-lg font-bold text-stone-800">Request Not Found</h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {searchError || `We could not find an assistance request matching "${searchQuery}". Please verify the ID or raise a new request.`}
          </p>
          <button
            onClick={() => setActiveTab('create-request')}
            className="btn-glass-primary px-6 py-2.5 rounded-full text-xs cursor-pointer"
          >
            Create New Request
          </button>
        </LiquidGlassCard>
      ) : (
        <div className="space-y-6">
          
          {/* Main Status Card */}
          <LiquidGlassCard variant="default" className="shadow-lg p-6 sm:p-8 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/80">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black font-mono text-[#1b4332] bg-[#f0fbf5] px-3 py-1 rounded-full border border-[#d8f3dc]">
                    {currentRequest.id}
                  </span>
                  <StatusBadge 
                    status={currentRequest.status} 
                    priority={currentRequest.priority} 
                    isEmergency={currentRequest.isEmergency}
                    size="md" 
                  />
                  <button
                    type="button"
                    onClick={() => fetchFromBackend(currentRequest.id, true)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#d8f3dc] bg-white/80 hover:bg-[#d8f3dc] text-[11px] font-bold text-[#1b4332] transition-colors cursor-pointer"
                    title="Fetch latest status from database"
                  >
                    <RefreshCw className={`w-3 h-3 text-[#40916c] ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh Live</span>
                  </button>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#1b4332] mt-2.5">
                  {currentRequest.title}
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#52b788]" />
                  <span>{currentRequest.seniorAddress}, {currentRequest.city}, {currentRequest.state}</span>
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-stone-200/80 sm:pl-6 text-xs text-stone-500 space-y-1">
                <div>Created: <strong className="text-stone-800">{new Date(currentRequest.createdAt).toLocaleDateString()}</strong></div>
                <div>Category: <strong className="capitalize text-stone-800">{currentRequest.type}</strong></div>
                <div>Urgency: <strong className="capitalize text-stone-800">{currentRequest.priority}</strong></div>
              </div>
            </div>

            {/* Prominent Completion Verification Banner */}
            {currentRequest.status === 'completed' && (
              <LiquidGlassCard variant="emerald" className="p-4 sm:p-5 flex items-center gap-3.5 border border-[#52b788]">
                <div className="w-11 h-11 rounded-full bg-[#1b4332] text-white flex items-center justify-center shrink-0 shadow-md">
                  <CheckCircle2 className="w-6 h-6 text-[#74c69d]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <LiquidGlassBadge variant="emerald" size="sm">
                      ✓ Service Safely Concluded
                    </LiquidGlassBadge>
                    <span className="text-xs text-[#2d6a4f] font-bold">100% Fulfilled</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#1b4332] font-bold mt-1">
                    This assistance task has been safely concluded by volunteer {currentRequest.assignedVolunteerName || 'community partner'}.
                  </p>
                  {currentRequest.completedAt && (
                    <p className="text-[11px] text-[#40916c] font-medium mt-0.5">
                      Concluded on {new Date(currentRequest.completedAt).toLocaleDateString()} at {new Date(currentRequest.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </LiquidGlassCard>
            )}

            {/* Description note */}
            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-[#d8f3dc] text-xs sm:text-sm text-stone-700 leading-relaxed shadow-2xs">
              <span className="font-bold text-[#1b4332] block mb-1">Request Details & Senior Instructions:</span>
              {currentRequest.description}
            </div>

            {/* Status Timeline */}
            <div className="pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#40916c]">
                    Lifecycle Progression
                  </span>
                  <h4 className="text-lg font-black text-[#1b4332] tracking-tight mt-0.5">
                    Live Assistance Status
                  </h4>
                </div>

                {/* Dynamic Status Progress Pill */}
                <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold self-start sm:self-auto shadow-2xs ${
                  currentRequest.status === 'completed'
                    ? 'bg-[#ebfbee] border-[#52b788] text-[#1b4332]'
                    : 'bg-[#f0fbf5] border-[#d8f3dc] text-[#1b4332]'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    currentRequest.status === 'completed' ? 'bg-[#2d6a4f]' : 'bg-[#52b788] animate-pulse'
                  }`} />
                  <span>
                    Stage {currentRequest.status === 'completed' ? 4 : Math.min(4, Math.max(1, ['pending', 'assigned', 'in_progress', 'completed'].indexOf(currentRequest.status) + 1))} of 4:
                  </span>
                  <span className="text-[#2d6a4f] font-extrabold uppercase text-[11px]">
                    {currentRequest.status.replace('_', ' ')}
                  </span>
                  <span className="text-stone-400">·</span>
                  <span className="text-[#1b4332]">
                    {currentRequest.status === 'completed' ? '100%' : `${Math.round(((Math.max(0, ['pending', 'assigned', 'in_progress', 'completed'].indexOf(currentRequest.status)) + 1) / 4) * 100)}%`}
                  </span>
                </div>
              </div>

              {/* Responsive Horizontal Progress Tracker with Dynamic Fill */}
              <div className="bg-white/60 backdrop-blur-md border border-[#d8f3dc] rounded-3xl p-4 sm:p-6 mb-8 shadow-xs overflow-hidden">
                <div className="relative">
                  {/* Background Track running horizontally between first and last circle centers */}
                  <div className="absolute top-4.5 sm:top-5.5 left-[12%] right-[12%] h-2 bg-[#e2f4e8] rounded-full z-0" />

                  {/* Dynamic Progress Fill Bar */}
                  <div
                    className="absolute top-4.5 sm:top-5.5 left-[12%] h-2 bg-gradient-to-r from-[#52b788] via-[#40916c] to-[#1b4332] rounded-full transition-all duration-700 ease-out z-0 shadow-xs"
                    style={{
                      width: `${currentRequest.status === 'completed' ? 76 : (Math.max(0, ['pending', 'assigned', 'in_progress', 'completed'].indexOf(currentRequest.status)) / 3) * 76}%`
                    }}
                  />

                  {/* 4 Checkpoint Milestone Circles & Labels */}
                  <div className="relative z-10 flex justify-between items-start">
                    {timelineSteps.map((step) => {
                      const state = getTimelineStepStatus(step.stepIndex, currentRequest.status);

                      return (
                        <div
                          key={step.stepIndex}
                          className="flex flex-col items-center text-center w-1/4 px-1 group"
                        >
                          {/* Milestone Circle */}
                          <div
                            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-xs transition-all duration-300 ${
                              state === 'done'
                                ? 'bg-[#52b788] text-white ring-4 ring-[#ebfbee]'
                                : state === 'current'
                                ? 'bg-[#1b4332] text-white ring-4 ring-[#d8f3dc] shadow-md scale-110'
                                : 'bg-white border-2 border-stone-300 text-stone-400'
                            }`}
                          >
                            {state === 'done' ? (
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            ) : (
                              <span>{step.stepIndex + 1}</span>
                            )}
                          </div>

                          {/* Step Label */}
                          <div className="mt-2.5 space-y-0.5">
                            <div
                              className={`text-[11px] sm:text-xs font-bold leading-tight line-clamp-2 ${
                                state === 'upcoming'
                                  ? 'text-stone-400'
                                  : state === 'current'
                                  ? 'text-[#1b4332]'
                                  : 'text-[#40916c]'
                              }`}
                            >
                              {step.title}
                            </div>

                            {/* State Tag */}
                            <div className="text-[10px] hidden sm:block font-semibold">
                              {state === 'done' && (
                                <span className="text-[#52b788]">Completed</span>
                              )}
                              {state === 'current' && (
                                <span className="text-[#1b4332] bg-[#e8f5ec] px-2 py-0.5 rounded-full text-[9px] uppercase font-extrabold">
                                  Current
                                </span>
                              )}
                              {state === 'upcoming' && (
                                <span className="text-stone-400">Upcoming</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Detailed Step-by-Step Chronological Progression */}
              <div className="space-y-0 pt-2 border-t border-stone-100">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4 pt-2">
                  Detailed Lifecycle Logs & Activity
                </div>
                {timelineSteps.map((step, idx) => {
                  const state = getTimelineStepStatus(step.stepIndex, currentRequest.status);
                  const isLast = idx === timelineSteps.length - 1;

                  return (
                    <div key={step.stepIndex} className="flex items-start group">
                      {/* Left Column: Circle Marker + Vertical Connecting Line */}
                      <div className="flex flex-col items-center shrink-0 w-10 sm:w-12">
                        {/* Step Circle */}
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-xs transition-all shrink-0 ${
                            state === 'done'
                              ? 'bg-[#52b788] text-white ring-4 ring-[#ebfbee]'
                              : state === 'current'
                              ? 'bg-[#1b4332] text-white ring-4 ring-[#d8f3dc] shadow-md scale-105'
                              : 'bg-white border-2 border-stone-300 text-stone-400'
                          }`}
                        >
                          {state === 'done' ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          ) : (
                            <span>{step.stepIndex + 1}</span>
                          )}
                        </div>

                        {/* Connecting Line between steps */}
                        {!isLast && (
                          <div
                            className={`w-0.5 min-h-[48px] sm:min-h-[52px] my-1.5 transition-colors ${
                              state === 'done' ? 'bg-[#52b788]' : 'bg-[#d8f3dc]'
                            }`}
                          />
                        )}
                      </div>

                      {/* Right Content Column */}
                      <div className={`flex-1 pl-5 sm:pl-7 ${!isLast ? 'pb-7 sm:pb-8' : 'pb-2'}`}>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h4
                            className={`text-sm sm:text-base font-bold ${
                              state === 'upcoming' ? 'text-stone-400' : 'text-[#1b4332]'
                            }`}
                          >
                            {step.title}
                          </h4>

                          {state === 'current' && (
                            <span className="text-[10px] sm:text-xs uppercase font-extrabold text-[#1b4332] bg-[#f0fbf5] px-3 py-0.5 rounded-full border border-[#52b788] animate-pulse">
                              Active Stage
                            </span>
                          )}

                          {state === 'done' && (
                            <span className="text-[10px] font-semibold text-[#52b788] bg-[#f0fbf5] px-2 py-0.5 rounded-full">
                              Completed
                            </span>
                          )}
                        </div>

                        <p
                          className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                            state === 'upcoming' ? 'text-stone-400' : 'text-stone-600'
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assigned Personnel Cards in Liquid Glass */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-200">
              
              {/* NGO Card */}
              <LiquidGlassCard variant="subtle" className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#40916c]">
                  <Building2 className="w-4 h-4 text-[#52b788]" />
                  <span>Supervising NGO</span>
                </div>
                <div>
                  <div className="font-bold text-[#1b4332] text-sm">
                    {currentRequest.assignedNgoName || 'Pending NGO Assignment'}
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    {currentRequest.assignedNgoName ? 'Reg. NGO Partner · Verified Credentials' : 'Routing to nearby verified NGO cluster'}
                  </div>
                </div>
              </LiquidGlassCard>

              {/* Volunteer Card */}
              <LiquidGlassCard variant="subtle" className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#40916c]">
                  <UserCheck className="w-4 h-4 text-[#52b788]" />
                  <span>Assigned Community Volunteer</span>
                </div>
                <div>
                  <div className="font-bold text-[#1b4332] text-sm">
                    {currentRequest.assignedVolunteerName || 'Awaiting Volunteer Match'}
                  </div>
                  {currentRequest.assignedVolunteerPhone ? (
                    <div className="flex items-center gap-3 mt-1.5">
                      <a
                        href={`tel:${currentRequest.assignedVolunteerPhone}`}
                        className="btn-glass-primary inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#74c69d]" />
                        <span>Call Volunteer: {currentRequest.assignedVolunteerPhone}</span>
                      </a>
                    </div>
                  ) : (
                    <div className="text-xs text-stone-500 mt-0.5">
                      Coordinator is matching nearest trained volunteer
                    </div>
                  )}
                </div>
              </LiquidGlassCard>

            </div>

            {/* Volunteer Notes & Updates Log */}
            {currentRequest.volunteerNotes && currentRequest.volunteerNotes.length > 0 && (
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#40916c]">
                  Field Progress Updates & Logs
                </h3>
                <div className="space-y-2">
                  {currentRequest.volunteerNotes.map((note: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-2xl bg-white/70 border border-[#d8f3dc] text-xs flex items-start gap-2.5">
                      <Clock className="w-3.5 h-3.5 text-[#40916c] mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[#1b4332] font-semibold">{note.text}</div>
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(note.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </LiquidGlassCard>

          {/* Feedback Section */}
          {currentRequest.status === 'completed' && (
            <LiquidGlassCard variant="subtle" className="p-6 sm:p-8 space-y-4 shadow-md">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="text-lg font-bold text-[#1b4332]">
                  Senior Citizen Feedback & Service Review
                </h3>
              </div>

              {currentRequest.feedback ? (
                <div className="p-5 rounded-2xl bg-white/80 border border-[#d8f3dc] space-y-2">
                  <div className="flex items-center gap-1 text-amber-500 text-base">
                    {'★'.repeat(currentRequest.feedback.rating)}
                    {'☆'.repeat(5 - currentRequest.feedback.rating)}
                    <span className="text-xs font-bold text-[#1b4332] ml-2">
                      ({currentRequest.feedback.rating}/5 Stars)
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-800 italic">
                    "{currentRequest.feedback.comment}"
                  </p>
                  <div className="text-[10px] text-stone-500 pt-1">
                    Submitted on {new Date(currentRequest.feedback.submittedAt).toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <p className="text-xs sm:text-sm text-stone-600">
                    This assistance request has been completed. How was your experience with the volunteer and NGO?
                  </p>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                      Rating (1 to 5 Stars)
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className="p-1 text-2xl transition-transform hover:scale-110 cursor-pointer"
                        >
                          <span className={star <= feedbackRating ? 'text-amber-500' : 'text-stone-300'}>
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Your Comments
                    </label>
                    <textarea
                      rows={3}
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="Share how the volunteer helped you..."
                      className="input-glass w-full px-4 py-2.5 text-xs sm:text-sm resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-glass-primary px-6 py-2.5 rounded-full text-xs sm:text-sm cursor-pointer"
                  >
                    Submit Service Feedback
                  </button>
                </form>
              )}
            </LiquidGlassCard>
          )}

        </div>
      )}

    </div>
  );
};
