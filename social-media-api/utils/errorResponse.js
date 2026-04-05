/**
 * Build a consistent error payload for API responses.
 */
function errorResponse(message, statusCode = 500) {
  return {
    success: false,
    error: message,
    statusCode,
  };
}

module.exports = errorResponse;
