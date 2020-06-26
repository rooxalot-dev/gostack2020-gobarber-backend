import { Router } from 'express';

import sessionRouter from '@modules/users/infra/http/routes/sessions.routes';
import userRouter from '@modules/users/infra/http/routes/users.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import appointmentRouter from '@modules/appointments/infra/http/routes/appointments.routes';

import authenticationMiddleware from '@modules/users/infra/http/middlewares/authentication.middleware';

const routes = Router();

routes.use('/sessions', sessionRouter);

routes.use('/users', userRouter);
routes.use('/profile', authenticationMiddleware, profileRouter);
routes.use('/users/password', passwordRouter);
routes.use('/appointments', authenticationMiddleware, appointmentRouter);

export default routes;
