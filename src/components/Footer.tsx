import React from 'react';
import { Phone, ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { LiquidGlassPanel, LiquidGlassBadge } from './LiquidGlass';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-[#2d6a4f]/50">
      <LiquidGlassPanel variant="dark" className="text-stone-300 text-sm py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            
            {/* Brand & Mission with Logo */}
            <div className="md:col-span-1 space-y-3">
              <div className="bg-white/95 p-3 rounded-2xl inline-block shadow-md backdrop-blur-xs">
                <BrandLogo size="md" showSubtitle={true} />
              </div>
              <p className="text-stone-300 text-xs leading-relaxed">
                A centralized digital community portal ensuring dignified, reliable, and prompt assistance for senior citizens in collaboration with verified NGOs and volunteer networks.
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs text-[#74c69d] bg-white/10 px-3 py-1 rounded-full border border-white/15 backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Volunteer Verified</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#74c69d] mb-3">
                Services & Portals
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setActiveTab('create-request')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Raise Assistance Request
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('schemes')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Welfare Scheme Finder
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('track')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Track Live Request
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Role Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('feedback')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Senior Citizen Reviews
                  </button>
                </li>
              </ul>
            </div>

            {/* Assistance Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#74c69d] mb-3">
                Support Pillars
              </h4>
              <ul className="space-y-2 text-xs text-stone-300">
                <li>• Medical Appointments & OPD Escort</li>
                <li>• Safe Senior Transportation</li>
                <li>• Grocery, Rations & Water Can Supply</li>
                <li>• Pension & Digital Life Certificate (Jeevan Pramaan)</li>
                <li>• Urgent Emergency Response Coordination</li>
              </ul>
            </div>

            {/* Emergency & Helplines */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#74c69d] mb-3">
                National Helplines
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs">
                  <div className="font-semibold text-white flex items-center justify-between">
                    <span>Elderline (Senior Citizens)</span>
                    <a href="tel:14567" className="text-[#74c69d] font-bold hover:underline flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3" /> 14567
                    </a>
                  </div>
                  <div className="text-[11px] text-stone-300 mt-0.5">Toll-free 24/7 all India support</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs">
                  <div className="font-semibold text-white flex items-center justify-between">
                    <span>Medical Emergency</span>
                    <a href="tel:108" className="text-rose-400 font-bold hover:underline flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3" /> 108
                    </a>
                  </div>
                  <div className="text-[11px] text-stone-300 mt-0.5">National Ambulance Service</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
            <p>© 2026 Sahaya Care — Support Home & Care For Elders. Built for social welfare & community impact.</p>
            <div className="flex items-center gap-4 text-stone-300">
              <span>Senior Friendly Design</span>
              <span>·</span>
              <span>Zero Commercial Fees</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-[#74c69d]">
                <Heart className="w-3 h-3 fill-[#74c69d]" /> Community Driven
              </span>
            </div>
          </div>
        </div>
      </LiquidGlassPanel>
    </footer>
  );
};

