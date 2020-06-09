import IMailProvider, { SendMailRequest } from '../IMailProvider';

export default class FakeMailProvider implements IMailProvider {
  private inbox: SendMailRequest[] = [];

  async sendMail({ to, subject, body }: SendMailRequest): Promise<boolean> {
    this.inbox.push({ to, subject, body });

    return true;
  }
}
