type CacheItem<T> = {
  value: T;
  expiryTime: number; // 到期时间
  ttl: number; // 存活时间
};

export class Cache<K, T> {
  private cache: Map<K, CacheItem<T>> = new Map();
  private defaultExpiryTime: number;

  public constructor(stdTTL = 60, checkperiod = 0) {
    this.defaultExpiryTime = stdTTL * 1000;
    if (checkperiod > 1) {
      setInterval(this.cleanup.bind(this), checkperiod * 1000); // Check every minute for expired items
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expiryTime > 0 && now >= item.expiryTime) {
        this.cache.delete(key);
        console.warn(`${key} 过期已删除`);
      }
    }
  }

  public set(key: K, value: T, ttl?: number): void {
    const expiry = ttl || this.defaultExpiryTime;
    let expiryTime = 0;
    if (expiry > 0) {
      expiryTime = Date.now() + expiry;
    }
    this.cache.set(key, { value, expiryTime, ttl: expiry });
  }

  public get(key: K): T | undefined {
    const item = this.cache.get(key);
    if (item) {
      console.log(
        `key: ${key}还有${(item.expiryTime - Date.now()) / 1000}s过期`
      );
    }
    if (item && Date.now() < item.expiryTime) {
      this.set(key, item.value, item.ttl); // 重新设置过期时间
      return item.value;
    }
    this.cache.delete(key); // Remove expired item
    return undefined;
  }

  public remove(key: K): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }
}
