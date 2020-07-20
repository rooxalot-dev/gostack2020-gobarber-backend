import 'reflect-metadata';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ICacheProvider from '@shared/providers/cache/ICacheProvider';
import FakeCacheProvider from '@shared/providers/cache/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

describe('ListProviders', () => {
  let fakeUsersRepository: IUsersRepository;
  let fakeCacheProvider: ICacheProvider;
  let listProvidersService: ListProvidersService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProvidersService = new ListProvidersService(fakeUsersRepository, fakeCacheProvider);
  });

  it('should be able to list all the users with the provider flag', async () => {
    const createdUser = await fakeUsersRepository.create({
      name: 'Teste 1',
      email: 'teste1@teste.com.br',
      passwordHash: '123456',
      isProvider: true,
    });

    fakeUsersRepository.create({
      name: 'Teste 2',
      email: 'teste2@teste.com.br',
      passwordHash: '123456',
    });

    fakeUsersRepository.create({
      name: 'Teste3',
      email: 'teste3@teste.com.br',
      passwordHash: '123456',
    });

    const createdUser2 = await fakeUsersRepository.create({
      name: 'Teste 4',
      email: 'teste4@teste.com.br',
      passwordHash: '123456',
      isProvider: true,
    });

    const providersList = await listProvidersService.execute();

    expect(providersList).toBeDefined();
    expect(providersList).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ ...createdUser }),
        expect.objectContaining({ ...createdUser2 }),
      ]),
    );
  });
});
