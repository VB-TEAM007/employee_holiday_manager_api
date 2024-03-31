import { Request, Response } from "express"
import { requestService } from "../services/request.service.js";
import { ApiError } from "../exceptions/api.error.js";

const getAll = async(req: Request, res: Response) => {
  try {
    const requests = await requestService.getAll();

    res.json(requests);
  } catch (e) {
    throw ApiError.badRequest('bad request', e);
  }
}

const create = async(req: Request, res: Response) => {
  try {
    const request = await requestService.create(req, res);

    res.json(request);
  } catch (e) {
    throw ApiError.badRequest('bad request', e);
  }
}



export const requestController = {
  getAll,
  create
}