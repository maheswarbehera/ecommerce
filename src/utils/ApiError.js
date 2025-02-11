class ApiError extends Error {
    constructor(
        statusCode,  
        message = "Internal server error",      
    )
    {
        super(message);
        this.statusCode = statusCode  
        this.status = false
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor)
        
    }
}

const ApiErrorResponse = (statusCode, message , next) => {
    if (typeof statusCode !== 'number' || statusCode < 100 || statusCode > 599) {
        statusCode = 500; // Default to 500 if the status code is invalid
    }

    const error = new ApiError(statusCode, message);
    if (typeof next === 'function') {
        next(error); // Pass the error to the next middleware function
    } else {
        throw new Error('next() is not a function');
    } 
}

export { ApiError, ApiErrorResponse }
  