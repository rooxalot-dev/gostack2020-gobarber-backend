import { Request, Response, NextFunction } from 'express';

import VerifyUserSessionService from '../../services/Users/VerifyUserSessionService';
import { UserToken } from '../../models/User';

const authenticationMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { authorization } = request.headers;
  let userToken = authorization as string;
  userToken = userToken
    .replace('Bearer', '')
    .replace(' ', '');

  try {
    const verifyUserSessionService = new VerifyUserSessionService();
    const validToken = await verifyUserSessionService.execute(userToken);

    if (!validToken) {
      return response.status(400).json({
        message: 'Invalid Token',
      });
    }

    request.user = validToken as UserToken;

    return next();
  } catch (error) {
    return response.status(400).json({
      message: error.message,
    });
  }
};

export default authenticationMiddleware;
