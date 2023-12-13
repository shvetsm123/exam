import React from 'react';
import OfferItem from './OfferItem/OfferItem';

const Moder = ({ offers, history }) => {
  const logOut = () => {
    localStorage.clear();
    history.replace('login');
  };
  return (
    <div style={{ margin: '1rem' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2rem' }}>MODER PANEL</h1>
      <button onClick={logOut}>log out</button>
      {offers.map((offer) => (
        <OfferItem key={offer.id} {...offer} />
      ))}
    </div>
  );
};

export default Moder;
