import React from 'react';
import { PhoneCall, ShieldAlert, HeartPulse, X, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LiquidGlassCard, LiquidGlassBadge } from './LiquidGlass';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRaiseEmergencyRequest: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, onRaiseEmergencyRequest }) => {
  const { showToast } = useApp();

  if (!isOpen) return null;

  const helplines = [
    {
      name: 'Elderline (National Senior Citizen Helpline)',
      number: '14567',
      desc: 'Free toll-free assistance for abuse, pension issues, rescue & emotional support',
      badge: 'Senior Helpline',
      color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950',
      iconColor: 'text-emerald-600'
    },
    {
      name: 'Medical Emergency / Ambulance',
      number: '108',
      desc: '24/7 urgent medical dispatch and paramedic support across states',
      badge: 'Immediate Dispatch',
      color: 'bg-rose-500/10 border-rose-500/30 text-rose-950',
      iconColor: 'text-rose-600'
    },
    {
      name: 'National Emergency Response System',
      number: '112',
      desc: 'Unified all-in-one emergency dispatch for Police, Fire, and Medical',
      badge: 'All-in-One 112',
      color: 'bg-stone-500/10 border-stone-300 text-stone-900',
      iconColor: 'text-stone-700'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md overflow-y-auto">
      <div 
        className="max-w-lg w-full my-6 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="emergency-dialog-title"
      >
        <LiquidGlassCard variant="rose" className="overflow-hidden border border-rose-200/80 shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-6 py-5 text-white flex items-start justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-xs shadow-inner">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 id="emergency-dialog-title" className="text-xl font-black tracking-tight">
                  Emergency & Immediate Assistance
                </h2>
                <p className="text-rose-100 text-xs mt-0.5 font-medium">
                  Priority medical triage & rapid senior emergency response
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close emergency modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Warning Alert Banner */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-950 text-xs sm:text-sm backdrop-blur-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <span>If life or physical safety is at immediate risk, call <strong>108</strong> (Ambulance) or <strong>112</strong> (Unified Emergency) immediately.</span>
            </div>

            {/* Helpline List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Verified Government Helplines (Toll-Free)
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  24/7 Active
                </span>
              </div>

              {helplines.map((line) => (
                <div
                  key={line.number}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all backdrop-blur-xs ${line.color}`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{line.name}</span>
                    </div>
                    <div className="text-xs text-stone-600 leading-snug">{line.desc}</div>
                  </div>
                  <a
                    href={`tel:${line.number}`}
                    onClick={() => showToast(`Dialing ${line.number}...`, 'info')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-xl border border-stone-200 font-black text-stone-900 text-sm shadow-xs hover:bg-[#f0fbf5] hover:border-[#52b788] active:scale-95 transition-all shrink-0 cursor-pointer"
                  >
                    <PhoneCall className={`w-4 h-4 ${line.iconColor}`} />
                    <span>{line.number}</span>
                  </a>
                </div>
              ))}
            </div>

            {/* In-App Dispatch Option */}
            <div className="pt-3 border-t border-rose-900/10 space-y-2">
              <div className="text-xs text-stone-600 font-medium">
                Need immediate community volunteer dispatch on Sahaya?
              </div>
              <button
                onClick={() => {
                  onClose();
                  onRaiseEmergencyRequest();
                }}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-rose-600/25 transition-all active:scale-98 cursor-pointer"
              >
                <HeartPulse className="w-5 h-5 animate-pulse" />
                <span>Raise Immediate Emergency Request on Sahaya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  );
};

