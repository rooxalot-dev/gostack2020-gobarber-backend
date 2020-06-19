import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/providers/crypto/IHashProvider';
import ITokenProvider from '../providers/token/ITokenProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import { UserLoginToken } from '../dtos/UserLoginToken';

interface AuthenticateUserRequest {
  email: string;
  password: string;
}

interface UserSessionResponse {
  token: string;
  user: UserLoginToken;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository') private repository: IUsersRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
    @inject('TokenProvider') private tokenProvider: ITokenProvider,
  ) { }

  public async execute({ email, password }: AuthenticateUserRequest): Promise<UserSessionResponse> {
    const { APP_KEY } = process.env;

    const user = await this.repository.findByEmail(email);
    if (!user) {
      throw new AppError('User not found!', 401);
    }

    const passwordsMatch = await this.hashProvider.compareHash(password, user.passwordHash);
    if (!passwordsMatch) {
      throw new AppError("User's password is wrong!", 401);
    }

    const userToken: UserLoginToken = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const jwt = this.tokenProvider.sign(userToken, String(APP_KEY), {
      subject: user.id,
      expiresIn: '1d',
    });

    return { token: jwt, user: userToken } as UserSessionResponse;
  }
}

export default AuthenticateUserService;
