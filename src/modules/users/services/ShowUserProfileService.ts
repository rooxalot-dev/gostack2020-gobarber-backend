import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

 @injectable()
class ShowUserProfileService {
   constructor(
     @inject('UsersRepository') private repository: IUsersRepository,
   ) {}

   public async execute(userID: string): Promise<User> {
     const user = await this.repository.findById(userID);

     if (!user) {
       throw new AppError('User does not exist!');
     }

     delete user.passwordHash;

     return user;
   }
 }

export default ShowUserProfileService;
