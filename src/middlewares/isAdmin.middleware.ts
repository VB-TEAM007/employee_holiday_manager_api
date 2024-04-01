import { tokenService } from "../services/token.service.js";

export async function isAdminMiddleware (req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];

  const [, accessToken] = authHeader.split(' ');

  const employeeData: any = tokenService.validateAccessToken(accessToken);

  if (employeeData.role === 'admin') {
    next();
  } else {
    res.status(401).json({ msg: 'Only employees with admin role can do it!' });
  }
}
