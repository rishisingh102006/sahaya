import { AssistanceRequest, Scheme, NotificationItem, UserProfile, VolunteerMember } from '../types';

export const INITIAL_USERS: Record<string, UserProfile> = {
  senior: {
    id: 'guest-senior',
    name: 'Senior Citizen',
    role: 'senior',
    email: '',
    phone: '',
    address: '',
    city: 'Pune',
    state: 'Maharashtra',
  },
  ngo: {
    id: 'guest-ngo',
    name: 'NGO Officer',
    role: 'ngo',
    email: '',
    phone: '',
    address: '',
    organizationName: 'Elder Welfare Organization',
    city: 'Pune',
    state: 'Maharashtra',
  },
  volunteer: {
    id: 'guest-volunteer',
    name: 'Community Volunteer',
    role: 'volunteer',
    email: '',
    phone: '',
    address: '',
    city: 'Pune',
    state: 'Maharashtra',
    skills: ['First Aid', 'OPD Escort', 'Emergency Response'],
    rating: 5.0,
    completedTasksCount: 0,
  },
};

export const MOCK_VOLUNTEERS: VolunteerMember[] = [];

export const INITIAL_REQUESTS: AssistanceRequest[] = [];


export const MOCK_SCHEMES: Scheme[] = [
  {
    id: 'sch-001',
    name: 'Ayushman Bharat PM-JAY Senior Citizen Universal Health Scheme',
    shortDescription: 'Free cashless health insurance coverage of ₹5 Lakh per year for all senior citizens aged 70 and above, regardless of income.',
    fullDescription: 'Under this historic expansion of Pradhan Mantri Jan Arogya Yojana, every Indian citizen aged 70 or above receives a distinct Ayushman Vaya Vandana card with ₹5 Lakh dedicated annual hospitalization cover across 29,000+ empaneled hospitals.',
    governingBody: 'National Health Authority, Ministry of Health & Family Welfare, Govt. of India',
    sourceType: 'government',
    benefitValue: '₹5 Lakh Cashless/Yr',
    helplinePhone: '14555',
    category: 'healthcare',
    minAge: 70,
    gender: 'all',
    incomeCriteria: 'any',
    applicableStates: ['All India'],
    requiredDocuments: [
      'Aadhaar Card (with verified Date of Birth)',
      'Active Mobile number linked to Aadhaar',
      'Passport size photograph'
    ],
    benefits: '₹5,00,000 cashless inpatient treatment covering secondary and tertiary treatments, surgeries, ICU, and medications.',
    officialLink: 'https://beneficiary.nha.gov.in',
    applySteps: [
      'Download Ayushman App or visit beneficiary.nha.gov.in',
      'Select "Beneficiary" login and enter Aadhaar-linked mobile number',
      'Complete Aadhaar e-KYC with biometric or facial authentication',
      'Download instant Ayushman Vaya Vandana Card with QR code'
    ]
  },
  {
    id: 'sch-002',
    name: 'Rashtriya Vayoshri Yojana (RVY) - Assisted Living Devices',
    shortDescription: 'Free distribution of physical aids and assisted living devices (hearing aids, wheelchairs, walkers, spectacles) for seniors.',
    fullDescription: 'Provides physical aids and assisted-living devices for senior citizens belonging to BPL category or suffering from age-related disabilities such as low vision, hearing impairment, teeth loss, and locomotor disability.',
    governingBody: 'Ministry of Social Justice and Empowerment & ALIMCO',
    sourceType: 'government',
    benefitValue: '100% Free Assistive Aids',
    helplinePhone: '1800-180-5129',
    category: 'assistive_devices',
    minAge: 60,
    gender: 'all',
    incomeCriteria: 'bpl',
    maxAnnualIncome: 180000,
    applicableStates: ['All India'],
    requiredDocuments: [
      'Aadhaar Card / Age Proof',
      'BPL Ration Card or Income Certificate (< ₹15,000/month)',
      'Medical assessment certificate from Govt Doctor confirming disability/infirmity'
    ],
    benefits: '100% free customized physical devices: Walking sticks, elbow crutches, quadpods, tripod walking sticks, wheelchairs, artificial dentures, spectacles, and hearing aids.',
    officialLink: 'https://socialjustice.gov.in',
    applySteps: [
      'Apply online via ALIMCO portal or attend district assessment camp',
      'Submit medical certificate verifying age-related infirmity',
      'Device fitting and free handover by district rehabilitation officer'
    ]
  },
  {
    id: 'sch-003',
    name: 'Indira Gandhi National Old Age Pension Scheme (IGNOAPS)',
    shortDescription: 'Monthly financial assistance pension paid directly to elderly citizens living below the poverty line.',
    fullDescription: 'Part of the National Social Assistance Programme (NSAP), this scheme provides non-contributory direct cash pensions to indigent senior citizens to ensure dignified sustenance in old age.',
    governingBody: 'Ministry of Rural Development, Govt. of India',
    sourceType: 'government',
    benefitValue: '₹1,000 - ₹3,000/Month',
    helplinePhone: '14567',
    category: 'pension',
    minAge: 60,
    gender: 'all',
    incomeCriteria: 'bpl',
    maxAnnualIncome: 120000,
    applicableStates: ['All India'],
    requiredDocuments: [
      'Aadhaar Card',
      'BPL Card / Antyodaya Anna Yojana Card',
      'Bank Account passbook linked to Aadhaar',
      'Age proof certificate from municipal authority or voter ID'
    ],
    benefits: 'Monthly direct benefit transfer (DBT) ranging from ₹1,000 to ₹3,000/month (central + state top-up depending on state).',
    officialLink: 'https://nsap.nic.in',
    applySteps: [
      'Fill Form 1 at local Gram Panchayat, Block Development Office (BDO), or Municipality',
      'Attach Aadhaar, BPL verification, and bank details',
      'Verification by Social Welfare Inspector within 30 days',
      'Direct monthly credit to beneficiary savings bank account'
    ]
  },
  {
    id: 'sch-004',
    name: 'Indira Gandhi National Widow Pension Scheme (IGNWPS)',
    shortDescription: 'Dedicated monthly pension support for widowed women aged 40 and above living below poverty line.',
    fullDescription: 'Provides monthly monetary assistance to vulnerable widows to help them meet food, healthcare, and shelter needs without dependency.',
    governingBody: 'Ministry of Rural Development, Govt. of India',
    sourceType: 'government',
    benefitValue: '₹1,000 - ₹2,500/Month',
    helplinePhone: '14567',
    category: 'widow_support',
    minAge: 40,
    gender: 'female',
    widowOnly: true,
    incomeCriteria: 'bpl',
    maxAnnualIncome: 120000,
    applicableStates: ['All India'],
    requiredDocuments: [
      'Husband Death Certificate',
      'Aadhaar Card',
      'BPL Ration Card or Tehsildar Income Certificate',
      'Bank Account Passbook'
    ],
    benefits: 'Direct cash pension of ₹1,000 to ₹2,500/month credited directly via PFMS/DBT.',
    officialLink: 'https://nsap.nic.in',
    applySteps: [
      'Submit application at nearest e-Seva / Citizen Service Centre (CSC)',
      'Upload husband death certificate and income declaration',
      'Receive acknowledgement slip and track status online'
    ]
  },
  {
    id: 'sch-005',
    name: 'Pradhan Mantri Vaya Vandana Yojana (PMVVY)',
    shortDescription: 'Guaranteed pension scheme operated via Life Insurance Corporation of India (LIC) with assured returns.',
    fullDescription: 'A government-subsidized social security pension scheme providing assured return of 7.4% per annum payable monthly for 10 years, safeguarding senior citizens against future fall in interest income.',
    governingBody: 'Ministry of Finance & Life Insurance Corporation (LIC)',
    sourceType: 'government',
    benefitValue: 'Up to ₹9,250/Month Guaranteed',
    helplinePhone: '1800-227-717',
    category: 'financial',
    minAge: 60,
    gender: 'all',
    incomeCriteria: 'any',
    applicableStates: ['All India'],
    requiredDocuments: [
      'PAN Card',
      'Aadhaar Card / Proof of Age',
      'Cancelled cheque or bank passbook copy'
    ],
    benefits: 'Guaranteed pension from ₹1,000 up to ₹9,250 per month for a term of 10 years, with full return of purchase price upon maturity or demise.',
    officialLink: 'https://licindia.in',
    applySteps: [
      'Visit nearest LIC branch or authorized portal',
      'Select preferred payout frequency (monthly, quarterly, or yearly)',
      'Deposit lump sum purchase price and receive policy bond'
    ]
  },
  {
    id: 'sch-006',
    name: 'Annapurna Scheme - Food Security for Indigent Elderly',
    shortDescription: 'Provides 10 kg of food grains (wheat/rice) completely free of cost every month to destitute senior citizens.',
    fullDescription: 'Aimed at senior citizens aged 65 and above who are eligible for national pension but are currently not receiving any pension due to quota saturation or administrative delays.',
    governingBody: 'Department of Food and Public Distribution, Govt. of India',
    sourceType: 'government',
    benefitValue: '10 kg Free Rations/Month',
    helplinePhone: '1967',
    category: 'food_security',
    minAge: 65,
    gender: 'all',
    incomeCriteria: 'bpl',
    maxAnnualIncome: 60000,
    applicableStates: ['All India'],
    requiredDocuments: [
      'Age proof / Aadhaar Card',
      'Certificate from Village Sarpanch or Ward Councilor stating destitute status',
      'Special Annapurna ration card allotment letter'
    ],
    benefits: '10 kg of food grains per month totally free of cost at local Fair Price Shop (Ration Store).',
    officialLink: 'https://dfpd.gov.in',
    applySteps: [
      'Submit application to the local Food & Civil Supplies Inspector',
      'Verification of destitute/non-pensioner status',
      'Issuance of Annapurna Card for monthly grain collection'
    ]
  },
  {
    id: 'sch-007',
    name: 'HelpAge India - Mobile Healthcare & Cataract Assistance Program',
    shortDescription: 'Non-governmental outreach providing free doorstep medical consultations, chronic disease medicines, and cataract surgeries.',
    fullDescription: 'HelpAge India operates 180+ Mobile Healthcare Units (MHUs) visiting urban slums and rural hamlets, delivering free clinical examinations, 15-day supply of basic medicines, and free cataract surgeries at partner eye hospitals.',
    governingBody: 'HelpAge India (Registered NGO / Non-Profit)',
    sourceType: 'ngo',
    benefitValue: 'Free Doctor Care & Surgery',
    helplinePhone: '1800-180-1253',
    category: 'healthcare',
    minAge: 60,
    gender: 'all',
    incomeCriteria: 'low',
    maxAnnualIncome: 250000,
    applicableStates: ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Rajasthan'],
    requiredDocuments: [
      'Any Photo ID (Aadhaar / Voter ID)',
      'Previous medical prescriptions (if available)'
    ],
    benefits: 'Free medical consultations, hypertension & diabetes screenings, free maintenance medicines, and 100% free cataract surgery with intraocular lens.',
    officialLink: 'https://www.helpageindia.org',
    applySteps: [
      'Call HelpAge National Elder Helpline: 1800-180-1253',
      'Sahaya coordinator registers your area for nearest MHU visit',
      'Free diagnosis and medicine kit handover at doorstep'
    ]
  },
  {
    id: 'sch-008',
    name: 'Sanjay Gandhi Niradhar Anudan Yojana (Maharashtra)',
    shortDescription: 'Monthly financial assistance for destitute seniors, disabled, and widows residing in Maharashtra.',
    fullDescription: 'Special state welfare scheme by the Government of Maharashtra providing monetary support to elderly persons who have no family income or support.',
    governingBody: 'Social Justice and Special Assistance Department, Govt. of Maharashtra',
    sourceType: 'government',
    benefitValue: '₹1,500 - ₹2,000/Month',
    helplinePhone: '1800-120-8040',
    category: 'pension',
    minAge: 65,
    gender: 'all',
    incomeCriteria: 'bpl',
    maxAnnualIncome: 50000,
    applicableStates: ['Maharashtra'],
    requiredDocuments: [
      'Maharashtra Domicile Certificate (min 15 years residence)',
      'Aadhaar Card',
      'Income Certificate issued by Tehsildar (< ₹50,000/yr)',
      'Age Proof (School Leaving Certificate or Civil Surgeon Age Certificate)'
    ],
    benefits: '₹1,500 per month for single beneficiary, ₹2,000 per month if both husband and wife are eligible.',
    officialLink: 'https://sjsa.maharashtra.gov.in',
    applySteps: [
      'Obtain application form from local Tehsildar office or Aaple Sarkar portal',
      'Attach domicile, age, and income documents',
      'Committee sanction led by Tehsildar approves application'
    ]
  },
  {
    id: 'sch-009',
    name: 'Sandhya Suraksha Scheme (Karnataka)',
    shortDescription: 'Social security pension of ₹1,200/month along with discounted KSRTC bus travel for seniors in Karnataka.',
    fullDescription: 'Comprehensive social security scheme initiated by Karnataka State Government for elderly citizens from unorganized sectors, weavers, agricultural laborers, and daily wage earners.',
    governingBody: 'Revenue Department, Government of Karnataka',
    sourceType: 'government',
    benefitValue: '₹1,200/Mo + 25% Bus Pass',
    helplinePhone: '080-22340555',
    category: 'pension',
    minAge: 65,
    gender: 'all',
    incomeCriteria: 'low',
    maxAnnualIncome: 50000,
    applicableStates: ['Karnataka'],
    requiredDocuments: [
      'Karnataka Domicile proof (minimum 3 years)',
      'Aadhaar Card',
      'Income Certificate from Village Accountant / Revenue Inspector',
      'Bank passbook copy with IFSC code'
    ],
    benefits: '₹1,200 monthly pension and identity card providing 25% discount on state transport bus fares.',
    officialLink: 'https://sevasindhu.karnataka.gov.in',
    applySteps: [
      'Apply through Seva Sindhu or Nadakacheri portal',
      'Biometric verification at nearest Karnataka One centre',
      'Approval within 21 working days'
    ]
  },
  {
    id: 'sch-010',
    name: 'Senior Citizen Savings Scheme (SCSS) - Sovereign 8.2%',
    shortDescription: 'Government-backed savings deposit with high quarterly interest rate (8.2% p.a.) and Section 80C tax deduction.',
    fullDescription: 'The premier fixed-income sovereign instrument for retired senior citizens in India, providing quarterly interest payouts with absolute safety guaranteed by the Ministry of Finance.',
    governingBody: 'Ministry of Finance & Department of Posts / Public Sector Banks',
    sourceType: 'government',
    benefitValue: '8.2% P.A. Sovereign Return',
    helplinePhone: '1800-266-6868',
    category: 'financial',
    minAge: 60,
    gender: 'all',
    incomeCriteria: 'any',
    applicableStates: ['All India'],
    requiredDocuments: [
      'PAN Card',
      'Aadhaar Card',
      '2 Passport size photographs',
      'Retirement proof (if joining between age 55-60 upon superannuation)'
    ],
    benefits: 'Guaranteed 8.2% annual interest paid quarterly, tax deduction up to ₹1.5 Lakh under Sec 80C, maximum deposit up to ₹30 Lakh.',
    officialLink: 'https://www.indiapost.gov.in',
    applySteps: [
      'Visit any Post Office or commercial bank branch (SBI, PNB, BoB, etc.)',
      'Submit Form-1 along with KYC documents and deposit cheque',
      'Quarterly interest is auto-credited to linked savings account'
    ]
  },
  {
    id: 'sch-011',
    name: 'Delhi Senior Citizen Monthly Financial Assistance (Old Age Pension)',
    shortDescription: 'Monthly direct monetary assistance of ₹2,000 to ₹2,500 for senior citizens residing in Delhi.',
    fullDescription: 'The Department of Social Welfare, Government of NCT of Delhi provides monthly pension to senior citizens aged 60 and above living below poverty line or low income groups with 5 years residency.',
    governingBody: 'Department of Social Welfare, Government of NCT of Delhi',
    sourceType: 'government',
    benefitValue: '₹2,000 - ₹2,500/Month',
    helplinePhone: '011-23381611',
    category: 'pension',
    minAge: 60,
    gender: 'all',
    incomeCriteria: 'low',
    maxAnnualIncome: 100000,
    applicableStates: ['Delhi'],
    requiredDocuments: [
      'Proof of 5 years residence in Delhi (Voter ID / Ration Card / Electricity Bill)',
      'Aadhaar Card with age proof',
      'Bank Account Passbook (Single account in Delhi)',
      'Self-declaration of family income'
    ],
    benefits: '₹2,000/month for age 60-69, ₹2,500/month for age 70 and above, directly credited into Aadhaar-linked savings account.',
    officialLink: 'https://edistrict.delhigovt.nic.in',
    applySteps: [
      'Register on Delhi e-District portal (edistrict.delhigovt.nic.in)',
      'Select "Financial Assistance to Senior Citizens" service',
      'Upload residence proof and self-declaration',
      'Verification by District Social Welfare Office'
    ]
  },
  {
    id: 'sch-012',
    name: 'Uttar Pradesh Vridhavastha Pension Yojana',
    shortDescription: 'Monthly social security allowance of ₹1,000 paid to elderly citizens in Uttar Pradesh.',
    fullDescription: 'Administered by Social Welfare Department, Government of Uttar Pradesh to protect indigent elderly rural and urban residents with direct monthly DBT benefits.',
    governingBody: 'Social Welfare Department, Government of Uttar Pradesh',
    sourceType: 'government',
    benefitValue: '₹1,000/Month Direct DBT',
    helplinePhone: '1800-419-0001',
    category: 'pension',
    minAge: 60,
    gender: 'all',
    incomeCriteria: 'bpl',
    maxAnnualIncome: 56460,
    applicableStates: ['Uttar Pradesh'],
    requiredDocuments: [
      'UP Domicile & Aadhaar Card',
      'Income Certificate (Rural < ₹46,080 / Urban < ₹56,460)',
      'Bank Account Passbook with IFSC',
      'Passport size photograph'
    ],
    benefits: '₹1,000 credited every month into the bank account of the beneficiary via PFMS/DBT.',
    officialLink: 'https://sspy-up.gov.in',
    applySteps: [
      'Apply online on UP SSPY Portal (sspy-up.gov.in)',
      'Gram Panchayat or District Officer verifies documents within 21 days',
      'Approval and automatic quarterly batch disbursement'
    ]
  },
  {
    id: 'sch-013',
    name: 'Tamil Nadu Old Age Pension Scheme (OAP)',
    shortDescription: 'Monthly pension of ₹1,200 plus free monthly rice and annual festival garments for destitute elders in Tamil Nadu.',
    fullDescription: 'Comprehensive social security scheme executed by Revenue Administration Department, Government of Tamil Nadu providing continuous sustenance and nutrition to senior citizens.',
    governingBody: 'Revenue Administration & Social Welfare Dept, Government of Tamil Nadu',
    sourceType: 'government',
    benefitValue: '₹1,200/Mo + Free Rice',
    helplinePhone: '1800-425-1333',
    category: 'pension',
    minAge: 60,
    gender: 'all',
    incomeCriteria: 'bpl',
    maxAnnualIncome: 60000,
    applicableStates: ['Tamil Nadu'],
    requiredDocuments: [
      'Tamil Nadu Smart Ration Card',
      'Aadhaar Card',
      'Destitute Certificate issued by Village Administrative Officer (VAO)',
      'Post Office or Bank Savings Account details'
    ],
    benefits: '₹1,200 monthly pension + 20 kg free rice per month through PDS shops + 2 sets of free dhotis/saris during Pongal festival.',
    officialLink: 'https://edistricts.tn.gov.in',
    applySteps: [
      'Submit application at nearest e-Sevai Centre or Taluk Office',
      'Field inquiry and verification by Special Tahsildar (SSS)',
      'Pension Order delivered and disbursed via money order or bank account'
    ]
  },
  {
    id: 'sch-014',
    name: 'West Bengal Jai Bangla Pension Scheme (Old Age)',
    shortDescription: 'State social security pension of ₹1,000/month for elderly citizens residing in West Bengal.',
    fullDescription: 'Unified social assistance umbrella launched by the Government of West Bengal integrating Tapasili Bandhu, Jai Johar, and Old Age Pension for all vulnerable seniors aged 60 and above.',
    governingBody: 'Department of Women & Child Development and Social Welfare, Govt. of West Bengal',
    sourceType: 'government',
    benefitValue: '₹1,000/Month Direct DBT',
    helplinePhone: '033-23374246',
    category: 'pension',
    minAge: 60,
    gender: 'all',
    incomeCriteria: 'low',
    maxAnnualIncome: 100000,
    applicableStates: ['West Bengal'],
    requiredDocuments: [
      'West Bengal Residence Proof (Ration Card / Swasthya Sathi Card)',
      'Aadhaar Card',
      'Single Bank Account linked with Aadhaar',
      'Age proof from school or electoral roll'
    ],
    benefits: '₹1,000 per month credited directly to the beneficiary account on the 1st of every calendar month.',
    officialLink: 'https://jaibangla.wb.gov.in',
    applySteps: [
      'Obtain Jai Bangla application form at Duare Sarkar camp or BDO office',
      'Attach Aadhaar and bank details',
      'Block Development Officer (BDO) approves and registers digital sanction'
    ]
  },
  {
    id: 'sch-015',
    name: 'Rajasthan Chief Minister Vridhjan Samman Pension Yojana',
    shortDescription: 'Monthly social pension of ₹1,000 to ₹1,500 for senior citizens in Rajasthan with annual 15% automatic increment.',
    fullDescription: 'Government of Rajasthan social justice scheme for male seniors aged 58+ and female seniors aged 55+ with family income below ₹48,000, with an automatic 15% inflation-indexed hike every July.',
    governingBody: 'Department of Social Justice and Empowerment, Government of Rajasthan',
    sourceType: 'government',
    benefitValue: '₹1,000 - ₹1,500/Month',
    helplinePhone: '181',
    category: 'pension',
    minAge: 58,
    gender: 'all',
    incomeCriteria: 'low',
    maxAnnualIncome: 48000,
    applicableStates: ['Rajasthan'],
    requiredDocuments: [
      'Jan Aadhaar Card (Rajasthan Family ID)',
      'Aadhaar Card',
      'Income Certificate verified by Two Gazetted Officers or Tehsildar',
      'Bank Account linked to Jan Aadhaar'
    ],
    benefits: '₹1,000/month up to age 75; ₹1,500/month after age 75 with automatic direct credit.',
    officialLink: 'https://ssp.rajasthan.gov.in',
    applySteps: [
      'Visit nearest e-Mitra kiosk with Jan Aadhaar card',
      'Biometric authentication and instant paperless form submission',
      'Sub-Divisional Officer (SDO) digital approval within 15 days'
    ]
  },
  {
    id: 'sch-016',
    name: 'Kerala Vayomithram Project & Social Security Pension',
    shortDescription: 'Free mobile healthcare clinics, free chronic medicines at doorstep, and ₹1,600 monthly pension in Kerala.',
    fullDescription: 'Flagship initiative by Kerala Social Security Mission (KSSM) delivering monthly direct cash pension of ₹1,600 alongside mobile clinical vans that visit municipal wards to provide free screening, laboratory diagnostics, and regular prescriptions.',
    governingBody: 'Kerala Social Security Mission (KSSM), Govt. of Kerala',
    sourceType: 'government',
    benefitValue: '₹1,600/Mo + Free Medicines',
    helplinePhone: '1800-120-1001',
    category: 'healthcare',
    minAge: 60,
    gender: 'all',
    incomeCriteria: 'low',
    maxAnnualIncome: 100000,
    applicableStates: ['Kerala'],
    requiredDocuments: [
      'Kerala Ration Card / Aadhaar Card',
      'Income Certificate from Village Officer',
      'Medical summary for chronic disease management (if enrolled in Vayomithram clinic)'
    ],
    benefits: '₹1,600 monthly pension + free bi-weekly doctor checkup, blood pressure/sugar testing, and free 1-month supply of routine medications.',
    officialLink: 'https://socialsecuritymission.gov.in',
    applySteps: [
      'Apply online via Sevana Pension Portal or nearest Akshaya Centre',
      'Enroll in local municipality ward Vayomithram health register',
      'Receive monthly home-delivered medicine kits and pension credit'
    ]
  },
  {
    id: 'sch-017',
    name: 'Gujarat Niradhar Vrudh Pension Yojana (Vrudh Sahay)',
    shortDescription: 'Monthly financial assistance of ₹1,250 for destitute and helpless senior citizens in Gujarat.',
    fullDescription: 'Social protection program executed by the Women & Child Development Department, Govt of Gujarat providing continuous subsistence to elderly persons who have no family earning members.',
    governingBody: 'Directorate of Social Defence, Government of Gujarat',
    sourceType: 'government',
    benefitValue: '₹1,250/Month',
    helplinePhone: '1800-233-5500',
    category: 'pension',
    minAge: 60,
    gender: 'all',
    incomeCriteria: 'bpl',
    maxAnnualIncome: 120000,
    applicableStates: ['Gujarat'],
    requiredDocuments: [
      'Gujarat Domicile Proof (min 10 years)',
      'Aadhaar Card',
      'Mamlatdar / Taluka Development Officer (TDO) Income Certificate',
      'Bank or Post Office savings account passbook'
    ],
    benefits: '₹1,000/month for age 60-79, ₹1,250/month for age 80+ credited directly through DBT into beneficiary account.',
    officialLink: 'https://digitalgujarat.gov.in',
    applySteps: [
      'Apply online on Digital Gujarat portal or visit nearest Jan Seva Kendra',
      'Verification by Talati / Mamlatdar within 20 days',
      'Monthly pension disbursed directly into savings account'
    ]
  },
  {
    id: 'sch-018',
    name: 'Telangana Aasara Pension Scheme for Senior Citizens',
    shortDescription: 'Monthly social security pension of ₹2,016 for senior citizens aged 57 and above in Telangana.',
    fullDescription: 'Aasara pensions are designed to support the most vulnerable sections of society in Telangana to live with self-respect and dignity, with a generous monthly benefit of ₹2,016.',
    governingBody: 'Panchayat Raj & Rural Development Department, Government of Telangana',
    sourceType: 'government',
    benefitValue: '₹2,016/Month Direct DBT',
    helplinePhone: '1800-425-1980',
    category: 'pension',
    minAge: 57,
    gender: 'all',
    incomeCriteria: 'low',
    maxAnnualIncome: 150000,
    applicableStates: ['Telangana'],
    requiredDocuments: [
      'Aadhaar Card (with verified age 57+)',
      'Food Security Card (FSC / White Ration Card)',
      'Meeseva Caste and Income Certificate',
      'Post Office or Bank Savings Account Passbook'
    ],
    benefits: 'Direct cash pension of ₹2,016 per month credited via biometric micro-ATMs or bank transfer on the 1st of every month.',
    officialLink: 'https://aasara.telangana.gov.in',
    applySteps: [
      'Submit application at nearest MeeSeva Centre or Prajavani Camp',
      'Biometric e-KYC and municipal ward inquiry',
      'Sanction card issued with monthly cash disbursement'
    ]
  },
  {
    id: 'sch-019',
    name: 'Punjab Old Age Pension Scheme',
    shortDescription: 'Monthly pension of ₹1,500 for male seniors aged 65+ and female seniors aged 58+ in Punjab.',
    fullDescription: 'Department of Social Security and Women & Child Development, Government of Punjab supports elderly persons having landholdings less than 2.5 acres or income below ₹60,000.',
    governingBody: 'Department of Social Security, Government of Punjab',
    sourceType: 'government',
    benefitValue: '₹1,500/Month',
    helplinePhone: '0172-2608746',
    category: 'pension',
    minAge: 58,
    gender: 'all',
    incomeCriteria: 'low',
    maxAnnualIncome: 60000,
    applicableStates: ['Punjab'],
    requiredDocuments: [
      'Punjab Residence Proof / Voter ID',
      'Aadhaar Card',
      'Land revenue certificate or Income declaration signed by Sarpanch / Municipal Councilor',
      'Bank Account Passbook'
    ],
    benefits: '₹1,500 direct monthly allowance deposited into the beneficiary savings account.',
    officialLink: 'https://sswcd.punjab.gov.in',
    applySteps: [
      'Fill application form at nearest Sewa Kendra or CDPO Office',
      'Gram Panchayat or Municipal Council approves candidate list',
      'District Social Security Officer sanctions pension'
    ]
  },
  {
    id: 'sch-020',
    name: 'Haryana Old Age Samman Allowance',
    shortDescription: 'Generous monthly pension of ₹3,000 for senior citizens aged 60 and above in Haryana.',
    fullDescription: 'Government of Haryana provides one of India’s highest monthly old age allowances (₹3,000/month) proactively mapped via the Parivar Pehchan Patra (PPP family ID) system.',
    governingBody: 'Social Justice, Empowerment, Welfare of SCs & BCs Dept, Haryana',
    sourceType: 'government',
    benefitValue: '₹3,000/Month (Proactive PPP)',
    helplinePhone: '1800-180-2128',
    category: 'pension',
    minAge: 60,
    gender: 'all',
    incomeCriteria: 'low',
    maxAnnualIncome: 300000,
    applicableStates: ['Haryana'],
    requiredDocuments: [
      'Parivar Pehchan Patra (PPP Family ID)',
      'Aadhaar Card',
      'Bank Account verified with PPP'
    ],
    benefits: 'Automatic monthly allowance of ₹3,000 directly deposited without requiring physical visits if age 60+ is verified in PPP.',
    officialLink: 'https://pension.socialjusticehry.gov.in',
    applySteps: [
      'Automatic proactive sanction via verified PPP family ID database',
      'Consent verification by District Social Welfare Team',
      'Instant monthly credit of ₹3,000 via DBT'
    ]
  },
  {
    id: 'sch-021',
    name: 'Madhya Pradesh Indira Gandhi & Vridhavastha Pension Yojana',
    shortDescription: 'Monthly social security assistance of ₹600 to ₹1,000 for elderly persons in Madhya Pradesh.',
    fullDescription: 'Social Justice and Disabled Welfare Department, Government of Madhya Pradesh provides monthly social security pension to BPL seniors with Samagra Social Security ID.',
    governingBody: 'Social Justice & Disabled Welfare Department, Govt. of Madhya Pradesh',
    sourceType: 'government',
    benefitValue: '₹600 - ₹1,000/Month',
    helplinePhone: '0755-2556916',
    category: 'pension',
    minAge: 60,
    gender: 'all',
    incomeCriteria: 'bpl',
    maxAnnualIncome: 60000,
    applicableStates: ['Madhya Pradesh'],
    requiredDocuments: [
      'Samagra ID (MP Family ID)',
      'BPL Card / Antyodaya Card',
      'Aadhaar Card',
      'Bank Passbook linked to Samagra'
    ],
    benefits: 'Monthly financial assistance credited directly via Samagra portal into the senior citizen’s bank account.',
    officialLink: 'https://socialjustice.mp.gov.in',
    applySteps: [
      'Apply online through Samagra Portal or nearest MP Online Kiosk',
      'Secretary of Gram Panchayat or Ward in-charge verifies BPL and age',
      'Janpad Panchayat CEO digital approval'
    ]
  },
  {
    id: 'sch-022',
    name: 'Agewell Foundation - Senior Healthcare & Dignity Support Kits',
    shortDescription: 'Non-governmental free distribution of health supplements, adult diapers, mobility canes, and winter warmers.',
    fullDescription: 'Agewell Foundation works across India distributing customized healthcare and winter relief kits, adult hygiene supplies, and walking supports to lonely and indigent elderly citizens in need.',
    governingBody: 'Agewell Foundation (Registered NGO in Special Consultative Status with UN)',
    sourceType: 'ngo',
    benefitValue: 'Free Wellness & Hygiene Kits',
    helplinePhone: '011-29836486',
    category: 'healthcare',
    minAge: 60,
    gender: 'all',
    incomeCriteria: 'any',
    applicableStates: ['All India'],
    requiredDocuments: [
      'Senior ID / Aadhaar Card',
      'Doorstep address confirmation for delivery'
    ],
    benefits: 'Free health packages including orthopedic walking sticks, adult diaper packs, digital BP monitors, thermal blankets, and joint care kits delivered by volunteers.',
    officialLink: 'https://www.agewellfoundation.org',
    applySteps: [
      'Request delivery through Sahaya or call Agewell Helpline (011-29836486)',
      'Sahaya volunteer visits residence to assess device/wellness needs',
      'Free kit handover and ongoing volunteer wellness checks'
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const STATES_LIST = [
  'All India',
  'Maharashtra',
  'Delhi',
  'Karnataka',
  'Tamil Nadu',
  'Uttar Pradesh',
  'West Bengal',
  'Gujarat',
  'Rajasthan',
  'Kerala',
  'Telangana',
  'Punjab',
  'Haryana',
  'Madhya Pradesh'
];
