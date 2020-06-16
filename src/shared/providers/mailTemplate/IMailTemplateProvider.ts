interface MailTemplateVariables {
  [key: string]: string | number;
}

export interface MailTemplateDTO {
  template: string;
  variables: MailTemplateVariables;
}

export default interface IMailTemplateProvider {
  parse(date: MailTemplateDTO): Promise<string>;
};
