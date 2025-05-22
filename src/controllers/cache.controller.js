import { ApiErrorResponse } from "../utils/ApiError.js";
import { ApiSuccessResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import cacheInstance from "../utils/cache.js";

const clearCache = asyncHandler(async (req, res, next) => {
    const cacheKeys = cacheInstance.keys();

    if (cacheKeys.length === 0) {
        return ApiErrorResponse(404, "No cache to clear", next);
    }

    const deletedCount = cacheInstance.del(cacheKeys);

    return ApiSuccessResponse(res, 200, {
        deletedCount,
        clearedKeys: cacheKeys  
    }, "Cache cleared successfully");
});


const getCache = asyncHandler(async (req, res, next) => {
    const cacheKeys = cacheInstance.keys();
    if (cacheKeys.length === 0) {
        return ApiErrorResponse(404, "No cache available", next);
    }
    const values = cacheKeys.map(key => ({
        key,
        values: cacheInstance.get(key)
    }));

    return ApiSuccessResponse(res, 200, { keys: cacheKeys }, "All cache keys");
});

export const cacheController = {
    getCache,
    clearCache
}
