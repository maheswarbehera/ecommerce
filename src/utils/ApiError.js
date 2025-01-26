class ApiError extends Error {
    constructor(
        statusCode,  
        message = "Internal server error",      
    )
    {
        super(message);
        this.statusCode = statusCode 
        this.message = message 
        this.status = false
       
        Error.captureStackTrace(this, this.constructor)
        
    }
}

// const ApiErrorResponse = (res, statusCode, message ) => {
//     const error = new ApiError(statusCode, message);
//     return res.status(error.statusCode).json({
//         statusCode: error.statusCode, 
//         message: error.message, 
//         status: error.status,
//     })
// }
const ApiErrorResponse = (statusCode, message , next) => {
    if (typeof statusCode !== 'number' || statusCode < 100 || statusCode > 599) {
        statusCode = 500; // Default to 500 if the status code is invalid
    }

    const error = new ApiError(statusCode, message);
    next(error)
}

export { ApiError, ApiErrorResponse }
  