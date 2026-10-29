import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IMAGES } from '../assets/images';
import { LiquidGlassCard, LiquidGlassBadge } from '../components/LiquidGlass';
import { 
  Stethoscope, 
  Activity, 
  ShoppingBag, 
  FileText, 
  ShieldAlert, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  HeartHandshake, 
  Car, 
  ChevronRight, 
  ChevronDown,
  PhoneCall, 
  Sparkles,
  Building2,
  Heart,
  ShieldCheck,
  Check,
  Clock,
  Layers
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab, switchRole } = useApp();
  const [activeAccordion, setActiveAccordion] = useState<number>(0);

  const accordionItems = [
    {
      title: 'Our History & Community Foundation',
      content: 'Sahaya was founded with a singular conviction: no senior citizen should feel isolated or helpless when facing medical visits, heavy household tasks, or government documentation. We built a decentralized bridge uniting accredited local charities, trained volunteers, and elders living independently.'
    },
    {
      title: 'Our Philosophy: Dignity First',
      content: 'We believe elderly assistance is an honor, not a transaction. Every interaction is designed with deep cultural respect, patient listening, zero commercial fees, and absolute safety verification for complete peace of mind.'
    },
    {
      title: 'Our Mission & Volunteer Verification',
      content: 'Every volunteer in our network undergoes rigorous background checks and orientation. When an elder requests support, our coordinators match them with the nearest available companion who speaks their preferred language.'
    },
    {
      title: 'Emergency Medical & OPD Escorts',
      content: 'From hospital queue assistance, wheelchair navigation, and doctor consultation note-taking to urgent oxygen cylinder refills, our emergency protocol ensures rapid dispatch within minutes.'
    }
  ];

  const services = [
    {
      title: 'Latest Medical Care & Escort',
      desc: 'Doctor appointments, hospital OPD companions, pharmacy pickups, and compassionate clinical checkup guidance.',
      icon: Stethoscope,
      accent: 'emerald' as const
    },
    {
      title: 'Senior Transport & Mobility',
      desc: 'Safe, assisted two-way rides for bank visits, diagnostic centers, physiotherapy sessions, or visiting family.',
      icon: Car,
      accent: 'default' as const
    },
    {
      title: 'Living & Grocery Support',
      desc: 'Heavy drinking water cans, weekly rations, fresh vegetables, and essential household provisions delivered upstairs.',
      icon: ShoppingBag,
      accent: 'amber' as const
    },
    {
      title: 'Caring Staff & Volunteers',
      desc: 'Police and NGO verified companions ready for digital life certificate submission and daily friendly check-ins.',
      icon: Users,
      accent: 'default' as const
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* HERO SECTION: Liquid Glass Hero with Refraction Highlights & Floating Glass Badges */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#ebfbee] via-[#f0fbf5] to-transparent pt-10 sm:pt-16 pb-20 sm:pb-32">
        {/* Soft Ambient Refraction Glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#74c69d]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#d8f3dc]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              {/* Liquid Glass Kicker Badge */}
              <div className="inline-block">
                <LiquidGlassBadge variant="emerald" icon={<Sparkles className="w-3.5 h-3.5 text-[#40916c]" />}>
                  Premium Senior Care & Community Welfare
                </LiquidGlassBadge>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-[#1b4332] tracking-tight leading-[1.16]">
                We Take Pride In Fine Senior Care & Support
              </h1>

              {/* Description */}
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl">
                Sahaya connects elderly citizens living independently with accredited NGOs and verified community volunteers for medical escorts, grocery supplies, digital pension documentation, and immediate emergency response.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setActiveTab('create-request')}
                  className="px-7 py-3.5 rounded-full btn-glass-primary text-white font-bold text-sm shadow-[0_4px_20px_rgba(45,106,79,0.3)] transition-all active:scale-98 cursor-pointer flex items-center gap-2"
                >
                  <span>Our Care Services</span>
                  <ArrowRight className="w-4 h-4 text-[#74c69d]" />
                </button>

                <button
                  onClick={() => setActiveTab('schemes')}
                  className="px-6 py-3.5 rounded-full btn-glass-secondary font-bold text-sm flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Search className="w-4 h-4 text-[#40916c]" />
                  <span>Explore Schemes</span>
                </button>
              </div>

              {/* Trust Badges Strip */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-stone-600 font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#52b788]" />
                  <span>100% Free Welfare Dispatches</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#52b788]" />
                  <span>Verified NGO Volunteers</span>
                </div>
              </div>

            </div>

            {/* Right Photo Column: Rounded Frame with Liquid Glass Floating Cards */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                
                {/* Decorative Mint Halo */}
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#52b788]/20 to-[#74c69d]/30 blur-2xl transform -rotate-1 opacity-80" />

                {/* Main Hero Photo */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 bg-white">
                  <img
                    src={IMAGES.hero}
                    alt="Senior citizen receiving gentle healthcare assistance from nurse"
                    className="w-full h-80 sm:h-96 object-cover object-center transform hover:scale-102 transition-transform duration-700"
                  />
                  
                  {/* Floating Liquid Glass Badge Top Right */}
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_24px_rgba(27,67,50,0.12)] p-2.5 px-3.5 rounded-2xl flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#52b788] animate-pulse" />
                    <span className="text-xs font-bold text-[#1b4332]">24/7 Live Dispatches</span>
                  </div>

                  {/* Floating Liquid Glass Trust Card Bottom */}
                  <LiquidGlassCard 
                    variant="emerald"
                    className="absolute bottom-4 left-4 right-4 sm:right-6 p-4 shadow-xl"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-[#1b4332] text-[#74c69d] flex items-center justify-center shrink-0 shadow-xs">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-[#1b4332] tracking-tight">
                          Accredited Elder Care Network
                        </div>
                        <div className="text-[11px] text-stone-600 mt-0.5 font-medium">
                          Trained community companions verified via local NGOs
                        </div>
                      </div>
                    </div>
                  </LiquidGlassCard>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Elegant Bottom Curve SVG Divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-8 sm:h-12 text-[#f6faf7] fill-current"
          >
            <path d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* EMERGENCY SOS BANNER: Liquid Glass Elevated Alert */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LiquidGlassCard
          variant="emerald"
          className="p-6 sm:p-8 border-[#52b788]/40 shadow-[0_12px_40px_rgba(45,106,79,0.12)]"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-13 h-13 rounded-2xl bg-[#1b4332] text-white flex items-center justify-center shrink-0 shadow-md">
                <ShieldAlert className="w-7 h-7 text-[#74c69d]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    24/7 Rapid Response
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#1b4332]">
                  Facing an Urgent Medical or Physical Emergency?
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
                  Call National Elderline at <a href="tel:14567" className="font-bold text-[#2d6a4f] underline hover:text-[#1b4332]">14567</a> or Ambulance at <a href="tel:108" className="font-bold text-[#2d6a4f] underline hover:text-[#1b4332]">108</a>. Trigger an emergency alert on Sahaya for immediate community volunteer dispatch.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('create-request')}
              className="w-full md:w-auto px-7 py-3.5 rounded-full btn-glass-primary text-white text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Trigger Emergency Alert</span>
              <ArrowRight className="w-4 h-4 text-[#74c69d]" />
            </button>
          </div>
        </LiquidGlassCard>
      </section>

      {/* SECTION: "Our Services" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <LiquidGlassBadge variant="emerald" icon={<Heart className="w-3.5 h-3.5 text-[#40916c]" />}>
            Specialized Care Pillars
          </LiquidGlassBadge>
          <h2 className="text-2xl sm:text-4xl font-black text-[#1b4332] tracking-tight">
            Our Care Services
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-lg mx-auto">
            Comprehensive, compassionate assistance designed to help elderly citizens live independently and safely in their own homes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Photo with Liquid Glass Halo */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white">
                <img
                  src={IMAGES.wheelchair}
                  alt="Young female caregiver assisting elderly man in wheelchair"
                  className="w-full h-80 sm:h-96 object-cover object-center transform hover:scale-102 transition-transform duration-700"
                />
              </div>

              {/* Decorative Mint Dotted Grid Accent */}
              <div className="absolute -bottom-4 -left-4 w-20 h-20 pointer-events-none opacity-60 z-0">
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-[#52b788]" />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: 2x2 Service Feature Cards with Liquid Glass Refraction */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {services.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <LiquidGlassCard 
                    key={idx}
                    variant={item.accent}
                    className="p-5 sm:p-6 hover:scale-[1.02] cursor-pointer group"
                    onClick={() => setActiveTab('create-request')}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#52b788]/30 flex items-center justify-center text-[#2d6a4f] mb-4 group-hover:bg-[#1b4332] group-hover:text-white transition-all shadow-xs">
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    </div>

                    <h3 className="text-base font-bold text-[#1b4332] mb-1.5 group-hover:text-[#2d6a4f] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {item.desc}
                    </p>

                    <div className="mt-4 text-xs font-bold text-[#40916c] group-hover:text-[#1b4332] inline-flex items-center gap-1.5">
                      <span>Request this assistance</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </LiquidGlassCard>
                );
              })}
            </div>
          </div>

        </div>

      </section>

      {/* SECTION: "How We Care" with Accordion */}
      <section className="bg-gradient-to-b from-[#f0fbf5]/60 to-white border-y border-[#d8f3dc] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Photo */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white">
                <img
                  src={IMAGES.sofa}
                  alt="Young volunteer talking with elderly grandmother on comfortable sofa"
                  className="w-full h-80 sm:h-96 object-cover object-center transform hover:scale-102 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Right Column: Accordion */}
            <div className="lg:col-span-6 space-y-6">
              
              <div>
                <LiquidGlassBadge variant="emerald">
                  Our Approach & Values
                </LiquidGlassBadge>
                <h2 className="text-2xl sm:text-4xl font-black text-[#1b4332] tracking-tight mt-2">
                  How We Care
                </h2>
              </div>

              {/* Accordion List with Liquid Glass Cards */}
              <div className="space-y-3">
                {accordionItems.map((item, idx) => {
                  const isOpen = activeAccordion === idx;
                  return (
                    <LiquidGlassCard
                      key={idx}
                      variant="default"
                      className="overflow-hidden transition-all shadow-xs"
                    >
                      <button
                        onClick={() => setActiveAccordion(isOpen ? -1 : idx)}
                        className="w-full px-5 py-4 text-left font-bold text-sm text-[#1b4332] flex items-center justify-between gap-4 cursor-pointer hover:bg-white/50 transition-colors"
                      >
                        <span>{item.title}</span>
                        <span className={`text-[#40916c] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-5 h-5" />
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-[#d8f3dc]/60">
                          {item.content}
                        </div>
                      )}
                    </LiquidGlassCard>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('schemes')}
                  className="px-6 py-3 rounded-full btn-glass-primary text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <span>Explore Supported Schemes</span>
                  <ArrowRight className="w-4 h-4 text-[#74c69d]" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* FEATURE BANNER: Community Network */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LiquidGlassCard
          variant="emerald"
          className="p-6 sm:p-10 shadow-[0_16px_40px_rgba(45,106,79,0.12)] border-[#52b788]/30"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Graphic */}
            <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-xl bg-white">
              <img
                src={IMAGES.vector}
                alt="Vector illustration of nurse standing beside senior in wheelchair"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Message */}
            <div className="space-y-3 text-center md:text-left flex-1">
              <LiquidGlassBadge variant="emerald">
                Community Network
              </LiquidGlassBadge>
              <h3 className="text-2xl sm:text-3xl font-black text-[#1b4332] tracking-tight">
                A Warm, Helping Hand Right Around Your Corner
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
                Whether you are an elderly person living alone, a working child wanting verified support for your parents, or an energetic youth wanting to volunteer, Sahaya brings everyone together.
              </p>
              
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  onClick={() => {
                    switchRole('senior');
                    setActiveTab('dashboard');
                  }}
                  className="px-5 py-2.5 rounded-full btn-glass-primary text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  Senior Portal
                </button>
                <button
                  onClick={() => {
                    switchRole('ngo');
                    setActiveTab('dashboard');
                  }}
                  className="px-5 py-2.5 rounded-full btn-glass-secondary text-[#1b4332] text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  NGO Desk
                </button>
                <button
                  onClick={() => {
                    switchRole('volunteer');
                    setActiveTab('dashboard');
                  }}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#40916c] to-[#2d6a4f] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  Volunteer Portal
                </button>
              </div>
            </div>
          </div>
        </LiquidGlassCard>
      </section>

      {/* SCHEMES SPOTLIGHT: Dark Liquid Glass */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LiquidGlassCard
          variant="dark"
          className="p-8 sm:p-12 shadow-[0_20px_50px_rgba(11,43,30,0.45)] relative overflow-hidden"
        >
          <div className="max-w-2xl relative z-10 space-y-4">
            <LiquidGlassBadge variant="emerald" className="bg-white/10 text-[#74c69d] border-white/20">
              Government Welfare Directory
            </LiquidGlassBadge>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Are you missing out on pensions or free healthcare benefits?
            </h3>
            <p className="text-sm sm:text-base text-[#d8f3dc] leading-relaxed">
              Find out in 60 seconds with our interactive eligibility calculator. Covers Ayushman Bharat 70+ Universal Cover (₹5L Free Hospitalization), Indira Gandhi Old Age Pension, Rashtriya Vayoshri Yojana (free walking aids and spectacles), and state welfare programs.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('schemes')}
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#52b788] to-[#40916c] hover:from-[#74c69d] hover:to-[#52b788] text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4 text-white" />
                <span>Check My Scheme Eligibility</span>
              </button>
            </div>
          </div>
        </LiquidGlassCard>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <LiquidGlassBadge variant="emerald">
            Real Stories & Trust
          </LiquidGlassBadge>
          <h3 className="text-2xl font-black text-[#1b4332] tracking-tight">
            Voices of Trust & Gratitude
          </h3>
          <p className="text-xs sm:text-sm text-stone-500">
            Feedback received from senior citizens supported across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LiquidGlassCard variant="default" className="p-6">
            <div className="text-[#52b788] font-bold text-base mb-2">★★★★★</div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic mb-4">
              "When my building lift stopped working, I was anxious about carrying heavy 20-litre water cans and wheat flour. Volunteer Rahul arrived with a warm smile and helped carry everything upstairs."
            </p>
            <div className="border-t border-[#d8f3dc]/60 pt-3">
              <div className="font-bold text-[#1b4332] text-xs">Ramesh Sharma, 72</div>
              <div className="text-[11px] text-stone-500">Pune, Maharashtra · Grocery Support</div>
            </div>
          </LiquidGlassCard>

          <LiquidGlassCard variant="default" className="p-6">
            <div className="text-[#52b788] font-bold text-base mb-2">★★★★★</div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic mb-4">
              "Submitting my annual Jeevan Pramaan digital life certificate was impossible alone on a smartphone. Ananya from CareIndia sat with me, did the facial biometric check, and completed it in 10 minutes."
            </p>
            <div className="border-t border-[#d8f3dc]/60 pt-3">
              <div className="font-bold text-[#1b4332] text-xs">Bhagwanti Devi, 68</div>
              <div className="text-[11px] text-stone-500">Rohini, Delhi · Pension Documentation</div>
            </div>
          </LiquidGlassCard>

          <LiquidGlassCard variant="default" className="p-6">
            <div className="text-[#52b788] font-bold text-base mb-2">★★★★★</div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic mb-4">
              "As an NGO coordinator, Sahaya gives us real-time visibility into senior emergencies. We can verify genuine cases instantly and deploy our nearby youth volunteers without delays."
            </p>
            <div className="border-t border-[#d8f3dc]/60 pt-3">
              <div className="font-bold text-[#1b4332] text-xs">Priya Nair, Lead Coordinator</div>
              <div className="text-[11px] text-stone-500">CareIndia Elder Welfare Foundation</div>
            </div>
          </LiquidGlassCard>
        </div>
      </section>

    </div>
  );
};
