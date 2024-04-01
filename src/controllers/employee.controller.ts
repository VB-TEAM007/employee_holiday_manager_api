import { Request, Response } from "express";
import { employeeService } from "../services/employee.service.js";
import { ApiError } from "../exceptions/api.error.js";
import { EmployeeDto } from "../dtos/employee.dto.js";

const getAll = async (req: Request, res: Response) => {
  try {
    const employees = await employeeService.getAll();

    const formattedData = employees.map(employee => new EmployeeDto(employee));
    
    res.send(formattedData);
  } catch (e) {
    throw ApiError.BadRequest('Bad request', e);
  }
}

export const employeeController = {
  getAll
}
