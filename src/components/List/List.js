import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';

import './List.scss';

const propTypes = {
  data: PropTypes.array,
  // Used to re-render the PureComponent List
  extraData: PropTypes.string,
  renderHeader: PropTypes.func,
  renderLoading: PropTypes.func,
  renderItem: PropTypes.func
};

class List extends PureComponent {
  ref = React.createRef();

  render () {
    const isLoading = this.props.data === undefined;

    return (
      <div className="list">
        {this.props.renderHeader && this.props.renderHeader(isLoading)}
        <Scrollbars
          ref={this.ref}
          className="list__scrollable-container"
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
        >
          {isLoading && this.props.renderLoading && this.props.renderLoading()}
          {!isLoading && this.props.data.map((item, index) => this.props.renderItem(item, index))}
        </Scrollbars>
      </div>
    );
  }

  scrollTop (top) {
    this.ref.current && this.ref.current.scrollTop(top);
  }
}

List.propTypes = propTypes;

export default List;
