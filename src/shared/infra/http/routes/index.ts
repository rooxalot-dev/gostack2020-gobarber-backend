import { Router } from 'express';

import authenticationMiddleware from '../../middlewares/authentication.middleware';

import sessionRouter from './sessions.routes';
import appointmentRouter from './appointments.routes';
import userRouter from './users.routes';

const routes = Router();

routes.use('/sessions', sessionRouter);

routes.use('/users', userRouter);
routes.use('/appointments', authenticationMiddleware, appointmentRouter);

export default routes;
