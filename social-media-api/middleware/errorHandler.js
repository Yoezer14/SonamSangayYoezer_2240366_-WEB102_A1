const errorResponse = require('../utils/errorResponse');

function errorHandler(err, req, res, next) {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  if (err.statusCode) statusCode = err.statusCode;
  if (err.name === 'ValidationError') statusCode = 400;

  const message = err.message || 'Server Error';

  res.status(statusCode).json({
    ...errorResponse(message, statusCode),
  });
}

module.exports = errorHandler;
