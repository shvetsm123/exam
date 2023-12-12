import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { pay, clearPaymentStore } from '../../store/slices/paymentSlice';
import PayForm from '../../components/PayForm/PayForm';
import styles from './Payment.module.sass';
import CONSTANTS from '../../constants';
import Error from '../../components/Error/Error';

const Payment = (props) => {
  const { contests } = props.contestCreationStore;
  const { error } = props.payment;

  useEffect(() => {
    if (isEmpty(contests)) {
      props.history.replace('startContest');
    }
  }, [contests, props.history]);

  const handlePay = (values) => {
    const { contests } = props.contestCreationStore;
    const contestArray = Object.values(contests).map((contest) => ({
      ...contest,
    }));
    const { number, expiry, cvc } = values;

    const data = new FormData();
    contestArray.forEach((contest) => {
      data.append('files', contest.file);
      contest.haveFile = !!contest.file;
    });

    data.append('number', number);
    data.append('expiry', expiry);
    data.append('cvc', cvc);
    data.append('contests', JSON.stringify(contestArray));
    data.append('price', '100');

    props.pay({
      data: { formData: data },
      history: props.history,
    });
  };

  const goBack = () => {
    props.history.goBack();
  };

  return (
    <div>
      <div className={styles.header}>
        <img
          src={`${CONSTANTS.STATIC_IMAGES_PATH}blue-logo.png`}
          alt="blue-logo"
        />
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.paymentContainer}>
          <span className={styles.headerLabel}>Checkout</span>
          {error && (
            <Error
              data={error.data}
              status={error.status}
              clearError={props.clearPaymentStore}
            />
          )}
          <PayForm sendRequest={handlePay} back={goBack} isPayForOrder />
        </div>
        <div className={styles.orderInfoContainer}>
          <span className={styles.orderHeader}>Order Summary</span>
          <div className={styles.packageInfoContainer}>
            <span className={styles.packageName}>Package Name: Standard</span>
            <span className={styles.packagePrice}>$100 USD</span>
          </div>
          <div className={styles.resultPriceContainer}>
            <span>Total:</span>
            <span>$100.00 USD</span>
          </div>
          <a href="/">Have a promo code?</a>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  payment: state.payment,
  contestCreationStore: state.contestCreationStore,
});

const mapDispatchToProps = (dispatch) => ({
  pay: ({ data, history }) => dispatch(pay({ data, history })),
  clearPaymentStore: () => dispatch(clearPaymentStore()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
