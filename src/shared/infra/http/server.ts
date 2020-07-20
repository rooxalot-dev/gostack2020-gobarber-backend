import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import 'express-async-errors';
import '@config/index';
import '@shared/infra/typeorm';
import '@shared/container';

import uploadOptions from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';

const PORT = process.env.PORT || 3333;
const ENV = process.env.NODE_ENV || 'development';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadOptions.storageDirectory));
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

app.listen(PORT, () => console.log(`App listening on port ${PORT} in ${ENV}`));
