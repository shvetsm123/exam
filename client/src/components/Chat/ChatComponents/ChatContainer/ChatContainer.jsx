import React from 'react';
import { connect } from 'react-redux';
import Chat from '../Chat/Chat';
import CONSTANTS from '../../../../constants';

const ChatContainer = (props) => {
  const { data } = props;
  console.log('data:', data);
  return <>{data && data.role !== CONSTANTS.MODER ? <Chat /> : null}</>;
};

const mapStateToProps = (state) => {
  const { data } = state.userStore;
  return { data };
};

export default connect(mapStateToProps, null)(ChatContainer);
