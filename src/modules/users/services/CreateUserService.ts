import { injectable, inject } from 'tsyringe';
import { hash } from 'bcrypt';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(@inject('UsersRepository') private repository: IUsersRepository) {
  }

  public async execute({
    name, email, password,
  }: CreateUserRequest): Promise<User> {
    const hasUserEmail = await this.repository.findByEmail(email);

    if (hasUserEmail) {
      throw new AppError('User email alredy exists!');
    }

    const passwordHash = await hash(password, 10);
    const newUser = await this.repository.create({
      name,
      email,
      passwordHash,
    });

    delete newUser.passwordHash;

    return newUser;
  }
}

export default CreateUserService;
