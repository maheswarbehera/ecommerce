import { ApiError, ApiErrorResponse } from "./ApiError.js";
import { ApiResponse, ApiSuccessResponse } from "./ApiResponse.js";
import { asyncHandler } from "./asyncHandler.js";
import { sendMail } from "./email.js";
import { uploadOnCloudinary } from "./cloudinary.js";

export const sharedUtils = {
    ApiError,
    ApiErrorResponse,
    ApiResponse,
    ApiSuccessResponse,
    asyncHandler,
    sendMail,
    uploadOnCloudinary,
}

export default sharedUtils;