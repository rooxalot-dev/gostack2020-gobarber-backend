import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id: providerId } = request.route;
    const { month, year } = request.body;

    const listProviderMonthAvailabilityService = container.resolve(ListProviderMonthAvailabilityService);
    const providerDaySchedule = await listProviderMonthAvailabilityService.execute({
      month, year, providerId,
    });

    return response.json(providerDaySchedule);
  }
}
