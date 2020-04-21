import { Repository, getRepository } from 'typeorm';
import { join } from 'path';
import fs from 'fs';

import uploadOptions from '../../config/upload';
import User from '../../models/User';


interface UpdateUserAvatarRequest {
  userID: string;
  avatarPath: string;
 }

class UpdateUserAvatarService {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  public async execute({ userID, avatarPath }: UpdateUserAvatarRequest): Promise<User> {
    const user = await this.repository.findOne(userID);

    if (!user) {
      throw new Error('User not found!');
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

    delete user.passwordHash;
    user.avatar = avatarPath;

    const { affected } = await this.repository.update(userID, { avatar: avatarPath });

    if (affected === 0) {
      throw new Error("User's avatar has not been updated");
    }

    return user;
  }
}

export default UpdateUserAvatarService;
