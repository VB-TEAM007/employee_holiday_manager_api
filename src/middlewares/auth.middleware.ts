import { ApiError } from "../exceptions/api.error.js";
import { tokenService } from "../services/token.service.js";

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw ApiError.unauthorized();
    }

    const [, accessToken] = authHeader.split(' ');

    if (!accessToken) {
      throw ApiError.unauthorized();
    }

    const employeeData = tokenService.validateAccessToken(accessToken);

    if (!employeeData) {
      throw ApiError.unauthorized();
    }
  
    req.employee = employeeData;
    next();

  } catch (e) {
    throw ApiError.badRequest('Bad request', e);
  }
}
