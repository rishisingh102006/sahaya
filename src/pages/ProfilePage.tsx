import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LiquidGlassCard, LiquidGlassBadge } from '../components/LiquidGlass';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Building2, 
  ShieldCheck, 
  Edit3, 
  RotateCcw, 
  HeartPulse, 
  Save, 
  X,
  Sparkles
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { 
    currentUser, 
    updateCurrentUserProfile, 
    resetDemoData
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    age: currentUser.age || 70,
    address: currentUser.address,
    city: currentUser.city,
    state: currentUser.state,
    emergencyContactName: currentUser.emergencyContactName || '',
    emergencyContactPhone: currentUser.emergencyContactPhone || '',
    medicalConditions: currentUser.medicalConditions || '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Profile Header Card with Liquid Glass */}
      <LiquidGlassCard variant="emerald" className="p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-[#d8f3dc]">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1b4332] text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-md">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <LiquidGlassBadge variant="emerald" size="sm">
                <Sparkles className="w-3 h-3 text-[#2d6a4f]" />
                <span className="capitalize">{currentUser.role} Account</span>
              </LiquidGlassBadge>
              <span className="text-xs text-stone-500 font-mono">ID: {currentUser.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1b4332] mt-1.5">
              {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Registered on Sahaya Care Welfare Network · Verified Citizen
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-glass-secondary px-5 py-2.5 rounded-full text-xs font-bold text-[#1b4332] flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Edit3 className="w-4 h-4 text-[#52b788]" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Profile Information'}</span>
        </button>
      </LiquidGlassCard>

      {/* Edit Profile Form (if toggled) */}
      {isEditing && (
        <LiquidGlassCard variant="emerald" className="p-6 sm:p-8 shadow-xl space-y-6 border border-[#52b788]">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
            <h2 className="text-base font-black text-[#1b4332]">
              Edit Account Information
            </h2>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-stone-400 hover:text-stone-600 p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-glass w-full px-4 py-2.5 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="input-glass w-full px-4 py-2.5 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="input-glass w-full px-4 py-2.5 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: Number(e.target.value) }))}
                  className="input-glass w-full px-4 py-2.5 text-xs sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Residential Address
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="input-glass w-full px-4 py-2.5 text-xs sm:text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="input-glass w-full px-4 py-2.5 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="input-glass w-full px-4 py-2.5 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                  className="input-glass w-full px-4 py-2.5 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                  className="input-glass w-full px-4 py-2.5 text-xs sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Medical Conditions / Mobility Alerts
                </label>
                <input
                  type="text"
                  value={formData.medicalConditions}
                  onChange={(e) => setFormData(prev => ({ ...prev, medicalConditions: e.target.value }))}
                  className="input-glass w-full px-4 py-2.5 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-glass-secondary px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-glass-primary px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4 text-[#74c69d]" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </LiquidGlassCard>
      )}

      {/* Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Contact & Location Details */}
        <LiquidGlassCard variant="subtle" className="p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <LiquidGlassBadge variant="emerald" size="sm">
              <MapPin className="w-3 h-3 text-[#40916c]" />
              <span>Contact & Address</span>
            </LiquidGlassBadge>
          </div>
          
          <div className="space-y-3.5 text-xs sm:text-sm">
            <div className="flex items-start gap-3 bg-white/60 p-3 rounded-2xl border border-stone-200/60">
              <Phone className="w-4 h-4 text-[#40916c] mt-0.5 shrink-0" />
              <div>
                <span className="text-stone-500 block text-[11px] font-semibold">Primary Phone</span>
                <span className="font-bold text-[#1b4332]">{currentUser.phone || 'Not provided'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/60 p-3 rounded-2xl border border-stone-200/60">
              <Mail className="w-4 h-4 text-[#40916c] mt-0.5 shrink-0" />
              <div>
                <span className="text-stone-500 block text-[11px] font-semibold">Email Address</span>
                <span className="font-bold text-[#1b4332]">{currentUser.email || 'Not provided'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/60 p-3 rounded-2xl border border-stone-200/60">
              <MapPin className="w-4 h-4 text-[#40916c] mt-0.5 shrink-0" />
              <div>
                <span className="text-stone-500 block text-[11px] font-semibold">Reporting Address</span>
                <span className="font-bold text-[#1b4332]">
                  {currentUser.address || 'Address on file'}, {currentUser.city}, {currentUser.state}
                </span>
              </div>
            </div>
          </div>
        </LiquidGlassCard>

        {/* Emergency & Medical Notes */}
        <LiquidGlassCard variant="subtle" className="p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <LiquidGlassBadge variant="rose" size="sm">
              <ShieldCheck className="w-3 h-3 text-rose-700" />
              <span>Emergency & Caretaker</span>
            </LiquidGlassBadge>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm">
            <div className="flex items-start gap-3 bg-white/60 p-3 rounded-2xl border border-stone-200/60">
              <ShieldCheck className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-stone-500 block text-[11px] font-semibold">Emergency Caretaker Contact</span>
                <span className="font-bold text-[#1b4332]">
                  {currentUser.emergencyContactName || 'Vikram Sharma (Son)'} —{' '}
                  <span className="font-mono text-[#40916c]">{currentUser.emergencyContactPhone || '+91 98220 89123'}</span>
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/60 p-3 rounded-2xl border border-stone-200/60">
              <HeartPulse className="w-4 h-4 text-[#52b788] mt-0.5 shrink-0" />
              <div>
                <span className="text-stone-500 block text-[11px] font-semibold">Medical Conditions Note</span>
                <span className="text-stone-700">
                  {currentUser.medicalConditions || 'No critical acute ailments registered. Regular mobility support only.'}
                </span>
              </div>
            </div>

            {currentUser.organizationName && (
              <div className="flex items-start gap-3 bg-white/60 p-3 rounded-2xl border border-stone-200/60">
                <Building2 className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-stone-500 block text-[11px] font-semibold">Organization Details</span>
                  <span className="font-bold text-[#1b4332]">{currentUser.organizationName}</span>
                </div>
              </div>
            )}
          </div>
        </LiquidGlassCard>

      </div>

      {/* Demonstration Settings & Data Reset */}
      <LiquidGlassCard variant="default" className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#d8f3dc]">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-[#1b4332] flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4 text-[#40916c]" />
            <span>Reset Demo Records</span>
          </h3>
          <p className="text-xs text-stone-500">
            Restore sample requests, initial volunteer dispatches, and notifications back to original demo state.
          </p>
        </div>

        <button
          onClick={resetDemoData}
          className="btn-glass-secondary px-5 py-2.5 rounded-full text-[#1b4332] font-bold text-xs shrink-0 cursor-pointer shadow-2xs"
        >
          Reset Demo Data
        </button>
      </LiquidGlassCard>

    </div>
  );
};
