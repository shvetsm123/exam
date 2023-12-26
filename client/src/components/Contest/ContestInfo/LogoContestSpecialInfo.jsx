import React from 'react';
import styles from './ContestInfo.module.sass';

const LogoContestSpecialInfo = ({ nameVenture, brandStyle }) => {
  return (
    <>
      {nameVenture && (
        <div className={styles.dataContainer}>
          <span className={styles.label}>Name ventrure</span>
          <span className={styles.data}>{nameVenture}</span>
        </div>
      )}
      <div className={styles.dataContainer}>
        <span className={styles.label}>Brand Style</span>
        <span className={styles.data}>{brandStyle}</span>
      </div>
    </>
  );
};

export default LogoContestSpecialInfo;
