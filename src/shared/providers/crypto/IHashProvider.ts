export default interface IHashProvider {
  createHash(payload: string): Promise<string>;
  compareHash(stringHash: string, stringToCompare: string): Promise<boolean>;
}
