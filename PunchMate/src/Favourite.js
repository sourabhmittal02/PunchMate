import React, { Component } from 'react'
import { ImageBackground, PanResponder, Animated, BackHandler, FlatList, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AngleUp from './images/up.png';
import AngleDown from './images/down.png';

let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT = Dimensions.get('window').height;
export default class Favourite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Profile: 'https://punchmateblobstorageac.blob.core.windows.net/punchmateappimg/nophoto.jpg',
            UserId: '',
            OrderFrequent: [],
            frequentlyOrderedExpanded: true,
            favoriteExpanded: false,
            frequentlyOrderedData: [],
            favoriteData: [],
        }
    }
    componentDidMount = async () => {
        this.setState({ UserId: await AsyncStorage.getItem('UserId') });
        this._GetFrequent(await AsyncStorage.getItem('UserId'));
        this.setState({ Profile: await AsyncStorage.getItem('Profile') });
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
    _GetFrequent = async (userid) => {
        this.setState({ isLoading: true })
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('accessToken');
        let body = {
            "UserId": userid,
            "restaurant_ID": "string"
        };
        fetch(global.URL + "RMS/FrequentlyOrderedProductOrder", {
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
                this.setState({ frequentlyOrderedData: respObject })
                this.setState({ isLoading: false })
                console.log("Res2==>", this.state.frequentlyOrderedData);
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
        const placeholderData = [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
            { id: 3, name: 'Item 3' },
        ];

        if (section === 'frequentlyOrdered') {
            this.setState({ frequentlyOrderedData: placeholderData });
        } else if (section === 'favorite') {
            this.setState({ favoriteData: placeholderData });
        }
    };
    render() {
        const { frequentlyOrderedExpanded, favoriteExpanded } = this.state;
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
                            <Text style={{ color: '#fff', fontSize: 18 }}>Favourite</Text>
                        </View>
                    </View>
                </View>
                <View style={{ margin: 0, marginTop: 10, alignItems: 'center', }}>
                    <TouchableOpacity style={[styles.dropHeading]} onPress={() => this.toggleSection('frequentlyOrdered')}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 3 }}>
                                <Text style={{ color: '#fff', textAlign: 'center', fontFamily: 'Inter-Bold', }}>Frequently Ordered</Text>
                            </View>
                            <View style={{ flex: 0.2 }}>
                                {frequentlyOrderedExpanded ? <Image style={{ width: 25, height: 25 }} source={AngleUp} /> : <Image style={{ width: 25, height: 25 }} source={AngleDown} />}
                            </View>
                        </View>
                    </TouchableOpacity>
                    {frequentlyOrderedExpanded && (
                        <View>
                            {this.state.frequentlyOrderedData.length === 0 ? (
                                <Text>Loading data...</Text>
                            ) : (
                                this.state.frequentlyOrderedData.map((item,index) => (
                                    <Text style={{color:'#000'}} key={index}>{item.pname}</Text>
                                ))
                            )}
                        </View>
                    )}

                    <TouchableOpacity style={[styles.dropHeading]} onPress={() => this.toggleSection('favorite')}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 3 }}>
                                <Text style={{ color: '#fff', textAlign: 'center', fontFamily: 'Inter-Bold', }}>Favorite Resaturent</Text>
                            </View>
                            <View style={{ flex: 0.2 }}>
                            {favoriteExpanded ? <Image style={{ width: 25, height: 25 }} source={AngleUp} /> : <Image style={{ width: 25, height: 25 }} source={AngleDown} />}
                            </View>
                        </View>
                    </TouchableOpacity>

                    {favoriteExpanded && (
                        <View>
                            {this.state.favoriteData.length === 0 ? (
                                <Text>Loading data...</Text>
                            ) : (
                                this.state.favoriteData.map((item) => (
                                    <Text key={item.id}>{item.name}</Text>
                                ))
                            )}
                        </View>
                    )}
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
            </SafeAreaView>
        )
    }
}
