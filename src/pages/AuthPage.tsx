import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { LiquidGlassCard, LiquidGlassBadge } from '../components/LiquidGlass';
import { 
  Building2, 
  UserCheck, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';

export const AuthPage: React.FC = () => {
  const { 
    authMode, 
    setAuthMode, 
    loginUser, 
    registerUser, 
    authInitialRole 
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>(authInitialRole || 'senior');
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Pune');
  const [age, setAge] = useState<number>(70);
  const [orgName, setOrgName] = useState('');
  const [ngoRegNo, setNgoRegNo] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!email.trim()) newErrors.email = 'Email address is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (authMode === 'register') {
      if (!name.trim()) newErrors.name = 'Full name is required';
      if (!phone.trim()) newErrors.phone = 'Mobile number is required';
      if (selectedRole === 'ngo') {
        if (!orgName.trim()) newErrors.orgName = 'Organization name is required';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    if (authMode === 'login') {
      loginUser(email, selectedRole, password);
    } else {
      registerUser({
        name,
        email,
        phone,
        role: selectedRole,
        address,
        city,
        state: 'Maharashtra',
        age: selectedRole === 'senior' ? age : undefined,
        organizationName: selectedRole === 'ngo' ? orgName : undefined,
        ngoRegistrationNo: selectedRole === 'ngo' ? ngoRegNo : undefined,
      }, password);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-14">
      <LiquidGlassCard variant="emerald" className="shadow-2xl overflow-hidden p-6 sm:p-10 space-y-6 border border-[#d8f3dc]">
        
        {/* Header with Logo */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <div className="p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-[#d8f3dc] shadow-xs">
            <BrandLogo size="lg" showSubtitle={true} />
          </div>
          <div className="pt-2">
            <LiquidGlassBadge variant="emerald" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2d6a4f]" />
              <span>Verified Role Gateway</span>
            </LiquidGlassBadge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1b4332] tracking-tight mt-1">
            {authMode === 'login' ? 'Sign In to Sahaya' : 'Create Your Account'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
            {authMode === 'login' 
              ? 'Select your role below to access your personalized assistance portal'
              : 'Join our welfare network as a Senior, registered NGO, or community Volunteer'}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
            Select Your Account Role
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedRole('senior')}
              className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                selectedRole === 'senior'
                  ? 'border-[#52b788] bg-white text-[#1b4332] font-black shadow-md ring-2 ring-[#52b788]/30 scale-102'
                  : 'border-stone-200/80 bg-white/60 hover:bg-white text-stone-600'
              }`}
            >
              <User className={`w-5 h-5 mx-auto mb-1 ${selectedRole === 'senior' ? 'text-[#1b4332]' : 'text-stone-400'}`} />
              <div className="text-xs font-bold">Senior Citizen</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('ngo')}
              className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                selectedRole === 'ngo'
                  ? 'border-[#52b788] bg-white text-[#1b4332] font-black shadow-md ring-2 ring-[#52b788]/30 scale-102'
                  : 'border-stone-200/80 bg-white/60 hover:bg-white text-stone-600'
              }`}
            >
              <Building2 className={`w-5 h-5 mx-auto mb-1 ${selectedRole === 'ngo' ? 'text-[#1b4332]' : 'text-stone-400'}`} />
              <div className="text-xs font-bold">NGO Lead</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('volunteer')}
              className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                selectedRole === 'volunteer'
                  ? 'border-[#52b788] bg-white text-[#1b4332] font-black shadow-md ring-2 ring-[#52b788]/30 scale-102'
                  : 'border-stone-200/80 bg-white/60 hover:bg-white text-stone-600'
              }`}
            >
              <UserCheck className={`w-5 h-5 mx-auto mb-1 ${selectedRole === 'volunteer' ? 'text-[#1b4332]' : 'text-stone-400'}`} />
              <div className="text-xs font-bold">Volunteer</div>
            </button>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          
          {authMode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Sharma"
                    className="input-glass w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm"
                  />
                </div>
                {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Mobile Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="input-glass w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm"
                  />
                </div>
                {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
              </div>

              {selectedRole === 'senior' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    min="55"
                    max="105"
                    className="input-glass w-full px-4 py-2.5 text-xs sm:text-sm"
                  />
                </div>
              )}

              {selectedRole === 'ngo' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Registered NGO Name *
                    </label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. CareIndia Elder Welfare Foundation"
                      className="input-glass w-full px-4 py-2.5 text-xs sm:text-sm"
                    />
                    {errors.orgName && <p className="text-xs text-rose-600 mt-1">{errors.orgName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      NGO Darpan / Society Registration Number
                    </label>
                    <input
                      type="text"
                      value={ngoRegNo}
                      onChange={(e) => setNgoRegNo(e.target.value)}
                      placeholder="e.g. NGO/DL/2018/009412"
                      className="input-glass w-full px-4 py-2.5 text-xs sm:text-sm"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  City & Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street / Society address"
                  className="input-glass w-full px-4 py-2.5 text-xs sm:text-sm mb-2"
                />
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="input-glass w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm"
              />
            </div>
            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
          </div>

          {/* Password with visibility toggle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="input-glass w-full pl-10 pr-11 py-2.5 text-xs sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="btn-glass-primary w-full py-3.5 rounded-full flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-md text-sm"
          >
            <span>{authMode === 'login' ? 'Sign In to Portal' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4 text-[#74c69d]" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-200/60">
          {authMode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('register', selectedRole)}
                className="font-bold text-[#40916c] hover:underline cursor-pointer"
              >
                Register Here
              </button>
            </p>
          ) : (
            <p>
              Already registered on Sahaya?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login', selectedRole)}
                className="font-bold text-[#40916c] hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

      </LiquidGlassCard>

    </div>
  );
};
