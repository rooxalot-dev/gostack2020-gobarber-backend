import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../../models/Appointment';
import AppointmentsRepository from '../../repositories/AppointmentsRepository';

interface CreateAppointmentRequest {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  private repository: AppointmentsRepository;

  constructor() {
    this.repository = getCustomRepository(AppointmentsRepository);
  }

  public async execute({ provider, date }: CreateAppointmentRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    const hasAppointmentInSameDate = await this.repository.findByProviderAndDate({ provider, date: appointmentDate });

    if (hasAppointmentInSameDate !== null) {
      throw new Error("You can't create two appointments for the same provider in the same date!");
    }

    const appointment = this.repository.create({ provider, date: appointmentDate });
    const newAppointment = await this.repository.save(appointment);

    return newAppointment;
  }
}

export default CreateAppointmentService;
