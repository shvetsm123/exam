import React from 'react';
import styles from './Button.module.css';

const Button = ({ h3, p, isActive, onClick }) => {
  return (
    <div
      className={`${styles.div} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      <h3 className={styles.h3}>{h3}</h3>
      <p>{p}</p>
    </div>
  );
};

export default Button;
