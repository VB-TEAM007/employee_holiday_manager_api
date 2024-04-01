import emplyoeeModel from "../models/emplyoee.model.js";
import { tokenService } from "./token.service.js";
import { EmployeeDto } from "../dtos/employee.dto.js";
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { ApiError } from "../exceptions/api.error.js";

async function register(name: string, password: string, remainingHolidays = 20, isAdmin = false) {
  const candidate = await emplyoeeModel.findOne({ name });
  
  if (candidate) {
    throw new Error (`Employee: ${name} already exist!`);
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const role = isAdmin ? 'admin' : 'employee';

  const employee = await emplyoeeModel.create({ name, password: hashPassword, remainingHolidays, role });

  const employeeDto = new EmployeeDto(employee);

  return employeeDto;
}

async function login(name: string, password: string) {
  const candidate = await emplyoeeModel.findOne({ name });

  if (!candidate) {
    throw new Error (`Employee: ${name} is not exist!`);
  }

  const isPasswordValid = await bcrypt.compare(password, candidate.password);
  
  if (!isPasswordValid) {
    throw new Error ('Password is wrong');
  }

  const employeeDto = new EmployeeDto(candidate);

  const tokens = tokenService.generateTokens({...employeeDto});

  tokenService.saveToken(employeeDto.id, tokens.refreshToken);

  return {
    ...tokens,
    employee: employeeDto
  };
}

async function logout(refreshToken: string) {
  await tokenService.removeToken(refreshToken);
}

async function getAll() {
  const employees = await emplyoeeModel.find();
  return employees;
}

async function refresh(refreshToken: string) {
  if (!refreshToken) {
    throw ApiError.Unauthorized();
  }

  const employeeData: any = tokenService.validateRefreshToken(refreshToken);
  const tokenFromDb = await tokenService.findToken(refreshToken);

  if (!employeeData || !tokenFromDb) {
    throw ApiError.Unauthorized();
  }

  const employee = await emplyoeeModel.findById(employeeData.id);
  const employeeDto = new EmployeeDto(employee);
  const tokens = tokenService.generateTokens({...employeeDto});

  await tokenService.saveToken(employeeDto.id, tokens.refreshToken);

  return {
    ...tokens,
    employee: employeeDto
  };
}

const findByName = async(name: string) => {
  return await emplyoeeModel.findOne({ name });
}


export const employeeService = {
  register,
  login,
  logout,
  getAll,
  refresh,
  findByName
}
