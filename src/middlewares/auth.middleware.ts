import { ApiError } from "../exceptions/api.error.js";
import { tokenService } from "../services/token.service.js";

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw ApiError.Unauthorized();
    }

    const [, accessToken] = authHeader.split(' ');

    if (!accessToken) {
      throw ApiError.Unauthorized();
    }

    const employeeData = tokenService.validateAccessToken(accessToken);

    if (!employeeData) {
      throw ApiError.Unauthorized();
    }
  
    req.employee = employeeData;
    next();

  } catch (e) {
    throw ApiError.BadRequest('Cannot authorize user', e);
  }
}
