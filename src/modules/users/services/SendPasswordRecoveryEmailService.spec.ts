import FakeMailProvider from '@shared/providers/mail/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendPasswordRecoveryEmailService from './SendPasswordRecoveryEmailService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

describe('SendPasswordRecoveryEmail', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeUserTokensRepository: FakeUserTokensRepository;
  let fakeMailProvider: FakeMailProvider;
  let sendPasswordRecoveryEmailService: SendPasswordRecoveryEmailService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeMailProvider = new FakeMailProvider();
    sendPasswordRecoveryEmailService = new SendPasswordRecoveryEmailService(fakeUsersRepository, fakeUserTokensRepository, fakeMailProvider);
  });

  it('should send a recovery password email to a registered user', async () => {
    const sendMailTemplate = jest.spyOn(fakeMailProvider, 'sendMailTemplate');
    const createdUser = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
    });

    const response = await sendPasswordRecoveryEmailService.execute({ email: createdUser.email });

    expect(sendMailTemplate).toHaveBeenCalled();
    expect(response).toBe(true);
  });

  it('should generate a token to be send on the email', async () => {
    const generate = jest.spyOn(fakeUserTokensRepository, 'generate');

    const createdUser = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
    });

    await sendPasswordRecoveryEmailService.execute({ email: createdUser.email });

    expect(generate).toHaveBeenCalledWith(createdUser.id);
  });

  it('should not send a email to a non-existing user', async () => {
    expect(sendPasswordRecoveryEmailService.execute({ email: 'non-existing-email' })).rejects.toThrowError(AppError);
  });
});
