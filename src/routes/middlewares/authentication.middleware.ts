import { Request, Response, NextFunction } from 'express';

import VerifyUserSessionService from '../../services/Users/VerifyUserSessionService';
import { UserToken } from '../../models/User';

const authenticationMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { authorization } = request.headers;
  let userToken = authorization || '';
  userToken = userToken.replace('Bearer', '').replace(' ', '');

  const verifyUserSessionService = new VerifyUserSessionService();
  const validToken = await verifyUserSessionService.execute(userToken);

  request.user = validToken as UserToken;

  return next();
};

export default authenticationMiddleware;
