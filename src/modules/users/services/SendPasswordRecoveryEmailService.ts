import fs from 'fs';
import { resolve } from 'path';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/providers/mail/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface SendPasswordRecoveryEmailRequest {
  email: string;
}

@injectable()
export default class SendPasswordRecoveryEmailService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('UserTokensRepository') private userTokensRepository: IUserTokensRepository,
    @inject('MailProvider') private mailProvider: IMailProvider,
  ) {}

  public async execute({ email }: SendPasswordRecoveryEmailRequest) {
    const existingUser = await this.usersRepository.findByEmail(email);

    if (!existingUser) {
      throw new AppError('User does not exist!');
    }

    const userToken = await this.userTokensRepository.generate(existingUser.id);

    const forgotPasswordTemplatePath = resolve(__dirname, '..', 'templates', 'forgot_user_password.hbs');
    const forgotPasswordTemplate = await fs.promises.readFile(forgotPasswordTemplatePath, { encoding: 'utf-8' });

    const isMailSend = await this.mailProvider.sendMailTemplate({
      to: [{ name: existingUser.name, email: existingUser.email }],
      subject: 'GoBarber - Recuperação de Senha',
      template: {
        template: forgotPasswordTemplate,
        variables: {
          name: existingUser.name,
          token: userToken.token,
        },
      },
    });

    return isMailSend;
  }
}
