import mongoose from "mongoose"; 
import sharedUtils from "../utils/index.js";

/**
 * Middleware to validate MongoDB ObjectId
 * Checks if the provided ID is valid as a MongoDB ObjectId.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

const { ApiErrorResponse } = sharedUtils;
const validateObjectId = (req, res, next) => { 
    let id = null;
    req.params.id ? id = req.params.id : req.body.id ? id = req.body.id : req.query.id ? id = req.query.id : id;

    if (!mongoose.Types.ObjectId.isValid(id)) return ApiErrorResponse(422, "The provided ID is not a valid MongoDB ObjectId.", next); 
    
    next();
};

export { validateObjectId };