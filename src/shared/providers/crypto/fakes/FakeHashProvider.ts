import IHashProvider from '../IHashProvider';

export default class FakeHashProvider implements IHashProvider {
  public async createHash(payload: string): Promise<string> {
    return payload;
  }

  public async compareHash(stringHash: string, stringToCompare: string): Promise<boolean> {
    return (stringHash === stringToCompare);
  }
}
