import { injectable, inject } from 'tsyringe';
import { startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';


interface CreateAppointmentRequest {
  providerID: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository') private repository: IAppointmentsRepository,
  ) {}

  public async execute({ providerID, date }: CreateAppointmentRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    const hasAppointmentInSameDate = await this.repository.findByProviderAndDate({ providerID, date: appointmentDate });

    if (hasAppointmentInSameDate) {
      throw new AppError("You can't create two appointments for the same provider in the same date!");
    }

    const appointment = this.repository.create({ providerID, date: appointmentDate });

    return appointment;
  }
}

export default CreateAppointmentService;
