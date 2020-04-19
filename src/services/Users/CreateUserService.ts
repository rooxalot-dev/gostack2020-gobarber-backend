import { hash, genSalt } from 'bcrypt';
import { getRepository, Repository } from 'typeorm';

import User from '../../models/User';

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

class CreateUserService {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  public async execute({
    name, email, password, confirmPassword,
  }: CreateUserRequest): Promise<User> {
    const hasUserEmail = await this.repository.findOne({
      where: { email },
    });

    if (hasUserEmail) {
      throw new Error('User email alredy exists!');
    }

    if (password !== confirmPassword) {
      throw new Error('Password and confirm password does not match!');
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
