import { volunteerService } from '../services/volunteerService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const volunteerController = {
  async getAll(req, res, next) {
    try {
      const volunteers = await volunteerService.getVolunteers(req.query);
      return successResponse(res, volunteers, 'Volunteers retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const volunteer = await volunteerService.getVolunteerById(req.params.id);
      return successResponse(res, volunteer, 'Volunteer details retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        return errorResponse(res, 'Volunteer name is required', 400);
      }
      const newVolunteer = await volunteerService.createVolunteer(req.body);
      return successResponse(res, newVolunteer, 'Volunteer created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await volunteerService.updateVolunteer(req.params.id, req.body);
      return successResponse(res, updated, 'Volunteer updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async verify(req, res, next) {
    try {
      const updated = await volunteerService.verifyVolunteer(req.params.id);
      return successResponse(res, updated, 'Volunteer verified successfully');
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await volunteerService.deleteVolunteer(req.params.id);
      return successResponse(res, null, 'Volunteer removed successfully');
    } catch (err) {
      next(err);
    }
  },
};
