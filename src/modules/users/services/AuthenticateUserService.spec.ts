import 'reflect-metadata';

import FakeHashProvider from '@shared/providers/crypto/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';
import FakeTokenProvider from '../providers/token/fakes/FakeTokenProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeTokenProvider: FakeTokenProvider;
let authenticateUserService: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeTokenProvider = new FakeTokenProvider();

    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository, fakeHashProvider, fakeTokenProvider,
    );
  });

  it('should be able to authenticate a existing user', async () => {
    const createdUser = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
    });

    const authResponse = await authenticateUserService.execute({ email: 'teste@teste.com.br', password: '123456' });

    expect(authResponse.token).toBeDefined();
    expect(authResponse.user.id).toBe(createdUser.id);
    expect(authResponse.user.email).toBe(createdUser.email);
    expect(authResponse.user.name).toBe(createdUser.name);
  });

  it('should not authenticate a non-existing user', async () => {
    expect(() => authenticateUserService.execute({ email: 'teste@teste.com.br', password: '123456' }))
      .rejects
      .toThrowError(AppError);
  });

  it('should note authenticate when receives a wrong password', async () => {
    const createdUser = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
    });

    expect(() => authenticateUserService.execute({ email: 'teste@teste.com.br', password: 'wrong-password' }))
      .rejects
      .toThrowError(AppError);
  });
});
