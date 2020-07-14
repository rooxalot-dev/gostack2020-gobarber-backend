import { inject, injectable } from 'tsyringe';
import { getHours } from 'date-fns';
import { getDateUTC } from '@shared/helpers/DateHelper';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface ListProviderDayAvailabilityRequest {
  providerId: string;
  year: number;
  month: number;
  day: number;
}

type ListProviderDayAvailabilityResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository') private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    providerId, year, month, day,
  }: ListProviderDayAvailabilityRequest)
  : Promise<ListProviderDayAvailabilityResponse> {
    const dayAppointments = await this.appointmentsRepository.findDayAppointments({
      providerId, year, month, day,
    });

    const startHour = 8;
    const arrayHours = Array.from(Array(10).keys()); // 10 agendamentos ao dia

    const dayAvailability = arrayHours
      .map((hour) => hour + startHour)
      .map((hour) => {
        const existingAppointment = dayAppointments.find((appointment) => getHours(getDateUTC(appointment.date)) === hour);

        return { hour, available: !existingAppointment };
      });

    return dayAvailability;
  }
}
