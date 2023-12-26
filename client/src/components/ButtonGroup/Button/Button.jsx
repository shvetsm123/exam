import React from 'react';
import styles from './Button.module.css';

const Button = ({ h3, p }) => {
  return (
    <div className={styles.div}>
      <h3 className={styles.h3}>{h3}</h3>
      <p>{p}</p>
    </div>
  );
};

export default Button;
