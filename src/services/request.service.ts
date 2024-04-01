import { Request, Response } from "express";
import requestModel from "../models/request.model.js"
import { ApiError } from "../exceptions/api.error.js";
import { employeeService } from "./employee.service.js";
import emplyoeeModel from "../models/emplyoee.model.js";
import { RequestUpdateDto } from "../dtos/request.update.dto.js";

const getAll = async() => {
  try {
    const requests = await requestModel.find().populate('employee');;
    return requests;
  } catch (e) {
    throw ApiError.BadRequest('bad request', e);
  }
}

const create = async(req: Request, res: Response) => {
  const { employeeName, startDate: startDateInput, endDate: endDateInput } = req.body;

  const currentEmployee: any = await employeeService.findByName(employeeName);
  
  if (!currentEmployee) {
    throw ApiError.NotFound();
  }

  const hasRequest = await requestModel.findOne({ employee: currentEmployee });

  if (hasRequest) {
    console.log(hasRequest);
    throw ApiError.BadRequest('Employee already has request');
  }

  const todayDate = new Date();
  const startDate = parseDate(startDateInput);
  const endDate = parseDate(endDateInput);

  if (startDate <= todayDate) {
    throw ApiError.BadRequest('Start date should be in future');
  }
  
  if (endDate <= startDate) {
    throw ApiError.BadRequest('End date should be after start date');
  }

  const totalDaysRequested = getTotalDaysRequested(startDate, endDate);
  
  if (totalDaysRequested > currentEmployee.remainingHolidays) {
    throw ApiError.NotFound();
  }

  const updatedRemainingHolidays = currentEmployee.remainingHolidays - totalDaysRequested;

  try {
    await emplyoeeModel.findByIdAndUpdate(currentEmployee._id, { remainingHolidays: updatedRemainingHolidays });
  
    const currentRequest = await requestModel.create({ 
      employee: currentEmployee,
      startDate,
      endDate,
    });
    
    return currentRequest;
  } catch (e) {
    throw ApiError.BadRequest('Cannot save request', e);
  }
}

const getTotalDaysRequested = (startDate: Date, endDate: Date) => {
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  const newEndDate = new Date(endDate);
  const newStartDate = new Date(startDate);

  return Math.ceil((newEndDate.getTime() - newStartDate.getTime()) / MILLISECONDS_PER_DAY);
}

const parseDate = (dateString: string) => {
  const [day, month, year] = dateString.split('-');
  return new Date(`${year}-${month}-${day}`);
}

const findByEmployee = async (employee) => {
  try {
    const currentRequest = await requestModel.findOne({ employee: employee._id })
    
    return currentRequest;
  } catch (e) {
    throw ApiError.BadRequest(`Cannot find employee`, e);
  }
}

const remove = async (employeeName: string) => {
  const currentEmployee = await employeeService.findByName(employeeName);

  if (!currentEmployee) {
    throw ApiError.NotFound();
  }

  const currentRequest = await findByEmployee(currentEmployee);

  try {
    await requestModel.deleteOne({_id: currentRequest._id});

    return `Request ${currentEmployee.name}'s request was successfully deleted!`;
  } catch (e) {
    throw ApiError.BadRequest('Cannot delete request', e);
  }
}

const update = async (employeeName: string, updateDto: RequestUpdateDto) => {
  const currentEmployee = await employeeService.findByName(employeeName);

  if (!currentEmployee) {
    throw ApiError.NotFound();
  }

  try {
    const filter = { employee: currentEmployee._id };
    const update = { startDate: updateDto.startDate, endDate: updateDto.endDate };

    const updatedRequest = await requestModel.findOneAndUpdate(filter, update);

    return updatedRequest;
  } catch (e) {
    throw ApiError.BadRequest('Cannot update request', e);
  }
}

const reject = async (employeeName: string) => {
  const currentEmployee = await employeeService.findByName(employeeName);

  if (!currentEmployee) {
    throw ApiError.NotFound();
  }

  try {
    const filter = { employee: currentEmployee._id };
    const update = { status: 'rejected' };
    const options = { new: true };

    const updatedRequest = await requestModel.findOneAndUpdate(filter, update, options);

    return updatedRequest;
  } catch (e) {
    throw ApiError.BadRequest('Cannot reject request', e);
  }
}

const approve = async (employeeName: string) => {
  const currentEmployee = await employeeService.findByName(employeeName);

  if (!currentEmployee) {
    throw ApiError.NotFound();
  }

  try {
    const filter = { employee: currentEmployee._id };
    const update = { status: 'approved' };
    const options = { new: true };

    const updatedRequest = await requestModel.findOneAndUpdate(filter, update, options);

    return updatedRequest;
  } catch (e) {
    throw ApiError.BadRequest('Cannot approve request', e);
  }
}


export const requestService = {
  getAll,
  create,
  remove,
  update,
  reject,
  approve
}
