import React, { Component } from 'react';
import { PermissionsAndroid, View, StyleSheet, Dimensions, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import startImg from './images/start.png';
import destinationImg from './images/destination.png';
import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');
const GOOGLE_MAPS_APIKEY = 'AIzaSyAP-LAud0co77rYuATkXmshuOEVE4e6HnU';
class Direction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMapReady: false,
            DestLat: '',
            DestLong: '',
            coordinates: [
                {
                    latitude: 37.3317876,
                    longitude: -122.0054812,
                },
                {
                    latitude: 37.771707,
                    longitude: -122.4053769,
                },
            ],
        };
    }
    onMapLayout = () => {
        this.setState({ isMapReady: true });
    };
    componentDidMount = async () => {
        this.requestLocationPermission();

    }
    requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            this.getCurrentLocation();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.getCurrentLocation();
                } else {
                    // Permission denied
                }
            } catch (error) {
                console.warn(error);
            }
        }
    }
    getCurrentLocation = async () => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                // console.log('Current Location:', latitude, longitude);
                // this.setState({ LAT: latitude.toString() })
                // this.setState({ LONG: longitude.toString() })
                const updatedCoordinates = [...this.state.coordinates];
                updatedCoordinates[0] = {
                    latitude: parseFloat(latitude.toString()),
                    longitude: parseFloat(longitude.toString()),
                    // latitude: parseFloat(26.9239),
                    // longitude: parseFloat(75.8267),
                };
                this.setState({ coordinates: updatedCoordinates });
                if (Array.isArray(this.props.destination) && this.props.destination.length > 0) {
                    const destination = this.props.destination[0];
                    this.setState({ DestLat: destination.latitude });
                    this.setState({ DestLong: destination.longitude });
                    updatedCoordinates[1] = {
                        latitude: destination.latitude,
                        longitude: destination.longitude,
                    };
                    this.setState({ coordinates: updatedCoordinates });
                }
                // const destination = this.props.destination.length > 0 ? this.props.destination[0] : null;
                // this.setState({ DestLat: destination.latitude });
                // this.setState({ DestLong: destination.longitude });
                // updatedCoordinates[1] = {
                //     latitude: destination.latitude,
                //     longitude: destination.longitude,
                // };
                // this.setState({ coordinates: updatedCoordinates });
            },
            error => {
                console.warn(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }
    render() {
        const { destination, height, width } = this.props;
        const { isMapReady } = this.state;
        // console.log("co==>", this.state.coordinates);
        return (
            <View style={[styles.container, { height: height, width: width }]}>
                <MapView
                    style={styles.map}
                    onLayout={this.onMapLayout}
                    initialRegion={{
                        latitude: 26.9124,
                        longitude: 75.7873,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {isMapReady && <>
                        {this.state.coordinates &&
                            <Marker image={startImg} coordinate={this.state.coordinates[0]} title="Origin"
                            />}
                        {this.state.coordinates && (
                            <Marker image={destinationImg} coordinate={this.state.coordinates[1]} title="Destination" />
                        )}
                        {(this.state.coordinates.length >= 2) && (
                            <MapViewDirections
                                origin={this.state.coordinates[0]}
                                waypoints={(this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1) : undefined}
                                destination={this.state.coordinates[this.state.coordinates.length - 1]}
                                apikey={GOOGLE_MAPS_APIKEY}
                                strokeWidth={5}
                                strokeColor="blue"
                                optimizeWaypoints={true}
                                onStart={(params) => {
                                    console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                                }}
                                onReady={result => {
                                    // console.log(`Distance: ${result.distance} km`)
                                    // console.log(`Duration: ${result.duration} min.`)
                                    // Set duration and distance in the state
                                    this.setState({
                                        distance: result.distance,
                                        duration: result.duration,
                                    });
                                    // Ensure this.mapView is defined before calling fitToCoordinates
                                    if (this.mapView) {
                                        this.mapView.fitToCoordinates(result.coordinates, {
                                            edgePadding: {
                                                right: (width / 20),
                                                bottom: (height / 20),
                                                left: (width / 20),
                                                top: (height / 20),
                                            }
                                        });
                                    }
                                }}
                                onError={(errorMessage) => {
                                    // Handle error
                                }}
                            />

                        )}
                    </>}
                    {/* {isMapReady && destination.map((hotel, index) => (
                        <Marker
                            key={index}
                            coordinate={{ latitude: hotel.latitude, longitude: hotel.longitude }}
                            title={hotel.restaurentName}
                        >
                            <Image source={require('./images/man_marker.png')} style={{ height: 35, width: 27 }} />
                        </Marker>
                    ))} */}
                </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 250, // Set a fixed height or use flex: 1 to fill available space
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default Direction;
