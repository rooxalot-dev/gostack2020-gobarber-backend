import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import { uuid } from 'uuidv4';
import IUserTokensRepository from '../IUserTokensRepository';

export default class FakeUserTokensRepository implements IUserTokensRepository {
  tokens: UserToken[] = [];

  public async generate(userID: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      userID,
      token: uuid(),
      consumed: false,
    });

    this.tokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.tokens.find((t) => t.token === token);

    return userToken;
  }

  public async consumeToken(token: string): Promise<void> {
    const tokenIndex = this.tokens.findIndex((t) => t.token === token);

    if (tokenIndex >= 0) {
      this.tokens[tokenIndex].consumed = true;
    }
  }
}
