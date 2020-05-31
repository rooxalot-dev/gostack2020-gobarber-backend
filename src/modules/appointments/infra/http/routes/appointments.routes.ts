import { Router } from 'express';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentRouter.get('/', appointmentsController.index);
appointmentRouter.post('/', appointmentsController.create);

export default appointmentRouter;
