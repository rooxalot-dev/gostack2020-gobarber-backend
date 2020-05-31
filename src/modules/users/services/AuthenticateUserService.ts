import { injectable, inject } from 'tsyringe';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

import { UserToken } from '../dtos/UserToken';

interface AuthenticateUserRequest {
  email: string;
  password: string;
}

interface UserSessionResponse {
  token: string;
  user: UserToken;
}

@injectable()
class AuthenticateUserService {
  constructor(@inject('UsersRepository') private repository: IUsersRepository) {

  }

  public async execute({ email, password }: AuthenticateUserRequest): Promise<UserSessionResponse> {
    const { APP_KEY } = process.env;

    const user = await this.repository.findByEmail(email);
    if (!user) {
      throw new AppError('User not found!', 401);
    }

    const passwordsMatch = await compare(password, user.passwordHash);
    if (!passwordsMatch) {
      throw new AppError("User's password is wrong!", 401);
    }

    const userToken: UserToken = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const jwt = sign(userToken, APP_KEY || '', {
      subject: user.id,
      expiresIn: '1d',
    });

    return { token: jwt, user: userToken } as UserSessionResponse;
  }
}

export default AuthenticateUserService;
