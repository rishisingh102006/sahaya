export const USER_ROLES = {
  SENIOR: 'senior',
  VOLUNTEER: 'volunteer',
  NGO: 'ngo',
};

// Aliases for compatibility
export const ROLE_ALIASES = {
  user: 'senior',
  citizen: 'senior',
  admin: 'ngo',
  coordinator: 'ngo',
};

export const REQUEST_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const REQUEST_PRIORITY = {
  ROUTINE: 'routine',
  URGENT: 'urgent',
  EMERGENCY: 'emergency',
};

export const REQUEST_TYPES = [
  'medical',
  'grocery',
  'transport',
  'documentation',
  'emergency',
  'companionship',
  'home_maintenance',
  'other',
];
