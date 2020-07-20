import { injectable, inject } from 'tsyringe';
import { startOfHour, isBefore, format } from 'date-fns';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/providers/cache/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface CreateAppointmentRequest {
  providerID: string;
  userID: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository') private repository: IAppointmentsRepository,
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('NotificationsRepository') private notificationsRepository: INotificationsRepository,
    @inject('CacheProvider') private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ providerID, userID, date }: CreateAppointmentRequest): Promise<Appointment> {
    const currentDate = new Date(Date.now());

    const existingUser = await this.usersRepository.findById(userID);

    if (!existingUser) {
      throw new AppError("The user's you're trying to create a appointment does not exist!");
    }

    if (providerID === userID) {
      throw new AppError("You cant't create a appointment with yourself!");
    }

    if (isBefore(date, currentDate)) {
      throw new AppError("You can't create a appointment for a past date!");
    }

    const appointmentDate = startOfHour(date);
    const hasAppointmentInSameDate = await this.repository.findByProviderAndDate({ providerID, date: appointmentDate });

    if (hasAppointmentInSameDate) {
      throw new AppError("You can't create two appointments for the same provider in the same date!");
    }

    // Cria uma notificação no banco de dados para que seja posteriormente processada
    const formattedDate = format(appointmentDate, "dd/MM/yyyy 'ás' HH:mm'h'");
    await this.notificationsRepository.create({ recipientId: providerID, content: `Olá! Novo agendamento marcado dia ${formattedDate}` });

    const appointment = this.repository.create({ providerID, userID, date: appointmentDate });

    // Limpa o cache para que retorne os agendamentos atualizados
    const cacheKey = `list-provider-appointments:${providerID}:${format(date, 'yyyy-MM-dd')}`;
    this.cacheProvider.invalidate(cacheKey);

    return appointment;
  }
}

export default CreateAppointmentService;
