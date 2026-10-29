import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { 
  Bell, 
  User, 
  Menu, 
  X, 
  ShieldAlert, 
  Compass, 
  Search, 
  PlusCircle, 
  LayoutDashboard, 
  LogOut,
  Sparkles,
  Type
} from 'lucide-react';
import { EmergencyModal } from './EmergencyModal';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    currentRole, 
    unreadCount, 
    logoutUser,
    setAuthMode,
    textSize,
    setTextSize
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  const navLinks = [
    { id: 'landing', label: 'Home', icon: null },
    { id: 'schemes', label: 'Welfare Schemes', icon: Compass },
    { id: 'track', label: 'Track Request', icon: Search },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'feedback', label: 'Reviews', icon: null },
  ];

  return (
    <>
      {/* Top Utility Bar: Emerald Glass with Accessibility Text Controls & SOS */}
      <div className="bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#1b4332] text-white text-xs border-b border-[#52b788]/20 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-1.5 opacity-95 text-xs sm:text-[13px] font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#74c69d]" />
              <span>National Elder Support & NGO Care Portal</span>
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Text Size Readability Controls for Senior Citizens */}
            <div className="hidden sm:flex items-center gap-1 bg-black/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 text-[11px]">
              <span className="text-white/70 mr-1 flex items-center gap-1">
                <Type className="w-3 h-3 text-[#74c69d]" /> Text:
              </span>
              <button
                onClick={() => setTextSize('normal')}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  textSize === 'normal' ? 'bg-[#52b788] text-white font-bold' : 'text-white/80 hover:text-white'
                }`}
                title="Normal Text Size"
              >
                A
              </button>
              <button
                onClick={() => setTextSize('large')}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer text-[12px] ${
                  textSize === 'large' ? 'bg-[#52b788] text-white font-bold' : 'text-white/80 hover:text-white'
                }`}
                title="Large Text Size for Seniors"
              >
                A+
              </button>
              <button
                onClick={() => setTextSize('extralarge')}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer text-[13px] ${
                  textSize === 'extralarge' ? 'bg-[#52b788] text-white font-bold' : 'text-white/80 hover:text-white'
                }`}
                title="Extra Large Text Size"
              >
                A++
              </button>
            </div>

            {/* Quick Emergency Button with Liquid Glass Glow */}
            <button
              onClick={() => setEmergencyModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-[11px] shadow-[0_2px_12px_rgba(225,29,72,0.4)] border border-rose-400/40 transition-all active:scale-95 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>SOS Helpline (108 / 112)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar: Liquid Glass with Refractive Specular Edge */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-2xl border-b border-[#52b788]/20 shadow-[0_4px_30px_rgba(27,67,50,0.06)] transition-all">
        {/* Prismatic Top Highlight Line */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#74c69d]/60 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div 
              onClick={() => setActiveTab('landing')}
              className="cursor-pointer group flex items-center transition-transform hover:scale-[1.01]"
            >
              <BrandLogo size="md" showSubtitle={true} />
            </div>

            {/* Desktop Navigation Links (Floating Glass Pill Strip) */}
            <nav className="hidden md:flex items-center p-1 rounded-full bg-stone-100/70 backdrop-blur-md border border-white/60 shadow-inner gap-1">
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setActiveTab(link.id as any)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                      isActive 
                        ? 'text-[#1b4332] bg-white shadow-[0_2px_10px_rgba(27,67,50,0.08)] border border-[#52b788]/30 font-bold scale-[1.02]' 
                        : 'text-stone-600 hover:text-[#1b4332] hover:bg-white/60'
                    }`}
                  >
                    {link.icon && <link.icon className={`w-4 h-4 ${isActive ? 'text-[#40916c]' : 'opacity-60'}`} />}
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Action Cluster */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              
              {/* Primary Call to Action: Liquid Glass Emerald Capsule */}
              <button
                onClick={() => setActiveTab('create-request')}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full btn-glass-primary text-white text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-98 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#74c69d]" />
                <span>Raise Request</span>
              </button>

              {/* Notification Bell with Glass Glow */}
              <button
                onClick={() => setActiveTab('notifications')}
                className="relative p-2.5 text-stone-600 hover:text-[#1b4332] hover:bg-[#f0fbf5] rounded-full transition-all cursor-pointer border border-transparent hover:border-[#52b788]/30"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white shadow-xs animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Profile / Account Dropdown */}
              {currentRole === 'guest' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAuthMode('login')}
                    className="px-4 py-2 text-xs font-bold text-[#1b4332] hover:text-[#0f2e21] border border-[#52b788]/30 rounded-full bg-white/70 backdrop-blur-md hover:bg-[#f0fbf5] transition-all cursor-pointer shadow-xs"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => setAuthMode('register')}
                    className="hidden sm:inline-block px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#40916c] to-[#2d6a4f] hover:from-[#52b788] hover:to-[#40916c] rounded-full transition-all cursor-pointer shadow-xs"
                  >
                    Register
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-10 h-10 rounded-full bg-[#f0fbf5] border border-[#52b788]/50 flex items-center justify-center text-[#1b4332] hover:bg-[#d8f3dc] transition-all cursor-pointer shadow-xs hover:ring-2 hover:ring-[#52b788]/20"
                    aria-label="User profile menu"
                  >
                    <User className="w-5 h-5 text-[#2d6a4f]" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-3xl bg-white/95 backdrop-blur-2xl border border-white/80 shadow-[0_16px_40px_rgba(27,67,50,0.12)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2.5 rounded-2xl bg-[#f0fbf5]/80 border border-[#d8f3dc] mb-1.5">
                        <p className="text-xs font-extrabold text-[#1b4332] truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-[#40916c] font-semibold capitalize mt-0.5">
                          {currentUser.role} Account
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-700 hover:text-[#1b4332] hover:bg-[#f0fbf5] transition-colors flex items-center gap-2.5 cursor-pointer"
                      >
                        <User className="w-4 h-4 text-[#52b788]" />
                        <span>My Profile & Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('dashboard');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-700 hover:text-[#1b4332] hover:bg-[#f0fbf5] transition-colors flex items-center gap-2.5 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#52b788]" />
                        <span>My Dashboard</span>
                      </button>
                      <div className="border-t border-stone-100 my-1" />
                      <button
                        onClick={() => {
                          logoutUser();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2.5 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-stone-600 hover:text-[#1b4332] rounded-xl hover:bg-[#f0fbf5] border border-stone-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#d8f3dc] bg-white/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
            <button
              onClick={() => {
                setActiveTab('create-request');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 rounded-full btn-glass-primary text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs mb-3 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#74c69d]" />
              <span>Raise Assistance Request</span>
            </button>

            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2.5 ${
                  activeTab === link.id 
                    ? 'bg-[#f0fbf5] text-[#1b4332] font-bold border border-[#52b788]/30' 
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4 text-[#40916c]" />}
                <span>{link.label}</span>
              </button>
            ))}

            <div className="border-t border-stone-100 pt-3 mt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  setEmergencyModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Emergency Helplines (14567 / 108 / 112)</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Emergency Helpline Modal */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        onRaiseEmergencyRequest={() => {
          setEmergencyModalOpen(false);
          setActiveTab('create-request');
        }}
      />
    </>
  );
};
