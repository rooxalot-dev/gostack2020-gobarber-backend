import { Router, Request, Response } from 'express';
import { startOfHour, parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentRouter = Router();
const repository = new AppointmentsRepository();

appointmentRouter.post('/', (request: Request, response: Response) => {
  const { provider, date } = request.body;

  const parsedDate = startOfHour(parseISO(date));
  const hasAppointmentInSameDate = repository.findByProviderAndDate({ provider, date: parsedDate });

  if (hasAppointmentInSameDate !== null) {
    return response.status(400).json({
      message: "You can't create two appointments for the same provider in the same date!",
    });
  }

  const appointment = repository.create({ provider, date: parsedDate });
  return response.status(201).json(appointment);
});

appointmentRouter.get('/', (request: Request, response: Response) => {
  const appointments = repository.all();
  response.json(appointments);
});

export default appointmentRouter;
