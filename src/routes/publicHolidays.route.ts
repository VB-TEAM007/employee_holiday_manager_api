import express from 'express';
import { publicHolidaysController } from '../controllers/publicHolidays.cotroller.js';
import { catchError } from '../middlewares/catchError.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const publicHolidaysRouter = express.Router();

publicHolidaysRouter.get('/:year/:countryCode', authMiddleware, catchError(publicHolidaysController.getByYearAndCountry));
