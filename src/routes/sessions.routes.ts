import { Router } from 'express';

import AuthenticateUserService from '../services/Users/AuthenticateUserService';

const sessionRouter = Router();

sessionRouter.post('/', async (request, response) => {
  const { email, password } = request.body;
  const authenticateUserService = new AuthenticateUserService();

  try {
    const token = await authenticateUserService.execute({
      email, password,
    });

    return response.json({
      token,
    });
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

export default sessionRouter;
