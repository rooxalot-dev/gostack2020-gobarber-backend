import Appointment from '../infra/typeorm/entities/Appointment';
import FindAppointmentDTO from '../dtos/FindAppountmentDTO';
import CreateAppointmentDTO from '../dtos/CreateAppointmentDTO';

export default interface IAppointmentsRepository {
  create(data: CreateAppointmentDTO): Promise<Appointment>;
  findByProviderAndDate(data: FindAppointmentDTO): Promise<Appointment | undefined>;
}
