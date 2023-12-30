import React from 'react';
import { connect } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import { updateOfferModerStatus } from '../../../store/slices/moderSlice';
import styles from './OfferItem.module.sass';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './confirmStyle.css';
import CONSTANTS from '../../../constants';

const OfferItem = ({
  id,
  updateOfferModerStatus,
  fileName,
  moderStatus,
  text,
  Contest,
  User,
  getAllPendingOffers,
}) => {
  const resolveOffer = () => {
    confirmAlert({
      title: 'Confirm',
      message: 'Are you sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: () =>
            handleOfferStatusChange(CONSTANTS.MODER_STATUS_ACCEPTED, id),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const rejectOffer = () => {
    confirmAlert({
      title: 'Confirm',
      message: 'Are you sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: () =>
            handleOfferStatusChange(CONSTANTS.MODER_STATUS_REJECTED, id),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const handleOfferStatusChange = async (status, offerId) => {
    await updateOfferModerStatus({
      offerId,
      moderStatus: status,
    });

    getAllPendingOffers();
  };

  return (
    <div className={styles.offerContainer}>
      <div className={styles.mainInfoContainer}>
        <div className={styles.responseConainer}>
          {fileName ? (
            <span className={styles.response}>
              Contest title: {Contest.title} <br /> <br />
              Creator's name: {User.displayName} <br /> <br />
              Offer: <br /> <br />
              <img
                className={styles.responseLogo}
                src={`${CONSTANTS.publicURL}${fileName}`}
                alt="logo"
              />
            </span>
          ) : (
            <span className={styles.response}>
              Contest title: {Contest.title} <br /> <br />
              Creator's name: {User.displayName} <br /> <br />
              Offer: {text}
            </span>
          )}
        </div>
      </div>
      {moderStatus === CONSTANTS.MODER_STATUS_PENDING && (
        <div className={styles.btnsContainer}>
          <div onClick={resolveOffer} className={styles.resolveBtn}>
            Resolve
          </div>
          <br />
          <div onClick={rejectOffer} className={styles.rejectBtn}>
            Reject
          </div>
        </div>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateOfferModerStatus: (data) => dispatch(updateOfferModerStatus(data)),
});

export default connect(null, mapDispatchToProps)(OfferItem);
