import React, { Component } from 'react'
import { ImageBackground, BackHandler, PermissionsAndroid, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, FlatList, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import Header from './Header'
import BottomBar from './BottomBar'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChPass from './images/chPass.png';
import NavigationService from './Service/NavigationService';

export default class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'Account',
            Profile: 'https://punchmateblobstorageac.blob.core.windows.net/punchmateappimg/nophoto.jpg',
            OldPass: '',
            NewPass: '',
            ConPass: '',
            secureTextEntry1: true,
            secureTextEntry2: true,
            secureTextEntry3: true,
        }
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
    _Logout() {
        Alert.alert(
            'Logout App',
            'Logout the application?', [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: async () => {
                    let IMEI = await AsyncStorage.getItem('IMEI');
                    await AsyncStorage.clear();
                    // await AsyncStorage.setItem("IMEI", IMEI);
                    setTimeout(() => {
                        NavigationService.navigateAndReset('Login');
                    }, 1000); // Wait for 1 second

                }
            },], {
            cancelable: false
        }
        )
    }
    async _ChPass() {
        if (this.state.NewPass == "" || this.state.ConPass == "") {
            Alert.alert(global.TITLE, "Field(s) Can't Be left Empty")
        } else if (this.state.NewPass != this.state.ConPass) {
            Alert.alert(global.TITLE, "New and Confirm Password Does Not Match")
        }
        let body = {
            "loginId": await AsyncStorage.getItem('mobile'),
            "password": this.state.NewPass,
        }
        console.log(body);
        fetch(global.URL + "Login/ChangePassword/", {
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
                console.log(respObject);
                Alert.alert(global.TITLE, respObject.status);
                if(respObject.response==1){
                    await AsyncStorage.clear();
                    setTimeout(() => {
                        NavigationService.navigateAndReset('Login');
                    }, 1000); // Wait for 1 second
                }
            }
            catch (error) {
                this.setState({ isLoading: false });
                console.log(error);
                Alert.alert(global.TITLE, error);
            }
        }).catch(error => {
            console.log(error);
            this.setState({ isLoading: false });
            Alert.alert(global.TITLE, " " + error);
        });

    }
    togglePasswordVisibility1 = () => {
        this.setState((prevState) => ({
            secureTextEntry1: !prevState.secureTextEntry1,
        }));
    };
    togglePasswordVisibility2 = () => {
        this.setState((prevState) => ({
            secureTextEntry2: !prevState.secureTextEntry2,
        }));
    };
    togglePasswordVisibility3 = () => {
        this.setState((prevState) => ({
            secureTextEntry3: !prevState.secureTextEntry3,
        }));
    };
    render() {
        const { secureTextEntry1, secureTextEntry2, secureTextEntry3 } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Header />
                {/* Main content */}
                <View style={{ flex: 1, backgroundColor: '#eee' }}>
                    {/* Header Bar */}
                    <View style={{ height: 50, backgroundColor: "#fff", flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
                        <View style={{ flex: 1, margin: 10, flexDirection: 'row' }}>
                            <View style={{ flex: 0.1 }}>
                                <TouchableOpacity onPress={() => this.GoBack()}>
                                    <Image style={{ tintColor: '#000', width: 25, height: 25, marginTop: 5, }} source={require('./images/back.png')} />
                                </TouchableOpacity>
                            </View>
                            <Text style={{ marginTop: 8, color: '#000', fontSize: 15 }}>  Change Password</Text>
                        </View>
                    </View>
                    <View>
                        {/* <View style={{ borderRadius: 20, margin: 20, backgroundColor: '#fff', marginTop: 20, height: 50, padding: 8, flexDirection: 'row' }}>
                            <TextInput secureTextEntry={secureTextEntry1} onChangeText={(txt) => { this.setState({ OldPass: txt }); }} style={{ marginLeft: 15, color: '#000', fontSize: 13, width: '80%', padding: 2 }} placeholder='Old Password' />
                            <TouchableOpacity onPress={this.togglePasswordVisibility1}>
                                <Image
                                    source={
                                        secureTextEntry1
                                            ? require('./images/hide.png')
                                            : require('./images/show.png')
                                    }
                                    style={{ marginTop: 3, width: 30, height: 30 }}
                                />
                            </TouchableOpacity>
                        </View> */}
                        <View style={{ borderRadius: 20, margin: 20, backgroundColor: '#fff', marginTop: 20, height: 50, padding: 8, flexDirection: 'row' }}>
                            <TextInput secureTextEntry={secureTextEntry2} onChangeText={(txt) => { this.setState({ NewPass: txt }); }} style={{ marginLeft: 15, color: '#000', fontSize: 13, width: '80%', padding: 2 }} placeholder='New Password' />
                            <TouchableOpacity onPress={this.togglePasswordVisibility2}>
                                <Image
                                    source={
                                        secureTextEntry2
                                            ? require('./images/hide.png')
                                            : require('./images/show.png')
                                    }
                                    style={{ marginTop: 3, width: 30, height: 30 }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ borderRadius: 20, margin: 20, backgroundColor: '#fff', marginTop: 5, height: 50, padding: 8, flexDirection: 'row' }}>
                            <TextInput secureTextEntry={secureTextEntry3} onChangeText={(txt) => { this.setState({ ConPass: txt }); }} style={{ marginLeft: 15, color: '#000', fontSize: 13, width: '80%', padding: 2 }} placeholder='Confirm Password' />
                            <TouchableOpacity onPress={this.togglePasswordVisibility3}>
                                <Image
                                    source={
                                        secureTextEntry3
                                            ? require('./images/hide.png')
                                            : require('./images/show.png')
                                    }
                                    style={{ marginTop: 3, width: 30, height: 30 }}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={[styles.BtnLogin]} onPress={() => this._ChPass()}>
                            <Text style={{ color: '#fff', textAlign: 'center', padding: 5 }}>Change Password</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* BottomBar */}
                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                    <BottomBar selectedTab={this.state.selectedTab} onHomePress={() => this.OrderNow()} onOfferPress={()=>this.MyOffer()} onOrderPress={() => this.OrderList()} onAccPress={() => this.MyAcc()} />
                </View>
            </View>
        )
    }
}
