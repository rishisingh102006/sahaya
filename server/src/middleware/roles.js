import { errorResponse } from '../utils/apiResponse.js';
import { ROLE_ALIASES } from '../config/constants.js';

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Unauthorized access', 401);
    }

    const userRole = ROLE_ALIASES[req.user.role] || req.user.role;
    const normalizedAllowed = allowedRoles.map((r) => ROLE_ALIASES[r] || r);

    if (!normalizedAllowed.includes(userRole)) {
      return errorResponse(
        res,
        `Access denied. Role '${req.user.role}' is not permitted to perform this action.`,
        403
      );
    }

    next();
  };
};
