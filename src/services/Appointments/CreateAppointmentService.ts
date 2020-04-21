import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../../models/Appointment';
import AppointmentsRepository from '../../repositories/AppointmentsRepository';
import AppError from '../../errors/AppError';

interface CreateAppointmentRequest {
  providerID: string;
  date: Date;
}

class CreateAppointmentService {
  private repository: AppointmentsRepository;

  constructor() {
    this.repository = getCustomRepository(AppointmentsRepository);
  }

  public async execute({ providerID, date }: CreateAppointmentRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    const hasAppointmentInSameDate = await this.repository.findByProviderAndDate({ providerID, date: appointmentDate });

    if (hasAppointmentInSameDate !== null) {
      throw new AppError("You can't create two appointments for the same provider in the same date!");
    }

    const appointment = this.repository.create({ providerID, date: appointmentDate });
    const newAppointment = await this.repository.save(appointment);

    return newAppointment;
  }
}

export default CreateAppointmentService;
