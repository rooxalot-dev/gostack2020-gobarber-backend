import { Router, Request, Response } from 'express';
import { parseISO } from 'date-fns';
import CreateAppointmentService from '../services/Appointments/CreateAppointmentService';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentRouter = Router();

const repository = new AppointmentsRepository();
const service = new CreateAppointmentService(repository);

appointmentRouter.post('/', (request: Request, response: Response) => {
  const { provider, date } = request.body;

  try {
    const parsedDate = parseISO(date);
    const appointment = service.execute({ provider, date: parsedDate });

    return response.status(201).json(appointment);
  } catch (error) {
    return response.status(400).json({
      message: error.message,
    });
  }
});

appointmentRouter.get('/', (request: Request, response: Response) => {
  const appointments = repository.all();
  response.json(appointments);
});

export default appointmentRouter;
