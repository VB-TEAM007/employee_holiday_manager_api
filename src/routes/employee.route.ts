import express from "express";
import { employeeController } from "../controllers/employee.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { catchError } from "../middlewares/catchError.js";

export const employeeRouter = express.Router();

employeeRouter.get('/', authMiddleware, catchError(employeeController.getAll));
