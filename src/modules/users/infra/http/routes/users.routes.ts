import { Router } from 'express';
import multer from 'multer';

import authenticationMiddleware from '@modules/users/infra/http/middlewares/authentication.middleware';
import uploadOptions from '@config/upload';
import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';


const userRouter = Router();
const upload = multer(uploadOptions);

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

userRouter.post('/', usersController.create);
userRouter.patch('/avatar', authenticationMiddleware, upload.single('avatar'), userAvatarController.update);

export default userRouter;
