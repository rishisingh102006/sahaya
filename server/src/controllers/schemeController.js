import { schemeService } from '../services/schemeService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const schemeController = {
  async getAll(req, res, next) {
    try {
      const schemes = await schemeService.getSchemes(req.query);
      return successResponse(res, schemes, 'Schemes retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const scheme = await schemeService.getSchemeById(req.params.id);
      return successResponse(res, scheme, 'Scheme retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async checkEligibility(req, res, next) {
    try {
      const result = await schemeService.checkEligibility(req.body);
      return successResponse(res, result, 'Eligibility evaluation completed');
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { name, shortDescription } = req.body;
      if (!name || !shortDescription) {
        return errorResponse(res, 'Scheme name and shortDescription are required', 400);
      }
      const newScheme = await schemeService.createScheme(req.body);
      return successResponse(res, newScheme, 'Scheme created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await schemeService.updateScheme(req.params.id, req.body);
      return successResponse(res, updated, 'Scheme updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await schemeService.deleteScheme(req.params.id);
      return successResponse(res, null, 'Scheme deleted successfully');
    } catch (err) {
      next(err);
    }
  },
};
