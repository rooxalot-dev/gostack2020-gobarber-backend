import { Repository, getRepository } from 'typeorm';
import { verify } from 'jsonwebtoken';

import User, { UserToken } from '../../models/User';

class VerifyUserSessionService {
  userRepository: Repository<User>;

  constructor() {
    this.userRepository = getRepository(User);
  }

  public async execute(token: string | undefined) {
    const { APP_KEY } = process.env;

    if (!token || token === '') {
      throw new Error('Token not informed!');
    }

    const userToken: UserToken = <UserToken>verify(token, APP_KEY || '');

    if (!userToken) {
      throw new Error('Invalid token informed!');
    }

    const user = this.userRepository.findOne({
      where: { id: userToken.id, email: userToken.email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return userToken;
  }
}

export default VerifyUserSessionService;
