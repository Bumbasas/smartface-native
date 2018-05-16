const AndroidConfig = require('../../util/Android/androidconfig');
const TypeUtil = require('../../util/type');
const NativeCriteria = requireClass('android.location.Criteria');
const NativeLocationListener = requireClass('android.location.LocationListener');

// Context.LOCATION_SERVICE
const LOCATION_SERVICE = 'location';
const LOCATION_MANAGER = 'android.location.LocationManager';
// android.location.LocationManager.GPS_PROVIDER
const GPS_PROVIDER = 'gps';
// android.location.LocationManager.NETWORK_PROVIDER
const NETWORK_PROVIDER = 'network';
const locationManager = AndroidConfig.getSystemService(LOCATION_SERVICE, LOCATION_MANAGER);

const criteria = new NativeCriteria();

const Location = {};

Location.ios = {};
Location.ios.locationServicesEnabled = function() {};
Location.ios.getAuthorizationStatus = function() {};
Location.ios.authorizationStatus = {};

var _locationListener;
var _onLocationChanged;
Object.defineProperties(Location, {
    'android': {
        value: {},
        enumerable: true
    },
    'Android': {
        value: {},
        enumerable: true
    },
    'start': {
        value: function(provider) {
            if (_locationListener) {
                locationManager.removeUpdates(_locationListener);
            }

            var selectedProvider;
            if (TypeUtil.isString(provider) && !(provider === Location.android.Provider.AUTO)) {
                selectedProvider = provider;
            }
            else {
                selectedProvider = locationManager.getBestProvider(criteria, false);
            }

            if (selectedProvider) {
                _locationListener = NativeLocationListener.implement({
                    onStatusChanged: function(provider, status, extras) {},
                    onProviderEnabled: function(provider) {},
                    onProviderDisabled: function(provider) {},
                    onLocationChanged: function(location) {
                        _onLocationChanged && _onLocationChanged({
                            latitude: location.getLatitude(),
                            longitude: location.getLongitude()
                        });
                    }
                });
                if (Array.isArray(provider)) {
                    provider.forEach((provider) => {
                        if (!(provider === Location.android.Provider.AUTO))
                            locationManager.requestLocationUpdates(provider, 1000, 1, _locationListener);
                    });
                }
                else {
                    locationManager.requestLocationUpdates(selectedProvider, 1000, 1, _locationListener);
                }
                // firing initial location because we dont have "getLastKnownLocation" for one time location
                // Implemented twice to enable to cache location on different providers 
                var initialNetworkLocationFromProvider = locationManager.getLastKnownLocation(NETWORK_PROVIDER);
                var initialGPSLocationFromProvider = locationManager.getLastKnownLocation(GPS_PROVIDER);
                if (initialNetworkLocationFromProvider != null && initialGPSLocationFromProvider != null) {
                    _onLocationChanged && _onLocationChanged({
                        latitude: initialGPSLocationFromProvider.getLatitude() || initialNetworkLocationFromProvider.getLatitude(),
                        longitude: initialGPSLocationFromProvider.getLongitude() || initialNetworkLocationFromProvider.getLongitude()
                    });
                }
            }
        }
    },
    'stop': {
        value: function() {
            if (_locationListener) {
                locationManager.removeUpdates(_locationListener);
                _locationListener = null;
            }
        }
    },
    'onLocationChanged': {
        get: function() {
            return _onLocationChanged;
        },
        set: function(callback) {
            if (TypeUtil.isFunction(callback)) {
                _onLocationChanged = callback;
            }
        }
    }
});

Object.defineProperty(Location.Android, "Provider", {
    value: {},
    enumerable: true
});
Object.defineProperty(Location.android, "Provider", {
    value: {},
    enumerable: true
});

Object.defineProperties(Location.Android.Provider, {
    'AUTO': {
        value: "auto",
        enumerable: true
    },
    'GPS': {
        value: GPS_PROVIDER,
        enumerable: true
    },
    'NETWORK': {
        value: NETWORK_PROVIDER,
        enumerable: true
    }
});

Object.assign(Location.android.Provider, Location.Android.Provider);

module.exports = Location;
