import AppError from '@shared/errors/AppError';
import ShowUserProfileService from './ShowUserProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

describe('ShowUserProfile', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let showUserProfileService: ShowUserProfileService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showUserProfileService = new ShowUserProfileService(fakeUsersRepository);
  });

  it('should be able to show the user\'s profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
    });

    const userProfile = await showUserProfileService.execute(user.id);

    expect(userProfile).toBeDefined();
    expect(userProfile.name).toBe('Teste');
    expect(userProfile.email).toBe('teste@teste.com.br');
  });

  it('should not be able to show an non-existing user\'s profile', async () => {
    await expect(showUserProfileService.execute('non-existing-id')).rejects.toThrowError(AppError);
  });
});
