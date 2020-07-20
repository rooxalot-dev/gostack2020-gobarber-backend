import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/providers/crypto/IHashProvider';
import ICacheProvider from '@shared/providers/cache/ICacheProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  isProvider?: boolean
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository') private repository: IUsersRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
    @inject('CacheProvider') private cacheProvider: ICacheProvider,
  ) { }

  public async execute({
    name, email, password, isProvider,
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
      isProvider,
    });

    // Limpa o cache de listagem de prestadores para que sejam retornadas as novas informaçoes
    const cacheKey = 'list-providers';
    this.cacheProvider.invalidatePrefix(cacheKey);

    return newUser;
  }
}

export default CreateUserService;
