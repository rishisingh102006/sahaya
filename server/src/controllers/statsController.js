import { statsService } from '../services/statsService.js';
import { successResponse } from '../utils/apiResponse.js';

export const statsController = {
  async getDashboardStats(req, res, next) {
    try {
      const stats = await statsService.getStats();
      return successResponse(res, stats, 'Dashboard statistics retrieved');
    } catch (err) {
      next(err);
    }
  },
};
