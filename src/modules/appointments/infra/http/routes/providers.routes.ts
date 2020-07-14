import { Router } from 'express';
import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();

providersRouter.get('/', providersController.index);

providersRouter.get('/:id/schedule/month', providerMonthAvailabilityController.index);
providersRouter.get('/:id/schedule/day', providerDayAvailabilityController.index);

export default providersRouter;
