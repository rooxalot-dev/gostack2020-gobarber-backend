import { inject, injectable } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/providers/cache/ICacheProvider';
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
    @inject('CacheProvider') private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    providerId, year, month, day,
  }: ListProviderAppointmentsRequest)
  : Promise<Appointment[]> {
    const cacheKey = `list-provider-appointments:${providerId}:${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    let dayAppointments: Appointment[];

    const cachedData = await this.cacheProvider.recover<Appointment[]>(cacheKey);

    if (cachedData) {
      dayAppointments = cachedData;
    } else {
      dayAppointments = await this.appointmentsRepository.findDayAppointments({
        providerId, year, month, day,
      });
      await this.cacheProvider.save(cacheKey, dayAppointments);
    }

    return dayAppointments;
  }
}
