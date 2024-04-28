import React, { Component } from 'react'
import { ImageBackground, BackHandler, FlatList, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
export default class ValidatePin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            PIN: '',
            Mobile:'',
            isEnable: false,
            isLoading: false,
            activeButton: 'button1',
        }
    }

    ValidatePin=async()=>{
        let body = {
            "loginId": await AsyncStorage.getItem('mobile'),
            "password": this.state.PIN,
        }
        console.log(body);
        if(this.state.PIN==="" || this.state.PIN===null){
            Alert.alert(global.TITLE,"PIN Field Can't Be Left Empty");
        }else{
            this.setState({ isLoading: true })
            fetch(global.URL + "Login/DoLogin/", {
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
                    console.log("Validate REs==>",respObject);
                    if (respObject!=-1) {
                        // this.setState({ isLoading: false });
                        await AsyncStorage.setItem('firstName', respObject.firstName);
                        await AsyncStorage.setItem('UserId',  respObject.id.toString());
                        await AsyncStorage.setItem('PIN', this.state.PIN);
                        AsyncStorage.setItem('accessToken',respObject.accessToken)
                        this.props.navigation.navigate('OrderNow', { name: 'OrderNow' })
                    }else {
                        this.setState({ isLoading: false });
                        Alert.alert(global.TITLE, "Invalid Pin")
                    }
                    this.setState({ isLoading: false });

                }
                catch (error) {
                    this.setState({ isLoading: false });
                    console.log(error);
                    Alert.alert(global.TITLE, "Invalid Pin");
                }
            }).catch(error => {
                console.log(error);
                this.setState({ isLoading: false });
                Alert.alert(global.TITLE, " " + error);
            });
        }
    }
    ForgetPass=async()=>{
        const mob=await AsyncStorage.getItem('mobile');
        console.log(mob);
        this.props.navigation.navigate('ForgetPass', { name: 'ForgetPass' })
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
                    <View style={[{ margin: 0, width: screenWidth, marginTop: -50, borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor: '#fff', height: screenHeight -440 }]}>
                        <Text style={{ margin: 30, color: '#000', fontSize: 20,fontFamily:'Poppins-Bold' }}>
                            Validate Passcode
                        </Text>
                        <View>
                            <TextInput style={{color:'#000',padding:10, margin: 5, borderRadius: 20, backgroundColor: '#fff', fontSize: 15,fontFamily:'Inter' }}
                                placeholder="Enter Passcode"
                                placeholderTextColor="#aaa"
                                backgroundColor="#eee"
                                secureTextEntry={true}
                                keyboardType='number-pad'
                                onChangeText={(txt) => { this.setState({ PIN: txt }); }}
                            />                          
                            <TouchableOpacity style={[styles.BtnLogin]} onPress={() => this.ValidatePin()} >
                                <Text style={[styles.BtnText]}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{margin:0}} onPress={() => this.ForgetPass()} >
                                <Text style={[styles.BtnLinkText,{textAlign:'center',margin:5}]}>Forget Passcode</Text>
                            </TouchableOpacity>
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
                </ScrollView>
            </SafeAreaView>
        )
    }
}
