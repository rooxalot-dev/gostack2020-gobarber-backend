import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { parseISO } from 'date-fns';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppointmentsRepository from '../../typeorm/repositories/AppointmentsRepository';

export default class AppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id: providerID } = request.user;

    const repository = container.resolve(AppointmentsRepository);
    const appointments = await repository.findByProviderID(providerID);

    return response.json(appointments);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { date, providerID } = request.body;
    const { id: userID } = request.user;

    const parsedDate = parseISO(date);

    const service = container.resolve(CreateAppointmentService);
    const appointment = await service.execute({ providerID, userID, date: parsedDate });

    return response.status(201).json(appointment);
  }
}
