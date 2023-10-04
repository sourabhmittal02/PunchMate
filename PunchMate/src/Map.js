import React, { Component } from 'react'
import { ImageBackground, PanResponder, Animated, BackHandler, FlatList, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Login: '',
            horizontalData: [{
                registrationID: 1,
                restaurentName: 'Hotel 1',
                lat: 37,
                long: -122,
                address: '123 Main Street',
            },
            {
                registrationID: 2,
                restaurentName: 'Hotel 2',
                lat: 37,
                long: -122,
                address: '456 Elm Street',
            },],
        }
    }
    componentDidMount = async () => {
        // this._SearchHotel();
    }
    _GetToken = async () => {
        let Body = {
            "loginId": await AsyncStorage.getItem('mobile'),
            "password": await AsyncStorage.getItem('PIN')
        }
        fetch(global.URL + "Login/DoLogin/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "platform": Platform.OS
            },
            body: JSON.stringify(Body),
            redirect: 'follow'
        }).then(response => response.text()).then(async responseText => {
            try {
                var respObject = JSON.parse(responseText);
                AsyncStorage.setItem('accessToken', respObject.accessToken)
            }
            catch (error) {
                Alert.alert(global.TITLE, "Invalid Pin");
            }
        }).catch(error => {
            console.log(error);
            this.setState({ isLoading: false });
            Alert.alert(global.TITLE, " " + error);
        });
    }
    // _SearchHotel = async () => {
    //     this._GetToken();
    //     let token = "Bearer " + await AsyncStorage.getItem('accessToken');
    //     let body;
    //     body = {
    //         "current_Lat": "29.472561",//await AsyncStorage.getItem('Current_Latitude'),
    //         "current_Log": "77.707130",//await AsyncStorage.getItem('Current_Longitude'),
    //         "filterRange": "1000"
    //     }
    //     fetch(global.URL + "RMS/RestaurantList", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": token,
    //             "platform": Platform.OS
    //         },
    //         body: JSON.stringify(body),
    //         redirect: 'follow'
    //     }).then(response => response.text()).then(async responseText => {
    //         try {
    //             var respObject = JSON.parse(responseText);
    //             this.setState({ horizontalData: respObject })
    //         }
    //         catch (error) {
    //             this.setState({ isLoading: false });
    //             console.log(error);
    //             Alert.alert(global.TITLE, "No Resaturent Found");
    //         }
    //     }).catch(error => {
    //         console.log(error);
    //         this.setState({ isLoading: false });
    //         Alert.alert(global.TITLE, " " + error);
    //     });
    // }
    render() {
        return (
            <SafeAreaView>
                <View style={{ flex: 1 }}>
                    <MapView
                        region={this.state.region}
                        onRegionChange={this.onRegionChange}
                        customMapStyle={mapStyle}
                    />
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
