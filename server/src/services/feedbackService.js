import { db } from '../database/db.js';
import { generateId } from '../utils/idGenerator.js';
import { notificationService } from './notificationService.js';

export const feedbackService = {
  async submitFeedback(requestId, feedbackData, user = null) {
    const request = db.findById('requests', requestId);
    if (!request) {
      const error = new Error('Assistance request not found');
      error.statusCode = 404;
      throw error;
    }

    const { rating, comment } = feedbackData;
    const submittedAt = new Date().toISOString();

    const feedbackEntry = {
      id: generateId('fb'),
      requestId,
      seniorId: request.seniorId,
      seniorName: request.seniorName,
      volunteerId: request.assignedVolunteerId || null,
      volunteerName: request.assignedVolunteerName || null,
      rating: Number(rating),
      comment: comment || '',
      submittedAt,
    };

    // Update the request with feedback
    await db.updateById('requests', requestId, {
      feedback: {
        rating: Number(rating),
        comment: comment || '',
        submittedAt,
      },
    });

    // Store in feedback collection
    await db.insert('feedback', feedbackEntry);

    // If volunteer was assigned, update volunteer rating
    if (request.assignedVolunteerId) {
      const volunteer = db.findById('volunteers', request.assignedVolunteerId);
      if (volunteer) {
        const allVolunteerFeedback = db.find(
          'feedback',
          (f) => f.volunteerId === volunteer.id
        );
        const sum = allVolunteerFeedback.reduce((acc, f) => acc + (f.rating || 5), 0);
        const newRating = Number((sum / allVolunteerFeedback.length).toFixed(1));

        await db.updateById('volunteers', volunteer.id, {
          rating: newRating,
        });

        // Notify volunteer
        await notificationService.createNotification({
          roleTarget: 'volunteer',
          title: `New Rating Received: ${rating} Stars`,
          message: `Senior ${request.seniorName} reviewed your assistance: "${comment || 'Great support!'}"`,
          relatedRequestId: requestId,
          type: 'info',
        });
      }
    }

    return feedbackEntry;
  },

  async getFeedback(filters = {}) {
    let feedbacks = db.getCollection('feedback');

    if (filters.volunteerId) {
      feedbacks = feedbacks.filter((f) => f.volunteerId === filters.volunteerId);
    }
    if (filters.requestId) {
      feedbacks = feedbacks.filter((f) => f.requestId === filters.requestId);
    }

    return feedbacks;
  },
};
