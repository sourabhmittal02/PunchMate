import React, { Component } from 'react'
import { PermissionsAndroid, PanResponder, Animated, BackHandler, FlatList, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import Header from './Header'
import AsyncStorage from '@react-native-async-storage/async-storage';
import search from './images/search.png';
import distance from './images/distance.png';
import location from './images/location.png';
import time from './images/time.png';
import account from './images/account.png';
import fav from './images/fav.png';
import addfav from './images/addfav.png';
import BottomBar from './BottomBar';
import { Dropdown } from 'react-native-element-dropdown';
import MapView, { Marker } from 'react-native-maps';
import MapComponent from './Map';
import rating from './images/rating.png';

let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT = Dimensions.get('window').height;
const GOOGLE_MAPS_APIKEY = 'AIzaSyAP-LAud0co77rYuATkXmshuOEVE4e6HnU';
export default class OrderNow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            Login: '',
            search: '',
            Profile: 'https://punchmateblobstorageac.blob.core.windows.net/punchmateappimg/nophoto.jpg',
            showPopup: false,
            showMenu: false,
            UserId: '',
            selectedTab: 'Home',
            menuVisible: false,
            orderCounts: [],
            travelTimes: [],
            latitude: null,
            longitude: null,
            RatingList: [],
            RangeList: [{ label: '2 Kms', value: '2' }, { label: '4 Kms', value: '4' },
            { label: '6 Kms', value: '6' }, { label: '8 Kms', value: '8' }, { label: 'All', value: 'All' },
            ],
            RangeVal: '',
            horizontalData: [
                // {
                //     id: '1',
                //     itemName: 'Item 1',
                //     description: 'This is item 1 description',
                //     buyLink: 'https://example.com/item1',
                //     image: require('./images/pizza.png'),
                // },
                // {
                //     id: '2',
                //     itemName: 'Item 2',
                //     description: 'This is item 2 description',
                //     buyLink: 'https://example.com/item2',
                //     image: require('./images/pizza.png'),
                // },
                // Add more items as needed
            ]
        }
        this.inactivityTimer = null;
        this.inactivityDuration = 3600000; // 5 minutes (in milliseconds)
        // this.translateX = new Animated.Value(this.state.showMenu ? 0 : -SCREEN_WIDTH + 100);
        this.translateX = new Animated.Value(SCREEN_WIDTH);
        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                const { dx } = gestureState;
                return dx > 10;
            },
            onPanResponderMove: (evt, gestureState) => {
                const { dx } = gestureState;
                const newX = dx + (this.state.showMenu ? 0 : -SCREEN_WIDTH);
                if (newX > 0) {
                    this.translateX.setValue(newX);
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                const { dx } = gestureState;
                const shouldShowMenu = dx > 50;
                if (shouldShowMenu) {
                    this.showMenu();
                } else {
                    this.hideMenu();
                }
            },
        });
    }
    componentDidMount = async () => {
        this.setState({ Login: await AsyncStorage.getItem('firstName') });
        this._GetUserDetail();
        this._GetRatingList();
        const { offerId } = this.props.route.params;
        if (offerId) {
            console.log("With Offer=>", this.props.route.params.offerId);
            this._SearchHotelwithOffer(this.state.RangeVal, this.props.route.params.offerId);
        } else {
            console.log("Without Offer=>", this.props.route.params.offerId);
            this._SearchHotel(this.state.RangeVal);
        }
        // this. hideMenu();
        this.setState({ latitude: await AsyncStorage.getItem('Current_Latitude') });
        this.setState({ longitude: await AsyncStorage.getItem('Current_Longitude') });
    }
    componentDidUpdate(prevProps) {
        if (prevProps.route.params.offerId !== this.props.route.params.offerId) {
            const { offerId } = this.props.route.params;
            if (offerId)
                this._SearchHotelwithOffer(this.state.RangeVal, offerId);
            else
                this._SearchHotel(this.state.RangeVal);
        }
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
    _GetUserDetail = async () => {
        let body = {
            "mobileNo": await AsyncStorage.getItem('mobile')
        }
        fetch(global.URL + "RMS/GetUserDetail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "platform": Platform.OS
            },
            body: JSON.stringify(body),
            redirect: 'follow'
        }).then(response => response.text()).then(async responseText => {
            try {
                var respObject = JSON.parse(responseText);
                console.log("TEST===>", respObject);
                this.setState({ UserId: respObject.id.toString() })
                await AsyncStorage.setItem('UserId', respObject.id.toString());
                if (respObject.image !== null) {
                    this.setState({ Profile: respObject.image })
                    await AsyncStorage.setItem('Profile', respObject.image);
                } else {
                    await AsyncStorage.setItem('Profile', this.state.Profile);
                }
                console.log("Res1==>", respObject);
            }
            catch (error) {
                this.setState({ isLoading: false });
                console.log(error);
            }
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
    _SearchHotelwithOffer = async (range, oid) => {
        this.setState({ isLoading: true })
        console.log("Range=>", range);
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('accessToken');
        let body;
        if (range === '') {
            body = {
                "current_Lat": "29.472561",//await AsyncStorage.getItem('Current_Latitude'),
                "current_Log": "77.707130",//await AsyncStorage.getItem('Current_Longitude'),
                "filterRange": "1000",
                "offerID": oid
            }
        } else {
            body = {
                "current_Lat": "29.472561",//await AsyncStorage.getItem('Current_Latitude'),
                "current_Log": "77.707130",//await AsyncStorage.getItem('Current_Longitude'),
                "filterRange": range,
                "offerID": oid
            }
        }

        fetch(global.URL + "RMS/OfferWiseRestaurantList", {
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
                this.setState({ horizontalData: respObject })
                // console.log("Res2==>", this.state.horizontalData);
                respObject.forEach(item => {
                    this._GetCount(item.registrationID);
                    //open on production
                    this._GetTravelTime(item.registrationID, item.lat, item.long);
                });
                this.setState({ isLoading: false })
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
    _SearchHotel = async (range) => {
        this.setState({ isLoading: true })
        console.log("Range=>", range);
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('accessToken');
        let body;
        if (range === '') {
            body = {
                "current_Lat": "29.472561",//await AsyncStorage.getItem('Current_Latitude'),
                "current_Log": "77.707130",//await AsyncStorage.getItem('Current_Longitude'),
                "filterRange": "1000"
            }
        } else {
            body = {
                "current_Lat": "29.472561",//await AsyncStorage.getItem('Current_Latitude'),
                "current_Log": "77.707130",//await AsyncStorage.getItem('Current_Longitude'),
                "filterRange": range
            }
        }

        fetch(global.URL + "RMS/RestaurantList", {
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
                this.setState({ horizontalData: respObject })
                // console.log("Res2==>", this.state.horizontalData);
                respObject.forEach(item => {
                    this._GetCount(item.registrationID);
                    //open on production
                    this._GetTravelTime(item.registrationID, item.lat, item.long);
                });
                this.setState({ isLoading: false })
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
    handleSearchChange = (text) => {
        this.setState({ search: text }); // Update the search state
    };

    handleSearchPress = () => {
        // Handle the search logic here, using this.state.search
        console.log('Search Query:', this.state.search);
    };
    _SearchList = async (hotel) => {
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('accessToken');
        let body = {
            "current_Lat": "29.472561",//await AsyncStorage.getItem('Current_Latitude'),
            "current_Log": "77.707130",//await AsyncStorage.getItem('Current_Longitude'),
            "name": hotel
        }
        fetch(global.URL + "RMS/SearchRestaurantList", {
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
                this.setState({ horizontalData: respObject })
                // console.log("Res2==>", this.state.horizontalData);
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
    GetOffer(regID, restImg, restfav, restlat, restlong, resttime, restmobile, restDis, restName, restAddress, restOffer, restOfferId, restRating) {
        this.props.navigation.navigate('RestaurantDetail', { regID: regID, img: restImg, fav: restfav, lat: restlat, long: restlong, time: resttime, mobile: restmobile, distance: restDis, name: restName, address: restAddress, offerName: restOffer, offerID: restOfferId, rating: restRating })
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
    UpdateAndClose(range) {
        this.setState({ showPopup: !this.state.showPopup });
        if (this.props.route.params.offerId) {
            this._SearchHotelWithOffer(range, this.props.route.params.offerId);
        } else {
            this._SearchHotel(range);
        }
    }
    _ShowModel() {
        this.setState({ showPopup: !this.state.showPopup });
    }
    GoBack() {
        this.props.navigation.goBack();
    }
    MyHome() {
        console.log("4");
        this.props.navigation.navigate('Dashboard', { name: 'Dashboard' })
    }
    MyFav() {
        console.log("5");
        this.props.navigation.navigate('Map', { name: 'Map' })
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
    //Calculate OrderCOunt For Display Cups counting
    // renderCupImages = (count) => {
    //     const cups = [];
    //     if (count == 0) {
    //         for (let i = 0; i < 4; i++) {
    //             cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 20, height: 20 }} />);
    //         }
    //         cups.push(<View style={{ marginTop: 5, marginLeft: 10, top: -5, flexDirection: 'row', flex: 1, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', padding: 5 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 20, height: 20 }} /><Text> Free</Text></View>);
    //     } else if (count == 1) {
    //         cups.push(<Image key={0} source={require('./images/coffee2.png')} style={{ tintColor: '#ff7f50', width: 20, height: 20 }} />);
    //         for (let i = count; i < 4; i++) {
    //             cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 20, height: 20 }} />);
    //         }
    //         cups.push(<View style={{ marginTop: 5, marginLeft: 10, top: -5, flexDirection: 'row', flex: 1, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', padding: 5 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 20, height: 20 }} /><Text> Free</Text></View>);
    //     } else if (count == 2) {
    //         for (let i = 0; i < count; i++) {
    //             cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ tintColor: '#ff7f50', width: 20, height: 20 }} />);
    //         }
    //         for (let i = count; i < 4; i++) {
    //             cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 20, height: 20 }} />);
    //         }
    //         cups.push(<View style={{ marginTop: 5, marginLeft: 10, top: -5, flexDirection: 'row', flex: 1, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', padding: 5 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 20, height: 20 }} /><Text> Free</Text></View>);
    //     } else if (count == 3) {
    //         for (let i = 0; i < count; i++) {
    //             cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ tintColor: '#ff7f50', width: 20, height: 20 }} />);
    //         }
    //         for (let i = count; i < 4; i++) {
    //             cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 20, height: 20 }} />);
    //         }
    //         cups.push(<View style={{ marginTop: 5, marginLeft: 10, top: -5, flexDirection: 'row', flex: 1, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', padding: 5 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 20, height: 20 }} /><Text> Free</Text></View>);
    //     } else {
    //         for (let i = 0; i < count; i++) {
    //             cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ tintColor: '#ff7f50', width: 20, height: 20 }} />);
    //         }
    //         cups.push(<View style={{ marginTop: 5, marginLeft: 10, top: -5, flexDirection: 'row', flex: 1, borderRadius: 20, backgroundColor: '#ff7f50', justifyContent: 'center', padding: 5 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#fff', width: 20, height: 20 }} /><Text style={{ color: '#fff' }}> Free</Text></View>);
    //     }
    //     return cups;
    // }
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
            cups.push(<View style={{ marginTop: 2, margin: 3, top: -4, flexDirection: 'row', flex: 1, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', padding: 3 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 20, height: 20 }} /><Text style={{ color: '#ccc' }}> Free</Text></View>);
        }
        return cups;
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header />
                {/* Main content */}
                <View style={{ flex: 1, backgroundColor: '#eee' }}>
                    {/* Contents */}
                    <View style={{ flexDirection: 'row', marginTop: 2 }}>
                        <View style={{ flexDirection: 'row', marginTop: 10, position: 'absolute', zIndex: 3, width: '95%' }}>
                            <View style={[styles.searchContainer, { flex: 5, alignSelf: 'center', marginLeft: 30 }]}>
                                <TextInput
                                    style={[{ marginLeft: 20, color: '#000', flex: 1, paddingVertical: 5, paddingHorizontal: 5, fontFamily: 'Inter-Regular' }]}
                                    placeholder="Search"
                                    placeholderTextColor="#bbb"
                                    onChangeText={(txt) => { this.setState({ search: txt }), this._SearchList(txt) }}
                                />
                                <Image
                                    source={search}
                                    style={styles.searchIcon}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', position: 'relative', zIndex: 2 }}>
                            {this.state.isLoading === false &&
                                <MapComponent hotels={this.state.horizontalData} width={SCREEN_WIDTH} height={300} />
                            }
                        </View>
                    </View>
                    {/* Listing of Restaurent */}
                    <View style={{ flexGrow:1,
                        backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius:30, padding: 10, marginTop: -20, zIndex: 3,
                        shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.29, shadowRadius: 4.65, elevation: 7,
                    }}>
                        <FlatList style={{ backgroundColor: '#fff', height: SCREEN_HEIGHT - 310 }}
                            showsVerticalScrollIndicator
                            data={this.state.horizontalData}
                            // keyExtractor={(item) => item.registrationID}
                            renderItem={({ item, index }) => (
                                <View key={index} style={[styles.horizontalListItem, { flexDirection: 'row' }]}>
                                    <View style={{ flex: 2.4, position: 'relative', }}>
                                        <Image
                                            source={{ uri: item.image.toString() }}
                                            style={{ margin: 10, height: 125, width: 120, borderRadius: 5 }}
                                        />
                                        <View style={{ position: 'absolute', top: 15, right: 20 }}>
                                            {item.favourite === "True" &&
                                                <Image source={fav} style={{ height: 15, width: 15 }} />
                                            }
                                            {item.favourite === "FALSE" &&
                                                <Image source={addfav} style={{ height: 15, width: 15 }} />
                                            }
                                        </View>
                                    </View>
                                    <View style={{ flex: 3, alignItems: 'baseline' }}>
                                        <View>
                                            <TouchableOpacity key={index} onPress={() => this.GetOffer(item.registrationID, item.image, item.favourite, item.lat, item.long, this.state.travelTimes[item.registrationID], item.mobileNo, item.distance.toFixed(2), item.restaurentName, item.address, item.offerName, item.offerID, this.searchRating(item.registrationID))} >
                                                <Text style={styles.itemName}>{item.restaurentName}</Text>
                                                <View style={{ flexDirection: 'row', marginTop: 3, marginLeft: 1 }}>
                                                    <Image source={rating} style={{ marginTop: 3, height: 12, width: 12 }} />
                                                    <Text style={{ fontSize: 10, fontFamily: 'Poppins-Bold', color: '#000' }}> {this.searchRating(item.registrationID)} | </Text>
                                                    <Image source={time} style={[styles.ListIcon, { marginTop: 3 }]} />
                                                    <Text style={{ fontSize: 10, fontFamily: 'Poppins-Bold', color: '#000' }}> {this.state.travelTimes[item.registrationID]} </Text>
                                                </View>
                                                {/* <Text style={{ fontSize: 10, fontFamily: 'Inter-Bold' }}> */}
                                                {/* <Image source={distance} style={[styles.ListIcon, { tintColor: '#ff7f50' }]} /> {item.distance !== undefined ? item.distance.toFixed(2) : ''} Km */}

                                                {/* </Text> */}
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Image source={location} style={styles.ListIcon} />
                                                    <Text style={{ fontSize: 10, color: '#000' }}>{item.address.substring(0, 50)}....</Text>
                                                </View>
                                                {/* <Text style={styles.address}>5:00 am-5:00 am</Text> */}
                                                {/* <Text style={styles.address}>DRIVE THRU</Text> */}
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ width: '110%', paddingTop: 10, margin: 3, padding: 0, flexDirection: 'row', backgroundColor: '#fff3ee', borderRadius: 20, alignItems: 'center' }}>
                                            {/* {this.renderCupImages(this.state.orderCounts[item.registrationID] || 0)} */}
                                            <Text style={{ marginTop: -15, marginLeft: 5, fontSize: 12, color: '#000' }}>{item.offerName}</Text>
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
                {/* BottomBar */}
                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                    <BottomBar selectedTab={this.state.selectedTab} onHomePress={() => this.OrderNow()} onOfferPress={() => this.MyOffer()} onOrderPress={() => this.OrderList()} onAccPress={() => this.MyAcc()} />
                </View>
            </View>
        )
    }
}
