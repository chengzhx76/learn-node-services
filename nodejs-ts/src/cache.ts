export type CacheItem<T> = {
  value: T;
  expiryTime: number; // Expiry time in milliseconds
};

export class Cache<K, T> {
  private cache: Map<K, CacheItem<T>> = new Map();
  private defaultExpiryTime: number;

  constructor(stdTTL = 60, checkperiod?: number) {
    this.defaultExpiryTime = stdTTL * 1000;
    if (checkperiod * 1000 < 1) {
      setInterval(this.cleanup.bind(this), checkperiod); // Check every minute for expired items
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expiryTime > 0 && now >= item.expiryTime) {
        this.cache.delete(key);
      }
    }
  }

  set(key: K, value: T, ttl?: number): void {
    const expiry = ttl || this.defaultExpiryTime;
    let expiryTime = 0;
    if (expiry > 0) {
      expiryTime = Date.now() + expiry;
    }
    this.cache.set(key, { value, expiryTime });
  }

  get(key: K): T | undefined {
    const item = this.cache.get(key);
    if (item && Date.now() < item.expiryTime) {
      return item.value;
    }
    this.cache.delete(key); // Remove expired item
    return undefined;
  }

  remove(key: K): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}
