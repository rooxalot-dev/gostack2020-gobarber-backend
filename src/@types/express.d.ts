import User, { UserToken } from '../models/User';

declare namespace Express {
  export interface Request {
    user: UserToken
  }
}
