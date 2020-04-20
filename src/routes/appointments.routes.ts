import { Router, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import CreateAppointmentService from '../services/Appointments/CreateAppointmentService';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentRouter = Router();

appointmentRouter.post('/', async (request: Request, response: Response) => {
  const service = new CreateAppointmentService();

  const { date } = request.body;
  const { id: providerID } = request.user;

  try {
    const parsedDate = parseISO(date);
    const appointment = await service.execute({ providerID, date: parsedDate });

    return response.status(201).json(appointment);
  } catch (error) {
    return response.status(400).json({ message: error.message  });
  }
});

appointmentRouter.get('/', async (request: Request, response: Response) => {
  const repository = getCustomRepository(AppointmentsRepository);

  const { id: providerID } = request.user;

  try {
    const appointments = await repository.find({
      where: { providerID },
    });

    return response.json(appointments);
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

export default appointmentRouter;
