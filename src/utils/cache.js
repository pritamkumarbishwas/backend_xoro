// src/utils/cache.js
const cache = {};
const CACHE_EXPIRATION = 3600 * 1000; // Cache expiration time in milliseconds (1 hour)

const isCacheValid = (key) => {
    const currentTime = Date.now();
    return cache[key] && (currentTime - cache[key].timestamp < CACHE_EXPIRATION);
};

const getCache = (key) => cache[key]?.data;

const setCache = (key, data) => {
    cache[key] = {
        data,
        timestamp: Date.now(),
    };
};

const clearCache = (key) => {
    delete cache[key];
};

// Clear specific cache entry by key
const clearCacheByKey = (key) => {
    if (cache[key]) {
        delete cache[key];
    }
};

export { isCacheValid, getCache, setCache, clearCache, clearCacheByKey };
