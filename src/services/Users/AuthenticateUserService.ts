import { Repository, getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';

import User, { UserToken } from '../../models/User';

interface AuthenticateUserRequest {
  email: string;
  password: string;
}

class AuthenticateUserService {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  public async execute({ email, password }: AuthenticateUserRequest): Promise<string> {
    const { APP_KEY } = process.env;

    const user = await this.repository.findOne({
      where: { email },
    });
    if (!user) {
      throw new Error('User not found!');
    }

    const passwordsMatch = await compare(password, user.passwordHash);
    if (!passwordsMatch) {
      throw new Error("User's password is wrong!");
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

    return jwt;
  }
}

export default AuthenticateUserService;
