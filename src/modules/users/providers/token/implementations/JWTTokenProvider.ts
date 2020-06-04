import { sign, verify } from 'jsonwebtoken';

import ITokenProvider, { ITokenProviderOptions } from '../ITokenProvider';

export default class JWTTokenProvider implements ITokenProvider {
  sign(payload: any, key: string, options?: ITokenProviderOptions | undefined): string {
    return sign(payload, String(key), {
      subject: options && options.subject,
      expiresIn: (options && options.expiresIn) || '1d',
    });
  }

  verify<T>(token: any, key: string): T | undefined {
    return <T><unknown>verify(token, key || '');
  }
}
