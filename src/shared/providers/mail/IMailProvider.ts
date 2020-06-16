import { MailTemplateDTO } from '../mailTemplate/IMailTemplateProvider';

interface SendMailContact {
  name: string;
  email: string;
}

export interface SendMailDTO {
  from?: SendMailContact;
  to: SendMailContact[];
  subject: string;
  body: string;
}

export interface SendMailTemplateDTO extends Omit<SendMailDTO, 'body'> {
  template: MailTemplateDTO
}

export default interface IMailProvider {
  sendMail(data: SendMailDTO): Promise<boolean>;
  sendMailTemplate(data: SendMailTemplateDTO): Promise<boolean>;
}
