class ApiResponse {
  /**
   * Creates an instance of ApiResponse.
   * 
   * @param {number} statusCode - The HTTP status code.
   * @param {any} data - The response data.
   * @param {string} [message="success"] - The response message.
   */
  constructor(statusCode, data, message = "success") {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.status = statusCode < 400;
  }
}

/**
 * Sends a successful API response.
 * 
 * @param {object} res - The response object.
 * @param {number} statusCode - The HTTP status code.
 * @param {any} data - The response data.
 * @param {string} [message="success"] - The response message.
 * @returns {object} The response object.
 */

const ApiSuccessResponse = (res, statusCode, data, message) => {
  const api = new ApiResponse(statusCode, data, message);
  return res.status(api.statusCode).json({
    statusCode: api.statusCode,
    data: api.data,
    message: api.message,
    status: api.status
  });
}


export { ApiResponse, ApiSuccessResponse };   