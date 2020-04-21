import { Repository, getRepository } from 'typeorm';
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
