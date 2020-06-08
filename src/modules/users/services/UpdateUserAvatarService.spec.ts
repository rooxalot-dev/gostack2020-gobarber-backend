import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/providers/storage/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeStorageProvider: FakeStorageProvider;
  let updateUserAvatarService: UpdateUserAvatarService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatarService = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);
  });

  it('should set the user\'s new avatar', async () => {
    const createdUser = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456789',
    });

    const updatedUser = await updateUserAvatarService.execute({ userID: createdUser.id, avatarPath: 'new-avatar.jpg' });

    expect(updatedUser.avatar).toBe('new-avatar.jpg');
  });

  it('should replace the user\'s actual avatar with a new one', async () => {
    const createdUser = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456789',
    });

    createdUser.avatar = 'old-avatar.jpg';

    const updatedUser = await updateUserAvatarService.execute({ userID: createdUser.id, avatarPath: 'new-avatar.jpg' });

    expect(updatedUser.avatar).toBe('new-avatar.jpg');
  });

  it('should throw a error when the user does not exist', async () => {
    expect(updateUserAvatarService.execute({ userID: 'unknown-id', avatarPath: 'new-avatar.jpg' })).rejects.toThrowError(AppError);
  });
});
