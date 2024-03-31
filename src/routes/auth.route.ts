import express from "express";
import { authController } from "../controllers/auth.controller.js";
import { catchError } from "../middlewares/catchError.js";

export const authRouter = express.Router();

authRouter.post('/registration', catchError(authController.register));
authRouter.post('/login', catchError(authController.login));
authRouter.post('/logout', catchError(authController.logout));
authRouter.get('/refresh', catchError(authController.refresh));
