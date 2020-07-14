import { uuid } from 'uuidv4';

import FindMonthAppointmentsDTO from '@modules/appointments/dtos/FindMonthAppointmentsDTO';
import FindDayAppointmentsDTO from '../../dtos/FindDayAppointmentsDTO';
import IAppointmentsRepository from '../IAppointmentsRepository';
import Appointment from '../../infra/typeorm/entities/Appointment';
import CreateAppointmentDTO from '../../dtos/CreateAppointmentDTO';
import FindAppointmentDTO from '../../dtos/FindAppointmentDTO';


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

  findByProviderAndDate({ providerID, date }: FindAppointmentDTO): Promise<Appointment | undefined> {
    const appointment = this.appointments.find((app) => app.providerID === providerID && app.date.toISOString() === date.toISOString());

    return new Promise<Appointment>((resolve, reject) => {
      resolve(appointment);
    });
  }

  findMonthAppointments({ providerId, month, year }: FindMonthAppointmentsDTO): Promise<Appointment[]> {
    // Mês recebido não vem no formato javascript (Índice 0)
    const appointmentsInMonth = this.appointments.filter((app) => app.providerID === providerId
      && app.date.getMonth() === month - 1
      && app.date.getFullYear() === year);

    return new Promise((resolve, reject) => {
      resolve(appointmentsInMonth);
    });
  }

  findDayAppointments({
    providerId, month, year, day,
  }: FindDayAppointmentsDTO): Promise<Appointment[]> {
    // Mês recebido não vem no formato javascript (Índice 0)
    const appointmentsInMonth = this.appointments.filter((app) => app.providerID === providerId
      && app.date.getMonth() === month - 1
      && app.date.getFullYear() === year
      && app.date.getDate() === day);

    return new Promise((resolve, reject) => {
      resolve(appointmentsInMonth);
    });
  }
}
