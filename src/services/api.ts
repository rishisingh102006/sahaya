const API_BASE = 'http://localhost:5000/api';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('sahaya_auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = json?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    (error as any).status = response.status;
    (error as any).data = json;
    throw error;
  }

  return json?.data !== undefined ? json.data : json;
}

export const api = {
  auth: {
    async login(email: string, password: string, role?: string) {
      const data = await request<{ user: any; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, role }),
      });
      if (data?.token) {
        localStorage.setItem('sahaya_auth_token', data.token);
      }
      return data;
    },
    async register(userData: any) {
      const data = await request<{ user: any; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (data?.token) {
        localStorage.setItem('sahaya_auth_token', data.token);
      }
      return data;
    },
    async getMe() {
      return request<any>('/auth/me');
    },
    async updateProfile(updates: any) {
      return request<any>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    logout() {
      localStorage.removeItem('sahaya_auth_token');
    },
  },

  requests: {
    async getAll(filters: Record<string, any> = {}) {
      const query = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
      });
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request<any[]>(`/requests${qs}`);
    },
    async getById(id: string) {
      return request<any>(`/requests/${id}`);
    },
    async create(data: any) {
      return request<any>('/requests', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    async update(id: string, updates: any) {
      return request<any>(`/requests/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    async assignVolunteer(id: string, volunteerId: string) {
      return request<any>(`/requests/${id}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ volunteerId }),
      });
    },
    async updateStatus(id: string, status: string, note?: string) {
      return request<any>(`/requests/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note }),
      });
    },
    async addNote(id: string, text: string) {
      return request<any>(`/requests/${id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
    },
    async remove(id: string) {
      return request<any>(`/requests/${id}`, {
        method: 'DELETE',
      });
    },
  },

  volunteers: {
    async getAll(filters: Record<string, any> = {}) {
      const query = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
      });
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request<any[]>(`/volunteers${qs}`);
    },
    async getById(id: string) {
      return request<any>(`/volunteers/${id}`);
    },
    async verify(id: string) {
      return request<any>(`/volunteers/${id}/verify`, {
        method: 'PATCH',
      });
    },
  },

  schemes: {
    async getAll(filters: Record<string, any> = {}) {
      const query = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
      });
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request<any[]>(`/schemes${qs}`);
    },
    async getById(id: string) {
      return request<any>(`/schemes/${id}`);
    },
    async checkEligibility(criteria: any) {
      return request<any>('/schemes/eligibility', {
        method: 'POST',
        body: JSON.stringify(criteria),
      });
    },
  },

  notifications: {
    async getAll(role?: string) {
      const qs = role ? `?role=${role}` : '';
      return request<any[]>(`/notifications${qs}`);
    },
    async markAsRead(id: string) {
      return request<any>(`/notifications/${id}/read`, {
        method: 'PATCH',
      });
    },
    async markAllAsRead(role?: string) {
      return request<any[]>('/notifications/read-all', {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      });
    },
    async create(data: any) {
      return request<any>('/notifications', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  feedback: {
    async submit(data: { requestId: string; rating: number; comment?: string }) {
      return request<any>('/feedback', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    async getAll(filters: Record<string, any> = {}) {
      const query = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
      });
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request<any[]>(`/feedback${qs}`);
    },
  },

  stats: {
    async getDashboardStats() {
      return request<any>('/stats');
    },
  },

  system: {
    async health() {
      return request<any>('/health');
    },
    async reset() {
      return request<any>('/reset', {
        method: 'POST',
      });
    },
  },
};
