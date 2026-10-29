import { authService } from '../services/authService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const authController = {
  async register(req, res, next) {
    try {
      const { email, name, role } = req.body;
      if (!email || !name) {
        return errorResponse(res, 'Email and name are required', 400);
      }
      const result = await authService.register(req.body);
      return successResponse(res, result, 'Registration successful', 201);
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password, role } = req.body;
      if (!email || !password) {
        return errorResponse(res, 'Email and password are required', 400);
      }
      const result = await authService.login(email, password, role);
      return successResponse(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.user.id);
      return successResponse(res, user, 'User profile retrieved');
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const updated = await authService.updateProfile(req.user.id, req.body);
      return successResponse(res, updated, 'Profile updated successfully');
    } catch (err) {
      next(err);
    }
  },
};
