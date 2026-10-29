import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Scheme } from '../types';
import { STATES_LIST } from '../data/mockData';
import { LiquidGlassCard, LiquidGlassBadge, LiquidGlassPanel } from '../components/LiquidGlass';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  X, 
  ExternalLink, 
  FileText, 
  Building2, 
  AlertCircle, 
  Sparkles, 
  Info, 
  ShieldCheck, 
  Check, 
  RotateCcw, 
  ArrowRight,
  UserCheck,
  Copy,
  Phone,
  Layers,
  MapPin,
  Clock,
  Coins,
  HeartHandshake,
  CheckCircle,
  HelpCircle,
  Download
} from 'lucide-react';

export const SchemeFinderPage: React.FC = () => {
  const { schemes, currentUser, createRequest, setSelectedTrackRequestId, setActiveTab, showToast } = useApp();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState(currentUser.state || 'All India');
  const [age, setAge] = useState<number>(currentUser.age || 65);
  const [gender, setGender] = useState<'all' | 'female' | 'male'>(
    currentUser.gender === 'female' ? 'female' : currentUser.gender === 'male' ? 'male' : 'all'
  );
  const [isWidow, setIsWidow] = useState<boolean>(false);
  const [incomeGroup, setIncomeGroup] = useState<'any' | 'bpl' | 'low' | 'middle'>('any');
  const [areaType, setAreaType] = useState<'all' | 'rural' | 'urban'>('all');
  const [disabilityOnly, setDisabilityOnly] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sourceTypeFilter, setSourceTypeFilter] = useState<'all' | 'government' | 'ngo'>('all');
  const [showEligibleOnly, setShowEligibleOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'best_match' | 'benefit_value' | 'name_asc'>('best_match');

  // Modal States
  const [detailsScheme, setDetailsScheme] = useState<Scheme | null>(null);
  const [applyScheme, setApplyScheme] = useState<Scheme | null>(null);

  // Application Wizard States (Inside Apply Modal)
  const [applyStep, setApplyStep] = useState<number>(1);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [applyMode, setApplyMode] = useState<'volunteer' | 'portal' | 'offline'>('volunteer');
  const [generatedAppRef, setGeneratedAppRef] = useState<string | null>(null);
  const [createdAssistanceId, setCreatedAssistanceId] = useState<string | null>(null);

  // Volunteer form fields inside Apply wizard
  const [volunteerSeniorName, setVolunteerSeniorName] = useState(currentUser.name || 'Ramesh Sharma');
  const [volunteerSeniorPhone, setVolunteerSeniorPhone] = useState(currentUser.phone || '+91 98201 44521');
  const [volunteerAddress, setVolunteerAddress] = useState(currentUser.address || 'Flat 402, Shanti Kunj Apts, Model Colony, Pune');
  const [preferredSlot, setPreferredSlot] = useState('Morning (10:00 AM - 1:00 PM)');
  const [volunteerNotes, setVolunteerNotes] = useState('Senior requires physical assistance with biometric e-KYC and form verification.');

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Categories' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'pension', label: 'Pensions' },
    { id: 'assistive_devices', label: 'Assistive Devices' },
    { id: 'widow_support', label: 'Widow Support' },
    { id: 'food_security', label: 'Food Security' },
    { id: 'financial', label: 'Financial & Savings' },
  ];

  // Robust Eligibility Evaluation Engine
  const evaluateEligibility = (scheme: Scheme) => {
    const reasons: string[] = [];
    const disqualifications: string[] = [];

    // 1. HARD DISQUALIFIERS
    // State applicability
    const isAllIndia = scheme.applicableStates.includes('All India');
    const isStateMatch = isAllIndia || selectedState === 'All India' || scheme.applicableStates.includes(selectedState);
    if (!isStateMatch) {
      disqualifications.push(`Only applicable in: ${scheme.applicableStates.join(', ')} (Your selected state: ${selectedState})`);
    }

    // Gender check
    if (scheme.gender !== 'all' && gender !== 'all' && scheme.gender !== gender) {
      disqualifications.push(`Exclusively for ${scheme.gender} applicants`);
    }

    // Widow check
    if (scheme.widowOnly && !isWidow) {
      disqualifications.push('Requires verified widow or destitute single senior status');
    }

    // Age check
    if (age < scheme.minAge) {
      disqualifications.push(`Requires minimum age of ${scheme.minAge} (You entered ${age} years)`);
    }
    if (scheme.maxAge && age > scheme.maxAge) {
      disqualifications.push(`Exceeds maximum age limit of ${scheme.maxAge}`);
    }

    // Disability check if scheme is disability only
    if (scheme.disabilityOnly && !disabilityOnly) {
      disqualifications.push('Requires certified age-related disability or locomotor infirmity');
    }

    // If hard disqualifications exist, scheme is Ineligible
    if (disqualifications.length > 0) {
      return {
        score: 0,
        status: 'ineligible' as const,
        isEligible: false,
        isPartial: false,
        reasons: disqualifications,
        disqualifications
      };
    }

    // 2. CONDITIONAL CRITERIA (Income & Area)
    let score = 100;
    const conditionalNotes: string[] = [];

    if (scheme.incomeCriteria === 'bpl' && incomeGroup !== 'bpl' && incomeGroup !== 'any') {
      score = 75;
      conditionalNotes.push(`Subject to BPL Ration Card / Income Certificate (< ₹${scheme.maxAnnualIncome?.toLocaleString('en-IN') || '1,20,000'}/year)`);
    }

    if (scheme.incomeCriteria === 'low' && incomeGroup === 'middle') {
      score = 70;
      conditionalNotes.push(`Annual income must be within verified limit (< ₹${scheme.maxAnnualIncome?.toLocaleString('en-IN') || '2,50,000'}/year)`);
    }

    if (scheme.areaCriteria && scheme.areaCriteria !== 'all' && areaType !== 'all' && scheme.areaCriteria !== areaType) {
      score = 65;
      conditionalNotes.push(`Priority designated for ${scheme.areaCriteria} areas`);
    }

    const isEligible = score === 100;
    const isPartial = score < 100;

    if (isEligible) {
      reasons.push(`✓ Age ${age} meets minimum ${scheme.minAge} requirement`);
      reasons.push(`✓ Applicable in ${isAllIndia ? 'All of India' : scheme.applicableStates.join(', ')}`);
      reasons.push(`✓ Universal / open criteria satisfied`);
    } else {
      reasons.push(...conditionalNotes);
    }

    return {
      score,
      status: isEligible ? ('eligible' as const) : ('conditional' as const),
      isEligible,
      isPartial,
      reasons,
      disqualifications: []
    };
  };

  // Filtered & Ranked Schemes
  const evaluatedSchemes = useMemo(() => {
    return schemes
      .filter((scheme) => {
        // Category filter
        if (selectedCategory !== 'all' && scheme.category !== selectedCategory) {
          return false;
        }

        // Source type filter (government vs ngo)
        if (sourceTypeFilter !== 'all' && scheme.sourceType && scheme.sourceType !== sourceTypeFilter) {
          return false;
        }

        // Disability only filter
        if (disabilityOnly && !scheme.disabilityOnly && scheme.category !== 'assistive_devices') {
          return false;
        }

        // Search text query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchText = `${scheme.name} ${scheme.shortDescription} ${scheme.governingBody} ${scheme.benefits} ${scheme.category} ${scheme.applicableStates.join(' ')}`.toLowerCase();
          if (!matchText.includes(q)) return false;
        }

        return true;
      })
      .map((scheme) => {
        const eligibility = evaluateEligibility(scheme);
        return {
          scheme,
          eligibility
        };
      })
      .filter((item) => {
        if (showEligibleOnly) {
          return item.eligibility.isEligible || item.eligibility.isPartial;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'best_match') {
          return b.eligibility.score - a.eligibility.score;
        }
        if (sortBy === 'name_asc') {
          return a.scheme.name.localeCompare(b.scheme.name);
        }
        if (sortBy === 'benefit_value') {
          return (b.scheme.benefitValue || '').localeCompare(a.scheme.benefitValue || '');
        }
        return 0;
      });
  }, [
    schemes, 
    selectedCategory, 
    sourceTypeFilter, 
    searchQuery, 
    age, 
    gender, 
    isWidow, 
    selectedState, 
    incomeGroup, 
    areaType, 
    disabilityOnly, 
    showEligibleOnly,
    sortBy
  ]);

  // Summary counts
  const eligibleCount = useMemo(() => {
    return schemes.filter(s => evaluateEligibility(s).isEligible).length;
  }, [schemes, age, gender, isWidow, selectedState, incomeGroup, areaType, disabilityOnly]);

  const conditionalCount = useMemo(() => {
    return schemes.filter(s => evaluateEligibility(s).isPartial).length;
  }, [schemes, age, gender, isWidow, selectedState, incomeGroup, areaType, disabilityOnly]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedState('All India');
    setAge(65);
    setGender('all');
    setIsWidow(false);
    setIncomeGroup('any');
    setAreaType('all');
    setDisabilityOnly(false);
    setSelectedCategory('all');
    setSourceTypeFilter('all');
    setShowEligibleOnly(false);
    setSortBy('best_match');
    showToast('All filters reset to default view', 'info');
  };

  // Open Apply Wizard
  const handleOpenApply = (scheme: Scheme) => {
    setApplyScheme(scheme);
    setApplyStep(1);
    // Initialize doc checklist
    const initialDocs: Record<string, boolean> = {};
    scheme.requiredDocuments.forEach(doc => {
      // By default mark common identity doc like Aadhaar as checked
      initialDocs[doc] = doc.toLowerCase().includes('aadhaar');
    });
    setCheckedDocs(initialDocs);
    setGeneratedAppRef(null);
    setCreatedAssistanceId(null);
    setVolunteerSeniorName(currentUser.name || 'Ramesh Sharma');
    setVolunteerSeniorPhone(currentUser.phone || '+91 98201 44521');
    setVolunteerAddress(currentUser.address || 'Flat 402, Shanti Kunj Apts, Model Colony, Pune');
  };

  const handleToggleDoc = (doc: string) => {
    setCheckedDocs(prev => ({
      ...prev,
      [doc]: !prev[doc]
    }));
  };

  const handleCheckAllDocs = () => {
    if (!applyScheme) return;
    const allChecked: Record<string, boolean> = {};
    applyScheme.requiredDocuments.forEach(d => {
      allChecked[d] = true;
    });
    setCheckedDocs(allChecked);
    showToast('All documents marked as ready', 'info');
  };

  const handleConfirmVolunteerBooking = () => {
    if (!applyScheme) return;

    // Create a real documentation assistance request on Sahaya
    const newReqId = createRequest({
      type: 'documentation',
      title: `Doorstep Application Help: ${applyScheme.name}`,
      description: `Senior requested physical volunteer assistance to fill out forms and verify documents for ${applyScheme.name}. Slot: ${preferredSlot}. Notes: ${volunteerNotes}`,
      priority: 'routine',
      isEmergency: false,
      seniorAddress: volunteerAddress || currentUser.address || 'Address on file',
      city: currentUser.city || 'Pune',
      state: selectedState !== 'All India' ? selectedState : currentUser.state || 'Maharashtra',
      preferredTiming: preferredSlot,
      seniorName: volunteerSeniorName || currentUser.name,
      seniorPhone: volunteerSeniorPhone || currentUser.phone
    });

    const appRef = `APP-SCH-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedAppRef(appRef);
    setCreatedAssistanceId(newReqId);
    setApplyStep(3);
    showToast(`Volunteer assistance request ${newReqId} created successfully!`, 'success');
  };

  const handleCopyChecklist = () => {
    if (!applyScheme) return;
    const text = `Required Documents for ${applyScheme.name}:\n` + applyScheme.requiredDocuments.map((d, i) => `${i + 1}. ${d}`).join('\n');
    navigator.clipboard.writeText(text);
    showToast('Document checklist copied to clipboard!', 'success');
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'healthcare':
        return { label: 'Healthcare', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'pension':
        return { label: 'Pension Scheme', color: 'bg-teal-50 text-teal-800 border-teal-200' };
      case 'assistive_devices':
        return { label: 'Assistive Devices', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'widow_support':
        return { label: 'Widow Support', color: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'food_security':
        return { label: 'Food Security', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'financial':
        return { label: 'Financial Savings', color: 'bg-sky-50 text-sky-800 border-sky-200' };
      default:
        return { label: 'Welfare Scheme', color: 'bg-stone-50 text-stone-800 border-stone-200' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header Banner in Liquid Glass Emerald */}
      <LiquidGlassCard variant="emerald" className="p-6 sm:p-10 space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/70 text-[#1b4332] border border-[#b7e4c7] text-xs font-bold shadow-2xs backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#52b788]" />
              <span>Smart Welfare Schemes & Pension Navigator</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#1b4332] tracking-tight">
              Welfare Scheme & Eligibility Directory
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Enter your age, state, and category below. Our real-time engine matches central and state government pensions, free medical schemes, assistive aids, and NGO initiatives tailored to your profile, with instant doorstep volunteer application assistance.
            </p>
          </div>

          <div className="shrink-0 p-5 rounded-2xl bg-white/80 border border-[#b7e4c7] text-xs text-stone-600 shadow-xs max-w-xs space-y-2 backdrop-blur-xs">
            <div className="font-bold text-[#1b4332] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#52b788]" />
              <span>Universal 70+ Coverage Active</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Indian citizens aged 70+ are entitled to ₹5 Lakh free annual hospitalization under Ayushman Vaya Vandana regardless of income.
            </p>
            <div className="pt-2 flex items-center justify-between border-t border-emerald-900/10 text-[11px]">
              <span className="text-stone-500">Ayushman Helpline:</span>
              <a href="tel:14555" className="font-mono font-bold text-[#1b4332] hover:underline flex items-center gap-1 bg-[#f0fbf5] px-2 py-0.5 rounded border border-[#d8f3dc]">
                <Phone className="w-3 h-3 text-[#52b788]" /> 14555
              </a>
            </div>
          </div>
        </div>

        {/* Real-time Match Summary Strip */}
        <div className="pt-3 border-t border-emerald-900/10 flex flex-wrap items-center justify-between gap-4 text-xs relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-stone-700 font-medium">
              Profile Summary: <strong>Age {age}</strong> · <strong>{selectedState}</strong> · <strong>{gender === 'all' ? 'Any Gender' : gender}</strong>
            </span>
            <LiquidGlassBadge variant="emerald" className="font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#52b788]" />
              <span>{eligibleCount} Fully Eligible</span>
            </LiquidGlassBadge>
            {conditionalCount > 0 && (
              <LiquidGlassBadge variant="amber" className="font-bold">
                <Info className="w-3.5 h-3.5 text-amber-700" />
                <span>{conditionalCount} Conditionally Eligible</span>
              </LiquidGlassBadge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEligibleOnly(!showEligibleOnly)}
              className={`px-4 py-2 rounded-full font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                showEligibleOnly
                  ? 'bg-[#1b4332] text-white shadow-xs'
                  : 'bg-white/80 text-stone-700 border border-[#b7e4c7] hover:bg-white'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{showEligibleOnly ? 'Showing Eligible Only' : 'Show Eligible Only'}</span>
            </button>
          </div>
        </div>
      </LiquidGlassCard>

      {/* Interactive Criteria & Filter Controls */}
      <LiquidGlassCard variant="default" className="p-6 sm:p-7 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-emerald-900/10">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#40916c]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1b4332]">
              Your Eligibility Profile & Filters
            </h2>
          </div>
          <button
            onClick={resetFilters}
            className="text-xs text-stone-500 hover:text-[#1b4332] flex items-center gap-1.5 transition-colors cursor-pointer px-3 py-1 rounded-full bg-white/70 border border-stone-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Criteria</span>
          </button>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* State of Residence */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              State of Residence
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="input-glass w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium"
            >
              {STATES_LIST.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Age Selection with Quick Presets */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Age: <span className="text-[#1b4332] text-sm font-bold">{age} Years</span>
              </label>
            </div>
            <input
              type="range"
              min="40"
              max="95"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#52b788]"
            />
            {/* Quick age chips for easy one-click selection */}
            <div className="flex items-center gap-1 pt-1">
              {[58, 60, 65, 70, 80].map((presetAge) => (
                <button
                  key={presetAge}
                  type="button"
                  onClick={() => setAge(presetAge)}
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                    age === presetAge 
                      ? 'bg-[#1b4332] text-white shadow-2xs' 
                      : 'bg-white/80 text-stone-600 hover:bg-white border border-stone-200'
                  }`}
                >
                  {presetAge}y{presetAge === 70 && '★'}
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="input-glass w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium"
            >
              <option value="all">Any / All</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>

          {/* Income Group */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Income Group
            </label>
            <select
              value={incomeGroup}
              onChange={(e) => setIncomeGroup(e.target.value as any)}
              className="input-glass w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium"
            >
              <option value="any">Any Income / Universal</option>
              <option value="bpl">Below Poverty Line (BPL / Antyodaya)</option>
              <option value="low">Annual Income &lt; ₹2.5 Lakh</option>
              <option value="middle">Annual Income &lt; ₹5.0 Lakh</option>
            </select>
          </div>

          {/* Area Type (Rural / Urban) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Area / Locality
            </label>
            <select
              value={areaType}
              onChange={(e) => setAreaType(e.target.value as any)}
              className="input-glass w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium"
            >
              <option value="all">All / Both Rural & Urban</option>
              <option value="rural">Rural Area (Gram Panchayat)</option>
              <option value="urban">Urban Area (Municipality)</option>
            </select>
          </div>

        </div>

        {/* Secondary Toggles & Source Filters */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-700 border-t border-emerald-900/10">
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isWidow}
                onChange={(e) => setIsWidow(e.target.checked)}
                className="w-4 h-4 rounded text-[#40916c] border-stone-300 focus:ring-[#52b788]"
              />
              <span className="font-semibold text-stone-800">Widowed / Single Destitute Pension</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={disabilityOnly}
                onChange={(e) => setDisabilityOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#40916c] border-stone-300 focus:ring-[#52b788]"
              />
              <span className="font-semibold text-stone-800">Assistive Devices & Disability Aids Only</span>
            </label>
          </div>

          {/* Scheme Source Pill filter (Govt vs NGO) */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 font-semibold">Source:</span>
            <div className="inline-flex rounded-xl border border-stone-200 bg-white/70 p-0.5 shadow-2xs">
              <button
                onClick={() => setSourceTypeFilter('all')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                  sourceTypeFilter === 'all' ? 'bg-[#1b4332] text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSourceTypeFilter('government')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                  sourceTypeFilter === 'government' ? 'bg-[#1b4332] text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Govt Schemes
              </button>
              <button
                onClick={() => setSourceTypeFilter('ngo')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                  sourceTypeFilter === 'ngo' ? 'bg-[#1b4332] text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                NGO Programs
              </button>
            </div>
          </div>
        </div>

        {/* Search, Category Pills & Sort Controls */}
        <div className="pt-4 border-t border-emerald-900/10 space-y-4">
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search schemes by name, keyword (e.g. 'ayushman', 'cataract', 'pension', 'wheelchair', 'annapurna', 'lic')..."
                className="input-glass w-full pl-11 pr-4 py-2.5 rounded-full text-xs sm:text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-stone-500 font-semibold whitespace-nowrap">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="input-glass px-3 py-2 rounded-xl text-xs font-medium"
              >
                <option value="best_match">Highest Eligibility Match</option>
                <option value="name_asc">Alphabetical (A - Z)</option>
                <option value="benefit_value">Benefit Highlight</option>
              </select>
            </div>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const count = cat.id === 'all' 
                ? schemes.length 
                : schemes.filter(s => s.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-[#1b4332] text-white shadow-xs'
                      : 'bg-[#f0fbf5]/80 text-[#1b4332] hover:bg-[#d8f3dc] border border-[#d8f3dc]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-[#d8f3dc] text-[#1b4332]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

      </LiquidGlassCard>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-lg font-extrabold text-[#1b4332] tracking-tight flex items-center gap-2">
          <span>Available Welfare Schemes & Benefits ({evaluatedSchemes.length})</span>
        </h3>
        <span className="text-xs text-stone-500">
          Showing schemes for: <strong>{selectedState}</strong> · Age <strong>{age}y</strong> · Area: <strong className="capitalize">{areaType}</strong>
        </span>
      </div>

      {/* Schemes Results List */}
      {evaluatedSchemes.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#d8f3dc] p-12 text-center space-y-4 shadow-xs">
          <AlertCircle className="w-10 h-10 text-stone-400 mx-auto" />
          <h4 className="text-base font-bold text-stone-800">No matching schemes found for these criteria</h4>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Try resetting your income filter, switching state to "All India", clearing search keywords, or disabling the "Show Eligible Only" switch.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 rounded-full bg-[#1b4332] text-white text-xs font-bold cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {evaluatedSchemes.map(({ scheme, eligibility }) => {
            const badge = getCategoryBadge(scheme.category);

            return (
              <LiquidGlassCard
                key={scheme.id}
                variant={eligibility.isEligible ? 'emerald' : eligibility.isPartial ? 'amber' : 'subtle'}
                className="p-6 flex flex-col justify-between transition-all group"
              >
                <div className="space-y-4">
                  
                  {/* Top line: Eligibility Indicator, Category Tag & Benefit Value */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-900/10 text-xs">
                    <div className="flex items-center gap-2">
                      {eligibility.isEligible ? (
                        <LiquidGlassBadge variant="emerald" className="font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#52b788]" />
                          <span>100% Eligible</span>
                        </LiquidGlassBadge>
                      ) : eligibility.isPartial ? (
                        <LiquidGlassBadge variant="amber" className="font-bold">
                          <Info className="w-3.5 h-3.5 text-amber-700" />
                          <span>Conditionally Eligible</span>
                        </LiquidGlassBadge>
                      ) : (
                        <LiquidGlassBadge variant="subtle" className="font-semibold text-stone-600">
                          <X className="w-3 h-3 text-stone-400" />
                          <span>Not Eligible</span>
                        </LiquidGlassBadge>
                      )}

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {scheme.benefitValue && (
                        <span className="text-[11px] font-bold text-[#1b4332] bg-[#e8f5ec]/80 px-2.5 py-0.5 rounded-full border border-[#d8f3dc]">
                          {scheme.benefitValue}
                        </span>
                      )}
                      <div className="text-[11px] text-[#40916c] font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{scheme.applicableStates.includes('All India') ? 'All India' : scheme.applicableStates.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Scheme Title & Ministry / Source */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        scheme.sourceType === 'ngo' 
                          ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {scheme.sourceType === 'ngo' ? 'NGO Initiative' : 'Government Welfare'}
                      </span>
                      {scheme.helplinePhone && (
                        <a
                          href={`tel:${scheme.helplinePhone}`}
                          className="text-[10px] text-stone-500 hover:text-[#1b4332] flex items-center gap-1 font-mono font-semibold"
                        >
                          <Phone className="w-2.5 h-2.5 text-[#52b788]" />
                          <span>{scheme.helplinePhone}</span>
                        </a>
                      )}
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-[#1b4332] group-hover:text-[#40916c] transition-colors leading-snug">
                      {scheme.name}
                    </h4>
                    <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                      <span>{scheme.governingBody}</span>
                    </p>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {scheme.shortDescription}
                  </p>

                  {/* Benefits Box */}
                  <div className="p-3.5 rounded-2xl bg-[#f0fbf5]/80 border border-[#d8f3dc] text-xs text-[#1b4332] backdrop-blur-xs">
                    <span className="font-bold block mb-0.5 text-[#1b4332]">Key Benefits:</span>
                    {scheme.benefits}
                  </div>

                  {/* Eligibility Reason or Disqualification Note */}
                  {!eligibility.isEligible && eligibility.reasons.length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
                      <span className="font-bold block text-[11px] uppercase tracking-wider">
                        {eligibility.status === 'ineligible' ? 'Disqualification Reason:' : 'Eligibility Condition:'}
                      </span>
                      <ul className="space-y-0.5 text-[11px]">
                        {eligibility.reasons.map((r, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span>•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Required Documents Checklist preview */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      Required Documents:
                    </span>
                    <ul className="text-xs text-stone-600 space-y-1">
                      {scheme.requiredDocuments.slice(0, 3).map((doc, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#52b788] shrink-0" />
                          <span className="truncate">{doc}</span>
                        </li>
                      ))}
                      {scheme.requiredDocuments.length > 3 && (
                        <li className="text-[11px] text-stone-400 italic pl-5">
                          +{scheme.requiredDocuments.length - 3} more required document(s)
                        </li>
                      )}
                    </ul>
                  </div>

                </div>

                {/* Card Actions: View Details vs Apply Now */}
                <div className="mt-6 pt-4 border-t border-emerald-900/10 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setDetailsScheme(scheme)}
                    className="text-xs font-semibold text-stone-700 hover:text-[#1b4332] flex items-center gap-1.5 cursor-pointer py-2 px-4 rounded-full bg-white/70 hover:bg-white border border-stone-200 transition-colors shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-stone-500" />
                    <span>View Details</span>
                  </button>

                  <button
                    onClick={() => handleOpenApply(scheme)}
                    className="btn-glass-primary text-xs font-bold px-5 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </LiquidGlassCard>
            );
          })}
        </div>
      )}

      {/* 1. SCHEME DETAILS MODAL (Pure Information, Breakdown, Criteria & Links) */}
      {detailsScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md overflow-y-auto">
          <div 
            className="glass-panel-elevated rounded-3xl max-w-2xl w-full border border-white/60 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-[#1b4332] text-white px-6 py-5 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#74c69d] bg-white/10 px-2 py-0.5 rounded">
                    {detailsScheme.category.toUpperCase().replace('_', ' ')}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200 bg-emerald-900/50 px-2 py-0.5 rounded">
                    {detailsScheme.sourceType === 'ngo' ? 'NGO Initiative' : 'Govt of India / State'}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                  {detailsScheme.name}
                </h3>
                <p className="text-xs text-[#d8f3dc]">
                  {detailsScheme.governingBody}
                </p>
              </div>
              <button
                onClick={() => setDetailsScheme(null)}
                className="text-stone-300 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
              
              {/* Itemized Eligibility Breakdown for the Active User */}
              {(() => {
                const evalResult = evaluateEligibility(detailsScheme);
                return (
                  <div className={`p-4 rounded-2xl border ${
                    evalResult.isEligible 
                      ? 'bg-[#f0fbf5] border-[#b7e4c7]' 
                      : evalResult.isPartial 
                      ? 'bg-amber-50/70 border-amber-200' 
                      : 'bg-stone-50 border-stone-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-[#1b4332] flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-[#52b788]" />
                        <span>Your Eligibility Status Breakdown</span>
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        evalResult.isEligible ? 'bg-[#1b4332] text-white' : evalResult.isPartial ? 'bg-amber-200 text-amber-900' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {evalResult.isEligible ? '100% Eligible' : evalResult.isPartial ? 'Conditionally Eligible' : 'Ineligible'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] mt-3">
                      <div className="p-2 rounded-xl bg-white border border-stone-200">
                        <span className="text-stone-400 block text-[10px]">Age ({age}y):</span>
                        <span className={`font-bold ${age >= detailsScheme.minAge ? 'text-[#1b4332]' : 'text-rose-600'}`}>
                          {age >= detailsScheme.minAge ? '✓ Meets Min Age' : `✗ Min ${detailsScheme.minAge}y req`}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-stone-200">
                        <span className="text-stone-400 block text-[10px]">State ({selectedState}):</span>
                        <span className={`font-bold ${detailsScheme.applicableStates.includes('All India') || detailsScheme.applicableStates.includes(selectedState) ? 'text-[#1b4332]' : 'text-rose-600'}`}>
                          {detailsScheme.applicableStates.includes('All India') || detailsScheme.applicableStates.includes(selectedState) ? '✓ Applicable' : '✗ State Mismatch'}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-stone-200">
                        <span className="text-stone-400 block text-[10px]">Gender:</span>
                        <span className={`font-bold ${detailsScheme.gender === 'all' || detailsScheme.gender === gender ? 'text-[#1b4332]' : 'text-rose-600'}`}>
                          {detailsScheme.gender === 'all' || detailsScheme.gender === gender ? '✓ Qualified' : `✗ ${detailsScheme.gender} only`}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-stone-200">
                        <span className="text-stone-400 block text-[10px]">Income:</span>
                        <span className="font-bold text-[#1b4332]">
                          {detailsScheme.incomeCriteria === 'any' ? '✓ Universal' : 'BPL / Low Income'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Full Description */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-[#1b4332] text-xs uppercase tracking-wider">
                  Detailed Scheme Summary
                </h4>
                <p className="text-stone-700 leading-relaxed">
                  {detailsScheme.fullDescription}
                </p>
              </div>

              {/* Key Benefits */}
              <div className="p-4 rounded-2xl bg-[#f0fbf5] border border-[#d8f3dc] text-[#1b4332] space-y-1">
                <div className="font-bold text-xs uppercase tracking-wider text-[#40916c] flex items-center justify-between">
                  <span>Guaranteed Benefits:</span>
                  {detailsScheme.benefitValue && (
                    <span className="font-bold text-xs bg-white px-2 py-0.5 rounded border border-[#d8f3dc]">
                      {detailsScheme.benefitValue}
                    </span>
                  )}
                </div>
                <div className="leading-relaxed">
                  {detailsScheme.benefits}
                </div>
              </div>

              {/* Eligibility Criteria Checklist */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#1b4332] text-xs uppercase tracking-wider">
                  Official Eligibility Criteria
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl border border-[#d8f3dc] bg-[#f7fbf8]">
                    <span className="text-stone-500 block">Minimum Age:</span>
                    <span className="font-bold text-[#1b4332]">{detailsScheme.minAge} Years or older</span>
                  </div>
                  <div className="p-3 rounded-2xl border border-[#d8f3dc] bg-[#f7fbf8]">
                    <span className="text-stone-500 block">Gender Applicability:</span>
                    <span className="font-bold text-[#1b4332] capitalize">{detailsScheme.gender === 'all' ? 'All Genders (Male / Female / Transgender)' : detailsScheme.gender}</span>
                  </div>
                  <div className="p-3 rounded-2xl border border-[#d8f3dc] bg-[#f7fbf8]">
                    <span className="text-stone-500 block">Income Eligibility:</span>
                    <span className="font-bold text-[#1b4332] capitalize">{detailsScheme.incomeCriteria === 'any' ? 'No Income Cap (Universal)' : `BPL / Max ₹${detailsScheme.maxAnnualIncome?.toLocaleString('en-IN') || '1,20,000'}/year`}</span>
                  </div>
                  <div className="p-3 rounded-2xl border border-[#d8f3dc] bg-[#f7fbf8]">
                    <span className="text-stone-500 block">Applicable Geography:</span>
                    <span className="font-bold text-[#1b4332]">{detailsScheme.applicableStates.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Required Documents */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#1b4332] text-xs uppercase tracking-wider">
                    Required Documents Checklist
                  </h4>
                  <button
                    onClick={() => {
                      const text = `Required Documents for ${detailsScheme.name}:\n` + detailsScheme.requiredDocuments.map((d, i) => `${i + 1}. ${d}`).join('\n');
                      navigator.clipboard.writeText(text);
                      showToast('Document checklist copied to clipboard!', 'success');
                    }}
                    className="text-[11px] text-[#40916c] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Document List</span>
                  </button>
                </div>
                <ul className="space-y-1.5 text-xs text-stone-700">
                  {detailsScheme.requiredDocuments.map((doc, i) => (
                    <li key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#f7fbf8] border border-[#d8f3dc]">
                      <CheckCircle2 className="w-4 h-4 text-[#52b788] shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step by step application procedure */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#1b4332] text-xs uppercase tracking-wider">
                  Official Application Steps
                </h4>
                <ol className="space-y-2 text-xs text-stone-700">
                  {detailsScheme.applySteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 rounded-2xl border border-stone-200">
                      <span className="w-6 h-6 rounded-full bg-[#1b4332] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Helpline Information */}
              {detailsScheme.helplinePhone && (
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#52b788]" />
                    <div>
                      <span className="font-bold text-[#1b4332] block">Toll-Free Helpline:</span>
                      <span className="text-stone-500 font-mono">{detailsScheme.helplinePhone}</span>
                    </div>
                  </div>
                  <a
                    href={`tel:${detailsScheme.helplinePhone}`}
                    className="px-3 py-1 bg-white border border-stone-300 rounded-full font-bold text-[#1b4332] hover:bg-stone-100 cursor-pointer shadow-2xs"
                  >
                    Call Helpline
                  </a>
                </div>
              )}

            </div>

            <div className="px-6 py-4 bg-[#f7fbf8] border-t border-[#d8f3dc] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {detailsScheme.officialLink ? (
                  <a
                    href={detailsScheme.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#40916c] hover:underline"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-stone-500">Apply via nearest CSC / Tehsil</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const sch = detailsScheme;
                    setDetailsScheme(null);
                    handleOpenApply(sch);
                  }}
                  className="btn-glass-primary px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <span>Proceed to Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDetailsScheme(null)}
                  className="px-5 py-2.5 rounded-full border border-stone-200 hover:bg-stone-100 text-stone-700 font-semibold text-xs cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. INTERACTIVE "APPLY NOW" ASSISTANT WIZARD */}
      {applyScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md overflow-y-auto">
          <div 
            className="glass-panel-elevated rounded-3xl max-w-xl w-full border border-white/60 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="bg-[#1b4332] text-white px-6 py-5 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#74c69d] bg-white/10 px-2 py-0.5 rounded">
                  Application Assistant
                </span>
                <h3 className="text-lg font-bold tracking-tight mt-1">
                  Apply for {applyScheme.name}
                </h3>
                <p className="text-xs text-[#d8f3dc]">
                  Step {applyStep} of 3: {applyStep === 1 && 'Document Checklist'} {applyStep === 2 && 'Select Application Method'} {applyStep === 3 && 'Confirmation & Acknowledgement'}
                </p>
              </div>
              <button
                onClick={() => setApplyScheme(null)}
                className="text-stone-300 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Step Progress Bar */}
            <div className="grid grid-cols-3 bg-[#e8f5ec] h-1.5">
              <div className={`bg-[#52b788] ${applyStep >= 1 ? 'opacity-100' : 'opacity-0'}`} />
              <div className={`bg-[#52b788] ${applyStep >= 2 ? 'opacity-100' : 'opacity-0'}`} />
              <div className={`bg-[#52b788] ${applyStep >= 3 ? 'opacity-100' : 'opacity-0'}`} />
            </div>

            {/* STEP 1: Interactive Document Readiness Checklist */}
            {applyStep === 1 && (
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#1b4332]">
                      Verify Your Required Documents
                    </h4>
                    <p className="text-xs text-stone-500">
                      Check off the documents you have readily available at home.
                    </p>
                  </div>
                  <button
                    onClick={handleCheckAllDocs}
                    className="text-xs font-bold text-[#40916c] hover:underline cursor-pointer"
                  >
                    Mark All Ready
                  </button>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {applyScheme.requiredDocuments.map((doc, idx) => {
                    const isChecked = !!checkedDocs[doc];
                    return (
                      <div
                        key={idx}
                        onClick={() => handleToggleDoc(doc)}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          isChecked 
                            ? 'bg-[#f0fbf5] border-[#52b788] text-[#1b4332]' 
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            isChecked ? 'bg-[#52b788] border-[#52b788] text-white' : 'border-stone-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span className="text-xs font-semibold">{doc}</span>
                        </div>
                        <span className={`text-[11px] font-bold ${isChecked ? 'text-[#40916c]' : 'text-stone-400'}`}>
                          {isChecked ? 'Ready' : 'Pending'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Readiness summary */}
                <div className="p-3.5 rounded-2xl bg-[#f7fbf8] border border-[#d8f3dc] flex items-center justify-between text-xs">
                  <div className="text-stone-600">
                    Document Readiness:{' '}
                    <strong className="text-[#1b4332]">
                      {Object.values(checkedDocs).filter(Boolean).length} of {applyScheme.requiredDocuments.length} Verified
                    </strong>
                  </div>
                  <button
                    onClick={handleCopyChecklist}
                    className="text-[#40916c] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Checklist</span>
                  </button>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                  <button
                    onClick={() => setApplyScheme(null)}
                    className="px-4 py-2 rounded-full border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setApplyStep(2)}
                    className="px-6 py-2.5 rounded-full bg-[#1b4332] hover:bg-[#0f2e21] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Continue to Application Options</span>
                    <ArrowRight className="w-4 h-4 text-[#74c69d]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Choose Application Mode */}
            {applyStep === 2 && (
              <div className="p-6 space-y-5">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#1b4332]">
                    How would you like to submit your application?
                  </h4>
                  <p className="text-xs text-stone-500">
                    Select doorstep volunteer assistance from Sahaya, direct government portal, or printable application form.
                  </p>
                </div>

                <div className="space-y-3">
                  
                  {/* Option A: Doorstep Volunteer Assistance (Recommended for Seniors) */}
                  <div
                    onClick={() => setApplyMode('volunteer')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      applyMode === 'volunteer'
                        ? 'border-[#52b788] bg-[#f0fbf5] ring-2 ring-[#52b788]/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1b4332] text-white flex items-center justify-center shrink-0">
                        <UserCheck className="w-5 h-5 text-[#74c69d]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#1b4332]">
                            Request Doorstep Volunteer Help (Sahaya Free Care)
                          </span>
                          <span className="text-[10px] font-extrabold uppercase text-[#40916c] bg-white px-2 py-0.5 rounded-full border border-[#d8f3dc]">
                            Recommended
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                          A verified community volunteer will visit your home, help fill out paper forms, assist with Aadhaar biometric e-KYC on mobile, and submit the application for you.
                        </p>

                        {/* Interactive Volunteer Form if Selected */}
                        {applyMode === 'volunteer' && (
                          <div className="mt-4 pt-4 border-t border-[#d8f3dc] space-y-3" onClick={(e) => e.stopPropagation()}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div>
                                <label className="block text-[11px] font-bold text-stone-600 mb-1">Senior Name</label>
                                <input
                                  type="text"
                                  value={volunteerSeniorName}
                                  onChange={(e) => setVolunteerSeniorName(e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#52b788]"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-stone-600 mb-1">Phone Number</label>
                                <input
                                  type="text"
                                  value={volunteerSeniorPhone}
                                  onChange={(e) => setVolunteerSeniorPhone(e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#52b788]"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-stone-600 mb-1">Doorstep Address</label>
                              <input
                                type="text"
                                value={volunteerAddress}
                                onChange={(e) => setVolunteerAddress(e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#52b788] text-xs"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div>
                                <label className="block text-[11px] font-bold text-stone-600 mb-1">Preferred Time Slot</label>
                                <select
                                  value={preferredSlot}
                                  onChange={(e) => setPreferredSlot(e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#52b788]"
                                >
                                  <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                                  <option value="Afternoon (2:00 PM - 5:00 PM)">Afternoon (2:00 PM - 5:00 PM)</option>
                                  <option value="Weekend (Saturday/Sunday)">Weekend (Saturday/Sunday)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-stone-600 mb-1">Special Assistance Notes</label>
                                <input
                                  type="text"
                                  value={volunteerNotes}
                                  onChange={(e) => setVolunteerNotes(e.target.value)}
                                  placeholder="e.g. Bring physical application printout"
                                  className="w-full px-3 py-1.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#52b788]"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Option B: Direct Government Portal */}
                  <div
                    onClick={() => setApplyMode('portal')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      applyMode === 'portal'
                        ? 'border-[#52b788] bg-[#f0fbf5] ring-2 ring-[#52b788]/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                        <ExternalLink className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-sm text-[#1b4332]">
                          Self-Apply on Official Government Portal
                        </span>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                          Follow the digital application steps on {applyScheme.officialLink || 'the central ministry portal'}. Best if you or a caregiver have Aadhaar-linked OTP access on your smartphone.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Option C: Offline Application Guide */}
                  <div
                    onClick={() => setApplyMode('offline')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      applyMode === 'offline'
                        ? 'border-[#52b788] bg-[#f0fbf5] ring-2 ring-[#52b788]/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-sm text-[#1b4332]">
                          Offline Application Guide & Checklist
                        </span>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                          Get your official application reference and submission guide to take directly to your local Gram Panchayat, Tehsildar office, or CSC centre.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                  <button
                    onClick={() => setApplyStep(1)}
                    className="px-4 py-2 rounded-full border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
                  >
                    Back to Checklist
                  </button>

                  {applyMode === 'volunteer' && (
                    <button
                      onClick={handleConfirmVolunteerBooking}
                      className="px-6 py-2.5 rounded-full bg-[#1b4332] hover:bg-[#0f2e21] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <UserCheck className="w-4 h-4 text-[#74c69d]" />
                      <span>Confirm & Book Volunteer</span>
                    </button>
                  )}

                  {applyMode === 'portal' && (
                    <a
                      href={applyScheme.officialLink || '#'}
                      target={applyScheme.officialLink ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!applyScheme.officialLink) {
                          e.preventDefault();
                        }
                        const appRef = `PORTAL-${Math.floor(100000 + Math.random() * 900000)}`;
                        setGeneratedAppRef(appRef);
                        setApplyStep(3);
                      }}
                      className="px-6 py-2.5 rounded-full bg-[#52b788] hover:bg-[#40916c] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Proceed to Official Website</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  {applyMode === 'offline' && (
                    <button
                      onClick={() => {
                        const appRef = `OFFLINE-${Math.floor(100000 + Math.random() * 900000)}`;
                        setGeneratedAppRef(appRef);
                        setApplyStep(3);
                      }}
                      className="px-6 py-2.5 rounded-full bg-[#1b4332] hover:bg-[#0f2e21] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <FileText className="w-4 h-4 text-[#74c69d]" />
                      <span>Generate Offline Reference & Proceed</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: Confirmation & Acknowledgement */}
            {applyStep === 3 && (
              <div className="p-6 space-y-6 text-center">
                <div className="w-14 h-14 rounded-full bg-[#f0fbf5] text-[#52b788] border-2 border-[#d8f3dc] flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#40916c] bg-[#f0fbf5] px-3 py-0.5 rounded-full border border-[#d8f3dc]">
                    Application Assistance Initiated
                  </span>
                  <h4 className="text-xl font-extrabold text-[#1b4332]">
                    {applyMode === 'volunteer' 
                      ? 'Volunteer Dispatched for Doorstep Help!' 
                      : applyMode === 'portal' 
                      ? 'Official Government Portal Opened!' 
                      : 'Offline Application Guide Ready!'}
                  </h4>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    {applyMode === 'volunteer'
                      ? `A verified volunteer will contact you at ${volunteerSeniorPhone} to assist with ${applyScheme.name}.`
                      : `You have successfully accessed guidance for ${applyScheme.name}.`}
                  </p>
                </div>

                {/* Acknowledgement Card */}
                <div className="p-4 rounded-2xl bg-[#f7fbf8] border border-[#d8f3dc] text-left text-xs space-y-2 max-w-sm mx-auto">
                  <div className="flex items-center justify-between text-stone-500">
                    <span>Application Ref:</span>
                    <strong className="font-mono text-[#1b4332]">{generatedAppRef}</strong>
                  </div>
                  {createdAssistanceId && (
                    <div className="flex items-center justify-between text-stone-500">
                      <span>Sahaya Request ID:</span>
                      <strong className="font-mono text-[#40916c]">{createdAssistanceId}</strong>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-stone-500">
                    <span>Scheme Category:</span>
                    <strong className="capitalize">{applyScheme.category.replace('_', ' ')}</strong>
                  </div>
                  <div className="flex items-center justify-between text-stone-500">
                    <span>Scheduled Slot:</span>
                    <strong>{preferredSlot}</strong>
                  </div>
                  <div className="flex items-center justify-between text-stone-500">
                    <span>Typical Processing:</span>
                    <strong>15 - 30 working days</strong>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  {createdAssistanceId && (
                    <button
                      onClick={() => {
                        setSelectedTrackRequestId(createdAssistanceId);
                        setApplyScheme(null);
                        setActiveTab('track');
                      }}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#1b4332] hover:bg-[#0f2e21] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Track Volunteer Live
                    </button>
                  )}
                  <button
                    onClick={() => setApplyScheme(null)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 cursor-pointer"
                  >
                    Done / Back to Schemes
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
