export type UserRole = 'senior' | 'ngo' | 'volunteer' | 'guest';

export type AssistanceType = 
  | 'medical'
  | 'transport'
  | 'grocery'
  | 'documentation'
  | 'emergency';

export type RequestStatus = 
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PriorityLevel = 'routine' | 'urgent' | 'emergency';

export type SchemeCategory = 
  | 'pension'
  | 'healthcare'
  | 'assistive_devices'
  | 'widow_support'
  | 'food_security'
  | 'financial';

export interface AssistanceRequest {
  id: string;
  seniorId: string;
  seniorName: string;
  seniorAge: number;
  seniorPhone: string;
  seniorAddress: string;
  city: string;
  state: string;
  type: AssistanceType;
  title: string;
  description: string;
  priority: PriorityLevel;
  isEmergency: boolean;
  status: RequestStatus;
  landmark?: string;
  preferredTiming?: string;
  assignedNgoId?: string;
  assignedNgoName?: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  assignedVolunteerPhone?: string;
  createdAt: string;
  assignedAt?: string;
  startedAt?: string;
  completedAt?: string;
  volunteerNotes?: Array<{
    text: string;
    timestamp: string;
  }>;
  feedback?: {
    rating: number;
    comment: string;
    submittedAt: string;
  };
}

export interface Scheme {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  governingBody: string;
  sourceType?: 'government' | 'ngo';
  benefitValue?: string;
  helplinePhone?: string;
  category: SchemeCategory;
  minAge: number;
  maxAge?: number;
  gender: 'all' | 'female' | 'male';
  widowOnly?: boolean;
  incomeCriteria: 'any' | 'bpl' | 'low' | 'middle';
  maxAnnualIncome?: number; // In INR
  disabilityOnly?: boolean;
  areaCriteria?: 'all' | 'rural' | 'urban';
  applicableStates: string[]; // e.g. ['All India'] or specific states
  requiredDocuments: string[];
  benefits: string;
  officialLink?: string;
  applySteps: string[];
}

export interface NotificationItem {
  id: string;
  userId?: string;
  roleTarget: UserRole | 'all';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedRequestId?: string;
  type: 'emergency' | 'assignment' | 'completion' | 'info';
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  address: string;
  city: string;
  state: string;
  pincode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalConditions?: string;
  organizationName?: string;
  ngoRegistrationNo?: string;
  skills?: string[];
  availability?: string;
  rating?: number;
  completedTasksCount?: number;
}

export interface VolunteerMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  skills: string[];
  rating: number;
  activeTasks: number;
  completedTasks: number;
  verified: boolean;
}
