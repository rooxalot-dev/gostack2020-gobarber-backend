import { inject, injectable } from 'tsyringe';
import { getDaysInMonth } from 'date-fns';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

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

    const monthDays = getDaysInMonth(month - 1); // Meses em javascript possuem índice 0;
    const arrayMonthDays = Array.from(Array(monthDays).keys());

    const monthAvailability = arrayMonthDays
      .map((monthDay) => monthDay + 1)
      .map((monthDay) => {
        const existingAppointment = monthAppointments.find((appointment) => appointment.date.getDate() === monthDay);

        return { day: monthDay, available: !existingAppointment };
      });

    return monthAvailability;
  }
}
