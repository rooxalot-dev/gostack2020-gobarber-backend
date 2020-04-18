import { EntityRepository, Repository } from 'typeorm';

import Appointment from '../models/Appointment';

export interface CreateAppointmentDTO {
  provider: string;
  date: Date;
}

export interface FindAppointmentDTO {
  provider: string;
  date: Date;
}

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  public async findByProviderAndDate({ provider, date }: FindAppointmentDTO): Promise<Appointment | null> {
    const appointment = await this.findOne({
      where: {
        provider,
        date,
      },
    });

    return appointment || null;
  }
}

export default AppointmentsRepository;
