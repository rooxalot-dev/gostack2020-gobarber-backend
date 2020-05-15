import './config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';

import './database';
import routes from './routes';
import uploadOptions from './config/upload';

import AppError from './errors/AppError';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadOptions.tempDirectory));
app.use(routes);

app.use((error: any, request: Request, response: Response, next: NextFunction) => {
  if (error) {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({ message: error.message });
    }

    return response.status(500).json({ message: error.message });
  }

  return next();
});

app.listen(3333, () => console.log(' App listening on port 3333'));
