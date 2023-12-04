import React, { Component } from 'react'
import { ImageBackground, BackHandler, PermissionsAndroid, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backgroundColor } from '@shopify/restyle';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // RestaurantId: '',
            // RestaurantPass: '',
            MobileNo: '',
            // CustomerPass: '',
            isEnable: false,
            isLoading: false,
            activeButton: 'button1',
        }
    }
    async componentDidMount() {
        let user = await AsyncStorage.getItem('firstName');
        if (user !== null) {
            this.props.navigation.navigate('Dashboard', { name: 'Dashboard' })
        }
    }
    GetCustomer() {
        if (this.state.activeButton !== 'button1') {
            this.setState({ activeButton: 'button1' });
        }
    }
    GetRestaurent() {
        if (this.state.activeButton !== 'button2') {
            this.setState({ activeButton: 'button2' });
        }
    }
    async GetCustomerLogin() {
        // For Testing
        await AsyncStorage.removeItem('ProductList');
        if (this.state.MobileNo == "" || this.state.MobileNo == null) {
            Alert.alert(global.TITLE, "Mobile  No. Can't Be Left Empty");
        } else {
            let body = {
                "mobileNo": this.state.MobileNo.toString()
            }
            this.setState({ isLoading: true })
            fetch(global.URL + "Login/CheckMobileNo/", {
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
                    // console.log(AsyncStorage.getItem('Current_Latitude'));
                    // console.log(AsyncStorage.getItem('Current_Longitude'));
                    await AsyncStorage.setItem('mobile', this.state.MobileNo);
                    if (respObject.response == 1) {
                        this.setState({ isLoading: false });
                        this.props.navigation.navigate('ValidatePin', { name: 'ValidatePin' })
                    } else if (respObject.response === 0) {
                        this.props.navigation.navigate('Registration', { name: 'Registration' })
                    } else {
                        this.setState({ isLoading: false });
                        Alert.alert(global.TITLE, "Invalid Mobile Number")
                    }
                    this.setState({ isLoading: false });

                }
                catch (error) {
                    this.setState({ isLoading: false });
                    console.log(error);
                    Alert.alert(global.TITLE, "Invalid Mobile Number");
                }
            }).catch(error => {
                console.log(error);
                this.setState({ isLoading: false });
                Alert.alert(global.TITLE, " " + error);
            });
        }
    }
    // GetResturantLogin() {
    //     let body = {
    //         "loginId": this.state.RestaurantId,
    //         "password": this.state.RestaurantPass,
    //     }
    //     this.setState({ isLoading: true })
    //     fetch(global.URL + "Login/RestaurantLogin/", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "platform": Platform.OS
    //         },
    //         body: JSON.stringify(body),
    //         redirect: 'follow'
    //     }).then(response => response.text()).then(async responseText => {
    //         try {
    //             var respObject = JSON.parse(responseText);
    //             console.log(respObject);
    //             if (respObject.registrationID !== null) {
    //                 this.setState({ EMP_NAME: respObject.restaurentName.toString() });
    //                 await AsyncStorage.setItem('uname', this.state.RestaurantId);
    //                 await AsyncStorage.setItem('pass', this.state.RestaurantPass);
    //                 await AsyncStorage.setItem('Token', respObject.accessToken);
    //                 this.setState({ isLoading: false });
    //                 this.props.navigation.navigate('Dashboard', { name: 'Dashboard' })
    //             } else {
    //                 this.setState({ isLoading: false });
    //                 Alert.alert(global.TITLE, "Invalid Restaurant Username or Password")
    //             }
    //             this.setState({ isLoading: false });

    //         }
    //         catch (error) {
    //             this.setState({ isLoading: false });
    //             console.log(error);
    //             Alert.alert(global.TITLE, "Invalid Restaurant Username or Password");
    //         }
    //     }).catch(error => {
    //         console.log(error);
    //         this.setState({ isLoading: false });
    //         Alert.alert(global.TITLE, " " + error);
    //     });
    // }
    render() {
        return (
            <SafeAreaView contentContainerStyle={[styles.contentContainer]}>
                <ScrollView>
                    <View style={{ margin: -5, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={require('./images/icon.png')}
                            style={{ width: screenWidth, height: screenHeight - 350 }}
                        />
                    </View>
                    {/* 092D21 */}
                    <View style={[{ margin: 0, width: screenWidth, marginTop: -50, borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor: '#000', height: screenHeight - 340 }]}>
                        <Text style={{ margin: 30, color: '#fff', fontSize: 24, fontFamily: 'Inter-Bold' }}>
                            Get food you want
                        </Text>
                        <Text style={{ marginTop: -20, margin: 30, color: '#fff', fontSize: 14, fontFamily: 'Inter' }}>
                            Please enter your phone number
                        </Text>
                        <View>
                            <TextInput style={{ margin: 10, borderRadius: 10, backgroundColor: '#fff', fontSize: 18, color: '#000', fontFamily: 'Inter-Regular' }}
                                placeholder="Enter Phone Number"
                                placeholderTextColor="#000"
                                keyboardType='number-pad'
                                onChangeText={(txt) => { this.setState({ MobileNo: txt }); }}
                            />
                            {/* <TextInput style={{ margin: 10, marginTop: -2, marginBottom: -2, borderRadius: 10, backgroundColor: '#fff', fontSize: 18 }}
                                    placeholder="Enter Password"
                                    placeholderTextColor="#000"
                                    secureTextEntry={true}
                                    onChangeText={(txt) => { this.setState({ CustomerPass: txt }); }} /> */}
                            <TouchableOpacity style={[styles.BtnLogin]} onPress={() => this.GetCustomerLogin()} >
                                <Text style={[styles.BtnText]}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                        {/* :
                            <View>
                                <TextInput style={{ margin: 10, borderRadius: 10, backgroundColor: '#fff', fontSize: 18 }}
                                    placeholder="Enter User Id"
                                    placeholderTextColor="#000"
                                    onChangeText={(txt) => { this.setState({ RestaurantId: txt }); }} />
                                <TextInput style={{ margin: 10, marginTop: -2, marginBottom: -2, borderRadius: 10, backgroundColor: '#fff', fontSize: 18 }}
                                    placeholder="Enter Password"
                                    placeholderTextColor="#000"
                                    secureTextEntry={true}
                                    onChangeText={(txt) => { this.setState({ RestaurantPass: txt }); }} />
                                <TouchableOpacity style={[styles.BtnLogin]} onPress={() => this.GetResturantLogin()}>
                                    <Text style={[styles.BtnText]}>Login</Text>
                                </TouchableOpacity>
                            </View>
                        } */}
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
                </ScrollView>
            </SafeAreaView>
        )
    }
}
