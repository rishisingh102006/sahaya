import { feedbackService } from '../services/feedbackService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const feedbackController = {
  async submit(req, res, next) {
    try {
      const { requestId, rating, comment } = req.body;
      if (!requestId || rating === undefined) {
        return errorResponse(res, 'requestId and rating are required', 400);
      }
      if (Number(rating) < 1 || Number(rating) > 5) {
        return errorResponse(res, 'Rating must be between 1 and 5', 400);
      }
      const result = await feedbackService.submitFeedback(requestId, req.body, req.user);
      return successResponse(res, result, 'Feedback submitted successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const feedbacks = await feedbackService.getFeedback(req.query);
      return successResponse(res, feedbacks, 'Feedbacks retrieved successfully');
    } catch (err) {
      next(err);
    }
  },
};
