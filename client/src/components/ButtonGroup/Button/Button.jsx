import React from 'react';
import styles from './Button.module.css';

const Button = (props) => {
  return (
    <div className={styles.div}>
      <h3 className={styles.h3}>{props.h3}</h3>
      <p>{props.p}</p>
    </div>
  );
};

export default Button;
