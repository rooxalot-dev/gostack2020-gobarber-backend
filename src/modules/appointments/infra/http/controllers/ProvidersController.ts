import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class AppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id: userID } = request.user;

    const listProvidersService = container.resolve(ListProvidersService);
    const providers = await listProvidersService.execute(userID);

    return response.json(providers);
  }
}
