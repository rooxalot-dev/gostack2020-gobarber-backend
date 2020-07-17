import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

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
    const transformedUser = classToClass(user);

    return response.json(transformedUser);
  }
}
