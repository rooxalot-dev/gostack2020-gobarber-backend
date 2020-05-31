import { injectable, inject } from 'tsyringe';
import { join } from 'path';
import fs from 'fs';

import uploadOptions from '@config/upload';
import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface UpdateUserAvatarRequest {
  userID: string;
  avatarPath: string;
 }

 @injectable()
class UpdateUserAvatarService {
   constructor(@inject('UsersRepository') private repository: IUsersRepository) {}

   public async execute({ userID, avatarPath }: UpdateUserAvatarRequest): Promise<User> {
     const user = await this.repository.findById(userID);

     if (!user) {
       throw new AppError('User not found!');
     }

     if (user.avatar) {
       const previousUserAvatarFile = join(uploadOptions.tempDirectory, user.avatar);
       try {
         const fileStats = await fs.promises.stat(previousUserAvatarFile);
         if (fileStats) {
           await fs.promises.unlink(previousUserAvatarFile);
         }
       } catch { const bypass = true; }
     }

     user.avatar = avatarPath;

     await this.repository.save(user);

     delete user.passwordHash;
     return user;
   }
 }

export default UpdateUserAvatarService;
