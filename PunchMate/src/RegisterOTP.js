import React, { Component } from 'react'
import { ImageBackground, BackHandler, FlatList, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
export default class RegisterOTP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            otp: ['', '', '', '', '', ''],
            currentIndex: 0,
            UserInfo: {},
            mobile: '',
        }
        this.otpTextInput = [];
    }
    async componentDidMount() {
        this.setState({ UserInfo: this.props.route.params.data })
        this.setState({ mobile: this.props.route.params.mobile })
        console.log("UserInfo:=>", this.props.route.params.data);
    }
    handleChangeText = (index, value) => {
        const newOtp = [...this.state.otp];
        newOtp[index] = value;
        this.setState({ otp: newOtp }, () => {
            if (index < this.state.otp.length - 1 && value !== '') {
                this.otpTextInput[index + 1].focus();
            }
        });
    };

    handleKeyPress = (index, e) => {
        if (e.nativeEvent.key === 'Backspace' && index > 0 && this.state.otp[index] === '') {
            this.otpTextInput[index - 1].focus();
        }
    };
    GoHome() {
        this.props.navigation.navigate('Login', { name: 'Login' })
    }
    ResendOTP(){
        let body={
            mobileNo:this.state.mobile.toString()
        }
        fetch(global.URL + "Login/SendOTP", {
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
                Alert.alert(global.TITLE,respObject.message);
            }
            catch (error) {
                this.setState({ isLoading: false });
                console.log(error);
            }
        });
    }
    handleButtonPress = () => {
        const otp = this.state.otp.join('');
        // Perform OTP validation here
        // alert('OTP entered: ' + otp);
        let body = {
            "mobileNo": this.state.mobile,
            "otp": otp
        }
        console.log(body);
        fetch(global.URL + "Login/ValidateOTP", {
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
                    try {
                        fetch(global.URL + "Login/UserRegistration", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "platform": Platform.OS
                            },
                            body: this.state.UserInfo,
                            redirect: 'follow'
                        }).then(response => response.text()).then(async responseText => {
                            var respObject = JSON.parse(responseText);
                            console.log(respObject);
                            if (respObject.status === 1) {
                                this.props.navigation.navigate('Login', { name: "Login" });
                            }else{
                                Alert.alert(global.TITLE,respObject.message);
                            }

                        })
                    } catch (error) {
                        console.error('Error uploading file:', error);
                    }
                }
            }
            catch (error) {
                this.setState({ isLoading: false });
                console.log(error);
            }
        });
    };
    render() {
        return (
            <SafeAreaView contentContainerStyle={[styles.contentContainer]}>
                <ScrollView>
                    <View style={{ margin: 2, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={require('./images/bgLogin.png')}
                            style={{ width: screenWidth, height: screenHeight - 250 }}
                        />
                    </View>
                    <View style={[{ margin: 0, width: screenWidth, marginTop: -50, borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor: '#fff', height: 305 }]}>
                        <Text style={{ margin: 25, color: '#000', fontSize: 18, fontFamily: 'Poppins-Bold' }}>
                            Enter OTP
                        </Text>
                        <View style={styles1.container}>
                            <View style={styles1.otpContainer}>
                                {this.state.otp.map((value, index) => (
                                    <TextInput
                                        key={index}
                                        style={styles1.otpBox}
                                        ref={(ref) => (this.otpTextInput[index] = ref)}
                                        onChangeText={(text) => this.handleChangeText(index, text)}
                                        onKeyPress={(e) => this.handleKeyPress(index, e)}
                                        value={value}
                                        maxLength={1}
                                        keyboardType="numeric"
                                    />
                                ))}
                            </View>
                        </View>
                        <TouchableOpacity style={[styles.BtnLogin]} onPress={() => this.handleButtonPress()} >
                            <Text style={[styles.BtnText]}>Validate OTP</Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 12, textAlign: 'center' }}>Didn't receive thr OTP</Text>
                            <TouchableOpacity style={{ margin: 0 }} onPress={() => this.GoHome()} >
                                <Text style={[styles.BtnLinkText, { fontSize: 12, marginLeft: 5 }]}>Change Number</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ margin: 10 }}>or</Text>
                            <TouchableOpacity style={{ margin: 0 }} onPress={() => this.ResendOTP()} >
                                <Text style={[styles.BtnLinkText, { fontSize: 12, marginLeft: 5 }]}>Resend OTP</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
const styles1 = StyleSheet.create({
    container: {
        flex: 0.7,
        marginLeft:50,
        // justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 10,
        marginTop: -20,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
    },
    otpBox: {
        marginLeft:5,
        color: '#000',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 20,
        textAlign: 'center',
        width: '20%',
    },
});