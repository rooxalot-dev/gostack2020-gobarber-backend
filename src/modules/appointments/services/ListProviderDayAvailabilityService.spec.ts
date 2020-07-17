import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
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
  it('should be able to list all the available hours in the selected day', async () => {
    const createdProvider = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
      isProvider: true,
    });

    const monthToTest = 5; // Maio no objeto Date do Javascript, pois inicia com indice 0;
    const dayToTest = 1;

    // Força que o método Date.now() retorne o dia 2 do mês
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, monthToTest, dayToTest).getTime());

    const arrayTenAppointments = Array.from(Array(8).keys());

    const createAppointmentsPromiseArray = arrayTenAppointments
      .map((appointmentHour) => appointmentHour + 8) // Agendamentos se iniciam as 8h
      .map((appointmentHour) => {
        const appointmentHourDate = new Date(2020, monthToTest, 1, appointmentHour, 0, 0);

        return fakeAppointmentsRepository.create({
          userID: 'user',
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

  it('should not be list as a available hour all the alredy passed hours', async () => {
    const createdProvider = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
      isProvider: true,
    });

    const monthToTest = 5; // Maio no objeto Date do Javascript, pois inicia com indice 0;
    const dayToTest = 1;

    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, monthToTest, dayToTest, 15, 0, 0, 0).getTime());

    // Cria um agendamento as 16h
    const appointmentHourDate = new Date(2020, monthToTest, dayToTest, 16, 0, 0);

    await fakeAppointmentsRepository.create({
      userID: 'user',
      providerID: createdProvider.id,
      date: appointmentHourDate,
    });

    const availableHours = await listProviderDayAvailabilityService.execute({
      providerId: createdProvider.id,
      year: 2020,
      month: monthToTest + 1,
      day: dayToTest,
    });

    // Deve haver somente os ultimo agendamento livre, poís o das 16 foi agendado agora e os demais são de horários passados
    expect(availableHours).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ hour: 8, available: false }),
        expect.objectContaining({ hour: 16, available: false }),
        expect.objectContaining({ hour: 17, available: true }),
      ]),
    );
  });
});
