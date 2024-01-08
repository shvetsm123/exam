const { Contest, Offer } = require('../../models');
const ServerError = require('../../errors/ServerError');
const CONSTANTS = require('../../constants');

module.exports.updateContest = async (data, predicate, transaction) => {
  const [updatedCount, [updatedContest]] = await Contest.update(data, {
    where: predicate,
    returning: true,
    transaction,
  });
  if (updatedCount !== 1) {
    throw new ServerError('cannot update Contest');
  } else {
    return updatedContest.dataValues;
  }
};

module.exports.updateModerStatusesForContest = async (
  data,
  predicate,
  transaction
) => {
  const [updatedCount] = await Offer.update(data, {
    where: {
      ...predicate,
      moderStatus: CONSTANTS.MODER_STATUS_PENDING,
    },
    transaction,
  });

  if (updatedCount < 1) {
    throw new ServerError('Cannot update moderStatus');
  }
};

module.exports.updateContestStatus = async (data, predicate, transaction) => {
  const updateResult = await Contest.update(data, {
    where: predicate,
    returning: true,
    transaction,
  });
  if (updateResult[0] < 1) {
    throw new ServerError('cannot update Contest');
  } else {
    return updateResult[1][0].dataValues;
  }
};

module.exports.updateOffer = async (data, predicate, transaction) => {
  const [updatedCount, [updatedOffer]] = await Offer.update(data, {
    where: predicate,
    returning: true,
    transaction,
  });
  if (updatedCount !== 1) {
    throw new ServerError('cannot update offer!');
  } else {
    return updatedOffer.dataValues;
  }
};

module.exports.updateOfferStatus = async (data, predicate, transaction) => {
  const result = await Offer.update(data, {
    where: predicate,
    returning: true,
    transaction,
  });
  if (result[0] < 1) {
    throw new ServerError('cannot update offer!');
  } else {
    return result[1];
  }
};

module.exports.createOffer = async (data) => {
  const result = await Offer.create(data);
  if (!result) {
    throw new ServerError('cannot create new Offer');
  } else {
    return result.get({ plain: true });
  }
};
