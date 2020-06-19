import IHashProvider from '@shared/providers/crypto/IHashProvider';
import FakeHashProvider from '@shared/providers/crypto/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import UpdateUserInfoService from './UpdateUserInfoService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import IUsersRepository from '../repositories/IUsersRepository';

describe('UpdateUserInfo', () => {
  let updateUserInfoService: UpdateUserInfoService;
  let fakeUsersRepository: IUsersRepository;
  let fakeHashProvider: IHashProvider;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateUserInfoService = new UpdateUserInfoService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to update the user\'s information', async () => {
    const createdUser = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
    });

    const updatedUser = await updateUserInfoService.execute({
      id: createdUser.id,
      oldPassword: createdUser.passwordHash,
      name: 'Teste2',
      email: 'teste2@teste.com.br',
      password: '654321',
      confirmPassword: '654321',
    });

    expect(updatedUser).toBeDefined();
    expect(updatedUser.name).toBe('Teste2');
    expect(updatedUser.email).toBe('teste2@teste.com.br');
    expect(updatedUser.passwordHash).toBe('654321');
  });

  it('should keep the user\'s old password if a new one is not informed', async () => {
    const createdUser = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
    });

    const updatedUser = await updateUserInfoService.execute({
      id: createdUser.id,
      name: 'Teste2',
      email: 'teste2@teste.com.br',
      password: '',
      confirmPassword: '',
    });

    expect(updatedUser).toBeDefined();
    expect(updatedUser.name).toBe('Teste2');
    expect(updatedUser.email).toBe('teste2@teste.com.br');
    expect(updatedUser.passwordHash).toBe('123456');
  });

  it('should not be able to update a non-existing user', async () => {
    expect(
      updateUserInfoService.execute({
        id: 'non-existing-user-id',
        oldPassword: 'wrong-password',
        name: 'Teste2',
        email: 'teste2@teste.com.br',
        password: '654321',
        confirmPassword: '654321',
      }),
    ).rejects.toThrowError(AppError);
  });

  it('should not be able to update the user\'s password if the old password is not informed', async () => {
    const createdUser = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
    });

    expect(
      updateUserInfoService.execute({
        id: createdUser.id,
        name: 'Teste2',
        email: 'teste2@teste.com.br',
        password: '654321',
        confirmPassword: '654321',
      }),
    ).rejects.toThrowError(AppError);
  });

  it('should not be able to update the user\'s information if the old password is incorrect', async () => {
    const createdUser = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
    });

    expect(
      updateUserInfoService.execute({
        id: createdUser.id,
        oldPassword: 'wrong-password',
        name: 'Teste2',
        email: 'teste2@teste.com.br',
        password: '654321',
        confirmPassword: '654321',
      }),
    ).rejects.toThrowError(AppError);
  });

  it('should not be able to update the user\'s information if the password and it\'s confirmation does not match', async () => {
    const createdUser = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
    });

    expect(
      updateUserInfoService.execute({
        id: createdUser.id,
        oldPassword: createdUser.passwordHash,
        name: 'Teste2',
        email: 'teste2@teste.com.br',
        password: '654321',
        confirmPassword: '987654321',
      }),
    ).rejects.toThrowError(AppError);
  });
});
