import React from 'react';
import styles from './NextButton.module.sass';

const NextButton = ({ submit }) => {
  return (
    <div onClick={submit} className={styles.buttonContainer}>
      <span>Next</span>
    </div>
  );
};

export default NextButton;
