import { db } from '../database/db.js';

export const statsService = {
  async getStats() {
    const requests = db.getCollection('requests');
    const volunteers = db.getCollection('volunteers');
    const schemes = db.getCollection('schemes');
    const feedback = db.getCollection('feedback');

    const statusCounts = {
      pending: 0,
      assigned: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
    };

    const typeCounts = {};
    let emergencyCount = 0;

    requests.forEach((r) => {
      if (statusCounts[r.status] !== undefined) {
        statusCounts[r.status]++;
      }
      if (r.isEmergency || r.priority === 'emergency') {
        emergencyCount++;
      }
      typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
    });

    const verifiedVolunteers = volunteers.filter((v) => v.verified).length;
    const avgRating =
      feedback.length > 0
        ? Number((feedback.reduce((sum, f) => sum + (f.rating || 5), 0) / feedback.length).toFixed(1))
        : 4.9;

    return {
      totalRequests: requests.length,
      activeRequests: statusCounts.pending + statusCounts.assigned + statusCounts.in_progress,
      completedRequests: statusCounts.completed,
      pendingRequests: statusCounts.pending,
      emergencyRequests: emergencyCount,
      statusBreakdown: statusCounts,
      typeBreakdown: typeCounts,
      totalVolunteers: volunteers.length,
      verifiedVolunteers,
      totalSchemes: schemes.length,
      averageRating: avgRating,
      totalFeedbacks: feedback.length,
    };
  },
};
