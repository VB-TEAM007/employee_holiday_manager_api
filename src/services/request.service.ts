import { Request, Response } from "express";
import requestModel from "../models/request.model.js"
import { ApiError } from "../exceptions/api.error.js";
import { employeeService } from "./employee.service.js";
import emplyoeeModel from "../models/emplyoee.model.js";

const getAll = async() => {
  try {
    const requests = await requestModel.find();
    return requests;
  } catch (e) {
    throw ApiError.badRequest('bad request', e);
  }
}

const create = async(req: Request, res: Response) => {
  const { employeeName, startDate: startDateInput, endDate: endDateInput } = req.body;

  const currentEmployee: any = await employeeService.findByName(employeeName);
  
  if (!currentEmployee) {
    throw ApiError.notFound();
  }

  const todayDate = new Date();
  const startDate = parseDate(startDateInput);
  const endDate = parseDate(endDateInput);

  if (startDate <= todayDate) {
    throw ApiError.notFound(); //
  }
  
  if (endDate <= startDate) {
    throw ApiError.notFound(); //
  }
  const totalDaysRequested = getTotalDaysRequested(startDate, endDate);
  
  if (totalDaysRequested > currentEmployee.remainingHolidays) {
    throw ApiError.notFound();
  }
  const updatedRemainingHolidays = currentEmployee.remainingHolidays - totalDaysRequested;

  try {
    await emplyoeeModel.findByIdAndUpdate(currentEmployee._id, { remainingHolidays: updatedRemainingHolidays });
  
    const currentRequest = await requestModel.create({ 
      employee: currentEmployee.id,
      startDate,
      endDate,
    });
    
    return currentRequest;
  } catch (e) {
    throw ApiError.badRequest('Cannot save request', e);
  }
}

const getTotalDaysRequested = (startDate: Date, endDate: Date) => {
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  const newEndDate = new Date(endDate);
  const newStartDate = new Date(startDate);

  return Math.ceil((newEndDate.getTime() - newStartDate.getTime()) / MILLISECONDS_PER_DAY);
}

const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('-');
  return new Date(`${year}-${month}-${day}`);
}


export const requestService = {
  getAll,
  create
}