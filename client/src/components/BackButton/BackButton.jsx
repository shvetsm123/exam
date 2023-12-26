import React from 'react';
import { withRouter } from 'react-router-dom';
import styles from './BackButton.module.sass';

const BackButton = ({ history }) => {
  function clickHandler() {
    history.goBack();
  }

  return (
    <div onClick={clickHandler} className={styles.buttonContainer}>
      <span>Back</span>
    </div>
  );
};

export default withRouter(BackButton);
