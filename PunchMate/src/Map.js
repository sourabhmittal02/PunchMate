import React, { Component } from 'react'
import { ImageBackground, PanResponder, Animated, BackHandler, FlatList, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Login: '',
            horizontalData: [{
                registrationID: 1,
                restaurentName: 'Hotel 1',
                lat: 29.4765836,
                long: 77.7210591,
                address: '123 Main Street',
            },
            {
                registrationID: 2,
                restaurentName: 'Hotel 2',
                lat: 37.09024,
                long: -95.71289100000001,
                address: '456 Elm Street',
            },],
        }
    }
    render() {
        return (
            <SafeAreaView>
                <View style={{ flex: 1 }}>
                    <MapView
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
                        {this.state.horizontalData.map((hotel) => (
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
                        ))}
                    </MapView>
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
                </View>
            </SafeAreaView>
        )
    }
}
