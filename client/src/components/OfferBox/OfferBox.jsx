import React from 'react';
import { connect } from 'react-redux';
import Rating from 'react-rating';
import { withRouter } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { confirmAlert } from 'react-confirm-alert';
import { goToExpandedDialog } from '../../store/slices/chatSlice';
import {
  changeMark,
  clearChangeMarkError,
  changeShowImage,
} from '../../store/slices/contestByIdSlice';
import CONSTANTS from '../../constants';
import styles from './OfferBox.module.sass';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './confirmStyle.css';

const OfferBox = ({
  messagesPreview,
  id,
  data,
  setOfferStatus,
  clearError,
  changeMark: handleChangeMark,
  goToExpandedDialog,
  role,
  contestType,
  changeShowImage,
  needButtons,
}) => {
  const findConversationInfo = () => {
    const participants = [id, data.User.id];
    participants.sort(
      (participant1, participant2) => participant1 - participant2
    );
    for (let i = 0; i < messagesPreview.length; i++) {
      if (isEqual(participants, messagesPreview[i].participants)) {
        return {
          participants: messagesPreview[i].participants,
          id: messagesPreview[i].id,
          blackList: messagesPreview[i].blackList,
          favoriteList: messagesPreview[i].favoriteList,
        };
      }
    }
    return null;
  };

  const resolveOffer = () => {
    confirmAlert({
      title: 'confirm',
      message: 'Are u sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => setOfferStatus(data.User.id, data.id, 'resolve'),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const rejectOffer = () => {
    confirmAlert({
      title: 'confirm',
      message: 'Are u sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => setOfferStatus(data.User.id, data.id, 'reject'),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const changeMark = (value) => {
    clearError();
    handleChangeMark({
      mark: value,
      offerId: data.id,
      isFirst: !data.mark,
      creatorId: data.User.id,
    });
  };

  const offerStatus = () => {
    const { status } = data;
    if (status === CONSTANTS.OFFER_STATUS_REJECTED) {
      return (
        <i
          className={classNames('fas fa-times-circle reject', styles.reject)}
        />
      );
    }
    if (status === CONSTANTS.OFFER_STATUS_WON) {
      return (
        <i
          className={classNames('fas fa-check-circle resolve', styles.resolve)}
        />
      );
    }
    return null;
  };

  const moderStatus = () => {
    const { moderStatus } = data;
    if (moderStatus === CONSTANTS.MODER_STATUS_PENDING) {
      return CONSTANTS.MODER_STATUS_PENDING;
    }
    if (moderStatus === CONSTANTS.MODER_STATUS_ACCEPTED) {
      return CONSTANTS.MODER_STATUS_ACCEPTED;
    }
    if (moderStatus === CONSTANTS.MODER_STATUS_REJECTED) {
      return CONSTANTS.MODER_STATUS_REJECTED;
    }
  };

  const goChat = () => {
    goToExpandedDialog({
      interlocutor: data.User,
      conversationData: findConversationInfo(),
    });
  };

  const { avatar, firstName, lastName, email, rating } = data.User;
  return (
    <div className={styles.offerContainer}>
      {offerStatus()}
      <div className={styles.mainInfoContainer}>
        <div className={styles.userInfo}>
          <div className={styles.creativeInfoContainer}>
            <img
              src={
                avatar === 'anon.png'
                  ? CONSTANTS.ANONYM_IMAGE_PATH
                  : `${CONSTANTS.publicURL}${avatar}`
              }
              alt="user"
            />
            <div className={styles.nameAndEmail}>
              <span>{`${firstName} ${lastName}`}</span>
              <span>{email}</span>
            </div>
          </div>
          <div className={styles.creativeRating}>
            <span className={styles.userScoreLabel}>Creative Rating </span>
            <Rating
              initialRating={rating}
              fractions={2}
              fullSymbol={
                <img
                  src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`}
                  alt="star"
                />
              }
              placeholderSymbol={
                <img
                  src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`}
                  alt="star"
                />
              }
              emptySymbol={
                <img
                  src={`${CONSTANTS.STATIC_IMAGES_PATH}star-outline.png`}
                  alt="star-outline"
                />
              }
              readonly
            />
          </div>
          <div style={{ color: '#556da5', fontSize: '15px' }}>
            moderation status: {moderStatus()}
          </div>
        </div>
        <div className={styles.responseConainer}>
          {contestType === CONSTANTS.LOGO_CONTEST ? (
            <img
              onClick={() =>
                changeShowImage({
                  imagePath: data.fileName,
                  isShowOnFull: true,
                })
              }
              className={styles.responseLogo}
              src={`${CONSTANTS.publicURL}${data.fileName}`}
              alt="logo"
            />
          ) : (
            <span className={styles.response}>{data.text}</span>
          )}
          {data.User.id !== id && (
            <Rating
              fractions={2}
              fullSymbol={
                <img
                  src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`}
                  alt="star"
                />
              }
              placeholderSymbol={
                <img
                  src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`}
                  alt="star"
                />
              }
              emptySymbol={
                <img
                  src={`${CONSTANTS.STATIC_IMAGES_PATH}star-outline.png`}
                  alt="star"
                />
              }
              onClick={changeMark}
              placeholderRating={data.mark}
            />
          )}
        </div>
        {role !== CONSTANTS.CREATOR && (
          <i onClick={goChat} className="fas fa-comments" />
        )}
      </div>
      {needButtons(data.status) && (
        <div className={styles.btnsContainer}>
          <div onClick={resolveOffer} className={styles.resolveBtn}>
            Resolve
          </div>
          <div onClick={rejectOffer} className={styles.rejectBtn}>
            Reject
          </div>
        </div>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  changeMark: (data) => dispatch(changeMark(data)),
  clearError: () => dispatch(clearChangeMarkError()),
  goToExpandedDialog: (data) => dispatch(goToExpandedDialog(data)),
  changeShowImage: (data) => dispatch(changeShowImage(data)),
});

const mapStateToProps = (state) => {
  const { changeMarkError } = state.contestByIdStore;
  const { id, role } = state.userStore.data;
  const { messagesPreview } = state.chatStore;
  return {
    changeMarkError,
    id,
    role,
    messagesPreview,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OfferBox)
);
