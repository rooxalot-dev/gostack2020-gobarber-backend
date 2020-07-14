import Appointment from '../infra/typeorm/entities/Appointment';
import FindAppointmentDTO from '../dtos/FindAppointmentDTO';
import CreateAppointmentDTO from '../dtos/CreateAppointmentDTO';
import FindMonthAppointmentsDTO from '../dtos/FindMonthAppointmentsDTO';
import FindDayAppointmentsDTO from '../dtos/FindDayAppointmentsDTO';

export default interface IAppointmentsRepository {
  create(data: CreateAppointmentDTO): Promise<Appointment>;
  findByProviderAndDate(data: FindAppointmentDTO): Promise<Appointment | undefined>;
  findMonthAppointments(data: FindMonthAppointmentsDTO): Promise<Appointment[]>;
  findDayAppointments(data: FindDayAppointmentsDTO): Promise<Appointment[]>;
};
