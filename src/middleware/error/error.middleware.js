const errorMiddleware = (err, req, res, next) => {
  res.status(err.status || 500);
  return res.json({
    errorMessage: err.message || 'Internal server error'
  });
};

module.exports = {
  errorMiddleware
};
