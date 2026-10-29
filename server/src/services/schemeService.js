import { db } from '../database/db.js';
import { generateId } from '../utils/idGenerator.js';

export const schemeService = {
  async getSchemes(filters = {}) {
    let schemes = db.getCollection('schemes');

    if (filters.category && filters.category !== 'all') {
      schemes = schemes.filter((s) => s.category === filters.category);
    }
    if (filters.sourceType && filters.sourceType !== 'all') {
      schemes = schemes.filter((s) => s.sourceType === filters.sourceType);
    }
    if (filters.state && filters.state !== 'All India') {
      schemes = schemes.filter(
        (s) =>
          !s.applicableStates ||
          s.applicableStates.includes('All India') ||
          s.applicableStates.includes(filters.state)
      );
    }
    if (filters.minAge) {
      const age = parseInt(filters.minAge, 10);
      schemes = schemes.filter((s) => !s.minAge || s.minAge <= age);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      schemes = schemes.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.shortDescription?.toLowerCase().includes(q) ||
          s.category?.toLowerCase().includes(q) ||
          s.governingBody?.toLowerCase().includes(q)
      );
    }

    return schemes;
  },

  async getSchemeById(id) {
    const scheme = db.findById('schemes', id);
    if (!scheme) {
      const error = new Error('Government/NGO scheme not found');
      error.statusCode = 404;
      throw error;
    }
    return scheme;
  },

  async checkEligibility(criteria) {
    const { age, state, gender, income, isWidow } = criteria;
    const allSchemes = db.getCollection('schemes');

    const eligible = allSchemes.filter((scheme) => {
      // Age check
      if (age && scheme.minAge && parseInt(age, 10) < scheme.minAge) {
        return false;
      }

      // Gender check
      if (gender && scheme.gender && scheme.gender !== 'all' && scheme.gender !== gender) {
        return false;
      }

      // Widow check
      if (scheme.widowOnly && !isWidow) {
        return false;
      }

      // State check
      if (state && state !== 'All India' && scheme.applicableStates) {
        const matchesState =
          scheme.applicableStates.includes('All India') ||
          scheme.applicableStates.includes(state);
        if (!matchesState) return false;
      }

      // Income check
      if (income !== undefined && scheme.maxAnnualIncome) {
        if (Number(income) > scheme.maxAnnualIncome) {
          return false;
        }
      }

      return true;
    });

    return {
      total: allSchemes.length,
      eligibleCount: eligible.length,
      schemes: eligible,
    };
  },

  async createScheme(data) {
    const id = data.id || generateId('sch');
    const newScheme = {
      id,
      ...data,
      applicableStates: Array.isArray(data.applicableStates)
        ? data.applicableStates
        : ['All India'],
      requiredDocuments: Array.isArray(data.requiredDocuments)
        ? data.requiredDocuments
        : [],
      applySteps: Array.isArray(data.applySteps)
        ? data.applySteps
        : [],
    };

    await db.insert('schemes', newScheme);
    return newScheme;
  },

  async updateScheme(id, updates) {
    const updated = await db.updateById('schemes', id, updates);
    if (!updated) {
      const error = new Error('Scheme not found');
      error.statusCode = 404;
      throw error;
    }
    return updated;
  },

  async deleteScheme(id) {
    const success = await db.deleteById('schemes', id);
    if (!success) {
      const error = new Error('Scheme not found');
      error.statusCode = 404;
      throw error;
    }
    return true;
  },
};
