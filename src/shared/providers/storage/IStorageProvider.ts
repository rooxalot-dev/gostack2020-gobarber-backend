export default interface IStorageProvider {
  store(file: string): Promise<string>;
  remove(file: string): Promise<void>;
};
