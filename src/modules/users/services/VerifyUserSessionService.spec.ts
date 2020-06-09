import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import VerifyUserSessionService from './VerifyUserSessionService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeTokenProvider from '../providers/token/fakes/FakeTokenProvider';
import { UserLoginToken } from '../dtos/UserLoginToken';

let fakeUsersRepository: FakeUsersRepository;
let fakeTokenProvider: FakeTokenProvider;
let verifyUserSessionService: VerifyUserSessionService;

describe('VerifyUserSession', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeTokenProvider = new FakeTokenProvider();
    verifyUserSessionService = new VerifyUserSessionService(fakeUsersRepository, fakeTokenProvider);
  });

  it('should be able to verify an existing and alredy authenticated user', async () => {
    // Cadastra o usuário em uma lista falsa
    await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
    });

    // Persiste um usuário em uma lista falsa de tokens autenticados
    const userToken: UserLoginToken = { id: '1', name: 'Teste', email: 'teste@teste.com.br' };
    const stringPayload = JSON.stringify(userToken);
    const token = Buffer.from(stringPayload).toString('base64');
    fakeTokenProvider.tokens.push({ token, payload: userToken });

    const authResponse = await verifyUserSessionService.execute(token);

    expect(authResponse).toBeDefined();
    expect(authResponse.id).toBe(userToken.id);
    expect(authResponse.email).toBe(userToken.email);
    expect(authResponse.name).toBe(userToken.name);
  });

  it('should throw a error when informed a invalid token', async () => {
    expect(() => verifyUserSessionService.execute('invalid-token')).rejects.toThrowError(AppError);
  });

  it('should throw a error when the token is not informed', async () => {
    expect(() => verifyUserSessionService.execute(undefined)).rejects.toThrowError(AppError);
  });

  it('should throw a error when a alredy authenticated user is not found', async () => {
    // Persiste um usuário em uma lista falsa de tokens autenticados, porém os usuário não está persistido
    const userToken: UserLoginToken = { id: '1', name: 'Teste', email: 'teste@teste.com.br' };
    const stringPayload = JSON.stringify(userToken);
    const token = Buffer.from(stringPayload).toString('base64');
    fakeTokenProvider.tokens.push({ token, payload: userToken });

    expect(() => verifyUserSessionService.execute(token)).rejects.toThrowError(AppError);
  });
});
