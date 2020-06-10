import { inject, injectable } from 'tsyringe';
import { differenceInHours } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/providers/crypto/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('UserTokensRepository') private userTokensRepository: IUserTokensRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, newPassword }: ResetPasswordRequest) {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('Token not found!');
    }

    const hoursDifference = differenceInHours(new Date(), userToken.createdAt);

    if (hoursDifference >= 2) {
      throw new AppError('The token is alredy expired!');
    }

    if (userToken.consumed) {
      throw new AppError('This token has alredy been consumed!');
    }

    const user = await this.usersRepository.findById(userToken.userID);

    if (!user) {
      throw new AppError('User not found!');
    }

    const newHashPassword = await this.hashProvider.createHash(newPassword);
    user.passwordHash = newHashPassword;

    await this.usersRepository.save(user);
    await this.userTokensRepository.consumeToken(token);
  }
}
