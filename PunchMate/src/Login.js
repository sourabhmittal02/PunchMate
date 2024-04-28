import React, { Component } from 'react'
import { BackHandler, PermissionsAndroid, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backgroundColor, shadow } from '@shopify/restyle';

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
            showPopup: false,
            email: '',
            activeButton: 'button1',
        }
    }
    async componentDidMount() {
        let user = await AsyncStorage.getItem('firstName');
        if (user !== null) {
            this.props.navigation.navigate('OrderNow', { name: 'OrderNow' })
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
                    console.log("Golbal:", global.URL, "==", respObject);
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
    async GetMobile() {
        let body = {
            "email": this.state.email
        }
        fetch(global.URL + "Login/GetMobileNo", {
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
                if (respObject.status === 1) {
                    Alert.alert(global.TITLE, "Mobile No. Send to your registed mail");
                    this.setState({ showPopup: false })
                } else {
                    Alert.alert(global.TITLE, respObject.message);
                }
            }
            catch (error) {
                this.setState({ isLoading: false });
                console.log(error);
            }
        });
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
                    <View style={{ margin: 2, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={require('./images/bgLogin.png')}
                            style={{ width: screenWidth, height: screenHeight - 220 }}
                        />
                    </View>
                    {/* 092D21 */}
                    <View style={[{ margin: 0, width: screenWidth, marginTop: -50, borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor: '#fff', height: 315 }]}>
                        <Text style={{ margin: 20, color: '#000', fontSize: 20, fontFamily: 'Poppins-Bold' }}>
                            Login
                        </Text>
                        <Text style={{ marginTop: -20, margin: 20, color: '#000', fontSize: 14, fontFamily: 'Poppins' }}>
                            Please enter your mobile number
                        </Text>
                        <View style={{}}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{backgroundColor:"#eee",paddingRight:0, padding:8, flex: 0, marginLeft: 10,borderTopLeftRadius:20,borderBottomLeftRadius:20 }}>
                                    <Text style={{ fontSize: 15, color: '#000' }}>+61 - </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TextInput style={{marginLeft:0, height: 40, marginBottom: 0, padding: 0, marginTop: 0, margin: 10, borderTopRightRadius: 20, borderBottomRightRadius:20, fontSize: 15, color: '#000', fontFamily: 'Poppins-Regular' }}
                                        placeholder="  Mobile Number"
                                        placeholderTextColor="#aaa"
                                        backgroundColor="#eee"
                                        keyboardType='number-pad'
                                        onChangeText={(txt) => { this.setState({ MobileNo: txt }); }}
                                    />
                                </View>
                            </View>
                            {/* <TextInput style={{ margin: 10, marginTop: -2, marginBottom: -2, borderRadius: 10, backgroundColor: '#fff', fontSize: 18 }}
                                    placeholder="Enter Password"
                                    placeholderTextColor="#000"
                                    secureTextEntry={true}
                                    onChangeText={(txt) => { this.setState({ CustomerPass: txt }); }} /> */}
                            <TouchableOpacity style={[styles.BtnLogin, { height: 40,marginTop:40 }]} onPress={() => this.GetCustomerLogin()} >
                                <Text style={[styles.BtnText]}>Continue</Text>
                            </TouchableOpacity>
                            
                            <View style={{ flexDirection: 'row-reverse', margin: 10}}>
                                <TouchableOpacity onPress={() => this.setState({ showPopup: true })}>
                                    <Text style={{ color: '#000', textDecorationLine: 'underline' }}>Forget Mobile No.</Text>
                                </TouchableOpacity>
                            </View>
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
                        {/* Detail Show */}
                        <Modal visible={this.state.showPopup} transparent={true} animationType='fade' onRequestClose={() => { this.handleBackPress() }}>
                            <View style={[styles.popup, { flexDirection: 'column' }]}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                        <Text style={{ fontSize: 14, color: '#000', fontFamily: 'Popins-Bold' }}>Enter Registered Email-Id</Text>
                                    </View>
                                    <View style={{ flex: 0.1, alignItems: 'flex-end' }}>
                                        <TouchableOpacity onPress={() => this.setState({ showPopup: false })}>
                                            <Text style={{ fontSize: 20, color: '#fc6a57', fontFamily: 'Popins-Bold', }}>X</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ width: '100%', }}>
                                    <TextInput style={{ padding: 10, margin: 10, borderRadius: 20, fontSize: 15, color: '#000', fontFamily: 'Poppins-Regular' }}
                                        placeholder="Email-Id"
                                        placeholderTextColor="#aaa"
                                        backgroundColor="#eee"
                                        keyboardType='email-address'
                                        onChangeText={(txt) => { this.setState({ email: txt }); }}
                                    />
                                </View>
                                <View style={{ width: '100%', alignItems: 'center' }}>
                                    <TouchableOpacity style={[styles.BtnLogin, { width: '50%' }]} onPress={() => this.GetMobile()}>
                                        <Text style={{ color: '#fff' }}>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
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
