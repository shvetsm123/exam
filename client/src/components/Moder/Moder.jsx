import React from 'react';
import OfferItem from './OfferItem/OfferItem';

const Moder = ({ offers, history }) => {
  const logOut = () => {
    localStorage.clear();
    history.replace('login');
  };

  const panelStyle = {
    margin: '1rem',
  };

  const headingStyle = {
    textAlign: 'center',
    fontSize: '2rem',
  };

  const offerItems = offers.map((offer) => (
    <OfferItem key={offer.id} {...offer} />
  ));

  return (
    <div style={panelStyle}>
      <h1 style={headingStyle}>MODER PANEL</h1>
      <button onClick={logOut}>log out</button>
      {offerItems}
    </div>
  );
};

export default Moder;
