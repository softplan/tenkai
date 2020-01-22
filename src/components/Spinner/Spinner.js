import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as reducer from 'stores/spinner/reducer';

class Spinner extends Component {
  render() {
    if (
      !!this.props &&
      !!this.props.loadingCount &&
      this.props.loadingCount > 0
    ) {
      return <div className="loading"></div>;
    } else {
      return <div></div>;
    }
  }
}

const mapStateToProps = state => ({
  loadingCount: reducer.getLoadingCount(state)
});

export default connect(mapStateToProps)(Spinner);
