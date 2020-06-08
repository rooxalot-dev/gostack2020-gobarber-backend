import { uuid } from 'uuidv4';

import IAppointmentsRepository from '../IAppointmentsRepository';
import Appointment from '../../infra/typeorm/entities/Appointment';
import CreateAppointmentDTO from '../../dtos/CreateAppointmentDTO';
import FindAppountmentDTO from '../../dtos/FindAppountmentDTO';


export default class FakeAppointmentsRepository implements IAppointmentsRepository {
  constructor() {}

  private appointments: Appointment[] = [];

  create({ date, providerID }: CreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    appointment.id = uuid();
    appointment.date = date;
    appointment.providerID = providerID;
    appointment.createdAt = new Date();
    appointment.updatedAt = new Date();

    this.appointments.push(appointment);

    return new Promise<Appointment>((resolve, reject) => {
      resolve(appointment);
    });
  }

  findByProviderAndDate({ providerID, date }: FindAppountmentDTO): Promise<Appointment | undefined> {
    const appointment = this.appointments.find((app) => app.providerID === providerID && app.date.toISOString() === date.toISOString());

    return new Promise<Appointment>((resolve, reject) => {
      resolve(appointment);
    });
  }
}
