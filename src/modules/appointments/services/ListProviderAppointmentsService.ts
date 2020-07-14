import { inject, injectable } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface ListProviderAppointmentsRequest {
  providerId: string;
  year: number;
  month: number;
  day: number;
}

@injectable()
export default class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository') private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    providerId, year, month, day,
  }: ListProviderAppointmentsRequest)
  : Promise<Appointment[]> {
    const dayAppointments = await this.appointmentsRepository.findDayAppointments({
      providerId, year, month, day,
    });

    return dayAppointments;
  }
}
