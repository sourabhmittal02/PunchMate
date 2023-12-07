import React, { Component } from 'react'
import { ImageBackground, PanResponder, Animated, BackHandler, FlatList, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import AsyncStorage from '@react-native-async-storage/async-storage';
import search from './images/search.png';
import order from './images/order.png';
import getintouch from './images/mail2.png';
import MenuIcon from './images/menu.png';
import account from './images/account.png';
import fav from './images/fav.png';
import addfav from './images/addfav.png';
import { Dropdown } from 'react-native-element-dropdown';
import NavigationService from './Service/NavigationService';

let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT = Dimensions.get('window').height;
export default class OrderNow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading:false,
            Login: '',
            search: '',
            Profile: 'https://punchmateblobstorageac.blob.core.windows.net/punchmateappimg/nophoto.jpg',
            showPopup: false,
            showMenu: false,
            UserId: '',
            menuVisible: false,
            RangeList: [{ label: '2 Kms', value: '2' }, { label: '4 Kms', value: '4' },
            { label: '6 Kms', value: '6' }, { label: '8 Kms', value: '8' }, { label: 'All', value: 'All' },
            ],
            RangeVal: '',
            horizontalData: [
                {
                    id: '1',
                    itemName: 'Item 1',
                    description: 'This is item 1 description',
                    buyLink: 'https://example.com/item1',
                    image: require('./images/pizza.png'),
                },
                {
                    id: '2',
                    itemName: 'Item 2',
                    description: 'This is item 2 description',
                    buyLink: 'https://example.com/item2',
                    image: require('./images/pizza.png'),
                },
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
        this._SearchHotel(this.state.RangeVal);
        // this. hideMenu();
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
                console.log("Res2==>", this.state.horizontalData);
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
                console.log("Res2==>", this.state.horizontalData);
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
    GetOffer(regID, restImg, restfav, restlat, restlong) {
        this.props.navigation.navigate('RestaurantDetail', { regID: regID, img: restImg, fav: restfav, lat: restlat, long: restlong })
    }
    UpdateAndClose(range) {
        this.setState({ showPopup: !this.state.showPopup });
        this._SearchHotel(range);
    }
    _ShowModel() {
        this.setState({ showPopup: !this.state.showPopup });
    }
    GoBack() {
        this.props.navigation.goBack();
    }
    render() {
        return (
            <SafeAreaView>
                <View style={{ height: 40, backgroundColor: "#000", flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
                    <View style={{ marginLeft: 10, flex: 0.1 }}>
                        <TouchableOpacity onPress={() => this.GoBack()}>
                            <Image style={{ width: 25, height: 25, marginTop: 5 }} source={require('./images/back.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, margin: 10 }}>
                        <TouchableOpacity>
                            <Image style={{ width: 30, height: 30, marginRight: 0, borderRadius: 30, marginRight: 10, resizeMode: 'contain' }} source={{ "uri": this.state.Profile.toString() }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', margin: 10 }}>
                        <Text style={{ color: '#fff' }}>Restaurant List</Text>
                    </View>
                    {/* <Text style={{ flex: 1.8, fontSize: 16, color: "#ffffff", alignSelf: "center", textAlign: "center" }}>Dashboard</Text> */}
                </View>
                <View style={{ flexDirection: 'row', position: 'relative' }}>
                    <Image
                        style={{ width: SCREEN_WIDTH, height: 250, alignSelf: 'center', zIndex: 2, position: 'relative' }}
                        source={require('./images/map.png')}
                    />
                </View>
                <View style={{ flexDirection: 'row', backgroundColor: '#fff', marginTop: 10 }}>
                    <View style={[styles.searchContainer, { flex: 4 }]}>
                        <Image
                            source={search}
                            style={styles.searchIcon}
                        />
                        <TextInput
                            style={[{ color: '#000', flex: 1, paddingVertical: 8, paddingHorizontal: 5, fontFamily: 'Inter-Regular' }]}
                            placeholder="Search Restaurant"
                            placeholderTextColor="#000"
                            onChangeText={(txt) => { this.setState({ search: txt }), this._SearchList(txt) }}
                        />
                    </View>
                    <View style={{ flex: 1, margin: 10, marginTop: 15, flexDirection: 'row' }}>
                        {/* <Text style={{ color: '#000', fontFamily: 'Inter-Regular' }}>Filter</Text> */}
                        <TouchableOpacity style={[]} onPress={() => this._ShowModel()} >
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    style={{ width: 30, height: 30, alignSelf: 'center' }}
                                    source={require('./images/filter.png')}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ backgroundColor: '#fff', padding: 10 }}>
                    {/* <Text style={{ fontWeight: 'bold' }}>Login As {this.state.Login}</Text> */}
                    <Text style={[styles.ListHeading]}>Nearby Stores</Text>
                </View>
                <FlatList style={{ backgroundColor: '#fff', height: 330 }}
                    showsVerticalScrollIndicator
                    data={this.state.horizontalData}
                    // keyExtractor={(item) => item.registrationID}
                    renderItem={({ item, index }) => (
                        <View key={index} style={[styles.horizontalListItem, { flexDirection: 'row' }]}>
                            <View style={{ flex: 2 }}>
                                <TouchableOpacity key={index} onPress={() => this.GetOffer(item.registrationID, item.image, item.favourite, item.lat, item.long)} >
                                    <Text style={styles.itemName}>{item.restaurentName}</Text>
                                    <Text style={styles.address}>{item.address}</Text>
                                    <Text style={styles.address}>5:00 am-5:00 am</Text>
                                    <Text style={styles.address}>DRIVE THRU</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontFamily: 'Inter-Regular', fontSize: 12, margin: 10 }}>
                                    <Image
                                        source={require('./images/location.png')} // Replace with the actual icon source
                                    />
                                    {item.distance !== undefined ? item.distance.toFixed(2) : ''} Km
                                </Text>
                            </View>
                        </View>
                    )}
                />
                {/* Popup Model For Adding Items */}
                <Modal visible={this.state.showPopup} transparent={true} animationType='fade' onRequestClose={this.UpdateAndClose}>
                    <View style={[styles.popup]}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <Text style={{ fontSize: 18, color: '#000', fontFamily: 'Inter-Bold' }}>Range</Text>
                            </View>
                            <View style={{ flex: 0.1, alignItems: 'flex-end' }}>
                                <TouchableOpacity onPress={() => this._ShowModel()}>
                                    <Text style={{ fontSize: 20, color: '#fc6a57', fontFamily: 'Inter-Bold', }}>X</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ width: '95%' }}>
                            <Dropdown
                                style={[styles.dropdown, this.state.isFocus && { color: '#000', borderColor: 'blue' }]}
                                itemTextStyle={styles.dropdownText}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={this.state.RangeList}
                                search={true}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!this.state.isFocus ? 'Select Range' : '...'}
                                searchPlaceholder="Search..."
                                value={this.state.RangeVal}
                                onFocus={() => this.setState({ isFocus: true })}
                                onBlur={() => this.setState({ isFocus: false })}
                                onChange={item => {
                                    this.setState({ RangeVal: item.value });
                                    this.setState({ isFocus: false });
                                    this.UpdateAndClose(item.value);
                                }}
                            />
                        </View>
                        {/* <View style={{ width: '95%' }}>
              <TouchableOpacity style={[styles.BtnLogin]} onPress={()=>this.UpdateAndClose()}>
                <Text style={{ fontFamily: "Arial", fontSize: 18, fontWeight: 'bold' }}>Update</Text>
              </TouchableOpacity>
            </View> */}
                    </View>
                </Modal>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.isLoading}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#F60000" />
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: "#F60000", margin: 15 }}>Loading....</Text>
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}
