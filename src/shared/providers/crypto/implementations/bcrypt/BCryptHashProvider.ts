import { hash, compare } from 'bcrypt';

import IHashProvider from '../../IHashProvider';

export default class BCryptHashProvider implements IHashProvider {
  public async createHash(payload: string): Promise<string> {
    const hashValue = await hash(payload, 10);
    return hashValue;
  }

  public async compareHash(stringHash: string, stringToCompare: string): Promise<boolean> {
    const isEquals = await compare(stringHash, stringToCompare);
    return isEquals;
  }
}
