import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IStorageProvider from '@shared/providers/storage/IStorageProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface UpdateUserAvatarRequest {
  userID: string;
  avatarPath: string;
 }

 @injectable()
class UpdateUserAvatarService {
   constructor(
     @inject('UsersRepository') private repository: IUsersRepository,
     @inject('StorageProvider') private storageProvider: IStorageProvider,
   ) {}

   public async execute({ userID, avatarPath }: UpdateUserAvatarRequest): Promise<User> {
     const user = await this.repository.findById(userID);

     if (!user) {
       throw new AppError('User not found!');
     }

     if (user.avatar) {
       await this.storageProvider.remove(user.avatar);
       await this.storageProvider.store(avatarPath);
     }

     user.avatar = avatarPath;

     await this.repository.save(user);

     delete user.passwordHash;
     return user;
   }
 }

export default UpdateUserAvatarService;
