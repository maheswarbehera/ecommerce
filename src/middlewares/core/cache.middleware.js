import cacheInstance from "../../utils/cache.js";

const cacheKeyGenerator = ( keyGenerator, ttl = 60 ) => ( req, res, next ) => {

    const cacheKey = keyGenerator(req);
    const cached = cacheInstance.get(cacheKey);

    if (cached) {
        res.set('X-Cache-Status', 'Cached');
        return res.json(cached);
    }

    res.set('X-Cache-Status', 'No Cache');

    const originalJson = res.json.bind(res);
    res.json = (data) => {
        cacheInstance.set(cacheKey, data, ttl);
        originalJson(data);
    };
    next();

}

export default cacheKeyGenerator;