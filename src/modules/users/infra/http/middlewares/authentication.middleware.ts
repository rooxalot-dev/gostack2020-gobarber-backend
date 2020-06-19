import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import VerifyUserSessionService from '@modules/users/services/VerifyUserSessionService';
import { UserLoginToken } from '@modules/users/dtos/UserLoginToken';


const authenticationMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { authorization } = request.headers;
  let userToken = authorization || '';
  userToken = userToken.replace('Bearer', '').replace(' ', '');

  const verifyUserSessionService = container.resolve(VerifyUserSessionService);
  const validToken = await verifyUserSessionService.execute(userToken);

  request.user = validToken as UserLoginToken;

  return next();
};

export default authenticationMiddleware;
