import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id: providerId } = request.route;
    const { day, month, year } = request.body;

    const listProviderDayAvailabilityService = container.resolve(ListProviderDayAvailabilityService);
    const providerDaySchedule = await listProviderDayAvailabilityService.execute({
      day, month, year, providerId,
    });

    return response.json(providerDaySchedule);
  }
}
