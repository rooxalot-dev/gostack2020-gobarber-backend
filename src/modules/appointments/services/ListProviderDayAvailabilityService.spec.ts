import { parseISO } from 'date-fns';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import { getDateUTC } from '@shared/helpers/DateHelper';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeUsersRepository: IUsersRepository;
let fakeAppointmentsRepository: IAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

beforeEach(() => {
  fakeUsersRepository = new FakeUsersRepository();
  fakeAppointmentsRepository = new FakeAppointmentsRepository();
  listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(fakeAppointmentsRepository);
});

describe('ListProviderDayAvailability', () => {
  it('', async () => {
    const createdProvider = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
      isProvider: true,
    });

    const monthToTest = 5; // Maio no objeto Date do Javascript, pois inicia com indice 0;
    const dayToTest = 1;

    const arrayTenAppointments = Array.from(Array(8).keys());

    const createAppointmentsPromiseArray = arrayTenAppointments
      .map((appointmentHour) => appointmentHour + 8) // Agendamentos se iniciam as 8h
      .map((appointmentHour) => {
        const appointmentHourDate = new Date(2020, monthToTest, 1, appointmentHour, 0, 0);

        return fakeAppointmentsRepository.create({
          providerID: createdProvider.id,
          date: appointmentHourDate,
        });
      });

    // Aguarda a criação de todos os agendamentos
    await Promise.all(createAppointmentsPromiseArray);

    const availableHours = await listProviderDayAvailabilityService.execute({
      providerId: createdProvider.id,
      year: 2020,
      month: monthToTest + 1,
      day: dayToTest,
    });

    // Deve haver somente os ultimos 2 agendamentos livres
    expect(availableHours).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ hour: 8, available: false }),
        expect.objectContaining({ hour: 9, available: false }),
        expect.objectContaining({ hour: 10, available: false }),
        expect.objectContaining({ hour: 11, available: false }),
        expect.objectContaining({ hour: 12, available: false }),
        expect.objectContaining({ hour: 13, available: false }),
        expect.objectContaining({ hour: 14, available: false }),
        expect.objectContaining({ hour: 15, available: false }),
        expect.objectContaining({ hour: 16, available: true }),
        expect.objectContaining({ hour: 17, available: true }),
      ]),
    );
  });
});
