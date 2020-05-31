import { hash } from 'bcrypt';
import { getRepository, Repository } from 'typeorm';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  public async execute({
    name, email, password,
  }: CreateUserRequest): Promise<User> {
    const hasUserEmail = await this.repository.findOne({
      where: { email },
    });

    if (hasUserEmail) {
      throw new AppError('User email alredy exists!');
    }

    const passwordHash = await hash(password, 10);
    const user = this.repository.create({
      name,
      email,
      passwordHash,
    });
    const newUser = await this.repository.save(user);

    delete newUser.passwordHash;

    return newUser;
  }
}

export default CreateUserService;
