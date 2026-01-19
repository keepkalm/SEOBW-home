/**
 * Redis Caching Layer
 *
 * Provides caching for API responses to reduce API costs and improve performance.
 * Falls back gracefully if Redis is not available.
 */

import { createClient, RedisClientType } from "redis";

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  KEYWORD_DATA: 60 * 60 * 24, // 24 hours
  DOMAIN_DATA: 60 * 60 * 12, // 12 hours
  BACKLINKS_DATA: 60 * 60 * 6, // 6 hours
  LIGHTHOUSE_DATA: 60 * 60 * 24 * 7, // 7 days
  WHOIS_DATA: 60 * 60 * 24 * 30, // 30 days
  BUSINESS_DATA: 60 * 60 * 24, // 24 hours
  SERP_DATA: 60 * 60 * 4, // 4 hours
} as const;

// Cache key prefixes
export const CACHE_PREFIX = {
  KEYWORD: "seo:keyword:",
  DOMAIN: "seo:domain:",
  BACKLINKS: "seo:backlinks:",
  LIGHTHOUSE: "seo:lighthouse:",
  WHOIS: "seo:whois:",
  BUSINESS: "seo:business:",
  SERP: "seo:serp:",
  SEARCH: "seo:search:",
} as const;

let redisClient: RedisClientType | null = null;
let isConnected = false;

/**
 * Get or create Redis client
 */
async function getRedisClient(): Promise<RedisClientType | null> {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    return null;
  }

  if (redisClient && isConnected) {
    return redisClient;
  }

  try {
    redisClient = createClient({
      url: redisUrl,
    }) as RedisClientType;

    redisClient.on("error", (err) => {
      console.error("Redis error:", err);
      isConnected = false;
    });

    redisClient.on("connect", () => {
      console.log("Redis connected");
      isConnected = true;
    });

    redisClient.on("disconnect", () => {
      console.log("Redis disconnected");
      isConnected = false;
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.warn("Failed to connect to Redis:", error);
    return null;
  }
}

/**
 * Generate cache key
 */
export function generateCacheKey(prefix: string, ...parts: string[]): string {
  return `${prefix}${parts.map((p) => p.toLowerCase().replace(/\s+/g, "_")).join(":")}`;
}

/**
 * Get cached data
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const client = await getRedisClient();
    if (!client) return null;

    const cached = await client.get(key);
    if (!cached) return null;

    return JSON.parse(cached) as T;
  } catch (error) {
    console.warn("Cache get error:", error);
    return null;
  }
}

/**
 * Set cache data
 */
export async function setInCache<T>(
  key: string,
  data: T,
  ttlSeconds: number
): Promise<boolean> {
  try {
    const client = await getRedisClient();
    if (!client) return false;

    await client.setEx(key, ttlSeconds, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn("Cache set error:", error);
    return false;
  }
}

/**
 * Delete cached data
 */
export async function deleteFromCache(key: string): Promise<boolean> {
  try {
    const client = await getRedisClient();
    if (!client) return false;

    await client.del(key);
    return true;
  } catch (error) {
    console.warn("Cache delete error:", error);
    return false;
  }
}

/**
 * Delete cached data by pattern
 */
export async function deleteByPattern(pattern: string): Promise<number> {
  try {
    const client = await getRedisClient();
    if (!client) return 0;

    const keys = await client.keys(pattern);
    if (keys.length === 0) return 0;

    const deleted = await client.del(keys);
    return deleted;
  } catch (error) {
    console.warn("Cache delete by pattern error:", error);
    return 0;
  }
}

/**
 * Cache wrapper - attempts to get from cache, falls back to fetcher function
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  // Try to get from cache first
  const cached = await getFromCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetcher();

  // Cache the result (don't await to not block)
  setInCache(key, data, ttlSeconds).catch(console.warn);

  return data;
}

/**
 * Check if cache is available
 */
export async function isCacheAvailable(): Promise<boolean> {
  try {
    const client = await getRedisClient();
    if (!client) return false;

    await client.ping();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get cache stats (for monitoring)
 */
export async function getCacheStats(): Promise<{
  connected: boolean;
  memory?: string;
  keys?: number;
} | null> {
  try {
    const client = await getRedisClient();
    if (!client) return { connected: false };

    const info = await client.info("memory");
    const dbSize = await client.dbSize();

    const memoryMatch = info.match(/used_memory_human:(\S+)/);

    return {
      connected: true,
      memory: memoryMatch?.[1],
      keys: dbSize,
    };
  } catch {
    return { connected: false };
  }
}

/**
 * Cleanup - close Redis connection
 */
export async function closeCache(): Promise<void> {
  if (redisClient && isConnected) {
    await redisClient.quit();
    isConnected = false;
    redisClient = null;
  }
}
