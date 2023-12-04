import React, { Component } from 'react'
import { ImageBackground, PanResponder, Animated, BackHandler, FlatList, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = 'AIzaSyAP-LAud0co77rYuATkXmshuOEVE4e6HnU';
export default class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Profile: 'https://punchmateblobstorageac.blob.core.windows.net/punchmateappimg/nophoto.jpg',
            duration:'',
            distance:'',
            LAT: '',
            LONG: '',
            Login: '',
            origin: null,
            destination: null,
            directions: [],
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
            // horizontalData: [{
            //     registrationID: 1,
            //     restaurentName: 'Hotel 1',
            //     lat: 29.4765836,
            //     long: 77.7210591,
            //     address: '123 Main Street',
            // },
            // {
            //     registrationID: 2,
            //     restaurentName: 'Hotel 2',
            //     lat: 29.4765836,
            //     long: 77.7010591,
            //     address: '456 Elm Street',
            // },],
        }
    }
    componentDidMount = async () => {
        this.setState({ Profile: await AsyncStorage.getItem('Profile') });
        // var dest = this.props.route.params.lat + "," + this.props.route.params.long;
        var destLat = parseFloat(this.props.route.params.lat);
        var destLong = parseFloat(this.props.route.params.long);
        // var current = await AsyncStorage.getItem('Current_Latitude') + "," + await AsyncStorage.getItem('Current_Longitude');
        // console.log("SelLAT=>", dest);
        // console.log("LAT=>", current);
        // this.setState({ origin: "29.4765836,77.7210591" });
        // this.setState({ destination: dest });
        this.setState({ coordinates: [{ latitude: 29.4765836, longitude: 77.7210591 }, { latitude: destLat, longitude: destLong }] })
        try {
            const latitude = 29.4765836;// await AsyncStorage.getItem('Current_Latitude');
            const longitude = 77.7210591;// await AsyncStorage.getItem('Current_Longitude');

            if (latitude !== null && longitude !== null) {
                this.setState({
                    LAT: parseFloat(latitude),
                    LONG: parseFloat(longitude),
                });
            } else {
                console.warn('Latitude and/or longitude not found in AsyncStorage.');
            }
        } catch (error) {
            console.error('Error fetching latitude and longitude from AsyncStorage:', error);
        }
        // this.getDirections();

    }
    getDirections = async () => {
        const { origin, destination } = this.state;
        const apiKey = 'AIzaSyAP-LAud0co77rYuATkXmshuOEVE4e6HnU';

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`
            );
            console.log("O/P=>", response);
            const data = await response.json();

            if (data.routes.length > 0) {
                const points = data.routes[0].overview_polyline.points;
                const decodedPoints = decodePolyline(points);

                this.setState({
                    directions: decodedPoints,
                });
            }
        } catch (error) {
            console.error('Error fetching directions:', error);
        }
    };
    GoBack() {
        this.props.navigation.goBack();
    }
    render() {
        const { directions } = this.state;
        const { LAT, LONG } = this.state;
        const { duration, distance } = this.state;
        return (
            <SafeAreaView>
                <View>
                    <View style={{ height: 40, backgroundColor: "#000", flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
                        <View style={{ flex: 1, margin: 10, flexDirection: 'row' }}>
                            <View style={{ flex: 0.1 }}>
                                <TouchableOpacity onPress={() => this.GoBack()}>
                                    <Image style={{ width: 25, height: 25, marginTop: 5 }} source={require('./images/back.png')} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity onPress={() => { this._Logout() }}>
                                    <Image style={{ width: 30, height: 30, marginRight: 0, borderRadius: 30, marginRight: 10, resizeMode: 'contain' }} source={{ "uri": this.state.Profile.toString() }} />
                                </TouchableOpacity>
                            </View>
                            <Text style={{ color: '#fff', fontSize: 18 }}>Map View</Text>
                        </View>
                    </View>
                </View>
                {/* <View style={{ flex: 1 }}> */}
                    <MapView
                        ref={mapView => this.mapView = mapView} // Create a reference to the MapView
                        style={{ height: height - 50, width: width }}
                        initialRegion={{
                            latitude: 29.4765836, // Initial map coordinates
                            longitude: 77.7210591,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        provider={PROVIDER_GOOGLE}
                        loadingIndicatorColor="#e21d1d"
                        loadingEnabled={true}
                    >
                        {this.state.coordinates.map((coordinate, index) =>
                            <Marker key={`coordinate_${index}`} coordinate={coordinate} />
                        )}
                        {(this.state.coordinates.length >= 2) && (
                            <MapViewDirections
                                origin={this.state.coordinates[0]}
                                waypoints={(this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1) : undefined}
                                destination={this.state.coordinates[this.state.coordinates.length - 1]}
                                apikey={GOOGLE_MAPS_APIKEY}
                                strokeWidth={3}
                                strokeColor="hotpink"
                                optimizeWaypoints={true}
                                onStart={(params) => {
                                    console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                                }}
                                onReady={result => {
                                    console.log(`Distance: ${result.distance} km`)
                                    console.log(`Duration: ${result.duration} min.`)
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
                    </MapView>
                    {/* Display duration and distance */}
                    
                    {/* <MapView
                       style={{ height: 300, width: 350 }}
                       initialRegion={{
                           latitude: 29.4765836, // Initial map coordinates
                           longitude: 77.7210591,
                           latitudeDelta: 0.0922,
                           longitudeDelta: 0.0421,
                       }}
                       provider={PROVIDER_GOOGLE}
                       loadingIndicatorColor="#e21d1d"
                       loadingEnabled={true}
                    >
                         {this.state.coordinates.map((coordinate, index) =>
                            <Marker key={`coordinate_${index}`} coordinate={coordinate} />
                        )}
                        {(this.state.coordinates.length >= 2) && (
                            <MapViewDirections
                                origin={this.state.coordinates[0]}
                                waypoints={(this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1) : undefined}
                                destination={this.state.coordinates[this.state.coordinates.length - 1]}
                                apikey={GOOGLE_MAPS_APIKEY}
                                strokeWidth={3}
                                strokeColor="hotpink"
                                optimizeWaypoints={true}
                                onStart={(params) => {
                                    console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                                }}
                                onReady={result => {
                                    console.log(`Distance: ${result.distance} km`)
                                    console.log(`Duration: ${result.duration} min.`)

                                    this.mapView.fitToCoordinates(result.coordinates, {
                                        edgePadding: {
                                            right: (width / 20),
                                            bottom: (height / 20),
                                            left: (width / 20),
                                            top: (height / 20),
                                        }
                                    });
                                }}
                                onError={(errorMessage) => {
                                    // console.log('GOT AN ERROR');
                                }}
                            />
                        )}
                    </MapView> */}
                    {/* <MapView
                        style={{ height: 300, width: 350 }}
                        initialRegion={{
                            latitude:LAT, // Initial map coordinates
                            longitude: LONG,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        provider={PROVIDER_GOOGLE}
                        loadingIndicatorColor="#e21d1d"
                        loadingEnabled={true}
                    > */}
                    {/* {this.state.horizontalData.map((hotel) => (
                            <Marker
                                identifier="marker"
                                key={hotel.registrationID}
                                coordinate={{
                                    latitude: hotel.lat,
                                    longitude: hotel.long,
                                }}
                                title={hotel.restaurentName}
                                description={hotel.address}
                            />
                        ))} */}
                    {/* </MapView> */}
                    {/* //================================================= */}
                    {/* <MapView
                        region={this.state.region}
                        onRegionChange={this.onRegionChange}
                        customMapStyle={mapStyle}
                    /> */}
                    {/* <MapView style={{flex:1, width: '100%', height: '100%' }}
                        initialRegion={{
                            latitude: 37.78825, // Initial map coordinates
                            longitude: -122.4324,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        {this.state.horizontalData.map((hotel) => (
                            <Marker
                                key={hotel.registrationID}
                                coordinate={{
                                    latitude: hotel.lat,
                                    longitude: hotel.long,
                                }}
                                title={hotel.restaurentName}
                                description={hotel.address}
                            />
                        ))}
                    </MapView> */}
                {/* </View> */}
                <View style={styles.overlay}>
                        <Text style={styles.overlayText}>{`Duration: ${parseInt(duration)} Min.`}</Text>
                        <Text style={styles.overlayText}>{`Distance: ${parseInt(distance)} Km`}</Text>
                    </View>
            </SafeAreaView>
        )
    }
}
// Function to decode the polyline points
function decodePolyline(encoded) {
    const points = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
        let b;
        let shift = 0;
        let result = 0;

        do {
            b = encoded.charAt(index++).charCodeAt(0) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);

        const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
        lat += dlat;

        shift = 0;
        result = 0;

        do {
            b = encoded.charAt(index++).charCodeAt(0) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);

        const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
        lng += dlng;

        points.push({
            latitude: lat / 1e5,
            longitude: lng / 1e5,
        });
    }

    return points;
}