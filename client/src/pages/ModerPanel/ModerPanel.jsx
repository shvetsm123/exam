import React from 'react';
import { connect } from 'react-redux';
import {
  getAllPendingOffers,
  updateOfferModerStatus,
} from '../../store/slices/moderSlice';
import 'react-image-lightbox/style.css';
import Moder from '../../components/Moder/Moder';
import ReactPaginate from 'react-paginate';
import styles from './ModerPanel.module.sass';

class ModerPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      pageSize: 3,
    };
  }

  componentDidMount() {
    this.props.getAllPendingOffers();
  }

  handlePageClick = ({ selected }) => {
    this.setState({ currentPage: selected });
  };

  render() {
    const { allPendingOffers } = this.props.moderStore;
    const { currentPage, pageSize } = this.state;

    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const currentOffers = allPendingOffers.slice(startIndex, endIndex);

    return (
      <div>
        <Moder offers={currentOffers} history={this.props.history} />
        <ReactPaginate
          className={styles.pagination}
          activeClassName={styles.active}
          pageCount={Math.ceil(allPendingOffers.length / pageSize)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={2}
          onPageChange={this.handlePageClick}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { moderStore } = state;
  return { moderStore };
};

const mapDispatchToProps = (dispatch) => ({
  getAllPendingOffers: (data) => dispatch(getAllPendingOffers(data)),
  updateOfferModerStatus: (data) => dispatch(updateOfferModerStatus(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModerPanel);
