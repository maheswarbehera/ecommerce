import NodeCache from "node-cache"

const cacheInstance = new NodeCache({
    stdTTL: 60,
    checkperiod: 120,
    useClones: false
});

export const clearCacheByKey = (key) => {
    cacheInstance.del(key);
};

export default cacheInstance;