import express from "express";
import { catchError } from "../middlewares/catchError.js";
import { requestController } from "../controllers/request.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const requestRouter = express.Router();

requestRouter.get('/', authMiddleware, catchError(requestController.getAll));
requestRouter.post('/add-request', authMiddleware, catchError(requestController.create));
requestRouter.delete('/delete-request', authMiddleware, catchError(requestController.remove));
requestRouter.post('/approve-request/:employeeName', authMiddleware, catchError(requestController.approve));
requestRouter.post('/reject-request/:employeeName', authMiddleware, catchError(requestController.reject));
requestRouter.patch('/update-request/:employeeName', authMiddleware, catchError(requestController.update));
