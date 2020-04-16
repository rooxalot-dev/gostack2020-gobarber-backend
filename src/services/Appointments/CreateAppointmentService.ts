import { startOfHour } from 'date-fns';

import Appointment from '../../models/Appointment';
import AppointmentsRepository from '../../repositories/AppointmentsRepository';

interface CreateAppointmentRequest {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  private repository: AppointmentsRepository;

  constructor(appointmentRepository: AppointmentsRepository) {
    this.repository = appointmentRepository;
  }

  public execute({ provider, date }: CreateAppointmentRequest): Appointment {
    const appointmentDate = startOfHour(date);
    const hasAppointmentInSameDate = this.repository.findByProviderAndDate({ provider, date: appointmentDate });

    if (hasAppointmentInSameDate !== null) {
      throw new Error("You can't create two appointments for the same provider in the same date!");
    }

    const appointment = this.repository.create({ provider, date: appointmentDate });
    return appointment;
  }
}

export default CreateAppointmentService;
