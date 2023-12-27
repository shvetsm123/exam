import React from 'react';
import Timer from '../../components/Timer/Timer';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './Events.module.css';

const Events = () => {
  return (
    <div>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.h1}>BE READY FOR EVENTS</h1>
        <p className={styles.p}>* - required</p>
        <hr />
        <Timer />
      </div>

      <Footer />
    </div>
  );
};

export default Events;
