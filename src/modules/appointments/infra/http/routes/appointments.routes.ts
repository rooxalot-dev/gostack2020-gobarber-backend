import { Router, Request, Response } from 'express';
import { container } from 'tsyringe';
import { parseISO } from 'date-fns';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppointmentsRepository from '../../typeorm/repositories/AppointmentsRepository';

const appointmentRouter = Router();

appointmentRouter.post('/', async (request: Request, response: Response) => {
  const { date } = request.body;
  const { id: providerID } = request.user;

  const parsedDate = parseISO(date);

  const service = container.resolve(CreateAppointmentService);
  const appointment = await service.execute({ providerID, date: parsedDate });

  return response.status(201).json(appointment);
});

appointmentRouter.get('/', async (request: Request, response: Response) => {
  const { id: providerID } = request.user;

  const repository = container.resolve(AppointmentsRepository);
  const appointments = await repository.findByProviderID(providerID);

  return response.json(appointments);
});

export default appointmentRouter;
