import { Router, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import CreateAppointmentService from '../services/Appointments/CreateAppointmentService';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentRouter = Router();

appointmentRouter.post('/', async (request: Request, response: Response) => {
  const service = new CreateAppointmentService();
  const { provider, date } = request.body;

  try {
    const parsedDate = parseISO(date);
    const appointment = await service.execute({ provider, date: parsedDate });

    return response.status(201).json(appointment);
  } catch (error) {
    return response.status(400).json({
      message: error.message,
    });
  }
});

appointmentRouter.get('/', async (request: Request, response: Response) => {
  const repository = getCustomRepository(AppointmentsRepository);

  const appointments = await repository.find();

  return response.json(appointments);
});

export default appointmentRouter;
