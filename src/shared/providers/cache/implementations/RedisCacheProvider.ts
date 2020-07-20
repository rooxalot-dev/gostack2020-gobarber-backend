import RedisClient, { Redis } from 'ioredis';

import ICacheProvider from '../ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
  private client: Redis;

  constructor() {
    const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

    this.client = new RedisClient({
      port: Number(REDIS_PORT),
      host: REDIS_HOST,
      password: REDIS_PASSWORD,
    });
  }

  public async save(key: string, value: any): Promise<void> {
    await this.client.set(key, value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data);

    return parsedData as T;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidatePrefix(key: string): Promise<void> {
    await this.client.del(`${key}:*`);
  }
}
