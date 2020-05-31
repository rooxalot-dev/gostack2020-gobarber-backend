import { Router } from 'express';

import sessionRouter from '@modules/users/infra/http/routes/sessions.routes';
import appointmentRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import userRouter from '@modules/users/infra/http/routes/users.routes';

import authenticationMiddleware from '@modules/users/infra/http/middlewares/authentication.middleware';

const routes = Router();

routes.use('/sessions', sessionRouter);

routes.use('/users', userRouter);
routes.use('/appointments', authenticationMiddleware, appointmentRouter);

export default routes;
