import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

@injectable()
export default class ListProvidersService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute(exceptUserId?: string): Promise<User[]> {
    const providers = await this.usersRepository.listAllProviders(exceptUserId);

    return providers;
  }
}
