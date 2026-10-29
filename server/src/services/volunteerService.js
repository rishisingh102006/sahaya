import { db } from '../database/db.js';
import { generateId } from '../utils/idGenerator.js';
import { getSupabase } from '../database/supabaseClient.js';

export const volunteerService = {
  async getVolunteers(filters = {}) {
    let volunteers = [];

    if (db.isUsingSupabase()) {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase.from('volunteers').select('*');
        if (!error && Array.isArray(data)) {
          volunteers = data;
        }
      } catch (err) {
        console.warn('[VolunteerService] Supabase getVolunteers error:', err.message);
      }
    }

    if (volunteers.length === 0) {
      volunteers = db.getCollection('volunteers');
    }

    if (filters.city) {
      volunteers = volunteers.filter((v) => v.city && v.city.toLowerCase() === filters.city.toLowerCase());
    }
    if (filters.state) {
      volunteers = volunteers.filter((v) => v.state && v.state.toLowerCase() === filters.state.toLowerCase());
    }
    if (filters.verified !== undefined) {
      const isVerified = filters.verified === 'true' || filters.verified === true;
      volunteers = volunteers.filter((v) => v.verified === isVerified);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      volunteers = volunteers.filter(
        (v) =>
          v.name?.toLowerCase().includes(q) ||
          v.city?.toLowerCase().includes(q) ||
          v.skills?.some((s) => s.toLowerCase().includes(q))
      );
    }

    return volunteers;
  },

  async getVolunteerById(id) {
    const volunteer = db.findById('volunteers', id);
    if (!volunteer) {
      const error = new Error('Volunteer not found');
      error.statusCode = 404;
      throw error;
    }
    // Also include their assigned tasks
    const tasks = db.find('requests', (r) => r.assignedVolunteerId === id);
    return {
      ...volunteer,
      tasks,
    };
  },

  async createVolunteer(data) {
    const id = data.id || `vol-${Date.now().toString(36)}`;
    const newVol = {
      id,
      name: data.name,
      email: data.email || '',
      phone: data.phone || '',
      city: data.city || '',
      state: data.state || '',
      skills: Array.isArray(data.skills) ? data.skills : (data.skills ? [data.skills] : []),
      rating: data.rating || 5.0,
      activeTasks: 0,
      completedTasks: 0,
      verified: Boolean(data.verified),
    };

    await db.insert('volunteers', newVol);
    return newVol;
  },

  async updateVolunteer(id, updates) {
    const updated = await db.updateById('volunteers', id, updates);
    if (!updated) {
      const error = new Error('Volunteer not found');
      error.statusCode = 404;
      throw error;
    }
    return updated;
  },

  async verifyVolunteer(id) {
    const updated = await db.updateById('volunteers', id, { verified: true });
    if (!updated) {
      const error = new Error('Volunteer not found');
      error.statusCode = 404;
      throw error;
    }
    return updated;
  },

  async deleteVolunteer(id) {
    const success = await db.deleteById('volunteers', id);
    if (!success) {
      const error = new Error('Volunteer not found');
      error.statusCode = 404;
      throw error;
    }
    return true;
  },
};
