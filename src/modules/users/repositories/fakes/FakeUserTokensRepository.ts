import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import { uuid } from 'uuidv4';
import IUserTokensRepository from '../IUserTokensRepository';

export default class FakeUserTokensRepository implements IUserTokensRepository {
  private tokens: UserToken[] = [];

  public async generate(userID: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      userID,
      token: uuid(),
    });

    this.tokens.push(userToken);

    return userToken;
  }
}
