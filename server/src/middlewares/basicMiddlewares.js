const { Contest, Sequelize } = require('../models');
const NotFound = require('../errors/UserNotFoundError');
const RightsError = require('../errors/RightsError');
const ServerError = require('../errors/ServerError');
const CONSTANTS = require('../constants');

module.exports.parseBody = (req, res, next) => {
  req.body.contests = JSON.parse(req.body.contests);
  if (req.files && req.body.contests) {
    req.body.contests = req.body.contests.map((contest, index) => {
      if (contest.haveFile && req.files.length > 0) {
        const file = req.files.splice(0, 1)[0];
        contest.fileName = file.filename;
        contest.originalFileName = file.originalname;
      }
      return contest;
    });
  }

  next();
};

module.exports.canGetContest = async (req, res, next) => {
  let result = null;
  try {
    if (req.tokenData.role === CONSTANTS.CUSTOMER) {
      result = await Contest.findOne({
        where: { id: req.headers.contestid, userId: req.tokenData.userId },
      });
    } else if (req.tokenData.role === CONSTANTS.CREATOR) {
      result = await Contest.findOne({
        where: {
          id: req.headers.contestid,
          status: {
            [Sequelize.Op.or]: [
              CONSTANTS.CONTEST_STATUS_ACTIVE,
              CONSTANTS.CONTEST_STATUS_FINISHED,
            ],
          },
        },
      });
    }
    result ? next() : next(new RightsError());
  } catch (e) {
    next(new ServerError(e));
  }
};

module.exports.onlyForCreative = (req, res, next) => {
  if (req.tokenData.role === CONSTANTS.CUSTOMER) {
    next(new RightsError());
  } else {
    next();
  }
};

module.exports.onlyForCustomer = (req, res, next) => {
  if (req.tokenData.role === CONSTANTS.CREATOR) {
    return next(new RightsError('this page only for customers'));
  } else {
    next();
  }
};

module.exports.canSendOffer = async (req, res, next) => {
  if (req.tokenData.role === CONSTANTS.CUSTOMER) {
    return next(new RightsError());
  }
  try {
    const result = await Contest.findOne({
      where: {
        id: req.body.contestId,
      },
      attributes: ['status'],
    });
    if (
      result.get({ plain: true }).status === CONSTANTS.CONTEST_STATUS_ACTIVE
    ) {
      next();
    } else {
      return next(new RightsError());
    }
  } catch (e) {
    next(new ServerError());
  }
};

module.exports.onlyForCustomerWhoCreateContest = async (req, res, next) => {
  try {
    const result = await Contest.findOne({
      where: {
        userId: req.tokenData.userId,
        id: req.body.contestId,
        status: CONSTANTS.CONTEST_STATUS_ACTIVE,
      },
    });
    if (!result) {
      return next(new RightsError());
    }
    next();
  } catch (e) {
    next(new ServerError());
  }
};

module.exports.canUpdateContest = async (req, res, next) => {
  try {
    const result = await Contest.findOne({
      where: {
        userId: req.tokenData.userId,
        id: req.body.contestId,
        status: { [Sequelize.Op.not]: CONSTANTS.CONTEST_STATUS_FINISHED },
      },
    });
    if (!result) {
      return next(new RightsError());
    }
    next();
  } catch (e) {
    next(new ServerError());
  }
};
