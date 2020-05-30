import { Router } from 'express';
import multer from 'multer';

import uploadOptions from '../../../../config/upload';

import authenticationMiddleware from '../../middlewares/authentication.middleware';

import CreateUserService from '../../../../modules/users/services/CreateUserService';
import UpdateUserAvatarService from '../../../../modules/users/services/UpdateUserAvatarService';

const userRouter = Router();
const upload = multer(uploadOptions);

userRouter.post('/', async (request, response) => {
  const {
    name, email, password,
  } = request.body;

  const createUserService = new CreateUserService();
  const user = await createUserService.execute({
    name, email, password,
  });

  return response.json(user);
});

userRouter.patch('/avatar', authenticationMiddleware, upload.single('avatar'), async (request, response) => {
  const { id } = request.user;
  const { filename } = request.file;

  const updateUserAvatarService = new UpdateUserAvatarService();
  const user = await updateUserAvatarService.execute({ userID: id, avatarPath: filename });

  return response.json(user);
});

export default userRouter;
