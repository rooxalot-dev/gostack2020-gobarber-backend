import UserToken from '../infra/typeorm/entities/UserToken';

export default interface IUserTokensRepository {
  generate(userID: string): Promise<UserToken>;
};
