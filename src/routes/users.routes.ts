import { Router } from 'express';

import CreateUserService from '../services/Users/CreateUserService';

const userRouter = Router();

userRouter.post('/', async (request, response) => {
  const {
    name, email, password, confirmPassword,
  } = request.body;

  try {
    const createUserService = new CreateUserService();

    const user = await createUserService.execute({
      name, email, password, confirmPassword,
    });

    return response.json(user);
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

export default userRouter;
