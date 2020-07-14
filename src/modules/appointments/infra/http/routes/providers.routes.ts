import { Router } from 'express';
import ProvidersController from '../controllers/ProvidersController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerAppointmentsController = new ProviderAppointmentsController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();

providersRouter.get('/', providersController.index);

providersRouter.get('/schedule/me', providerAppointmentsController.index);

providersRouter.get('/:id/schedule/month', providerMonthAvailabilityController.index);
providersRouter.get('/:id/schedule/day', providerDayAvailabilityController.index);

export default providersRouter;
