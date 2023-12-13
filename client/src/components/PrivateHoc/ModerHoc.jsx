import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import CONSTANTS from '../../constants';
import { getUser } from '../../store/slices/userSlice';

const ModerHoc = (Component, props) => {
  class Hoc extends React.Component {
    componentDidMount() {
      if (!this.props.data) {
        this.props.getUser();
      }
    }

    render() {
      if (this.props.isFetching) {
        return null;
      }

      if (!this.props.data) {
        return (
          <Component
            history={this.props.history}
            match={this.props.match}
            {...props}
          />
        );
      }

      if (this.props.data.role !== CONSTANTS.MODER) {
        return <Redirect to="/" />;
      }

      return (
        <Component
          history={this.props.history}
          match={this.props.match}
          {...props}
        />
      );
    }
  }

  const mapStateToProps = (state) => state.userStore;

  const mapDispatchToProps = (dispatch) => ({
    getUser: () => dispatch(getUser()),
  });

  return connect(mapStateToProps, mapDispatchToProps)(Hoc);
};

export default ModerHoc;
