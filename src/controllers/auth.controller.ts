import { ApiError } from "../exceptions/api.error.js";
import { employeeService } from "../services/employee.service.js"
import { Request, Response } from "express";

const register = async (req: Request, res: Response) => {
  const { name, password, remainingHolidays, isAdmin } = req.body;

  try {
    const employeeDto = await employeeService.register(name, password, remainingHolidays, isAdmin);

    res.json(employeeDto);
  } catch (e) {
    throw ApiError.badRequest('Bad request', e);
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body;
  
    const employeeData = await employeeService.login(name, password);
    
    res.cookie(
      'refreshToken',
      employeeData.refreshToken, {
        maxAge: 30 * 1000,
        httpOnly: true
      }
    );
    
    res.json(employeeData);
  } catch (e) {
    throw ApiError.badRequest('Bad request', e);
  }
}

const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    await employeeService.logout(refreshToken);
    
    res.clearCookie('refreshToken');
    return res.status(200).send('Logout successful');
  } catch (e) {
    throw ApiError.badRequest('Bad request', e);
  }
}

const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    const employeeData = await employeeService.refresh(refreshToken);
    res.cookie('refreshToken', employeeData.refreshToken);
    return res.json(employeeData);
  } catch (e) {
    throw ApiError.badRequest('Refresh token is expired', e);
  }
}

export const authController = {
  register, login, logout, refresh
}
