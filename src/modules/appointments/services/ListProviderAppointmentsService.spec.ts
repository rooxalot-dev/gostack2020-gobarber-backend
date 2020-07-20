import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/providers/cache/fakes/FakeCacheProvider';
import ListProviderAppointments from './ListProviderAppointmentsService';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: IAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviderAppointments: ListProviderAppointments;

beforeEach(() => {
  fakeAppointmentsRepository = new FakeAppointmentsRepository();
  fakeCacheProvider = new FakeCacheProvider();
  listProviderAppointments = new ListProviderAppointments(fakeAppointmentsRepository, fakeCacheProvider);
});

describe('ListProviderMonthAvailability', () => {
  it('should be able to list all the available day in the selected month', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 1, 15, 0, 0),
      providerID: 'provider',
      userID: 'user',
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 1, 16, 0, 0),
      providerID: 'provider',
      userID: 'user',
    });

    const appointments = await listProviderAppointments.execute({
      year: 2020,
      month: 5,
      day: 1,
      providerId: 'provider',
    });

    expect(appointments).toEqual(
      expect.arrayContaining([appointment1, appointment2]),
    );
  });
});
