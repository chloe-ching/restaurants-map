import React, { Component } from 'react';

import Map from 'components/Map';
import MapSideBar from 'components/MapSideBar';

import './MapView.scss';

// Billion Plaza 2
const DEFAULT_CENTER = {
  lat: 22.337200380026804,
  lng: 114.15076309986327
};

class MapView extends Component {
  state = {
    center: DEFAULT_CENTER,
    sortingRefCenter: DEFAULT_CENTER,
    restaurants: undefined,
    restaurantDetails: null
  };

  updateRestaurantSeq = 0;

  render () {
    return (
      <div className="map-view">
        <Map
          defaultCenter={DEFAULT_CENTER}
          center={this.state.center}
          restaurants={this.state.restaurants}
          focusedRestaurant={this.state.focusedRestaurant}
          onGoogleApiLoaded={this.onGoogleApiLoaded}
          onChange={this.onMapChange}
        />
        <MapSideBar
          data={this.state.restaurants}
          focusedRestaurant={this.state.focusedRestaurant}
          restaurantDetails={this.state.restaurantDetails}
          sortingRefCenter={this.state.sortingRefCenter}
          onItemClick={this.onListItemClick}
        />
      </div>
    );
  }

  onGoogleApiLoaded = ({ map, maps }) => {
    this.mapApi = maps;
    this.placesServices = new maps.places.PlacesService(map);
    this.updateNearbyRestaurant();
  }

  onMapChange = ({ center }) => {
    if (center.lat !== this.state.center.lat || center.lng !== this.state.center.lng) {
      this.setState({ center }, this.updateNearbyRestaurant);
    }
    if (!this.state.focusedRestaurant) {
      this.setState({ sortingRefCenter: center });
    }
  };

  onListItemClick = (item, index) => {
    const { focusedRestaurant } = this.state;
    const wasFocused = !!focusedRestaurant && item.place_id === focusedRestaurant.place_id;

    this.updateDetails(item.place_id);
    this.setState({
      focusedRestaurant: wasFocused ? null : {
        index,
        ...item
      },
      center: {
        lat: item.geometry.location.lat(),
        lng: item.geometry.location.lng()
      }
    })
  };

  setRestaurants (restaurants) {
    this.setState({ restaurants })
  }

  updateNearbyRestaurant (location) {
    if (!this.placesServices) {
      return;
    }

    const request = {
      location: location || this.state.center,
      radius: 1000,
      type: ['restaurant']
    };
    const seq = ++this.updateRestaurantSeq;

    this.restaurants = [];
    this.placesServices.nearbySearch(request, (restaurants, status, pagetoken) => {
      if (seq !== this.updateRestaurantSeq) {
        return;
      }

      if (status !== this.mapApi.places.PlacesServiceStatus.OK) {
        console.warn("Cannot get restaurants");
        this.setRestaurants([]);
        return;
      }

      // Wait for all pages then update. Should add the paging feature in the future.
      this.restaurants = this.restaurants.concat(restaurants);
      if (pagetoken && pagetoken.hasNextPage) {
        pagetoken.nextPage();
      } else {
        this.setRestaurants(this.restaurants);
      }
    });
  }

  updateDetails (placeId) {
    const request = {
      placeId
    };
    // For notifying that there might be details coming
    this.setState({ restaurantDetails: undefined });
    this.placesServices.getDetails(request, (restaurantDetails, status) => {
      if (status !== this.mapApi.places.PlacesServiceStatus.OK) {
        console.warn("Cannot fetch restaurant details: ", placeId);
        this.setState({ restaurantDetails: null });
        return;
      }
      this.setState({ restaurantDetails });
    });
  }
}

export default MapView;
