import { container } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';

import ICacheProvider from '@shared/providers/cache/ICacheProvider';
import RedisCacheProvider from '@shared/providers/cache/implementations/RedisCacheProvider';

import IHashProvider from '@shared/providers/crypto/IHashProvider';
import BCryptHashProvider from '@shared/providers/crypto/implementations/bcrypt/BCryptHashProvider';

import ITokenProvider from '@modules/users/providers/token/ITokenProvider';
import JWTTokenProvider from '@modules/users/providers/token/implementations/JWTTokenProvider';

import IStorageProvider from '@shared/providers/storage/IStorageProvider';
import LocalStorageProvider from '@shared/providers/storage/implementations/LocalStorageProvider';
import S3StorageProvider from '@shared/providers/storage/implementations/S3StorageProvider';

import IMailProvider from '@shared/providers/mail/IMailProvider';
import EtherealMailProvider from '@shared/providers/mail/implementations/EtherealMailProvider';

import MailTemplateProvider from '@shared/providers/mailTemplate/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from '@shared/providers/mailTemplate/implementations/HandlebarsMailTemplateProvider';


// Repositories
container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepository);
container.registerSingleton<IUserTokensRepository>('UserTokensRepository', UserTokensRepository);
container.registerSingleton<IAppointmentsRepository>('AppointmentsRepository', AppointmentsRepository);
container.registerSingleton<INotificationsRepository>('NotificationsRepository', NotificationsRepository);

// Providers
container.registerInstance<ICacheProvider>('CacheProvider', container.resolve(RedisCacheProvider));
container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
container.registerSingleton<ITokenProvider>('TokenProvider', JWTTokenProvider);
container.registerSingleton<IStorageProvider>('StorageProvider', process.env.NODE_ENV === 'production' ? S3StorageProvider : LocalStorageProvider);
container.registerSingleton<MailTemplateProvider>('MailTemplateProvider', HandlebarsMailTemplateProvider);
container.registerInstance<IMailProvider>('MailProvider', container.resolve(EtherealMailProvider));
