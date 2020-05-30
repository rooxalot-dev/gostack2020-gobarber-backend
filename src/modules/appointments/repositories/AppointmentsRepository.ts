import { EntityRepository, Repository } from 'typeorm';

import Appointment from '../models/Appointment';

export interface CreateAppointmentDTO {
  provider: string;
  date: Date;
}

export interface FindAppointmentDTO {
  providerID: string;
  date: Date;
}

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  public async findByProviderAndDate({ providerID, date }: FindAppointmentDTO): Promise<Appointment | null> {
    const appointment = await this.findOne({
      where: {
        providerID,
        date,
      },
    });

    return appointment || null;
  }
}

export default AppointmentsRepository;
