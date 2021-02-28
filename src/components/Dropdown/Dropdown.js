import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactDropdown from 'react-dropdown';

import './Dropdown.scss';

const propTypes = {
  options: PropTypes.array,
  // The selected object in options
  value: PropTypes.object,
  placeholder: PropTypes.string,
  onChange: PropTypes.func
};

const arrowClosed = <FontAwesomeIcon className="dropdown__icon" icon="angle-down" />;
const arrowOpen = <FontAwesomeIcon className="dropdown__icon" icon="angle-up" />;

class Dropdown extends PureComponent {
  render () {
    return (
      <ReactDropdown
        options={this.props.options}
        value={this.props.value}
        placeholder={this.props.placeholder}
        onChange={this.props.onChange}

        className="dropdown"
        controlClassName="dropdown__control"
        placeholderClassName="dropdown__placeholder"
        menuClassName="dropdown__menu"
        arrowClosed={arrowClosed}
        arrowOpen={arrowOpen}
      />
    );
  }
}

Dropdown.propTypes = propTypes;

export default Dropdown;
