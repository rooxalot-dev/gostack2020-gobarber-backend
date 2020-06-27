import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      name, email, password, isProvider,
    } = request.body;

    const createUserService = container.resolve(CreateUserService);
    const user = await createUserService.execute({
      name, email, password, isProvider,
    });

    return response.json(user);
  }
}
