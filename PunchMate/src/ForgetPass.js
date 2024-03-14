import React, { Component } from 'react'
import { BackHandler, PermissionsAndroid, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import AsyncStorage from '@react-native-async-storage/async-storage';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
export default class ForgetPass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            otp: ['', '', '', ''],
            currentIndex: 0,
        }
        this.otpTextInput = [];
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

    handleButtonPress = () => {
        const otp = this.state.otp.join('');
        // Perform OTP validation here
        alert('OTP entered: ' + otp);
    };
    GoHome() {
        this.props.navigation.navigate('Login', { name: 'Login' })
    }
    ResendOTP(){

    }
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
                            <Text style={{fontSize:12, textAlign: 'center' }}>Didn't receive thr OTP</Text>
                            <TouchableOpacity style={{ margin: 0 }} onPress={() => this.GoHome()} >
                                <Text style={[styles.BtnLinkText, {fontSize:12, marginLeft: 5 }]}>Change Number</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{margin:10}}>or</Text>
                            <TouchableOpacity style={{ margin: 0 }} onPress={() => this.ResendOTP()} >
                                <Text style={[styles.BtnLinkText, {fontSize:12, marginLeft: 5 }]}>Resend OTP</Text>
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
        flex: 0.6,
        // justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop:-20,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
    },
    otpBox: {
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