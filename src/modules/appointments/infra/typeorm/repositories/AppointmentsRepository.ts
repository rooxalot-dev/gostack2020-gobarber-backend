import {
  EntityRepository, Repository, getRepository, Raw,
} from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import FindAppointmentDTO from '@modules/appointments/dtos/FindAppointmentDTO';
import FindMonthAppointmentsDTO from '@modules/appointments/dtos/FindMonthAppointmentsDTO';
import CreateAppointmentDTO from '@modules/appointments/dtos/CreateAppointmentDTO';
import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByProviderID(providerID: string): Promise<Appointment | undefined> {
    const appointment = this.ormRepository.findOne({
      where: {
        providerID,
      },
    });

    return appointment;
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

  public async findMonthAppointments({ providerId: providerID, month, year }: FindMonthAppointmentsDTO): Promise<Appointment[]> {
    const appointments = await this.ormRepository.find({
      where: {
        providerID,
        date: Raw((alias) => `
          EXTRACT(YEAR FROM ${alias}) = ${year} AND
          EXTRACT(MONTH FROM ${alias}) = ${month}
        `),
      },
    });

    return appointments;
  }

  create(data: CreateAppointmentDTO): Promise<Appointment> {
    const { providerID, date } = data;

    const appointment = this.ormRepository.create({ providerID, date });
    const newAppointment = this.ormRepository.save(appointment);

    return newAppointment;
  }
}

export default AppointmentsRepository;
