export interface ITokenProviderOptions {
  subject: any;
  expiresIn: string;
}

export default interface ITokenProvider {
  sign(payload: any, key: string, options?: ITokenProviderOptions): string;
  verify<T>(token: any, key: string): T | undefined;
};
