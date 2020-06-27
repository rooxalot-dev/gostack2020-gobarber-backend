import { Repository, getRepository, Not } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import CreateUserDTO from '@modules/users/dtos/CreateUserDTO';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  findByEmail(email: string): Promise<User | undefined> {
    const user = this.ormRepository.findOne({
      where: { email },
    });

    return user;
  }

  findById(id: string): Promise<User | undefined> {
    const user = this.ormRepository.findOne(id);
    return user;
  }

  async listAllProviders(exceptUserId?: string | undefined): Promise<User[]> {
    let providers: User[];

    if (exceptUserId) {
      providers = await this.ormRepository.find({
        where: {
          id: Not(exceptUserId),
          isProvider: true,
        },
      });
    } else {
      providers = await this.ormRepository.find({
        where: { isProvider: true },
      });
    }

    providers.forEach((p) => delete p.passwordHash);

    return providers;
  }

  create(data: CreateUserDTO): Promise<User> {
    const {
      name, email, passwordHash, isProvider,
    } = data;

    const createdUser = this.ormRepository.create({
      name, email, passwordHash, isProvider,
    });

    const user = this.ormRepository.save(createdUser);
    return user;
  }

  save(data: User): Promise<User> {
    const user = this.ormRepository.save(data);
    return user;
  }
}

export default UsersRepository;
