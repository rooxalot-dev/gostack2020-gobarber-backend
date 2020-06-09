export interface SendMailRequest {
  to: string[];
  subject: string;
  body: string;
}

export default interface IMailProvider {
  sendMail(data: SendMailRequest): Promise<boolean>;
};
