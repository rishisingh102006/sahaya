import { db } from '../database/db.js';
import { statsService } from '../services/statsService.js';
import { successResponse } from '../utils/apiResponse.js';
import { testSupabaseConnection, isSupabaseConfigured } from '../database/supabaseClient.js';
import { env } from '../config/env.js';

export const systemController = {
  async health(req, res, next) {
    try {
      const stats = await statsService.getStats();
      const supabaseStatus = await testSupabaseConnection();
      const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: {
          status: 'connected',
          provider: (env.USE_SUPABASE && supabaseStatus.connected) 
            ? 'Supabase PostgreSQL' 
            : 'JSON File Persistence (Atomic Local Fallback)',
          supabase: supabaseStatus,
          totalRecords: {
            requests: stats.totalRequests,
            volunteers: stats.totalVolunteers,
            schemes: stats.totalSchemes,
          },
        },
      };
      return successResponse(res, healthData, 'Sahaya API server is healthy and operational');
    } catch (err) {
      next(err);
    }
  },

  async reset(req, res, next) {
    try {
      const freshData = await db.reset();
      return successResponse(
        res,
        {
          usersCount: freshData.users.length,
          requestsCount: freshData.requests.length,
          volunteersCount: freshData.volunteers.length,
          schemesCount: freshData.schemes.length,
        },
        'Database successfully reset to initial demo dataset'
      );
    } catch (err) {
      next(err);
    }
  },
};
