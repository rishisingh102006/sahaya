import { notificationService } from '../services/notificationService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const notificationController = {
  async getAll(req, res, next) {
    try {
      const roleTarget = req.query.role || (req.user ? req.user.role : null);
      const userId = req.user ? req.user.id : null;
      const notifications = await notificationService.getNotifications(roleTarget, userId);
      return successResponse(res, notifications, 'Notifications retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async markAsRead(req, res, next) {
    try {
      const updated = await notificationService.markAsRead(req.params.id);
      return successResponse(res, updated, 'Notification marked as read');
    } catch (err) {
      next(err);
    }
  },

  async markAllAsRead(req, res, next) {
    try {
      const roleTarget = req.body.role || (req.user ? req.user.role : null);
      const updated = await notificationService.markAllAsRead(roleTarget);
      return successResponse(res, updated, 'All notifications marked as read');
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { title, message } = req.body;
      if (!title || !message) {
        return errorResponse(res, 'Title and message are required', 400);
      }
      const newNotif = await notificationService.createNotification(req.body);
      return successResponse(res, newNotif, 'Notification created', 201);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await notificationService.deleteNotification(req.params.id);
      return successResponse(res, null, 'Notification removed successfully');
    } catch (err) {
      next(err);
    }
  },
};
