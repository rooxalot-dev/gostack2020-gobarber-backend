import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@shared/providers/crypto/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/providers/cache/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUserService: CreateUserService;

beforeEach(() => {
  fakeUsersRepository = new FakeUsersRepository();
  fakeHashProvider = new FakeHashProvider();
  fakeCacheProvider = new FakeCacheProvider();
  createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
});

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    expect(user).toBeDefined();
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Teste');
    expect(user.email).toBe('teste@teste.com.br');
  });

  it('should not create two users with the same email', async () => {
    // First user
    await createUserService.execute({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    expect(async () => {
      await createUserService.execute({
        name: 'Teste',
        email: 'teste@teste.com.br',
        password: '123456',
      });
    }).rejects.toThrowError(AppError);
  });
});
