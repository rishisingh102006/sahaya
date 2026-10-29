import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { DashboardCharts } from '../components/DashboardCharts';
import { DownloadReportModal } from '../components/DownloadReportModal';
import { LiquidGlassCard, LiquidGlassBadge } from '../components/LiquidGlass';
import { 
  HeartHandshake, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  Compass, 
  MapPin, 
  Phone, 
  ArrowRight, 
  Star, 
  ShieldCheck,
  Sparkles,
  FileDown,
  Activity,
  AlertCircle
} from 'lucide-react';

export const SeniorDashboard: React.FC = () => {
  const { 
    currentUser, 
    requests, 
    schemes, 
    setActiveTab, 
    setSelectedTrackRequestId 
  } = useApp();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const myRequests = requests.filter(r => r.seniorId === currentUser.id || r.seniorName === currentUser.name);
  const activeRequests = myRequests.filter(r => r.status !== 'completed' && r.status !== 'cancelled');
  const completedRequests = myRequests.filter(r => r.status === 'completed');

  const handleTrackRequest = (requestId: string) => {
    setSelectedTrackRequestId(requestId);
    setActiveTab('track');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Welcome & Senior Profile Card: Liquid Glass Emerald Banner */}
      <LiquidGlassCard
        variant="emerald"
        className="p-6 sm:p-8 shadow-[0_12px_36px_rgba(45,106,79,0.12)] border-[#52b788]/30"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#1b4332] to-[#2d6a4f] text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-md border-2 border-white/60">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <LiquidGlassBadge variant="emerald">
                  Senior Citizen Beneficiary
                </LiquidGlassBadge>
                <span className="text-xs text-stone-500 font-semibold">Age {currentUser.age || 72}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1b4332] mt-1.5 tracking-tight">
                Namaste, {currentUser.name}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-[#40916c]" />
                <span>{currentUser.address}, {currentUser.city}</span>
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-4 py-3 rounded-full btn-glass-secondary font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-[#40916c]" />
              <span>Download PDF Summary</span>
            </button>

            <button
              onClick={() => setActiveTab('create-request')}
              className="px-6 py-3 rounded-full btn-glass-primary text-white font-extrabold text-sm shadow-[0_4px_16px_rgba(45,106,79,0.3)] transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 text-[#74c69d]" />
              <span>Raise Assistance Request</span>
            </button>
          </div>
        </div>
      </LiquidGlassCard>

      {/* Summary Stat Cards: 4 Refractive Glass Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        <LiquidGlassCard variant="default" className="p-5 sm:p-6 hover:scale-[1.02] cursor-default">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Active Requests</span>
            <div className="w-8 h-8 rounded-xl bg-[#f0fbf5] flex items-center justify-center text-[#2d6a4f]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1b4332] mt-3 font-mono">
            {activeRequests.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-medium">Under review / in progress</div>
        </LiquidGlassCard>

        <LiquidGlassCard variant="emerald" className="p-5 sm:p-6 hover:scale-[1.02] cursor-default">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2d6a4f] uppercase tracking-wider">Services Concluded</span>
            <div className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center text-[#52b788]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#2d6a4f] mt-3 font-mono">
            {completedRequests.length}
          </div>
          <div className="text-[11px] text-[#40916c] mt-1 font-medium">100% verified fulfillment</div>
        </LiquidGlassCard>

        <LiquidGlassCard variant="default" className="p-5 sm:p-6 hover:scale-[1.02] cursor-default">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Welfare Schemes</span>
            <div className="w-8 h-8 rounded-xl bg-[#f0fbf5] flex items-center justify-center text-[#2d6a4f]">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1b4332] mt-3 font-mono">
            {schemes.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-medium">Health & pension coverage</div>
        </LiquidGlassCard>

        <LiquidGlassCard variant="rose" className="p-5 sm:p-6 hover:scale-[1.02] cursor-default">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Elderline SOS</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100/80 flex items-center justify-center text-rose-600">
              <Phone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700 mt-3 font-mono">
            14567
          </div>
          <div className="text-[11px] text-rose-700/80 mt-1 font-medium">Toll-free 24/7 all India</div>
        </LiquidGlassCard>

      </div>

      {/* Interactive Visual Graph & Care Distribution */}
      <DashboardCharts 
        requests={myRequests.length > 0 ? myRequests : requests} 
        title="My Care History & Category Breakdown"
        subtitle="Visual distribution of your assistance requests across healthcare, transportation, ration support, and documentation."
        defaultGraphType="bar"
      />

      {/* Active Requests Tracker Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[#1b4332] tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#52b788]" />
            <span>Active Requests ({activeRequests.length})</span>
          </h2>
          <button
            onClick={() => setActiveTab('track')}
            className="text-xs font-bold text-[#40916c] hover:text-[#1b4332] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Live Tracking Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeRequests.length === 0 ? (
          <LiquidGlassCard variant="default" className="p-8 sm:p-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#52b788] mx-auto opacity-80" />
            <h3 className="text-base font-bold text-stone-800">No active assistance requests right now</h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
              Whenever you need medicines, groceries, doctor escort, or documents help, click below.
            </p>
            <button
              onClick={() => setActiveTab('create-request')}
              className="px-6 py-2.5 rounded-full btn-glass-primary text-white text-xs font-bold cursor-pointer shadow-xs inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-[#74c69d]" />
              <span>Raise Request</span>
            </button>
          </LiquidGlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeRequests.map((req) => (
              <LiquidGlassCard
                key={req.id}
                variant="default"
                className="p-6 flex flex-col justify-between space-y-4 hover:border-[#52b788]/60 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-[#1b4332] bg-[#f0fbf5] px-3 py-1 rounded-full border border-[#d8f3dc]">
                      {req.id}
                    </span>
                    <StatusBadge status={req.status} isEmergency={req.isEmergency} size="sm" />
                  </div>

                  <h3 className="font-extrabold text-[#1b4332] text-base mt-3">
                    {req.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                    {req.description}
                  </p>
                </div>

                <div className="border-t border-[#d8f3dc]/60 pt-3.5 space-y-2.5 text-xs">
                  {req.assignedVolunteerName ? (
                    <div className="flex items-center justify-between text-stone-700 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-[#d8f3dc]">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-5 h-5 text-[#52b788]" />
                        <div>
                          <div className="font-bold text-[#1b4332]">{req.assignedVolunteerName}</div>
                          <div className="text-[11px] text-stone-500 font-medium">Verified Volunteer Assigned</div>
                        </div>
                      </div>
                      {req.assignedVolunteerPhone && (
                        <a
                          href={`tel:${req.assignedVolunteerPhone}`}
                          className="px-3.5 py-1.5 bg-[#f0fbf5] hover:bg-[#d8f3dc] border border-[#52b788]/30 rounded-full font-bold text-[#1b4332] flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#52b788]" />
                          <span>Call</span>
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="text-stone-500 italic text-xs bg-[#f0fbf5]/50 p-2.5 rounded-xl border border-[#d8f3dc]">
                      Under review by NGO coordinator. Nearby volunteer will be assigned shortly.
                    </div>
                  )}

                  <button
                    onClick={() => handleTrackRequest(req.id)}
                    className="w-full py-2.5 px-4 rounded-full btn-glass-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Track Request & Live Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#74c69d]" />
                  </button>
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        )}
      </div>

      {/* Service History & Completed Requests */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-[#1b4332] tracking-tight flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#52b788]" />
          <span>Completed Assistance History ({completedRequests.length})</span>
        </h2>

        {completedRequests.length === 0 ? (
          <LiquidGlassCard variant="default" className="p-6 text-center text-xs text-stone-500">
            No completed requests on record yet.
          </LiquidGlassCard>
        ) : (
          <LiquidGlassCard variant="default" className="overflow-hidden p-0 divide-y divide-[#d8f3dc]/60">
            {completedRequests.map((req) => (
              <div key={req.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#f0fbf5]/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">{req.id}</span>
                    <span className="text-[11px] text-stone-500 font-semibold capitalize">· {req.type} Assistance</span>
                    <StatusBadge status={req.status} size="sm" />
                  </div>
                  <h3 className="font-bold text-[#1b4332] text-sm">{req.title}</h3>
                  <p className="text-xs text-stone-500 font-medium">
                    Concluded on {req.completedAt ? new Date(req.completedAt).toLocaleDateString() : 'Recently'} by {req.assignedVolunteerName || 'Volunteer'}
                  </p>
                </div>

                <button
                  onClick={() => handleTrackRequest(req.id)}
                  className="px-4 py-2 rounded-full btn-glass-secondary text-xs font-bold flex items-center gap-1.5 shrink-0"
                >
                  <span>Review Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </LiquidGlassCard>
        )}
      </div>

      {/* Download Report Modal */}
      <DownloadReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        role="senior"
        requests={myRequests}
      />

    </div>
  );
};
