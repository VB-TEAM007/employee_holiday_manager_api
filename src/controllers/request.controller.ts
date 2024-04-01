import { Request, Response } from "express"
import { requestService } from "../services/request.service.js";
import { ApiError } from "../exceptions/api.error.js";
import { RequestDto } from "../dtos/request.dto.js";
import { RequestUpdateDto } from "../dtos/request.update.dto.js";

const getAll = async(req: Request, res: Response) => {
  try {
    const requests = await requestService.getAll();

    const formattedData = requests.map(request => new RequestDto(request));

    res.json(formattedData);
  } catch (e) {
    throw ApiError.BadRequest('Cannot get all requests', e);
  }
}

const create = async(req: Request, res: Response) => {
  try {
    const request = await requestService.create(req, res);
    const requestDto = new RequestDto(request);

    res.json(requestDto);
  } catch (e) {
    throw ApiError.BadRequest('Cannot create request', e);
  }
}

const remove = async(req: Request, res: Response) => {
  const { employeeName } = req.body;

  try {
    const result = await requestService.remove(employeeName);

    res.json({message: result});
  } catch (e) {
    throw ApiError.BadRequest('Cannot remove request', e);
  }
}

const update = async(req: Request, res: Response) => {
  const employeeName: string = req.params.employeeName;
  const { startDate, endDate } = req.body;
  const updateDto = new RequestUpdateDto(startDate, endDate);


  try {
    const result = await requestService.update(employeeName, updateDto);

    const formattedData = new RequestDto(result);

    res.json(formattedData);
  } catch (e) {
    throw ApiError.BadRequest('Cannot update request', e);
  }
}

const reject = async(req: Request, res: Response) => {
  const employeeName: string = req.params.employeeName;
  const { status } = req.body;

  try {
    const result = await requestService.reject(employeeName);

    const formattedData = new RequestDto(result);

    res.json(formattedData);
  } catch (e) {
    throw ApiError.BadRequest('Cannot reject request', e);
  }
}

const approve = async(req: Request, res: Response) => {
  const employeeName: string = req.params.employeeName;

  try {
    const result = await requestService.approve(employeeName);

    const formattedData = new RequestDto(result);

    res.json(formattedData);
  } catch (e) {
    throw ApiError.BadRequest('Cannot approve request', e);
  }
}

export const requestController = {
  getAll,
  create,
  remove,
  update,
  reject,
  approve
}
