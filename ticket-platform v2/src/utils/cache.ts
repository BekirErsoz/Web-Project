interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface CacheResult<T> {
  data: T | null;
  expired: boolean;
}

// Önbellek süresi (10 dakika)
const CACHE_EXPIRY = 10 * 60 * 1000;

// Önbellek objeleri
const cache: { [key: string]: CacheItem<any> } = {};

/**
 * Veriyi önbelleğe kaydetme
 */
export const saveToCache = <T>(key: string, data: T, expiryMs: number = CACHE_EXPIRY): void => {
  cache[key] = {
    data,
    timestamp: Date.now() + expiryMs
  };
};

/**
 * Veriyi önbellekten getirme
 */
export const getFromCache = <T>(key: string): CacheResult<T> => {
  const item = cache[key] as CacheItem<T> | undefined;
  
  if (!item) {
    return { data: null, expired: true };
  }
  
  const now = Date.now();
  const expired = now > item.timestamp;
  
  return { 
    data: item.data,
    expired
  };
};

/**
 * Önbellekteki öğeyi silme
 */
export const removeFromCache = (key: string): void => {
  delete cache[key];
};

/**
 * Önbelleği tamamen temizleme
 */
export const clearCache = (): void => {
  Object.keys(cache).forEach(key => {
    delete cache[key];
  });
}; 