import IMailTemplateProvider, { MailTemplateDTO } from '../IMailTemplateProvider';

export default class FakeMailTemplateProvider implements IMailTemplateProvider {
  async parse({ template, variables }: MailTemplateDTO) {
    return template;
  }
}
