import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/providers/crypto/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface UpdateUserRequest {
  id: string;
  oldPassword?: string;

  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@injectable()
export default class UpdateUserInfoService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({
    id, oldPassword, name, email, password, confirmPassword,
  }: UpdateUserRequest): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('The user does not exist!');
    }

    const userExistingEmail = await this.usersRepository.findByEmail(email);
    if (!!userExistingEmail && userExistingEmail.id !== id) {
      throw new AppError('The informed email alredy exists. Try a different one!');
    }

    // Validações para troca de senha do usuário
    let isValidPasswordUpdate = false;

    if (!!password && !!confirmPassword) {
      if (!oldPassword) {
        throw new AppError('The old password should be informed!');
      }

      const invalidHash = await this.hashProvider.compareHash(user.passwordHash, oldPassword);
      if (!invalidHash) {
        throw new AppError('The password and it\'s confirmation does not match!');
      }

      if (password !== confirmPassword) {
        throw new AppError('The password and it\'s confirmation does not match!');
      }

      isValidPasswordUpdate = true;
    }

    Object.assign(user, {
      name,
      email,
      passwordHash: !isValidPasswordUpdate
        ? user.passwordHash
        : await this.hashProvider.createHash(password),
    });

    const updatedUser = await this.usersRepository.save(user);

    return updatedUser;
  }
}
