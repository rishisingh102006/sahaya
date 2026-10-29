import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/apiResponse.js';
import { db } from '../database/db.js';
import { ROLE_ALIASES } from '../config/constants.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Authentication token missing or invalid', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return errorResponse(res, 'Token has expired or is invalid', 401);
  }

  const user = db.findById('users', decoded.id);
  if (!user) {
    return errorResponse(res, 'User no longer exists', 401);
  }

  // Normalize role
  const normalizedRole = ROLE_ALIASES[user.role] || user.role;
  req.user = {
    ...user,
    role: normalizedRole,
  };

  next();
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (decoded) {
      const user = db.findById('users', decoded.id);
      if (user) {
        req.user = {
          ...user,
          role: ROLE_ALIASES[user.role] || user.role,
        };
      }
    }
  }
  next();
};
