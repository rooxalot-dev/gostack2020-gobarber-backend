import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

beforeEach(() => {
  fakeAppointmentsRepository = new FakeAppointmentsRepository();
  createAppointmentService = new CreateAppointmentService(fakeAppointmentsRepository);
});

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointmentService.execute({
      providerID: '123456',
      date: new Date(),
    });

    expect(appointment).toBeDefined();
    expect(appointment.id).toBeDefined();
    expect(appointment.providerID).toBe('123456');
  });

  it('should not create two appointments on the same hour', async () => {
    const date = new Date();

    // First appointment
    await createAppointmentService.execute({
      providerID: '123456',
      date,
    });

    // Second appointment
    expect(async () => {
      await createAppointmentService.execute({
        providerID: '123456',
        date,
      });
    }).rejects.toThrow(AppError);
  });
});
