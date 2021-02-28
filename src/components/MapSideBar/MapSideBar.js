import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { createClassName } from 'services/utils';
import List from 'components/List';
import Dropdown from 'components/Dropdown';
import RestaurantDetails from './components/RestaurantDetails';
import RatingPricing from './components/RatingPricing';

import './MapSideBar.scss';

const propTypes = {
  data: PropTypes.array,
  sortingRefCenter: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number
  }).isRequired,
  focusedRestaurant: PropTypes.object,
  restaurantDetails: PropTypes.object,
  onItemClick: PropTypes.func
};

const upIcon = <FontAwesomeIcon icon="caret-up" className="dropdown__icon"/>;
const downIcon = <FontAwesomeIcon icon="caret-down" className="dropdown__icon"/>;
const SORTING_OPTIONS = [{
  value: "distance-asc",
  label: <div className="dropdown__option">distance{upIcon}</div>
}, {
  value: "distance-desc",
  label: <div className="dropdown__option">distance{downIcon}</div>
}, {
  value: "cost-asc",
  label: <div className="dropdown__option">cost{upIcon}</div>
}, {
  value: "cost-desc",
  label: <div className="dropdown__option">cost{downIcon}</div>
}, {
  value: "name-asc",
  label: <div className="dropdown__option">name{upIcon}</div>
}, {
  value: "name-desc",
  label: <div className="dropdown__option">name{downIcon}</div>
}];

class MapSideBar extends PureComponent {
  state = {
    selectedSortOpt: SORTING_OPTIONS[0]
  };

  listRef = React.createRef();
  focusedItemRef = React.createRef();

  render () {
    const { data, sortingRefCenter, focusedRestaurant, restaurantDetails } = this.props;
    let sortedData = this.getSortedData(
      data,
      this.state.selectedSortOpt.value,
      sortingRefCenter
    );

    // Add the focused restaurant to the head of the data array if it can't be found in data.
    const { "place_id": focusedRestaurantId } = focusedRestaurant || {};
    if (!!focusedRestaurantId && !sortedData.find(item => item.place_id === focusedRestaurantId)) {
      sortedData.unshift(focusedRestaurant);
    }

    const extraData = [
      ...(data || []).map(item => item.place_id),
      sortingRefCenter.lat,
      sortingRefCenter.lng,
      focusedRestaurant ? focusedRestaurant.place_id : "",
      restaurantDetails ? restaurantDetails.place_id : ""
    ].join("|");

    return (
      <div className="map-side-bar">
        <List
          ref={this.listRef}
          data={sortedData}
          extraData={extraData}
          renderHeader={this.renderHeader}
          renderLoading={this.renderLoadingSpinner}
          renderItem={this.renderListItem}
        />
      </div>
    );
  }

  componentDidUpdate () {
    if (!!this.props.focusedRestaurant) {
      this.scrollToFocused();
    }
  }

  renderHeader = () => {
    return (
      <div className="map-side-bar__list-header">
        <Dropdown
          options={SORTING_OPTIONS}
          value={this.state.selectedSortOpt}
          onChange={this.onSortChange}
        />
      </div>
    );
  };

  renderLoadingSpinner = () => {
    return (
      <div className="map-side-bar__loading-row">
        <FontAwesomeIcon icon="spinner" size="1x" spin className="map-side-bar__loading-icon"/>
      </div>
    );
  };

  renderListItem = (item, index) => {
    const { focusedRestaurant, onItemClick } = this.props;
    const isFocused = focusedRestaurant && focusedRestaurant.place_id === item.place_id;
    const onClick = onItemClick ? () => onItemClick(item, index) : null;
    const className = createClassName("map-side-bar__list-item", {
      focused: isFocused
    });

    return (
      <div key={index} className={className} ref={isFocused && this.focusedItemRef}>
        <div className="map-side-bar__list-item-name-row" onClick={onClick}>
          <div className="map-side-bar__list-item-name">{item.name}</div>
          {isFocused && <FontAwesomeIcon icon="angle-up" />}
          {!isFocused && <RatingPricing rating={item.rating} pricing={item["price_level"]} />}
        </div>
        {isFocused && this.renderRestaurantDetails()}
      </div>
    );
  };

  renderRestaurantDetails () {
    return <RestaurantDetails details={this.props.restaurantDetails} />;
  }

  getDistance (a, b) {
    const { lat: ax, lng: ay } = a;
    const { lat: bx, lng: by } = b;
    return Math.sqrt(Math.pow((ax - bx), 2) + Math.pow((ay - by), 2));
  }

  getSortedData = memoizeOne((data, sortOpt, center) => {
    if (data === undefined) {
      return data;
    }

    const [ sort, order ] = sortOpt.split("-");
    const isAsc = order === "asc";
    let sortFunc, propName;

    switch (sort) {
      case "distance":
        sortFunc = (a, b) => {
          const distanceToA = this.getDistance(center, a.geometry.location);
          const distanceToB = this.getDistance(center, b.geometry.location);
          return isAsc ? distanceToA - distanceToB : distanceToB - distanceToA;
        };
        break;
      case "cost":
        propName = "price_level";
        sortFunc = isAsc
          ? (a, b) => (a[propName] - b[propName])
          : (a, b) => (b[propName] - a[propName]);
        break;
      default:
        propName = "name";
        sortFunc = (a, b) => {
          if (a[propName] < b[propName]) {
            return isAsc ? -1 : 1;
          }
          if (a[propName] > b[propName]) {
            return isAsc ? 1 : -1;
          }
          return 0;
        };
        break;
    }
    return [...data].sort(sortFunc);
  });

  onSortChange = selectedSortOpt => this.setState({ selectedSortOpt });

  scrollToFocused () {
    if (!this.listRef.current || !this.focusedItemRef.current) {
      return;
    }

    this.listRef.current.scrollTop(this.focusedItemRef.current.offsetTop);
  }
}

MapSideBar.propTypes = propTypes;

export default MapSideBar;
