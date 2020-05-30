import { Repository, getRepository } from 'typeorm';
import { verify } from 'jsonwebtoken';

import User, { UserToken } from '../infra/typeorm/entities/User';
import AppError from '../../../shared/errors/AppError';

class VerifyUserSessionService {
  userRepository: Repository<User>;

  constructor() {
    this.userRepository = getRepository(User);
  }

  public async execute(token: string | undefined) {
    const { APP_KEY } = process.env;

    if (!token || token === '') {
      throw new AppError('Token not informed!', 401);
    }

    const userToken: UserToken = <UserToken>verify(token, APP_KEY || '');

    if (!userToken) {
      throw new AppError('Invalid token informed!', 401);
    }

    const user = this.userRepository.findOne({
      where: { id: userToken.id, email: userToken.email },
    });

    if (!user) {
      throw new AppError('User not found', 401);
    }

    return userToken;
  }
}

export default VerifyUserSessionService;
