import ICacheProvider from '../ICacheProvider';

export default class FakeCacheProvider implements ICacheProvider {
  private cacheObject = {};

  public async save(key: string, value: any): Promise<void> {
    Object.assign(this.cacheObject, { [key]: value });
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = this.cacheObject[key] as any;
    if (!data) {
      return null;
    }

    return data as T;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cacheObject[key];
  }

  public async invalidatePrefix(key: string): Promise<void> {
    delete this.cacheObject[key];
  }
}
