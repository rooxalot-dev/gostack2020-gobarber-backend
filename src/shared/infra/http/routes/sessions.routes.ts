import { Router } from 'express';

import AuthenticateUserService from '../../../../modules/users/services/AuthenticateUserService';

const sessionRouter = Router();

sessionRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authenticateUserService = new AuthenticateUserService();
  const token = await authenticateUserService.execute({ email, password });

  return response.json(token);
});

export default sessionRouter;
