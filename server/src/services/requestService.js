import { db } from '../database/db.js';
import { generateRequestId } from '../utils/idGenerator.js';
import { notificationService } from './notificationService.js';
import { getSupabase } from '../database/supabaseClient.js';

export const requestService = {
  async getRequests(filters = {}, user = null) {
    let requests = [];

    if (db.isUsingSupabase()) {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('requests')
          .select('*')
          .order('createdAt', { ascending: false });
        if (!error && Array.isArray(data)) {
          requests = data;
        }
      } catch (err) {
        console.warn('[RequestService] Supabase getRequests error, using local:', err.message);
      }
    }

    if (requests.length === 0) {
      requests = db.getCollection('requests');
    }

    // Role-based filtering if user is present
    if (user) {
      if (user.role === 'senior') {
        // Senior sees their own requests
        requests = requests.filter(
          (r) => r.seniorId === user.id || r.seniorEmail === user.email || r.seniorPhone === user.phone
        );
      } else if (user.role === 'volunteer') {
        // Volunteer sees requests assigned to them or unassigned pending requests in their community
        requests = requests.filter(
          (r) => r.assignedVolunteerId === user.id || r.assignedVolunteerPhone === user.phone || r.status === 'pending'
        );
      }
      // NGO / admin sees all requests
    }

    // Explicit query filters
    if (filters.status) {
      requests = requests.filter((r) => r.status === filters.status);
    }
    if (filters.priority) {
      requests = requests.filter((r) => r.priority === filters.priority);
    }
    if (filters.type) {
      requests = requests.filter((r) => r.type === filters.type);
    }
    if (filters.city) {
      requests = requests.filter((r) => r.city && r.city.toLowerCase() === filters.city.toLowerCase());
    }
    if (filters.state) {
      requests = requests.filter((r) => r.state && r.state.toLowerCase() === filters.state.toLowerCase());
    }
    if (filters.isEmergency !== undefined) {
      const isEm = filters.isEmergency === 'true' || filters.isEmergency === true;
      requests = requests.filter((r) => r.isEmergency === isEm);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      requests = requests.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.seniorName?.toLowerCase().includes(q) ||
          r.city?.toLowerCase().includes(q) ||
          r.id?.toLowerCase().includes(q)
      );
    }

    return requests;
  },

  async getRequestById(id) {
    let request = null;

    if (db.isUsingSupabase()) {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('requests')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (!error && data) {
          request = data;
        }
      } catch (err) {
        console.warn('[RequestService] Supabase getRequestById error:', err.message);
      }
    }

    if (!request) {
      request = db.findById('requests', id);
    }

    if (!request) {
      const error = new Error('Assistance request not found');
      error.statusCode = 404;
      throw error;
    }
    return request;
  },

  async createRequest(data, user = null) {
    const requestId = data.id || generateRequestId();
    const requestCity = data.city || (user ? user.city : 'Pune');

    const newRequest = {
      id: requestId,
      seniorId: user ? user.id : (data.seniorId || 'user-senior-guest'),
      seniorName: data.seniorName || (user ? user.name : 'Senior Citizen'),
      seniorAge: data.seniorAge || (user ? user.age : 70),
      seniorPhone: data.seniorPhone || (user ? user.phone : ''),
      seniorAddress: data.seniorAddress || (user ? user.address : ''),
      city: requestCity,
      state: data.state || (user ? user.state : 'Maharashtra'),
      type: data.type || 'medical',
      title: data.title,
      description: data.description,
      priority: data.isEmergency ? 'emergency' : (data.priority || 'routine'),
      isEmergency: Boolean(data.isEmergency || data.priority === 'emergency'),
      status: 'pending',
      landmark: data.landmark || '',
      preferredTiming: data.preferredTiming || 'As soon as possible',
      assignedVolunteerId: null,
      assignedVolunteerName: null,
      assignedVolunteerPhone: null,
      assignedNgoId: null,
      assignedNgoName: null,
      assignedAt: null,
      createdAt: new Date().toISOString(),
      volunteerNotes: [],
    };

    await db.insert('requests', newRequest);

    if (newRequest.isEmergency) {
      await notificationService.createNotification({
        roleTarget: 'ngo',
        title: `EMERGENCY ALERT: ${newRequest.title}`,
        message: `Emergency request ${newRequest.id} from ${newRequest.seniorName} in ${newRequest.city} requires immediate triage.`,
        relatedRequestId: newRequest.id,
        type: 'emergency',
      });
    } else {
      await notificationService.createNotification({
        roleTarget: 'ngo',
        title: `New Request Created: ${newRequest.title}`,
        message: `${newRequest.seniorName} requested assistance for ${newRequest.type} (${newRequest.id}).`,
        relatedRequestId: newRequest.id,
        type: 'info',
      });
    }

    return newRequest;
  },

  async updateRequest(id, updates) {
    const updated = await db.updateById('requests', id, updates);
    if (!updated) {
      const error = new Error('Assistance request not found');
      error.statusCode = 404;
      throw error;
    }
    return updated;
  },

  async assignVolunteer(id, volunteerId, assignedNgo = null) {
    let request = null;
    if (db.isUsingSupabase()) {
      try {
        const supabase = getSupabase();
        const { data } = await supabase.from('requests').select('*').eq('id', id).maybeSingle();
        if (data) request = data;
      } catch (e) {}
    }
    if (!request) {
      request = db.findById('requests', id);
    }
    if (!request) {
      const error = new Error('Assistance request not found');
      error.statusCode = 404;
      throw error;
    }

    let volunteer = db.findById('volunteers', volunteerId) || db.findById('users', volunteerId);
    if (!volunteer && db.isUsingSupabase()) {
      try {
        const supabase = getSupabase();
        const { data: vol } = await supabase.from('volunteers').select('*').eq('id', volunteerId).maybeSingle();
        if (vol) volunteer = vol;
        else {
          const { data: u } = await supabase.from('users').select('*').eq('id', volunteerId).maybeSingle();
          if (u) volunteer = u;
        }
      } catch (e) {}
    }

    if (!volunteer) {
      // Fallback: create minimal record from volunteerId
      volunteer = { id: volunteerId, name: 'Registered Volunteer', phone: '' };
    }

    const updates = {
      assignedVolunteerId: volunteer.id,
      assignedVolunteerName: volunteer.name,
      assignedVolunteerPhone: volunteer.phone || '',
      status: 'assigned',
      assignedAt: new Date().toISOString(),
    };

    if (assignedNgo) {
      updates.assignedNgoId = assignedNgo.id;
      updates.assignedNgoName = assignedNgo.organizationName || assignedNgo.name;
    }

    const updated = await db.updateById('requests', id, updates);

    // Update volunteer active tasks count
    if (volunteer.activeTasks !== undefined) {
      await db.updateById('volunteers', volunteer.id, {
        activeTasks: (volunteer.activeTasks || 0) + 1,
      });
    }

    // Create notifications for senior and volunteer
    await notificationService.createNotification({
      roleTarget: 'senior',
      title: `Volunteer Assigned: ${volunteer.name}`,
      message: `${volunteer.name} has been assigned to your request (${request.id}).`,
      relatedRequestId: request.id,
      type: 'assignment',
    });

    await notificationService.createNotification({
      roleTarget: 'volunteer',
      title: `New Task Assigned (${request.id})`,
      message: `You have been assigned to assist ${request.seniorName} with ${request.title}.`,
      relatedRequestId: request.id,
      type: 'assignment',
    });

    return updated;
  },

  async updateStatus(id, status, noteText = null, user = null) {
    let request = null;
    if (db.isUsingSupabase()) {
      try {
        const supabase = getSupabase();
        const { data } = await supabase.from('requests').select('*').eq('id', id).maybeSingle();
        if (data) request = data;
      } catch (e) {}
    }
    if (!request) {
      request = db.findById('requests', id);
    }
    if (!request) {
      const error = new Error('Assistance request not found');
      error.statusCode = 404;
      throw error;
    }

    const updates = { status };
    const now = new Date().toISOString();

    if (status === 'in_progress' && !request.startedAt) {
      updates.startedAt = now;
    } else if (status === 'completed') {
      updates.completedAt = now;
      // Decrement volunteer activeTasks and increment completedTasks
      if (request.assignedVolunteerId) {
        const vol = db.findById('volunteers', request.assignedVolunteerId);
        if (vol) {
          await db.updateById('volunteers', vol.id, {
            activeTasks: Math.max(0, (vol.activeTasks || 1) - 1),
            completedTasks: (vol.completedTasks || 0) + 1,
          });
        }
      }
      // Notify senior
      await notificationService.createNotification({
        roleTarget: 'senior',
        title: `Service Completed: ${request.title}`,
        message: `Your request (${request.id}) has been marked as completed. Please submit your feedback!`,
        relatedRequestId: request.id,
        type: 'completion',
      });
    }

    if (noteText) {
      const existingNotes = request.volunteerNotes || [];
      updates.volunteerNotes = [
        ...existingNotes,
        {
          text: noteText,
          timestamp: now,
          authorName: user ? user.name : 'System',
        },
      ];
    }

    return await db.updateById('requests', id, updates);
  },

  async addNote(id, text, authorName = 'Volunteer') {
    const request = db.findById('requests', id);
    if (!request) {
      const error = new Error('Assistance request not found');
      error.statusCode = 404;
      throw error;
    }

    const notes = request.volunteerNotes || [];
    const newNote = {
      text,
      timestamp: new Date().toISOString(),
      authorName,
    };

    return await db.updateById('requests', id, {
      volunteerNotes: [...notes, newNote],
    });
  },

  async deleteRequest(id) {
    const success = await db.deleteById('requests', id);
    if (!success) {
      const error = new Error('Assistance request not found');
      error.statusCode = 404;
      throw error;
    }
    return true;
  },
};
