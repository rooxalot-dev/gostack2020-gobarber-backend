import { getDaysInMonth } from 'date-fns';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeUsersRepository: IUsersRepository;
let fakeAppointmentsRepository: IAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

beforeEach(() => {
  fakeUsersRepository = new FakeUsersRepository();
  fakeAppointmentsRepository = new FakeAppointmentsRepository();
  listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(fakeAppointmentsRepository);
});

describe('ListProviderMonthAvailability', () => {
  it('should be able to list all the available day in the selected month', async () => {
    const createdProvider = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
      isProvider: true,
    });

    const monthToTest = 5; // Maio no objeto Date do Javascript, pois inicia com indice 0;

    // Força que o método Date.now() retorne o dia 2 do mês
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, monthToTest, 2).getTime());

    const arrayTenAppointments = Array.from(Array(10).keys());

    const createApponintmentsPromiseArray = arrayTenAppointments
      .map((appointmentHour) => appointmentHour + 8) // Agendamentos se iniciam as 8h
      .map((appointmentHour) => (
        fakeAppointmentsRepository.create({
          userID: 'user',
          providerID: createdProvider.id,
          date: new Date(2020, monthToTest, 1, appointmentHour, 0, 0),
        })
      ));

    // Aguarda a criação de todos os agendamentos
    await Promise.all(createApponintmentsPromiseArray);

    const availableDays = await listProviderMonthAvailabilityService.execute({
      providerId: createdProvider.id,
      year: 2020,
      month: monthToTest + 1,
    });

    expect(availableDays).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ day: 1, available: false }),
        expect.objectContaining({ day: 2, available: true }),
      ]),
    );
  });

  it('should not be list as a available day all the alredy passed days', async () => {
    const createdProvider = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
      isProvider: true,
    });

    const monthToTest = 5; // Maio no objeto Date do Javascript, pois inicia com indice 0;

    // Força que o método Date.now() retorne o dia 2 do mês
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, monthToTest, 2).getTime());

    await fakeAppointmentsRepository.create({
      userID: 'user',
      providerID: createdProvider.id,
      date: new Date(2020, monthToTest, 1, 12, 0, 0),
    });

    const availableDays = await listProviderMonthAvailabilityService.execute({
      providerId: createdProvider.id,
      year: 2020,
      month: monthToTest + 1,
    });

    expect(availableDays).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ day: 1, available: false }),
      ]),
    );
  });
});
