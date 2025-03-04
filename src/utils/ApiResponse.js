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
  const response ={
    statusCode: api.statusCode,
    message: api.message,
    status: api.status
  }
  if (data !== null && data !== undefined) {
    // If `data` is an object with a single key, use that key instead of "data"
    if (typeof data === "object" && !Array.isArray(data) && Object.keys(data).length === 1) {
      const key = Object.keys(data)[0]; // Get the first key dynamically
      response[key] = data[key]; // Use the key dynamically instead of "data"
    } else {
      response.data = api.data; // Default to "data" if multiple fields or not an object
    }
  }
  return res.status(statusCode).json(response);
}

export { ApiResponse, ApiSuccessResponse };   