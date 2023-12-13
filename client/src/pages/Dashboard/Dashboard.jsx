import React from 'react';
import { connect } from 'react-redux';
import CONSTANTS from '../../constants';
import CustomerDashboard from '../../components/CustomerDashboard/CustomerDashboard';
import CreatorDashboard from '../../components/CreatorDashboard/CreatorDashboard';
import Header from '../../components/Header/Header';

const Dashboard = (props) => {
  const { role, history } = props;
  let dashboardComponent = null;

  if (role === CONSTANTS.CUSTOMER) {
    dashboardComponent = (
      <CustomerDashboard history={history} match={props.match} />
    );
  } else if (role === CONSTANTS.CREATOR) {
    dashboardComponent = (
      <CreatorDashboard history={history} match={props.match} />
    );
  } else {
    dashboardComponent = (
      <h1 style={{ fontSize: '2rem' }}>You should be creator/customer</h1>
    );
  }

  return (
    <div>
      <Header />
      {dashboardComponent}
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state.userStore.data,
});

export default connect(mapStateToProps)(Dashboard);
