const {
  Select,
  Rating,
  Contest,
  Offer,
  User,
  Sequelize,
  sequelize,
} = require('../models');
const ServerError = require('../errors/ServerError');
const contestQueries = require('./queries/contestQueries');
const userQueries = require('./queries/userQueries');
const controller = require('../socketInit');
const UtilFunctions = require('../utils/functions');
const CONSTANTS = require('../constants');
const { sendEmail } = require('../utils/sendEmail');

module.exports.dataForContest = async (req, res, next) => {
  const response = {};
  try {
    const {
      body: { characteristic1, characteristic2 },
    } = req;
    const types = [characteristic1, characteristic2, 'industry'].filter(
      Boolean
    );

    const characteristics = await Select.findAll({
      where: {
        type: {
          [Sequelize.Op.or]: types,
        },
      },
    });
    if (!characteristics) {
      return next(new ServerError());
    }
    characteristics.forEach((characteristic) => {
      if (!response[characteristic.type]) {
        response[characteristic.type] = [];
      }
      response[characteristic.type].push(characteristic.describe);
    });
    res.send(response);
  } catch (err) {
    console.log(err);
    next(new ServerError('cannot get contest preferences'));
  }
};

module.exports.getContestById = async (req, res, next) => {
  try {
    let contestInfo = await Contest.findOne({
      where: { id: req.headers.contestid },
      order: [[Offer, 'id', 'asc']],
      include: [
        {
          model: User,
          required: true,
          attributes: {
            exclude: ['password', 'role', 'balance', 'accessToken'],
          },
        },
        {
          model: Offer,
          required: false,
          where: {
            ...(req.tokenData.role === CONSTANTS.CUSTOMER && {
              moderStatus: CONSTANTS.MODER_STATUS_ACCEPTED,
            }),
            ...(req.tokenData.role === CONSTANTS.CREATOR && {
              userId: req.tokenData.userId,
            }),
          },
          attributes: { exclude: ['userId', 'contestId'] },
          include: [
            {
              model: User,
              required: true,
              attributes: {
                exclude: ['password', 'role', 'balance', 'accessToken'],
              },
            },
            {
              model: Rating,
              required: false,
              where: { userId: req.tokenData.userId },
              attributes: { exclude: ['userId', 'offerId'] },
            },
          ],
        },
      ],
    });
    contestInfo = contestInfo.get({ plain: true });
    contestInfo.Offers.forEach((offer) => {
      if (offer.Rating) {
        offer.mark = offer.Rating.mark;
      }
      delete offer.Rating;
    });
    res.send(contestInfo);
  } catch (e) {
    next(new ServerError());
    console.log('the error is: ', e.message);
  }
};

module.exports.downloadFile = async (req, res, next) => {
  const file = CONSTANTS.CONTESTS_DEFAULT_DIR + req.params.fileName;
  res.download(file);
};

module.exports.updateContest = async (req, res, next) => {
  if (req.file) {
    req.body.fileName = req.file.filename;
    req.body.originalFileName = req.file.originalname;
  }
  const contestId = req.body.contestId;
  delete req.body.contestId;
  try {
    const updatedContest = await contestQueries.updateContest(req.body, {
      id: contestId,
      userId: req.tokenData.userId,
    });
    res.send(updatedContest);
  } catch (e) {
    next(e);
  }
};

module.exports.setNewOffer = async (req, res, next) => {
  const obj = {};
  if (req.body.contestType === CONSTANTS.LOGO_CONTEST) {
    obj.fileName = req.file.filename;
    obj.originalFileName = req.file.originalname;
  } else {
    obj.text = req.body.offerData;
  }
  obj.userId = req.tokenData.userId;
  obj.contestId = req.body.contestId;
  try {
    const result = await contestQueries.createOffer(obj);
    delete result.contestId;
    delete result.userId;
    controller
      .getNotificationController()
      .emitEntryCreated(req.body.customerId);
    const User = Object.assign({}, req.tokenData, { id: req.tokenData.userId });
    res.send(Object.assign({}, result, { User }));
  } catch (e) {
    return next(new ServerError());
  }
};

const rejectOffer = async (offerId, creatorId, contestId) => {
  const rejectedOffer = await contestQueries.updateOffer(
    { status: CONSTANTS.OFFER_STATUS_REJECTED },
    { id: offerId }
  );
  controller
    .getNotificationController()
    .emitChangeOfferStatus(
      creatorId,
      'Someone of yours offers was rejected',
      contestId
    );
  return rejectedOffer;
};

