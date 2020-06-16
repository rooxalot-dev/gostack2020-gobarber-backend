import Handlebars from 'handlebars';

import IMailTemplateProvider, { MailTemplateDTO } from '../IMailTemplateProvider';

export default class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  async parse({ template, variables }: MailTemplateDTO): Promise<string> {
    const templateCompiler = Handlebars.compile(template);
    const compiledTemplate = templateCompiler(variables);

    return compiledTemplate;
  }
}
