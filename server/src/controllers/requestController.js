import { requestService } from '../services/requestService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const requestController = {
  async getAll(req, res, next) {
    try {
      const requests = await requestService.getRequests(req.query, req.user);
      return successResponse(res, requests, 'Requests retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const request = await requestService.getRequestById(req.params.id);
      return successResponse(res, request, 'Request retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { title, description } = req.body;
      if (!title || !description) {
        return errorResponse(res, 'Title and description are required', 400);
      }
      const newRequest = await requestService.createRequest(req.body, req.user);
      return successResponse(res, newRequest, 'Assistance request created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await requestService.updateRequest(req.params.id, req.body);
      return successResponse(res, updated, 'Request updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async assignVolunteer(req, res, next) {
    try {
      const { volunteerId } = req.body;
      if (!volunteerId) {
        return errorResponse(res, 'volunteerId is required', 400);
      }
      const updated = await requestService.assignVolunteer(req.params.id, volunteerId, req.user);
      return successResponse(res, updated, 'Volunteer assigned successfully');
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { status, note } = req.body;
      if (!status) {
        return errorResponse(res, 'Status is required', 400);
      }
      const updated = await requestService.updateStatus(req.params.id, status, note, req.user);
      return successResponse(res, updated, `Status updated to ${status}`);
    } catch (err) {
      next(err);
    }
  },

  async addNote(req, res, next) {
    try {
      const { text } = req.body;
      if (!text) {
        return errorResponse(res, 'Note text is required', 400);
      }
      const author = req.user ? req.user.name : (req.body.author || 'Volunteer');
      const updated = await requestService.addNote(req.params.id, text, author);
      return successResponse(res, updated, 'Note added successfully');
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await requestService.deleteRequest(req.params.id);
      return successResponse(res, null, 'Request deleted successfully');
    } catch (err) {
      next(err);
    }
  },
};