const resolveOffer = async (
  contestId,
  creatorId,
  orderId,
  offerId,
  priority,
  transaction
) => {
  const finishedContest = await contestQueries.updateContestStatus(
    {
      status: sequelize.literal(`CASE
            WHEN "id"=${contestId}  AND "orderId"='${orderId}' THEN '${
        CONSTANTS.CONTEST_STATUS_FINISHED
      }'
            WHEN "orderId"='${orderId}' AND "priority"=${priority + 1}  THEN '${
        CONSTANTS.CONTEST_STATUS_ACTIVE
      }'
            ELSE '${CONSTANTS.CONTEST_STATUS_PENDING}'
            END
    `),
    },
    { orderId },
    transaction
  );

  await userQueries.updateUser(
    { balance: sequelize.literal('balance + ' + finishedContest.prize) },
    creatorId,
    transaction
  );

  const updatedOffers = await contestQueries.updateOfferStatus(
    {
      status: sequelize.literal(`CASE
            WHEN "id"=${offerId} THEN '${CONSTANTS.OFFER_STATUS_WON}'
            ELSE '${CONSTANTS.OFFER_STATUS_REJECTED}'
            END
    `),
    },
    {
      contestId,
    },
    transaction
  );

  await contestQueries.updateModerStatusesForContest(
    { moderStatus: CONSTANTS.MODER_STATUS_REJECTED },
    { contestId },
    transaction
  );

  transaction.commit();

  const arrayRoomsId = [];
  updatedOffers.forEach((offer) => {
    if (
      offer.status === CONSTANTS.OFFER_STATUS_WON &&
      creatorId !== offer.userId
    ) {
      arrayRoomsId.push(offer.userId);
    }
  });

  controller
    .getNotificationController()
    .emitChangeOfferStatus(
      creatorId,
      'Congrats! You just won a contest!',
      contestId
    );

  const updatedOffer = updatedOffers.find((offer) => offer.id === offerId);
  return updatedOffer ? updatedOffer.dataValues : null;
};

module.exports.setOfferStatus = async (req, res, next) => {
  let transaction;
  if (req.body.command === 'reject') {
    try {
      const offer = await rejectOffer(
        req.body.offerId,
        req.body.creatorId,
        req.body.contestId
      );
      res.send(offer);
    } catch (err) {
      next(err);
    }
  } else if (req.body.command === 'resolve') {
    try {
      transaction = await sequelize.transaction();
      const winningOffer = await resolveOffer(
        req.body.contestId,
        req.body.creatorId,
        req.body.orderId,
        req.body.offerId,
        req.body.priority,
        transaction
      );
      res.send(winningOffer);
    } catch (err) {
      transaction.rollback();
      next(err);
    }
  }
};

module.exports.getCustomersContests = async (req, res, next) => {
  try {
    const contests = await Contest.findAll({
      where: { status: req.headers.status, userId: req.tokenData.userId },
      limit: req.body.limit,
      offset: req.body.offset ? req.body.offset : 0,
      order: [['id', 'DESC']],
      include: [
        {
          model: Offer,
          required: false,
          attributes: ['id', 'moderStatus'],
        },
      ],
    });

    contests.forEach((contest) => {
      const acceptedOffers = contest.Offers.filter(
        (offer) =>
          offer.dataValues.moderStatus === CONSTANTS.MODER_STATUS_ACCEPTED
      );

      contest.dataValues.count = acceptedOffers.length;
    });

    let haveMore = true;
    if (contests.length === 0) {
      haveMore = false;
    }

    res.send({ contests, haveMore });
  } catch (err) {
    console.error('Error in getCustomersContests:', err);
    next(new ServerError(err));
  }
};

module.exports.getContests = async (req, res, next) => {
  const predicates = UtilFunctions.createWhereForAllContests(
    req.body.typeIndex,
    req.body.contestId,
    req.body.industry,
    req.body.awardSort
  );
  await Contest.findAll({
    where: predicates.where,
    order: predicates.order,
    limit: req.body.limit,
    offset: req.body.offset ? req.body.offset : 0,
    include: [
      {
        model: Offer,
        required: req.body.ownEntries,
        where: req.body.ownEntries ? { userId: req.tokenData.userId } : {},
        attributes: ['id'],
      },
    ],
  })
    .then(async (contests) => {
      const updatedContests = await Promise.all(
        contests.map(async (contest) => {
          const offersCount = await Offer.count({
            where: {
              contestId: contest.id,
              userId: req.tokenData.userId,
            },
          });
          return {
            ...contest.toJSON(),
            count: offersCount,
          };
        })
      );
      let haveMore = true;
      if (contests.length === 0) {
        haveMore = false;
      }

      res.send({ contests: updatedContests, haveMore });
    })
    .catch((err) => {
      next(new ServerError());
    });
};

module.exports.getAllPendingOffers = async (req, res, next) => {
  try {
    const allOffers = await Offer.findAll({
      ...req.pagination,
      where: { moderStatus: CONSTANTS.MODER_STATUS_PENDING },
      include: [User, Contest],
    });
    res.send(allOffers);
  } catch (error) {
    next(new ServerError());
  }
};

module.exports.getOneOffer = async (req, res, next) => {
  try {
    const {
      params: { offerId },
    } = req;
    const offer = await Offer.findByPk(offerId);
    if (!offer) {
      return res.status(404).send({ error: 'Offer not found' });
    }
    res.send(offer);
  } catch (error) {
    next(new ServerError());
  }
};

module.exports.updateOfferModerStatus = async (req, res, next) => {
  try {
    const {
      params: { offerId },
      body: { moderStatus },
    } = req;

    const offer = await Offer.findByPk(offerId, {
      include: [
        {
          model: User,
          attributes: ['email'],
        },
      ],
    });

    const userEmail = offer.User.email;

    const currentModerStatus = offer.moderStatus;
    if (currentModerStatus !== moderStatus) {
      await offer.update({ moderStatus });

      const recipientEmail = userEmail;
      const emailSubject = 'Moder Status Upgrade';
      const emailHtml = `Your offer status was upgraded to ${moderStatus}`;

      const url = await sendEmail(recipientEmail, emailSubject, emailHtml);

      res.send({ offerId, moderStatus, url });
    } else {
      res.send({ offerId, currentModerStatus });
    }
  } catch (error) {
    console.error('Error in updateOfferModerStatus:', error);
    next(new ServerError());
  }
};
