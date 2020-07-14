import { inject, injectable } from 'tsyringe';
import { getDaysInMonth, isBefore } from 'date-fns';
import { convertToTimeZone } from 'date-fns-timezone';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getDateUTC } from '@shared/helpers/DateHelper';

interface ListProviderMonthAvailabilityRequest {
  providerId: string;
  year: number;
  month: number;
}

type ListProviderMonthAvailabilityResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository') private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ providerId, year, month }: ListProviderMonthAvailabilityRequest)
  : Promise<ListProviderMonthAvailabilityResponse> {
    const monthAppointments = await this.appointmentsRepository.findMonthAppointments({
      providerId, year, month,
    });
    const currentDate = new Date(Date.now());
    const monthDays = getDaysInMonth(month - 1); // Meses em javascript possuem índice 0;
    const arrayMonthDays = Array.from(Array(monthDays).keys());

    const monthAvailability = arrayMonthDays
      .map((monthDay) => monthDay + 1)
      .map((monthDay) => {
        let availableDay = true;
        const monthDayDate = convertToTimeZone(new Date(year, month - 1, monthDay), { timeZone: 'America/Sao_Paulo' });

        if (isBefore(monthDayDate, currentDate)) {
          availableDay = false;
        } else {
          const existingAppointments = monthAppointments
            .filter((appointment) => appointment.date.getDate() === monthDay);

          availableDay = existingAppointments.length < 10;
        }

        return { day: monthDay, available: availableDay };
      });

    return monthAvailability;
  }
}
