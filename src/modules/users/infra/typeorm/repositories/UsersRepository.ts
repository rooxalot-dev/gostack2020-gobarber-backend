import { EntityRepository, Repository, getRepository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import CreateUserDTO from '@modules/users/dtos/CreateUser';
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

  create(data: CreateUserDTO): Promise<User> {
    const { name, email, passwordHash } = data;

    const createdUser = this.ormRepository.create({
      name, email, passwordHash,
    });

    const user = this.ormRepository.save(createdUser);
    return user;
  }
}

export default UsersRepository;
