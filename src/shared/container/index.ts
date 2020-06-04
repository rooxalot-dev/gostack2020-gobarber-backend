import { container } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';


import IHashProvider from '@shared/providers/crypto/IHashProvider';
import BCryptHashProvider from '@shared/providers/crypto/implementations/bcrypt/BCryptHashProvider';

import ITokenProvider from '@modules/users/providers/token/ITokenProvider';
import JWTTokenProvider from '@modules/users/providers/token/implementations/JWTTokenProvider';


// Repositories
container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepository);
container.registerSingleton<IAppointmentsRepository>('AppointmentsRepository', AppointmentsRepository);

// Providers
container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
container.registerSingleton<ITokenProvider>('TokenProvider', JWTTokenProvider);
