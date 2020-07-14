import { inject, injectable } from 'tsyringe';
import { getHours, isBefore } from 'date-fns';
import { getDateUTC } from '@shared/helpers/DateHelper';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { convertToTimeZone } from 'date-fns-timezone';

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

    const currentDate = new Date(Date.now());

    const startHour = 8;
    const arrayHours = Array.from(Array(10).keys()); // 10 agendamentos ao dia

    const dayAvailability = arrayHours
      .map((hour) => hour + startHour)
      .map((hour) => {
        let availableHour = true;
        const hourDate = convertToTimeZone(new Date(year, month - 1, day, hour, 0, 0, 0), { timeZone: 'America/Sao_Paulo' });

        if (isBefore(hourDate, currentDate)) {
          availableHour = false;
        } else {
          const existingAppointment = dayAppointments.find((appointment) => getHours(getDateUTC(appointment.date)) === hour);
          availableHour = !existingAppointment;
        }

        return { hour, available: availableHour };
      });

    return dayAvailability;
  }
}
