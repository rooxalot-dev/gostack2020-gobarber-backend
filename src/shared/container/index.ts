import { container } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IHashProvider from '@shared/providers/crypto/IHashProvider';
import BCryptHashProvider from '@shared/providers/crypto/implementations/bcrypt/BCryptHashProvider';

import ITokenProvider from '@modules/users/providers/token/ITokenProvider';
import JWTTokenProvider from '@modules/users/providers/token/implementations/JWTTokenProvider';

import IStorageProvider from '@shared/providers/storage/IStorageProvider';
import LocalStorageProvider from '@shared/providers/storage/implementations/LocalStorageProvider';

import IMailProvider from '@shared/providers/mail/IMailProvider';
import EtherealMailProvider from '@shared/providers/mail/implementations/EtherealMailProvider';

import MailTemplateProvider from '@shared/providers/mailTemplate/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from '@shared/providers/mailTemplate/implementations/HandlebarsMailTemplateProvider';


// Repositories
container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepository);
container.registerSingleton<IUserTokensRepository>('UserTokensRepository', UserTokensRepository);
container.registerSingleton<IAppointmentsRepository>('AppointmentsRepository', AppointmentsRepository);

// Providers
container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
container.registerSingleton<ITokenProvider>('TokenProvider', JWTTokenProvider);
container.registerSingleton<IStorageProvider>('StorageProvider', LocalStorageProvider);
container.registerSingleton<MailTemplateProvider>('MailTemplateProvider', HandlebarsMailTemplateProvider);
container.registerInstance<IMailProvider>('MailProvider', container.resolve(EtherealMailProvider)); // DEV
