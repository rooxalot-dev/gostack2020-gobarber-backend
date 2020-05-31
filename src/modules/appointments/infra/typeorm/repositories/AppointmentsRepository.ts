import { EntityRepository, Repository, getRepository } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import FindAppointmentDTO from '@modules/appointments/dtos/FindAppountmentDTO';
import CreateAppointmentDTO from '@modules/appointments/dtos/CreateAppointmentDTO';
import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByProviderAndDate({ providerID, date }: FindAppointmentDTO):
    Promise<Appointment | undefined> {
    const appointment = await this.ormRepository.findOne({
      where: {
        providerID,
        date,
      },
    });

    return appointment;
  }

  create(data: CreateAppointmentDTO): Promise<Appointment> {
    const { providerID, date } = data;

    const appointment = this.ormRepository.create({ providerID, date });
    const newAppointment = this.ormRepository.save(appointment);

    return newAppointment;
  }
}

export default AppointmentsRepository;
