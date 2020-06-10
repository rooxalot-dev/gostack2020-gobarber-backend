import nodemailer, { Transporter } from 'nodemailer';

import IMailProvider, { SendMailRequest } from '../IMailProvider';

export default class EtherealMailProvider implements IMailProvider {
  private mailClient: Transporter;

  constructor() {
    nodemailer.createTestAccount().then((account) => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.mailClient = transporter;
    });
  }

  async sendMail({ to, subject, body }: SendMailRequest): Promise<boolean> {
    const message = await this.mailClient.sendMail({
      from: { name: 'Equipe GoBarber', address: 'equipe@gobarber.com.br' },
      to,
      subject,
      text: body,
    });


    console.log('\x1b[36m%s\x1b[0m', 'Message sent: ', message.messageId);
    console.log('\x1b[36m%s\x1b[0m', 'Preview URL: ', nodemailer.getTestMessageUrl(message));

    return true;
  }
}
