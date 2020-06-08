import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/providers/crypto/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository') private repository: IUsersRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) { }

  public async execute({
    name, email, password,
  }: CreateUserRequest): Promise<User> {
    const hasUserEmail = await this.repository.findByEmail(email);

    if (hasUserEmail) {
      throw new AppError('User email alredy exists!');
    }

    const passwordHash = await this.hashProvider.createHash(password);
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
