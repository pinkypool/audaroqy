export const CACHE_PREFIX = 'audaroky_cache_';

export interface CacheItem<T> {
    value: T;
    timestamp: number;
}

export const getFromCache = <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(CACHE_PREFIX + key);
    if (!item) return null;
    try {
        const parsed: CacheItem<T> = JSON.parse(item);
        // Optional: Add expiration logic here if needed
        return parsed.value;
    } catch (e) {
        console.error('Cache parse error', e);
        return null;
    }
};

export const saveToCache = <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    const item: CacheItem<T> = {
        value,
        timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
};
