import FakeMailProvider from '@shared/providers/mail/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendPasswordRecoveryEmailService from './SendPasswordRecoveryEmailService';

describe('SendPasswordRecoveryEmail', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeMailProvider: FakeMailProvider;
  let sendPasswordRecoveryEmailService: SendPasswordRecoveryEmailService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    sendPasswordRecoveryEmailService = new SendPasswordRecoveryEmailService(fakeUsersRepository, fakeMailProvider);
  });

  it('should send a recovery password email to a registered user', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    const createdUser = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
    });

    const response = await sendPasswordRecoveryEmailService.execute({ email: createdUser.email });

    expect(sendMail).toHaveBeenCalled();
    expect(response).toBe(true);
  });

  it('should not send a email to a non-existing user', async () => {
    expect(sendPasswordRecoveryEmailService.execute({ email: 'non-existing-email' })).rejects.toThrowError(AppError);
  });
});
