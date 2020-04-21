import { Router } from 'express';
import multer from 'multer';

import uploadOptions from '../config/upload';

import authenticationMiddleware from './middlewares/authentication.middleware';

import CreateUserService from '../services/Users/CreateUserService';
import UpdateUserAvatarService from '../services/Users/UpdateUserAvatarService';

const userRouter = Router();
const upload = multer(uploadOptions);

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

userRouter.patch('/avatar', authenticationMiddleware, upload.single('avatar'), async (request, response) => {
  const { id } = request.user;
  const { filename } = request.file;

  try {
    const updateUserAvatarService = new UpdateUserAvatarService();

    const user = await updateUserAvatarService.execute({ userID: id, avatarPath: filename });

    return response.json(user);
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

export default userRouter;
