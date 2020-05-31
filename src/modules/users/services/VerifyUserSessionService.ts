import { injectable, inject } from 'tsyringe';
import { verify } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import { UserToken } from '../dtos/UserToken';

@injectable()
class VerifyUserSessionService {
  constructor(
    @inject('UsersRepository') private userRepository: IUsersRepository,
  ) {}

  public async execute(token: string | undefined) {
    const { APP_KEY } = process.env;

    if (!token || token === '') {
      throw new AppError('Token not informed!', 401);
    }

    const userToken: UserToken = <UserToken>verify(token, APP_KEY || '');

    if (!userToken) {
      throw new AppError('Invalid token informed!', 401);
    }

    const user = await this.userRepository.findByEmail(userToken.email);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    return userToken;
  }
}

export default VerifyUserSessionService;
