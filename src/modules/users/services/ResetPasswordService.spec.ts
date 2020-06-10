import { addHours } from 'date-fns';

import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@shared/providers/crypto/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

describe('SendPasswordRecoveryEmail', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeUserTokensRepository: FakeUserTokensRepository;
  let fakeHashProvider: FakeHashProvider;
  let resetPasswordService: ResetPasswordService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository, fakeUserTokensRepository, fakeHashProvider,
    );
  });

  it('should reset the user\'s password', async () => {
    const createdUser = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
    });

    const createHash = jest.spyOn(fakeHashProvider, 'createHash');
    const { token } = await fakeUserTokensRepository.generate(createdUser.id);

    await resetPasswordService.execute({ token, newPassword: '123123' });

    const updatedUser = await fakeUsersRepository.findById(createdUser.id);

    expect(createHash).toHaveBeenCalledWith('123123');
    expect(updatedUser && updatedUser.passwordHash).toBe('123123');
  });

  it('should not reset the user\'s password when the token is expired after 2h', async () => {
    const createdUser = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(createdUser.id);
    fakeUserTokensRepository.tokens[0].createdAt = addHours(new Date(), -2);

    await expect(resetPasswordService.execute({ token, newPassword: '123123' })).rejects.toThrowError(AppError);
  });

  it('should not reset the user\'s password when the token has alredy been consumed', async () => {
    const createdUser = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(createdUser.id);
    await fakeUserTokensRepository.consumeToken(token);

    await expect(resetPasswordService.execute({ token, newPassword: '123123' })).rejects.toThrowError(AppError);
  });

  it('should throw a error when the informed token does not exist', async () => {
    await expect(resetPasswordService.execute({ token: 'unknown-token', newPassword: '123123' })).rejects.toThrowError(AppError);
  });

  it('should throw a error when the token\'s user does not exist', async () => {
    const { token } = await fakeUserTokensRepository.generate('unknown-id');

    await expect(resetPasswordService.execute({ token, newPassword: '123123' })).rejects.toThrowError(AppError);
  });
});
