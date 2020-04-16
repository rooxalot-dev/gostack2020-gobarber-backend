import { isEqual } from 'date-fns';
import Appointment from '../models/Appointment';

export interface CreateAppointmentDTO {
  provider: string;
  date: Date;
}

export interface FindAppointmentDTO {
  provider: string;
  date: Date;
}

class AppointmentsRepository {
  private appointments: Array<Appointment>;

  constructor() {
    this.appointments = [];
  }

  public all(): Array<Appointment> {
    return this.appointments.slice();
  }

  public findByProviderAndDate({ provider, date }: FindAppointmentDTO): Appointment | null {
    const appointment = this.appointments.find((a) => a.provider === provider && isEqual(a.date, date));
    return appointment || null;
  }

  public create({ provider, date }: CreateAppointmentDTO): Appointment {
    const appointment = new Appointment(provider, date);
    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
