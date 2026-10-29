import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  UserProfile, 
  UserRole, 
  AssistanceRequest, 
  Scheme, 
  NotificationItem, 
  VolunteerMember,
  RequestStatus,
  AssistanceType,
  PriorityLevel
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_REQUESTS, 
  MOCK_SCHEMES, 
  INITIAL_NOTIFICATIONS, 
  MOCK_VOLUNTEERS 
} from '../data/mockData';
import { api } from '../services/api';

export type NavigationTab = 
  | 'landing' 
  | 'schemes' 
  | 'track' 
  | 'create-request' 
  | 'dashboard' 
  | 'notifications' 
  | 'profile' 
  | 'feedback' 
  | 'auth';

export type TextSizeOption = 'normal' | 'large' | 'extralarge';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  requests: AssistanceRequest[];
  schemes: Scheme[];
  notifications: NotificationItem[];
  volunteers: VolunteerMember[];
  activeTab: NavigationTab;
  authMode: 'login' | 'register';
  authInitialRole: UserRole;
  textSize: TextSizeOption;
  selectedTrackRequestId: string | null;
  toasts: ToastItem[];
  
  // Navigation & UI controls
  setActiveTab: (tab: NavigationTab) => void;
  setAuthMode: (mode: 'login' | 'register', role?: UserRole) => void;
  setTextSize: (size: TextSizeOption) => void;
  setSelectedTrackRequestId: (id: string | null) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
  
  // Role & User
  switchRole: (role: UserRole) => void;
  updateCurrentUserProfile: (updated: Partial<UserProfile>) => void;
  loginUser: (email: string, role: UserRole, password?: string) => void;
  registerUser: (profile: Partial<UserProfile>, password?: string) => void;
  logoutUser: () => void;

  // Assistance Flow
  createRequest: (data: {
    type: AssistanceType;
    title: string;
    description: string;
    priority: PriorityLevel;
    isEmergency: boolean;
    seniorAddress: string;
    city: string;
    state: string;
    landmark?: string;
    preferredTiming?: string;
    seniorPhone?: string;
    seniorName?: string;
  }) => string;
  assignVolunteer: (requestId: string, volunteerId: string) => void;
  updateRequestStatus: (requestId: string, status: RequestStatus, note?: string) => void;
  submitFeedback: (requestId: string, rating: number, comment: string) => void;
  fetchRequests: () => Promise<void>;

  // Notifications
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Reset
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Active Tab
  const [activeTab, setActiveTabState] = useState<NavigationTab>('landing');
  const [authMode, setAuthModeState] = useState<'login' | 'register'>('login');
  const [authInitialRole, setAuthInitialRole] = useState<UserRole>('senior');
  const [selectedTrackRequestId, setSelectedTrackRequestId] = useState<string | null>(null);

  // Text Size for Senior Readability
  const [textSize, setTextSizeState] = useState<TextSizeOption>(() => {
    return (localStorage.getItem('sahaya_text_size') as TextSizeOption) || 'normal';
  });

  // Current User
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sahaya_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.id === 'user-senior-01' || parsed.id === 'user-vol-01' || parsed.id === 'user-ngo-01' || parsed.id === 'user-senior-demo') {
          return INITIAL_USERS.senior;
        }
        return parsed;
      } catch {
        return INITIAL_USERS.senior;
      }
    }
    return INITIAL_USERS.senior;
  });

  // Requests (clean out any old dummy data from localStorage)
  const [requests, setRequests] = useState<AssistanceRequest[]>(() => {
    const saved = localStorage.getItem('sahaya_requests');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (r: any) => r && r.id && !r.id.startsWith('SHY-2026-08') && !r.title?.includes('[Role Test]')
          );
        }
      } catch {
        return [];
      }
    }
    return [];
  });

  // Notifications (clean out old mock notifications)
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('sahaya_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((n: any) => n && n.id && !n.id.startsWith('notif-00'));
        }
      } catch {
        return [];
      }
    }
    return [];
  });

  // Volunteers & Schemes
  const [volunteers, setVolunteers] = useState<VolunteerMember[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>(MOCK_SCHEMES);

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Function to refresh requests from API on demand (memoized to prevent render loops)
  const fetchRequests = useCallback(async () => {
    try {
      const apiRequests = await api.requests.getAll();
      if (Array.isArray(apiRequests)) {
        const clean = apiRequests.filter(
          (r: any) => r && r.id && !r.id.startsWith('SHY-2026-08') && !r.title?.includes('[Role Test]')
        );
        setRequests(clean);
      }
    } catch (err) {
      console.warn('Backend requests sync notice:', err);
    }
  }, []);

  // Fetch initial data from Backend API on mount
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const [apiRequests, apiVolunteers, apiSchemes, apiNotifications] = await Promise.allSettled([
          api.requests.getAll(),
          api.volunteers.getAll(),
          api.schemes.getAll(),
          api.notifications.getAll(),
        ]);

        if (apiRequests.status === 'fulfilled' && Array.isArray(apiRequests.value)) {
          const cleanRequests = apiRequests.value.filter(
            (r: any) => r && r.id && !r.id.startsWith('SHY-2026-08') && !r.title?.includes('[Role Test]')
          );
          setRequests(cleanRequests);
        }
        if (apiVolunteers.status === 'fulfilled' && Array.isArray(apiVolunteers.value)) {
          const cleanVolunteers = apiVolunteers.value.filter(
            (v: any) => v && v.id && !v.id.startsWith('vol-00')
          );
          setVolunteers(cleanVolunteers);
        }
        if (apiSchemes.status === 'fulfilled' && Array.isArray(apiSchemes.value) && apiSchemes.value.length > 0) {
          setSchemes(apiSchemes.value);
        }
        if (apiNotifications.status === 'fulfilled' && Array.isArray(apiNotifications.value)) {
          const cleanNotifs = apiNotifications.value.filter(
            (n: any) => n && n.id && !n.id.startsWith('notif-00')
          );
          setNotifications(cleanNotifs);
        }
      } catch (err) {
        console.warn('Backend connection notice - using local cached data:', err);
      }
    };

    fetchApiData();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sahaya_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sahaya_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('sahaya_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sahaya_text_size', textSize);
  }, [textSize]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setTextSize = (size: TextSizeOption) => {
    setTextSizeState(size);
  };

  const setActiveTab = (tab: NavigationTab) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setAuthMode = (mode: 'login' | 'register', role?: UserRole) => {
    setAuthModeState(mode);
    if (role) {
      setAuthInitialRole(role);
    }
    setActiveTab('auth');
  };

  const switchRole = (role: UserRole) => {
    if (role === 'guest') {
      api.auth.logout();
      setCurrentUser({
        id: 'guest',
        name: 'Guest Visitor',
        role: 'guest',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: 'All India'
      });
      showToast('Switched to Guest mode', 'info');
      return;
    }

    if (INITIAL_USERS[role]) {
      setCurrentUser(INITIAL_USERS[role]);
      showToast(`Switched active profile to ${INITIAL_USERS[role].name} (${role.toUpperCase()})`, 'success');
    }
  };

  const loginUser = async (email: string, role: UserRole, password?: string) => {
    if (password) {
      try {
        const res = await api.auth.login(email, password, role);
        if (res && res.user) {
          setCurrentUser(res.user);
          showToast(`Welcome back, ${res.user.name}!`, 'success');
          setActiveTab('dashboard');
          return;
        }
      } catch (err: any) {
        showToast(err.message || 'Login failed. Please check your credentials.', 'error');
        return;
      }
    }

    const defaultUser = INITIAL_USERS[role] || INITIAL_USERS.senior;
    const userToSet: UserProfile = {
      ...defaultUser,
      email: email || defaultUser.email,
      role: role
    };
    setCurrentUser(userToSet);
    showToast(`Welcome back, ${userToSet.name}!`, 'success');
    setActiveTab('dashboard');
  };

  const registerUser = async (profileData: Partial<UserProfile>, password?: string) => {
    try {
      const res = await api.auth.register({
        ...profileData,
        password: password || 'Sahaya@123',
      });
      if (res && res.user) {
        setCurrentUser(res.user);
        showToast(`Registration complete! Welcome to Sahaya, ${res.user.name}.`, 'success');
        setActiveTab('dashboard');
        return;
      }
    } catch (err: any) {
      showToast(err.message || 'Registration failed. Please verify details.', 'error');
      return;
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: profileData.name || 'New Member',
      role: profileData.role || 'senior',
      email: profileData.email || 'user@example.com',
      phone: profileData.phone || '+91 98000 00000',
      address: profileData.address || '',
      city: profileData.city || 'Pune',
      state: profileData.state || 'Maharashtra',
      pincode: profileData.pincode,
      age: profileData.age,
      emergencyContactName: profileData.emergencyContactName,
      emergencyContactPhone: profileData.emergencyContactPhone,
      organizationName: profileData.organizationName,
      ngoRegistrationNo: profileData.ngoRegistrationNo,
      skills: profileData.skills
    };
    setCurrentUser(newUser);
    showToast(`Registration complete! Welcome to Sahaya, ${newUser.name}.`, 'success');
    setActiveTab('dashboard');
  };

  const logoutUser = () => {
    api.auth.logout();
    switchRole('guest');
    setActiveTab('landing');
    showToast('You have been logged out successfully.', 'info');
  };

  const updateCurrentUserProfile = (updated: Partial<UserProfile>) => {
    setCurrentUser(prev => ({ ...prev, ...updated }));
    api.auth.updateProfile(updated).catch(() => {});
    showToast('Profile updated successfully', 'success');
  };

  const createRequest = (data: {
    type: AssistanceType;
    title: string;
    description: string;
    priority: PriorityLevel;
    isEmergency: boolean;
    seniorAddress: string;
    city: string;
    state: string;
    landmark?: string;
    preferredTiming?: string;
    seniorPhone?: string;
    seniorName?: string;
  }): string => {
    const year = new Date().getFullYear();
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const newId = `SHY-${year}-${randomCode}`;

    const newRequest: AssistanceRequest = {
      id: newId,
      seniorId: currentUser.id,
      seniorName: data.seniorName || currentUser.name,
      seniorAge: currentUser.age || 70,
      seniorPhone: data.seniorPhone || currentUser.phone,
      seniorAddress: data.seniorAddress || currentUser.address,
      city: data.city || currentUser.city || 'Pune',
      state: data.state || currentUser.state || 'Maharashtra',
      type: data.type,
      title: data.title,
      description: data.description,
      priority: data.priority,
      isEmergency: data.isEmergency,
      status: 'pending',
      landmark: data.landmark,
      preferredTiming: data.preferredTiming || 'As soon as possible',
      createdAt: new Date().toISOString(),
      volunteerNotes: []
    };

    setSelectedTrackRequestId(newId);
    setRequests(prev => [newRequest, ...prev]);

    // Asynchronously sync with Backend API & Supabase
    api.requests.create({
      id: newId,
      ...data,
      seniorId: currentUser.id,
      seniorName: data.seniorName || currentUser.name,
      seniorAge: currentUser.age || 70,
      seniorPhone: data.seniorPhone || currentUser.phone,
      seniorAddress: data.seniorAddress || currentUser.address,
    }).then((created) => {
      if (created && created.id) {
        setRequests(prev => prev.map(r => r.id === newId ? created : r));
      }
    }).catch(err => {
      console.warn('Backend sync failed for createRequest:', err);
    });

    // Send notifications to NGO and Senior
    const notifSenior: NotificationItem = {
      id: `notif-${Date.now()}-1`,
      userId: currentUser.id,
      roleTarget: 'senior',
      title: 'Assistance Request Created',
      message: `Your request ${newId} (${data.title}) has been broadcast to partner NGOs for verification.`,
      timestamp: new Date().toISOString(),
      read: false,
      relatedRequestId: newId,
      type: data.isEmergency ? 'emergency' : 'info'
    };

    const notifNgo: NotificationItem = {
      id: `notif-${Date.now()}-2`,
      roleTarget: 'ngo',
      title: data.isEmergency ? `EMERGENCY ALERT: ${newId}` : `New Assistance Request: ${newId}`,
      message: `${data.seniorName || currentUser.name} in ${data.city} requires ${data.type} support.`,
      timestamp: new Date().toISOString(),
      read: false,
      relatedRequestId: newId,
      type: data.isEmergency ? 'emergency' : 'info'
    };

    setNotifications(prev => [notifSenior, notifNgo, ...prev]);
    showToast(`Request ${newId} created successfully! NGOs have been alerted.`, 'success');
    return newId;
  };

  const assignVolunteer = (requestId: string, volunteerId: string) => {
    let targetVolName = currentUser.name;
    let targetVolPhone = currentUser.phone || '';
    let targetVolId = volunteerId;

    const matchedVol = volunteers.find(v => v.id === volunteerId);
    if (matchedVol) {
      targetVolName = matchedVol.name;
      targetVolPhone = matchedVol.phone || '';
      targetVolId = matchedVol.id;
    } else if (currentUser.id === volunteerId) {
      targetVolName = currentUser.name;
      targetVolPhone = currentUser.phone || '';
      targetVolId = currentUser.id;
    }

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'assigned',
          assignedVolunteerId: targetVolId,
          assignedVolunteerName: targetVolName,
          assignedVolunteerPhone: targetVolPhone,
          assignedAt: new Date().toISOString(),
          volunteerNotes: [
            ...(req.volunteerNotes || []),
            {
              text: `Assigned to volunteer ${targetVolName}.`,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return req;
    }));

    // Asynchronously sync with Backend API
    api.requests.assignVolunteer(requestId, volunteerId).catch(err => {
      console.warn('Backend sync failed for assignVolunteer:', err);
    });

    const notifVol: NotificationItem = {
      id: `notif-${Date.now()}-vol`,
      roleTarget: 'volunteer',
      title: 'New Service Assignment',
      message: `You have accepted assistance request ${requestId}. Please review senior details and contact them.`,
      timestamp: new Date().toISOString(),
      read: false,
      relatedRequestId: requestId,
      type: 'assignment'
    };
    const notifSenior: NotificationItem = {
      id: `notif-${Date.now()}-sen`,
      roleTarget: 'senior',
      title: 'Volunteer Assigned',
      message: `${targetVolName} (${targetVolPhone}) has been assigned to your request ${requestId}.`,
      timestamp: new Date().toISOString(),
      read: false,
      relatedRequestId: requestId,
      type: 'assignment'
    };

    setNotifications(prev => [notifVol, notifSenior, ...prev]);
    showToast(`Volunteer ${targetVolName} assigned to request ${requestId}!`, 'success');
  };

  const updateRequestStatus = (requestId: string, status: RequestStatus, note?: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedNotes = [...(req.volunteerNotes || [])];
        if (note) {
          updatedNotes.push({
            text: note,
            timestamp: new Date().toISOString()
          });
        }
        return {
          ...req,
          status,
          startedAt: status === 'in_progress' && !req.startedAt ? new Date().toISOString() : req.startedAt,
          completedAt: status === 'completed' && !req.completedAt ? new Date().toISOString() : req.completedAt,
          volunteerNotes: updatedNotes
        };
      }
      return req;
    }));

    // Asynchronously sync with Backend API
    api.requests.updateStatus(requestId, status, note).then((updated) => {
      if (updated && updated.id) {
        setRequests(prev => prev.map(r => r.id === requestId ? updated : r));
      }
    }).catch(err => {
      console.warn('Backend sync failed for updateRequestStatus:', err);
    });

    const statusLabels: Record<RequestStatus, string> = {
      pending: 'Pending Review',
      assigned: 'Volunteer Assigned',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };

    const notif: NotificationItem = {
      id: `notif-${Date.now()}-status`,
      roleTarget: 'senior',
      title: `Status Update: ${statusLabels[status]}`,
      message: `Your assistance request ${requestId} has been updated to "${statusLabels[status]}". ${note ? `Note: "${note}"` : ''}`,
      timestamp: new Date().toISOString(),
      read: false,
      relatedRequestId: requestId,
      type: status === 'completed' ? 'completion' : 'info'
    };

    setNotifications(prev => [notif, ...prev]);
    showToast(`Request ${requestId} status updated to ${statusLabels[status]}!`, 'success');
  };

  const submitFeedback = (requestId: string, rating: number, comment: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          feedback: {
            rating,
            comment,
            submittedAt: new Date().toISOString()
          }
        };
      }
      return req;
    }));

    // Asynchronously sync with Backend API
    api.feedback.submit({ requestId, rating, comment }).catch(err => {
      console.warn('Backend sync failed for submitFeedback:', err);
    });

    const notif: NotificationItem = {
      id: `notif-${Date.now()}-feedback`,
      roleTarget: 'ngo',
      title: 'Senior Citizen Feedback Received',
      message: `Senior gave ${rating} stars for request ${requestId}: "${comment}"`,
      timestamp: new Date().toISOString(),
      read: false,
      relatedRequestId: requestId,
      type: 'completion'
    };

    setNotifications(prev => [notif, ...prev]);
    showToast('Thank you! Your feedback has been recorded and shared with the NGO and Volunteer.', 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    api.notifications.markAsRead(id).catch(() => {});
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    api.notifications.markAllAsRead(currentUser.role).catch(() => {});
    showToast('All notifications marked as read', 'info');
  };

  const resetDemoData = () => {
    localStorage.removeItem('sahaya_requests');
    localStorage.removeItem('sahaya_notifications');
    localStorage.removeItem('sahaya_current_user');
    api.system.reset().catch(() => {});
    setRequests([]);
    setNotifications([]);
    setCurrentUser(INITIAL_USERS.senior);
    showToast('All local storage data cleared successfully!', 'info');
  };

  const unreadCount = notifications.filter(n => {
    if (currentUser.role === 'guest') return !n.read;
    return !n.read && (n.roleTarget === 'all' || n.roleTarget === currentUser.role);
  }).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        requests,
        schemes,
        notifications,
        volunteers,
        activeTab,
        authMode,
        authInitialRole,
        textSize,
        selectedTrackRequestId,
        toasts,
        setActiveTab,
        setAuthMode,
        setTextSize,
        setSelectedTrackRequestId,
        showToast,
        dismissToast,
        switchRole,
        updateCurrentUserProfile,
        loginUser,
        registerUser,
        logoutUser,
        createRequest,
        assignVolunteer,
        updateRequestStatus,
        submitFeedback,
        fetchRequests,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
