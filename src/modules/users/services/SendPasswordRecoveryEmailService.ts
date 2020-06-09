import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/providers/mail/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface SendPasswordRecoveryEmailRequest {
  email: string;
}

@injectable()
export default class SendPasswordRecoveryEmailService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('MailProvider') private mailProvider: IMailProvider,
  ) {}

  public async execute({ email }: SendPasswordRecoveryEmailRequest) {
    const existingUser = await this.usersRepository.findByEmail(email);

    if (!existingUser) {
      throw new AppError('User does not exist!');
    }

    const isMailSend = await this.mailProvider.sendMail({
      to: [email],
      subject: 'GoBarber - Recuperação de Senha',
      body: 'E-mail de recuperação de senha',
    });

    return isMailSend;
  }
}
