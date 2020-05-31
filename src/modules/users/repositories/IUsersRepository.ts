import User from '../infra/typeorm/entities/User';
import CreateUserDTO from '../dtos/CreateUserDTO';

export default interface IAppointmentsRepository {
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;

  create(data: CreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
};
