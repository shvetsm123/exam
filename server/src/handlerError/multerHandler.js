const { MulterError } = require('multer');
const badRequestError = require('../errors/BadRequestError');

module.exports = async (err, req, res, next) => {
  if (err instanceof MulterError) {
    return next(new badRequestError('Invalid file'));
  } else {
    next(err);
  }
};
