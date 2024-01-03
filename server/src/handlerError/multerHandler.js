const { MulterError } = require('multer');
const badRequestError = require('../errors/BadRequestError');

module.exports = (err, req, res, next) => {
  if (err instanceof MulterError) {
    return next(new badRequestError('Invalid file'));
  } else {
    return next(err);
  }
};
