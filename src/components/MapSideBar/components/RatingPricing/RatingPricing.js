import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './RatingPricing.scss';

const propTypes = {
  rating: PropTypes.number,
  pricing: PropTypes.number
};

class RatingPricing extends PureComponent {
  render () {
    const { rating, pricing } = this.props;
    if (rating === undefined && pricing === undefined) {
      return null;
    }

    // Rating stars
    let starCount = rating, stars = [];
    while (starCount > 0) {
      stars.push(<FontAwesomeIcon
        key={`star-${starCount}`}
        icon={starCount < 1 ? "star-half-alt" : "star"}
        className="rating-pricing__star-icon"
      />);
      starCount--;
    }

    // Pricing icons
    let pricingIcons = [];
    for (let i = 0; i < pricing; i++) {
      pricingIcons.push(<FontAwesomeIcon
        key={`pricing-${i}`}
        icon="dollar-sign"
        className="rating-pricing__pricing-icon"
      />);
    }

    return (
      <div className="rating-pricing">
        {!!rating && <div className="rating-pricing__item">{stars}</div>}
        {!!pricing && <div className="rating-pricing__item">{pricingIcons}</div>}
      </div>
    );
  }
}

RatingPricing.propTypes = propTypes;

export default RatingPricing;
