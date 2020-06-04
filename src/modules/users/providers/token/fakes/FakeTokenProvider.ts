import ITokenProvider, { ITokenProviderOptions } from '../ITokenProvider';

export default class FakeTokenProvider implements ITokenProvider {
  tokens: { token: string, payload: object }[] = [];

  sign(payload: any, key: string, options?: ITokenProviderOptions | undefined): string {
    const stringPayload = JSON.stringify(payload);
    const token = Buffer.from(stringPayload).toString('base64');

    this.tokens.push({ token, payload });

    return token;
  }

  verify<T>(token: any, key: string): T | undefined {
    const payload = this.tokens.find((t) => t.token === token);

    if (payload) {
      return <T><unknown>payload.payload;
    }

    return undefined;
  }
}
