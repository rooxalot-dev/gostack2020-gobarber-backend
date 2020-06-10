import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import { Repository, getRepository } from 'typeorm';
import { uuid } from 'uuidv4';
import UserToken from '../entities/UserToken';

export default class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository<UserToken>(UserToken);
  }

  async generate(userID: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      userID,
    });

    userToken.token = uuid();

    const newUserToken = await this.ormRepository.save(userToken);

    return newUserToken;
  }

  async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });

    return userToken;
  }
}
