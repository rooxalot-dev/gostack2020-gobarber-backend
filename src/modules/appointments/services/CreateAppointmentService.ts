import { injectable, inject } from 'tsyringe';
import { startOfHour, isBefore } from 'date-fns';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
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

    const appointment = this.repository.create({ providerID, userID, date: appointmentDate });

    return appointment;
  }
}

export default CreateAppointmentService;
