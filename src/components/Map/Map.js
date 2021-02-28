import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { googleMapApiKey } from 'keys';
import { areObjShallowEqual, areArraysEqual } from 'services/utils';

import './Map.scss';

const centerPropTypes = PropTypes.shape({
  lat: PropTypes.number,
  lng: PropTypes.number
});

const propTypes = {
  defaultCenter: centerPropTypes,
  defaultZoom: PropTypes.number,
  center: centerPropTypes,
  restaurants: PropTypes.arrayOf(PropTypes.object),
  focusedRestaurant: PropTypes.object,
  onGoogleApiLoaded: PropTypes.func,
  onChange: PropTypes.func
};

const RestaurantMarker = ({ isFocused }) => (
  <FontAwesomeIcon
    icon="map-marker-alt"
    className="map__restaurant-marker"
    size={isFocused ? "3x" : "2x"}
  />
);

class Map extends Component {
  bootstrapURLKeys = {
    key: googleMapApiKey,
    libraries: "places"
  };

  render() {
    const { "place_id": focusedRestaurantId } = this.props.focusedRestaurant || {};
    return (
      <div className="map">
        <GoogleMapReact
          bootstrapURLKeys={this.bootstrapURLKeys}
          defaultCenter={this.props.defaultCenter}
          defaultZoom={this.props.defaultZoom}
          center={this.props.center}
          yesIWantToUseGoogleMapApiInternals={true}
          onGoogleApiLoaded={this.onGoogleApiLoaded}
          onChange={this.onChange}
        >
          {this.props.restaurants.map((r, idx) => (
            <RestaurantMarker
              key={`restaurant-marker-${idx}`}
              isFocused={r.place_id === focusedRestaurantId}
              lat={r.geometry.location.lat()}
              lng={r.geometry.location.lng()}
            />
          ))}
        </GoogleMapReact>
      </div>
    );
  }

  shouldComponentUpdate (prevProps) {
    if (
      areObjShallowEqual(prevProps.center), this.props.center ||
      areObjShallowEqual(prevProps.focusedRestaurant, this.props.focusedRestaurant) ||
      areArraysEqual(prevProps.restaurants, this.props.restaurants, true)
    ) {
      return true;
    }
    return false;
  }

  onGoogleApiLoaded = apiObj => {
    this.props.onGoogleApiLoaded && this.props.onGoogleApiLoaded(apiObj);
  };

  onChange = values => {
    this.props.onChange && this.props.onChange(values);
  };
}

Map.propTypes = propTypes;

Map.defaultProps = {
  defaultCenter: {
    // Center of Hong Kong
    lat: 22.3529808,
    lng: 113.9876157
  },
  defaultZoom: 18,
  restaurants: []
};

export default Map;
