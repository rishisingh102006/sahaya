import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AssistanceType, PriorityLevel } from '../types';
import { STATES_LIST } from '../data/mockData';
import { LiquidGlassCard, LiquidGlassBadge } from '../components/LiquidGlass';
import { 
  Stethoscope, 
  Car, 
  ShoppingBag, 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Clock, 
  AlertTriangle,
  HeartPulse,
  Info,
  Sparkles,
  Check
} from 'lucide-react';

export const CreateRequestPage: React.FC = () => {
  const { currentUser, createRequest, setActiveTab, setSelectedTrackRequestId } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    type: 'medical' as AssistanceType,
    title: '',
    description: '',
    priority: 'routine' as PriorityLevel,
    isEmergency: false,
    seniorName: currentUser.name || '',
    seniorPhone: currentUser.phone || '',
    seniorAddress: currentUser.address || '',
    city: currentUser.city || 'Pune',
    state: currentUser.state || 'Maharashtra',
    landmark: '',
    preferredTiming: 'Morning (9:00 AM - 12:00 PM)',
    emergencyContactName: currentUser.emergencyContactName || '',
    emergencyContactPhone: currentUser.emergencyContactPhone || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const typeOptions: Array<{
    type: AssistanceType;
    label: string;
    description: string;
    icon: any;
    color: string;
    badge: string;
  }> = [
    {
      type: 'medical',
      label: 'Medical Assistance',
      description: 'Doctor visits, OPD companions, medicine pickups, hospital counter navigation',
      icon: Stethoscope,
      color: 'from-emerald-500/10 to-teal-500/10 border-[#52b788]',
      badge: 'Healthcare'
    },
    {
      type: 'emergency',
      label: 'Emergency Assistance',
      description: 'Immediate urgent help, medical distress, oxygen refill, acute fall support',
      icon: ShieldAlert,
      color: 'from-rose-500/15 to-red-500/10 border-rose-400',
      badge: 'Immediate SLA'
    },
    {
      type: 'grocery',
      label: 'Grocery & Essentials',
      description: 'Monthly ration bags, fresh vegetables, drinking water cans, daily essentials',
      icon: ShoppingBag,
      color: 'from-amber-500/10 to-orange-500/10 border-amber-400',
      badge: 'Essential Rations'
    },
    {
      type: 'transport',
      label: 'Senior Transportation',
      description: 'Assisted local transit to banks, diagnostic clinics, temples, or post office',
      icon: Car,
      color: 'from-sky-500/10 to-blue-500/10 border-sky-400',
      badge: 'Assisted Travel'
    },
    {
      type: 'documentation',
      label: 'Documentation & Pension',
      description: 'Digital Life Certificate (Jeevan Pramaan), Aadhaar-pension linking, official forms',
      icon: FileText,
      color: 'from-teal-500/10 to-emerald-500/10 border-teal-400',
      badge: 'e-KYC & Forms'
    }
  ];

  const handleTypeSelect = (selectedType: AssistanceType) => {
    setFormData(prev => ({
      ...prev,
      type: selectedType,
      isEmergency: selectedType === 'emergency',
      priority: selectedType === 'emergency' ? 'emergency' : prev.priority,
      title: prev.title || (
        selectedType === 'medical' ? 'Doctor Appointment OPD Companion' :
        selectedType === 'emergency' ? 'Urgent Medical Attention Support' :
        selectedType === 'grocery' ? 'Heavy Ration & Water Delivery' :
        selectedType === 'transport' ? 'Assisted Travel to Bank / Clinic' :
        'Digital Life Certificate Submission'
      )
    }));
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.type) newErrors.type = 'Please select an assistance type';
    } else if (step === 2) {
      if (!formData.title.trim()) newErrors.title = 'Please provide a short title for your request';
      if (!formData.description.trim()) newErrors.description = 'Please describe what you need assistance with';
      else if (formData.description.trim().length < 10) newErrors.description = 'Please provide a bit more detail (min 10 characters)';
    } else if (step === 3) {
      if (!formData.seniorAddress.trim()) newErrors.seniorAddress = 'Address is required so the volunteer can reach you';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
    } else if (step === 4) {
      if (!formData.seniorName.trim()) newErrors.seniorName = 'Senior name is required';
      if (!formData.seniorPhone.trim()) newErrors.seniorPhone = 'Contact phone number is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) {
      setCurrentStep(4);
      return;
    }

    const newId = createRequest({
      type: formData.type,
      title: formData.title,
      description: formData.description,
      priority: formData.isEmergency ? 'emergency' : formData.priority,
      isEmergency: formData.isEmergency,
      seniorAddress: formData.seniorAddress,
      city: formData.city,
      state: formData.state,
      landmark: formData.landmark,
      preferredTiming: formData.preferredTiming,
      seniorPhone: formData.seniorPhone,
      seniorName: formData.seniorName
    });

    setCreatedRequestId(newId);
  };

  if (createdRequestId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <LiquidGlassCard variant="emerald" className="p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <div className="w-18 h-18 rounded-full bg-emerald-500/15 text-[#52b788] flex items-center justify-center mx-auto border-2 border-[#52b788]/40 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-[#2d6a4f]" />
          </div>

          <div className="space-y-2">
            <LiquidGlassBadge variant="emerald" size="md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Broadcast Dispatched to Verified Volunteer Network</span>
            </LiquidGlassBadge>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1b4332] tracking-tight">
              Assistance Request Raised!
            </h2>
            <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              Your request has been routed to registered NGOs and verified volunteer networks in {formData.city}. You will receive a phone confirmation shortly.
            </p>
          </div>

          {/* Request ID Display Card */}
          <div className="bg-white/80 backdrop-blur-md border border-[#d8f3dc] rounded-2xl p-5 max-w-sm mx-auto text-left space-y-2 shadow-xs">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Assistance Tracking ID
            </div>
            <div className="text-2xl font-black font-mono text-[#1b4332] tracking-wider">
              {createdRequestId}
            </div>
            <div className="text-xs text-stone-500">
              Save this tracking code to look up your request progress live at any time.
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setSelectedTrackRequestId(createdRequestId);
                setActiveTab('track');
              }}
              className="btn-glass-primary w-full sm:w-auto px-7 py-3.5 rounded-full flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Track This Request Live</span>
              <ArrowRight className="w-4 h-4 text-[#74c69d]" />
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="btn-glass-secondary w-full sm:w-auto px-6 py-3.5 rounded-full text-stone-700 font-bold text-sm cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        </LiquidGlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Title & Progress Header */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <LiquidGlassBadge variant="emerald" size="sm">
              <Sparkles className="w-3 h-3 text-[#40916c]" />
              <span>Assistance Intake Wizard</span>
            </LiquidGlassBadge>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1b4332] tracking-tight mt-1.5">
              Raise an Assistance Request
            </h1>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Step {currentStep} of 5
            </span>
            <div className="text-sm font-extrabold text-[#1b4332]">
              {currentStep === 1 && 'Assistance Type'}
              {currentStep === 2 && 'Requirement Details'}
              {currentStep === 3 && 'Location & Urgency'}
              {currentStep === 4 && 'Contact & Timing'}
              {currentStep === 5 && 'Review & Confirm'}
            </div>
          </div>
        </div>

        {/* Multi-step progress bar */}
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                s <= currentStep 
                  ? 'bg-gradient-to-r from-[#52b788] to-[#1b4332] shadow-2xs' 
                  : 'bg-stone-200'
              }`}
            />
          ))}
        </div>
      </div>

      <LiquidGlassCard variant="default" className="shadow-lg overflow-hidden border border-[#d8f3dc]">
        
        {/* STEP 1: Select Type */}
        {currentStep === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#1b4332]">
                What kind of assistance do you need?
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Choose the category that best describes your requirement.
              </p>
            </div>

            <div className="space-y-3">
              {typeOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = formData.type === opt.type;
                return (
                  <div
                    key={opt.type}
                    onClick={() => handleTypeSelect(opt.type)}
                    className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                      isSelected
                        ? `bg-gradient-to-br ${opt.color} ring-2 ring-[#52b788]/40 shadow-sm border-2`
                        : 'border-stone-200 hover:border-[#74c69d] bg-white/70 hover:bg-white'
                    }`}
                  >
                    <div className={`p-3 rounded-xl shrink-0 ${isSelected ? 'bg-white shadow-xs text-[#1b4332]' : 'bg-[#f0fbf5] text-[#40916c]'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-[#1b4332]">
                            {opt.label}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 border border-stone-200 text-stone-600">
                            {opt.badge}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#1b4332] text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-[#74c69d]" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {errors.type && <p className="text-xs text-rose-600">{errors.type}</p>}
          </div>
        )}

        {/* STEP 2: Description & Details */}
        {currentStep === 2 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#1b4332]">
                Describe your requirement
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Provide clear instructions so our volunteers can arrive prepared with the right equipment.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Request Headline / Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Escort for Cardiology checkup at KEM Hospital"
                  className="input-glass w-full px-4 py-3 text-sm"
                />
                {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Detailed Needs & Instructions *
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g. Need someone to help me walk up the hospital ramp, stand in the billing queue, and collect medications. I use a walking stick."
                  className="input-glass w-full px-4 py-3 text-sm resize-none"
                />
                {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description}</p>}
              </div>

              {/* Special condition note */}
              <div className="p-4 rounded-2xl bg-[#f0fbf5]/80 border border-[#d8f3dc] text-[#1b4332] text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#40916c] shrink-0 mt-0.5" />
                <span>If you require a female volunteer, wheelchair assistance, or language comfort (Hindi, Marathi, Tamil, etc.), feel free to mention it in the description.</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Location & Urgency */}
        {currentStep === 3 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#1b4332]">
                Where should the volunteer report?
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Enter accurate location details so coordinators can dispatch volunteers in your neighborhood.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Complete Residential Address *
                </label>
                <textarea
                  rows={2}
                  value={formData.seniorAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, seniorAddress: e.target.value }))}
                  placeholder="Flat No, Building Name, Society, Street Name"
                  className="input-glass w-full px-4 py-3 text-sm resize-none"
                />
                {errors.seniorAddress && <p className="text-xs text-rose-600 mt-1">{errors.seniorAddress}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="e.g. Pune"
                    className="input-glass w-full px-4 py-3 text-sm"
                  />
                  {errors.city && <p className="text-xs text-rose-600 mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    State *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    className="input-glass w-full px-4 py-3 text-sm"
                  >
                    {STATES_LIST.filter(s => s !== 'All India').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Prominent Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
                  placeholder="e.g. Near Deep Bungalow Chowk, opposite Ganpati Temple"
                  className="input-glass w-full px-4 py-3 text-sm"
                />
              </div>

              {/* Priority & Emergency Toggle */}
              <div className="pt-2 border-t border-stone-100 space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f7fbf8] border border-[#d8f3dc]">
                  <div className="flex items-center gap-3">
                    <HeartPulse className={`w-5 h-5 ${formData.isEmergency ? 'text-rose-600 animate-pulse' : 'text-stone-400'}`} />
                    <div>
                      <div className="text-sm font-bold text-[#1b4332]">
                        Is this an Emergency / Critical Situation?
                      </div>
                      <div className="text-xs text-stone-500">
                        Emergencies bypass standard queues and ping all active NGO coordinators immediately.
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isEmergency}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData(prev => ({
                          ...prev,
                          isEmergency: checked,
                          priority: checked ? 'emergency' : 'routine'
                        }));
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>

                {!formData.isEmergency && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Priority Level
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, priority: 'routine' }))}
                        className={`py-2.5 px-4 rounded-full border text-xs font-bold cursor-pointer transition-all ${
                          formData.priority === 'routine'
                            ? 'border-[#1b4332] bg-[#1b4332] text-white shadow-2xs'
                            : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        Routine (Within 24-48 Hours)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, priority: 'urgent' }))}
                        className={`py-2.5 px-4 rounded-full border text-xs font-bold cursor-pointer transition-all ${
                          formData.priority === 'urgent'
                            ? 'border-amber-600 bg-amber-600 text-white shadow-2xs'
                            : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        Urgent (Within 4-12 Hours)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Contact & Timing */}
        {currentStep === 4 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#1b4332]">
                Contact information & Preferred Timing
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Our coordinator will call you to verify details before dispatch.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Senior Citizen Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.seniorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, seniorName: e.target.value }))}
                    placeholder="e.g. Ramesh Sharma"
                    className="input-glass w-full px-4 py-3 text-sm"
                  />
                  {errors.seniorName && <p className="text-xs text-rose-600 mt-1">{errors.seniorName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Primary Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.seniorPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, seniorPhone: e.target.value }))}
                    placeholder="e.g. +91 98201 44521"
                    className="input-glass w-full px-4 py-3 text-sm"
                  />
                  {errors.seniorPhone && <p className="text-xs text-rose-600 mt-1">{errors.seniorPhone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Preferred Time for Volunteer Arrival
                </label>
                <select
                  value={formData.preferredTiming}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredTiming: e.target.value }))}
                  className="input-glass w-full px-4 py-3 text-sm"
                >
                  <option value="As soon as possible / Immediate">As soon as possible / Immediate</option>
                  <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                  <option value="Evening (4:30 PM - 7:30 PM)">Evening (4:30 PM - 7:30 PM)</option>
                  <option value="Tomorrow Morning">Tomorrow Morning</option>
                </select>
              </div>

              <div className="pt-2 border-t border-stone-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Emergency Relative / Caretaker Details (Optional)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      Caretaker / Son / Daughter Name
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                      placeholder="e.g. Vikram Sharma (Son)"
                      className="input-glass w-full px-4 py-2.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      Caretaker Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                      placeholder="e.g. +91 98220 89123"
                      className="input-glass w-full px-4 py-2.5 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Review & Confirm */}
        {currentStep === 5 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#1b4332]">
                Please review your assistance request
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Double-check the address and telephone number before submitting.
              </p>
            </div>

            <div className="rounded-2xl border border-[#d8f3dc] p-5 space-y-4 bg-white/70 backdrop-blur-md shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#d8f3dc]">
                <div>
                  <span className="text-xs uppercase font-bold text-[#40916c]">
                    Category: {formData.type.toUpperCase()}
                  </span>
                  <h3 className="text-base font-bold text-[#1b4332] mt-0.5">
                    {formData.title}
                  </h3>
                </div>
                <div>
                  {formData.isEmergency ? (
                    <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold">
                      Emergency Alert
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-white text-stone-800 border border-[#d8f3dc] text-xs font-semibold capitalize">
                      {formData.priority} Priority
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                <span className="font-semibold text-[#1b4332]">Description: </span>
                {formData.description}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#d8f3dc] text-xs">
                <div>
                  <span className="font-semibold text-[#1b4332] block mb-0.5">Senior Citizen:</span>
                  <span className="text-stone-700">{formData.seniorName} ({formData.seniorPhone})</span>
                </div>
                <div>
                  <span className="font-semibold text-[#1b4332] block mb-0.5">Preferred Time:</span>
                  <span className="text-stone-700">{formData.preferredTiming}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold text-[#1b4332] block mb-0.5">Reporting Address:</span>
                  <span className="text-stone-700">
                    {formData.seniorAddress}, {formData.city}, {formData.state}
                    {formData.landmark && ` (Landmark: ${formData.landmark})`}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f0fbf5] border border-[#d8f3dc] text-[#1b4332] text-xs flex items-start gap-2">
              <Info className="w-4 h-4 text-[#40916c] shrink-0 mt-0.5" />
              <span><strong>Notice:</strong> Sahaya is a free community welfare initiative. Volunteers are non-commercial community members. You will never be asked for any cash fees.</span>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="px-6 sm:px-8 py-5 bg-white/60 backdrop-blur-md border-t border-[#d8f3dc] flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="btn-glass-secondary px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-glass-primary px-7 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 text-[#74c69d]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="btn-glass-primary px-8 py-3 rounded-full text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Confirm & Submit Request</span>
              <CheckCircle2 className="w-4 h-4 text-[#74c69d]" />
            </button>
          )}
        </div>

      </LiquidGlassCard>

    </div>
  );
};
