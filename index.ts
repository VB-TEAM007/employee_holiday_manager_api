import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { publicHolidaysRouter } from './src/routes/publicHolidays.route.js';
import 'dotenv/config'
import { authRouter } from './src/routes/auth.route.js';
import { employeeRouter } from './src/routes/employee.route.js';
import { errorMiddleware } from './src/middlewares/error.middleware.js';
import { requestRouter } from './src/routes/request.route.js';

const app = express();
const PORT = process.env.PORT || 5001

mongoose.connect(process.env.DB_URL)
  .then(() => console.log('MongoDB connected.'))
  .catch(error => console.log(error));
  
app.use(express.json());
app.use(cookieParser())
app.use(cors())
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

app.use('/', authRouter);
app.use('/public-holidays', publicHolidaysRouter);
app.use('/employees', employeeRouter);
app.use('/requests', requestRouter);
app.use(errorMiddleware);

app.get('*', (req, res)  => {
  res.json({message: 'invalid endpoint'});
});

app.listen(PORT, () => console.log(`server started! http://localhost:${PORT}`));
