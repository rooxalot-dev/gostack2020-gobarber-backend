import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ShowUserProfileService from '@modules/users/services/ShowUserProfileService';
import UpdateUserInfoService from '@modules/users/services/UpdateUserInfoService';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const showUserProfileService = container.resolve(ShowUserProfileService);
    const userProfile = await showUserProfileService.execute(id);

    return response.status(200).json(userProfile);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const {
      name, email, oldPassword, password, confirmPassword,
    } = request.body;

    const updateUserInfoService = container.resolve(UpdateUserInfoService);

    const newUser = await updateUserInfoService.execute({
      id, name, email, oldPassword, password, confirmPassword,
    });

    const transformedUser = classToClass(newUser);

    return response.status(200).json(transformedUser);
  }
}
