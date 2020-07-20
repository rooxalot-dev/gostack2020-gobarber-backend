import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import { jsxExpressionContainer } from '@babel/types';
import FakeCacheProvider from '@shared/providers/cache/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeUsersRepository: FakeUsersRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointmentService: CreateAppointmentService;

beforeEach(() => {
  fakeUsersRepository = new FakeUsersRepository();
  fakeAppointmentsRepository = new FakeAppointmentsRepository();
  fakeNotificationsRepository = new FakeNotificationsRepository();
  fakeCacheProvider = new FakeCacheProvider();

  createAppointmentService = new CreateAppointmentService(fakeAppointmentsRepository, fakeUsersRepository, fakeNotificationsRepository, fakeCacheProvider);
});

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const user = await fakeUsersRepository.create({
      name: 'teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
    });

    const create = jest.spyOn(fakeNotificationsRepository, 'create');

    const appointment = await createAppointmentService.execute({
      providerID: '123456',
      userID: user.id,
      date: new Date(new Date().getUTCFullYear() + 1, new Date().getUTCMonth()),
    });

    expect(appointment).toBeDefined();
    expect(appointment.id).toBeDefined();
    expect(appointment.userID).toBe(user.id);
    expect(appointment.providerID).toBe('123456');
    expect(create).toHaveBeenCalled();
  });

  it('should not create two appointments on the same hour', async () => {
    const date = new Date(new Date().getUTCFullYear() + 1, new Date().getUTCMonth());

    const user = await fakeUsersRepository.create({
      name: 'teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
    });

    // First appointment
    await createAppointmentService.execute({
      providerID: '123456',
      userID: user.id,
      date,
    });

    // Second appointment
    expect(async () => {
      await createAppointmentService.execute({
        providerID: '123456',
        userID: user.id,
        date,
      });
    }).rejects.toThrow(AppError);
  });

  it('should not create a appointment for a non-existing user', async () => {
    const date = new Date(2020, 7, 1);

    await expect(() => createAppointmentService.execute({
      providerID: '123456',
      userID: 'non-existing-id',
      date,
    })).rejects.toThrow(AppError);
  });

  it('should not create a appointment on a past date', async () => {
    const date = new Date(2020, 7, 1);

    const user = await fakeUsersRepository.create({
      name: 'teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
    });

    // Força que o método Date.now() retorne o dia 2 do mês
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, 7, 2).getTime());

    await expect(() => createAppointmentService.execute({
      providerID: '123456',
      userID: user.id,
      date,
    })).rejects.toThrow(AppError);
  });

  it('should not allow the user to create a appointment with himself ', async () => {
    const date = new Date(new Date().getUTCFullYear() + 1, new Date().getUTCMonth());

    const user = await fakeUsersRepository.create({
      name: 'teste',
      email: 'teste@teste.com.br',
      passwordHash: '123456',
    });

    await expect(() => createAppointmentService.execute({
      providerID: user.id,
      userID: user.id,
      date,
    })).rejects.toThrow(AppError);
  });
});
