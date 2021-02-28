import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import RatingPricing from '../RatingPricing';

import { createClassName } from 'services/utils';

import './RestaurantDetails.scss';

const propTypes = {
  details: PropTypes.shape({
      photos: PropTypes.arrayOf(PropTypes.object),
      rating: PropTypes.number,
      "price_level": PropTypes.number,
      "opening_hours": PropTypes.object,
      "formatted_address": PropTypes.string,
      "international_phone_number": PropTypes.string,
      website: PropTypes.string
  })
};

class RestaurantDetails extends PureComponent {
  render () {
    const { details } = this.props;
    const {
      photos,
      rating,
      "price_level": price,
      "opening_hours": openingHours,
      "formatted_address": address,
      "international_phone_number": phone,
      website
    } = details || {};

    return (
      <div className={createClassName("restaurant-details", { show: !!details })}>
        {this.renderRestaurantPhoto(photos)}
        {this.renderRatingPricing(rating, price)}
        {this.renderOpenState(openingHours)}
        {this.renderOpeningHours(openingHours)}
        {this.renderAddress(address)}
        {this.renderPhone(phone)}
        {this.renderWebsite(website)}
      </div>
    );
  }

  renderNormalDetailsRow (icon, text, shouldShowOneLine) {
    const textClassName = createClassName("restaurant-details__text", {
      "show-one-line": shouldShowOneLine
    });

    return (
      <div className="restaurant-details__row">
        <FontAwesomeIcon icon={icon} className="restaurant-details__icon" />
        <span className={textClassName}>{text}</span>
      </div>
    );
  }

  renderRestaurantPhoto (photos) {
    if (!photos || !photos.length) {
      return null;
    }

    return (
      <div className="restaurant-details__image-row">
        <img className="restaurant-details__image" src={photos[0].getUrl()} alt="restaurant" />
      </div>
    );
  }

  renderRatingPricing (rating, pricing) {
    return <RatingPricing rating={rating} pricing={pricing} />;
  }

  renderOpenState (openingHours) {
    if (!openingHours) {
      return null;
    }

    const isOpenNow = openingHours.isOpen();
    const openNowText = isOpenNow ? "Open now" : "Closed";

    return this.renderNormalDetailsRow(
      "door-open",
      <span className={createClassName("restaurant-details__opening-now-text", {
        closed: !isOpenNow
      })}>{openNowText}</span>
    );
  }

  renderOpeningHours (openingHours) {
    if (!openingHours) {
      return;
    }

    const exactWeekday = new Date().getDay();
    const weekday = !exactWeekday ? 7 : exactWeekday - 1;

    return this.renderNormalDetailsRow("clock",
      <Fragment>
        {openingHours["weekday_text"].map((text, idx) =>
          <div
            key={`opening-${idx}`}
            className={createClassName("restaurant-details__opening-hours", {
              today: idx === weekday
            })}
          >{text}</div>
        )}
      </Fragment>
    );
  }

  renderAddress (address) {
    if (!address) {
      return null;
    }

    return this.renderNormalDetailsRow("map-marked-alt", address);
  }

  renderPhone (phone) {
    if (!phone) {
      return null;
    }

    return this.renderNormalDetailsRow("phone", phone);
  }

  renderWebsite (website) {
    if (!website) {
      return null;
    }

    return (
      <a
        className={createClassName("restaurant-details__row", { clickable: true })}
        href={website}
        target="_blank"
        rel="noreferrer"
      >
        <FontAwesomeIcon icon="globe" className="restaurant-details__icon" />
        <span className={createClassName("restaurant-details__text", {
          "show-one-line": true
        })}>{website}</span>
      </a>
    );
  }
}

RestaurantDetails.propTypes = propTypes;

export default RestaurantDetails;
