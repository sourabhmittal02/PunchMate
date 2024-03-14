import React, { Component } from 'react'
import { Appearance, PanResponder, Animated, BackHandler, FlatList, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import Header from './Header'
import BottomBar from './BottomBar'
import AsyncStorage from '@react-native-async-storage/async-storage';
import rating from './images/rating.png';
import time from './images/time.png';
import location from './images/location.png';
import fav from './images/fav.png';

let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT = Dimensions.get('window').height;
export default class Favourite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'Account',
            Profile: 'https://punchmateblobstorageac.blob.core.windows.net/punchmateappimg/nophoto.jpg',
            appearance: Appearance.getColorScheme(),
            UserId: '',
            RatingList: [],
            favoriteData: [],
            travelTimes: [],
            orderCounts: [],
        }
    }
    componentDidMount = async () => {
        this.appearanceSubscription = Appearance.addChangeListener(({ colorScheme }) => {
            this.setState({ appearance: colorScheme });
        });
        this.setState({ UserId: await AsyncStorage.getItem('UserId') });
        this._GetRatingList();
        this._GetFavorite();
        this.setState({ Profile: await AsyncStorage.getItem('Profile') });
    }
    componentWillUnmount() {
        this.appearanceSubscription.remove();
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
    _GetRatingList() {
        fetch(global.URL + "RMS/GetRestaurantRatings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": token,
                "platform": Platform.OS
            },
            redirect: 'follow'
        }).then(response => response.text()).then(async responseText => {
            try {
                var respObject = JSON.parse(responseText);
                this.setState({ RatingList: respObject })
            }
            catch (error) {
                this.setState({ isLoading: false });
                console.log(error);
                Alert.alert(global.TITLE, "No Resaturent Found");
            }
        }).catch(error => {
            console.log(error);
            this.setState({ isLoading: false });
            Alert.alert(global.TITLE, " " + error);
        });
    }
    searchRating = (RegId) => {
        const item = this.state.RatingList.find(item => item.registrationID === RegId);
        return item ? item.averageRating : null;
    };
    _GetTravelTime = (regID, lat, long) => {
        // Example fetch call to Google Maps Directions API        
        //*****Change to this line on Production***** */ // fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.latitude},${this.state.longitude}&destination=${lat},${long}&key=${GOOGLE_MAPS_APIKEY}`)
        fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=29.472683,77.708511&destination=${lat},${long}&key=${GOOGLE_MAPS_APIKEY}`)
            .then(response => response.json())
            .then(data => {
                const travelTime = data.routes[0].legs[0].duration.text;
                this.setState(prevState => ({
                    travelTimes: {
                        ...prevState.travelTimes,
                        [regID]: travelTime
                    }
                }));
            })
            .catch(error => {
                console.error('Error fetching travel time:', error);
                // Handle error if necessary
            });
    }
    _GetCount = async (regId) => {
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('accessToken');
        let body = {
            "userID": await AsyncStorage.getItem('UserId'),
            "restaurant_ID": regId,
        }
        fetch(global.URL + "RMS/OrderCOunt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
                "platform": Platform.OS
            },
            body: JSON.stringify(body),
            redirect: 'follow'
        }).then(response => response.text()).then(async responseText => {
            try {
                var respObject = JSON.parse(responseText);
                // console.log("COUNT=>", respObject);
                this.setState(prevState => ({
                    orderCounts: {
                        ...prevState.orderCounts,
                        [regId]: respObject.response
                    }
                }));
            } catch (error) {

            }
        })
    }
    _GetFavorite = async () => {
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('accessToken');
        let body = {
            "current_Lat": await AsyncStorage.getItem('Current_Latitude'),
            "current_Log": await AsyncStorage.getItem('Current_Longitude'),
            "UserId": this.state.UserId
        };
        console.log(body);
        fetch(global.URL + "RMS/FavouritehRestaurantList", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
                "platform": Platform.OS
            },
            body: JSON.stringify(body),
            redirect: 'follow'
        }).then(response => response.text()).then(async responseText => {
            try {
                var respObject = JSON.parse(responseText);
                this.setState({ favoriteData: respObject })
                this.setState({ isLoading: false })
                console.log("Res3==>", this.state.favoriteData);
            }
            catch (error) {
                this.setState({ isLoading: false });
                console.log(error);
                Alert.alert(global.TITLE, "No Resaturent Found");
            }
        }).catch(error => {
            console.log(error);
            this.setState({ isLoading: false });
            Alert.alert(global.TITLE, " " + error);
        });
    }
    renderFreeCupImages = (count, OID) => {
        const cups = [];
        var TotalCount = 0;
        if (OID == 1)
            TotalCount = 4;
        else if (OID == 2)
            TotalCount = 5;
        else if (OID == 3)
            TotalCount = 6;
        else if (OID == 4)
            TotalCount = 7;
        else if (OID == 5)
            TotalCount = 8;
        if (count == 4 && OID == 1) {
            cups.push(<View style={{ marginTop: 5, marginLeft: 10, top: -5, flexDirection: 'row', flex: 1, borderRadius: 20, backgroundColor: '#ff7f50', justifyContent: 'center', padding: 5 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#fff', width: 20, height: 20 }} /><Text style={{ color: '#fff' }}> Free</Text></View>);
        } else if (count == 5 && OID == 2) {
            cups.push(<View style={{ marginTop: 5, marginLeft: 10, top: -5, flexDirection: 'row', flex: 1, borderRadius: 20, backgroundColor: '#ff7f50', justifyContent: 'center', padding: 5 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#fff', width: 20, height: 20 }} /><Text style={{ color: '#fff' }}> Free</Text></View>);
        } else if (count == 6 && OID == 3) {
            cups.push(<View style={{ marginTop: 5, marginLeft: 10, top: -5, flexDirection: 'row', flex: 1, borderRadius: 20, backgroundColor: '#ff7f50', justifyContent: 'center', padding: 5 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#fff', width: 20, height: 20 }} /><Text style={{ color: '#fff' }}> Free</Text></View>);
        } else if (count == 7 && OID == 4) {
            cups.push(<View style={{ marginTop: 5, marginLeft: 10, top: -5, flexDirection: 'row', flex: 1, borderRadius: 20, backgroundColor: '#ff7f50', justifyContent: 'center', padding: 5 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#fff', width: 20, height: 20 }} /><Text style={{ color: '#fff' }}> Free</Text></View>);
        } else if (count == 8 && OID == 5) {
            cups.push(<View style={{ marginTop: 5, marginLeft: 10, top: -5, flexDirection: 'row', flex: 1, borderRadius: 20, backgroundColor: '#ff7f50', justifyContent: 'center', padding: 5 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#fff', width: 20, height: 20 }} /><Text style={{ color: '#fff' }}> Free</Text></View>);
        }
        else {
            cups.push(<View style={{ marginTop: 2, margin: 3, top: -4, flexDirection: 'row', flex: 1, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', padding: 3 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 20, height: 20 }} /><Text style={{color:'#ccc'}}> Free</Text></View>);
        }
        return cups;
    }
    _Logout() {

    }
    GoBack() {
        this.props.navigation.goBack();
    }
    toggleSection = (section) => {
        if (section === 'frequentlyOrdered') {
            this.setState((prevState) => ({
                frequentlyOrderedExpanded: !prevState.frequentlyOrderedExpanded,
            }));
        } else if (section === 'favorite') {
            this.setState((prevState) => ({
                favoriteExpanded: !prevState.favoriteExpanded,
            }));
        }
        this.fetchDataFromServer(section);
    };
    fetchDataFromServer = (section) => {
        if (section === 'frequentlyOrdered') {
            this._GetFrequent(this.state.UserId);
        } else if (section === 'favorite') {
            this._GetFavorite();
        }
    };
    GetOffer(regID, restImg, restfav, restlat, restlong, resttime, restmobile, restDis, restName, restAddress, restOffer, restOfferId, restRating) {
        this.props.navigation.navigate('RestaurantDetail', { regID: regID, img: restImg, fav: restfav, lat: restlat, long: restlong, time: resttime, mobile: restmobile, distance: restDis, name: restName, address: restAddress, offerName: restOffer, offerID: restOfferId, rating: restRating })
    }
    OrderNow() {
        console.log("6");
        this.props.navigation.navigate('OrderNow', { name: 'OrderNow' })
    }
    OrderList() {
        console.log("7");
        this.props.navigation.navigate('OrderList', { name: 'OrderList' })
    }
    MyAcc() {
        console.log("7");
        this.props.navigation.navigate('Account', { name: 'Account' })
    }
    MyOffer() {
        console.log("8");
        this.props.navigation.navigate('OfferList', { name: 'OfferList' })
    }
    GoBack() {
        this.props.navigation.goBack();
    }
    render() {
        const { appearance } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Header />
                {/* Main content */}
                <View style={{ flex: 1, backgroundColor: appearance === 'dark' ? '#000' : '#eee' }}>
                    {/* Header Bar */}
                    <View style={{height: 50, backgroundColor: "#fff", flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
                        <View style={{ flex: 1, margin: 10, flexDirection: 'row' }}>
                            <View style={{ flex: 0.1 }}>
                                <TouchableOpacity onPress={() => this.GoBack()}>
                                    <Image style={{ tintColor: '#000', width: 25, height: 25, marginTop: 5, }} source={require('./images/back.png')} />
                                </TouchableOpacity>
                            </View>
                            <Text style={{marginLeft:5, marginTop: 5, color: '#000', fontSize: 15, fontFamily: 'Poppins' }}>  Favourite Restaurants</Text>
                        </View>
                    </View>
                    {/* Contents */}
                    <View style={{ flex: 1 }}>
                        <View style={{ flexGrow: 1, backgroundColor: '#fff', }}>
                            <FlatList style={{ backgroundColor: '#fff', height: SCREEN_HEIGHT - 310 }}
                                showsVerticalScrollIndicator
                                data={this.state.favoriteData}
                                renderItem={({ item, index }) => (
                                    <View key={index} style={[styles.horizontalListItem, { flexDirection: 'row' }]}>
                                        <View style={{ flex: 2.2, position: 'relative', }}>
                                            <Image
                                                source={{ uri: item.image.toString() }}
                                                style={{ margin: 10, height: 115, width: 110, borderRadius: 5 }}
                                            />
                                            <View style={{ position: 'absolute', top: 15, right: 20 }}>
                                                <Image source={fav} style={{ height: 15, width: 15 }} />
                                            </View>
                                        </View>
                                        <View style={{ flex: 3, alignItems: 'baseline' }}>
                                            <View>
                                                <TouchableOpacity key={index} onPress={() => this.GetOffer(item.registrationID, item.image, item.favourite, item.lat, item.long, this.state.travelTimes[item.registrationID], item.mobileNo, item.distance.toFixed(2), item.restaurentName, item.address, item.offerName, item.offerID, this.searchRating(item.registrationID))} >
                                                    <View style={{ flexDirection: 'row', marginTop: 3, marginLeft: 1 }}>
                                                        <View style={{ flex: 2 }}>
                                                            <Text style={styles.itemName}>{item.restaurentName}</Text>
                                                        </View>
                                                        <View style={{marginLeft:5, flex: 0.4, flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                                                            <Image source={rating} style={{ marginTop: 3, height: 12, width: 12 }} />
                                                            <Text style={{ fontSize: 10, fontFamily: 'Poppins-Bold',color:'#000' }}> {this.searchRating(item.registrationID)} </Text>
                                                        </View>
                                                        {/* <Image source={time} style={[styles.ListIcon, { marginTop: 3 }]} /> */}
                                                        {/* <Text style={{ fontSize: 10, fontFamily: 'Poppins-Bold' }}> {this.state.travelTimes[item.registrationID]} </Text> */}
                                                    </View>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Image source={location} style={styles.ListIcon} />
                                                        <Text style={{ fontSize: 10,color:'#000' }}>{item.address.substring(0, 50)}....</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{marginTop:6, width: '110%', paddingTop: 10, margin: 3, padding: 0, flexDirection: 'row', backgroundColor: '#fff3ee', borderRadius: 20, alignItems: 'center' }}>
                                                <Text style={{ marginTop: -15, marginLeft: 5, fontSize: 12,color:'#000' }}>{item.offerName}</Text>
                                                {this.renderFreeCupImages(this.state.orderCounts[item.registrationID] || 0, item.offerID)}
                                            </View>

                                        </View>
                                        <View style={{ flex: 0.5 }}>
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    </View>
                </View>
                {/* BottomBar */}
                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                    <BottomBar selectedTab={this.state.selectedTab} onHomePress={() => this.OrderNow()} onOfferPress={()=>this.MyOffer()} onOrderPress={() => this.OrderList()} onAccPress={() => this.MyAcc()} />
                </View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.isLoading}>
                    <View style={{ flex: 1, backgroundColor: "#ffffffee", alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#F60000" />
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: "#434343", margin: 15 }}>Loading....</Text>
                    </View>
                </Modal>
            </View>
        )
    }
}
