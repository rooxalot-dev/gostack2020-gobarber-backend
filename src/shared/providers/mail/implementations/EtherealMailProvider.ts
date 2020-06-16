import nodemailer, { Transporter } from 'nodemailer';
import { injectable, inject } from 'tsyringe';

import IMailTemplateProvider from '@shared/providers/mailTemplate/IMailTemplateProvider';
import IMailProvider, { SendMailDTO, SendMailTemplateDTO } from '../IMailProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private mailClient: Transporter;

  constructor(
    @inject('MailTemplateProvider') private mailTemplateProvider: IMailTemplateProvider,
  ) {
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

  async sendMail({
    from, to, subject, body,
  }: SendMailDTO): Promise<boolean> {
    const fromContact = from && { name: from.name, address: from.email };
    const contacts = to.map((contact) => ({ name: contact.name, address: contact.email }));

    const message = await this.mailClient.sendMail({
      from: fromContact || { name: 'Equipe GoBarber', address: 'equipe@gobarber.com.br' },
      to: contacts,
      subject,
      text: body,
    });


    console.log('\x1b[36m%s\x1b[0m', 'Message sent: ', message.messageId);
    console.log('\x1b[36m%s\x1b[0m', 'Preview URL: ', nodemailer.getTestMessageUrl(message));

    return true;
  }

  async sendMailTemplate({
    from, to, subject, template,
  }: SendMailTemplateDTO): Promise<boolean> {
    const fromContact = from && { name: from.name, address: from.email };
    const contacts = to.map((contact) => ({ name: contact.name, address: contact.email }));

    const parsedTemplate = await this.mailTemplateProvider.parse(template);

    const message = await this.mailClient.sendMail({
      from: fromContact || { name: 'Equipe GoBarber', address: 'equipe@gobarber.com.br' },
      to: contacts,
      subject,
      html: parsedTemplate,
    });


    console.log('\x1b[36m%s\x1b[0m', 'Message sent: ', message.messageId);
    console.log('\x1b[36m%s\x1b[0m', 'Preview URL: ', nodemailer.getTestMessageUrl(message));

    return true;
  }
}
