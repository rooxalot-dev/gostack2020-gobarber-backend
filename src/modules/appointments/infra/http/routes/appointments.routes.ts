import { Router, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

const appointmentRouter = Router();

appointmentRouter.post('/', async (request: Request, response: Response) => {
  const { date } = request.body;
  const { id: providerID } = request.user;

  const parsedDate = parseISO(date);

  const service = new CreateAppointmentService();
  const appointment = await service.execute({ providerID, date: parsedDate });

  return response.status(201).json(appointment);
});

appointmentRouter.get('/', async (request: Request, response: Response) => {
  const { id: providerID } = request.user;

  const repository = getCustomRepository(AppointmentsRepository);
  const appointments = await repository.find({
    where: { providerID },
  });

  return response.json(appointments);
});

export default appointmentRouter;
