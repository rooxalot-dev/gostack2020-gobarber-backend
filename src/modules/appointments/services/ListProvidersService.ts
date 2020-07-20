import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import ICacheProvider from '@shared/providers/cache/ICacheProvider';

@injectable()
export default class ListProvidersService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('CacheProvider') private cacheProvider: ICacheProvider,
  ) {}

  public async execute(exceptUserId?: string): Promise<User[]> {
    const cacheKey = `list-providers:${exceptUserId}`;
    let providers: User[] = [];

    const cachedData = await this.cacheProvider.recover<User[]>(cacheKey);

    if (cachedData) {
      providers = cachedData;
    } else {
      providers = await this.usersRepository.listAllProviders(exceptUserId);
      await this.cacheProvider.save(cacheKey, providers);
    }

    return providers;
  }
}
