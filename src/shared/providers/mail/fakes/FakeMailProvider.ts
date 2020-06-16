import IMailProvider, { SendMailDTO, SendMailTemplateDTO } from '../IMailProvider';

export default class FakeMailProvider implements IMailProvider {
  private inbox: SendMailDTO[] = [];

  async sendMail({
    from, to, subject, body,
  }: SendMailDTO): Promise<boolean> {
    this.inbox.push({
      from, to, subject, body,
    });

    return true;
  }

  async sendMailTemplate({
    from, to, subject, template,
  }: SendMailTemplateDTO): Promise<boolean> {
    this.inbox.push({
      from, to, subject, body: template.template,
    });

    return true;
  }
}
