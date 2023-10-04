import React, { Component } from 'react'
import { ImageBackground, BackHandler, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Style';
import profileBG from './images/profileBG.jpg';
import UserImg from './images/name.png';
import BirthImg from './images/birthday.png';
import MobileImg from './images/mobile.png';
import MailImg from './images/mail.png';
import AddressImg from './images/address.png';
import GenderImg from './images/gender.png';
import BottomBar from './BottomBar';

let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT = Dimensions.get('window').height;
export default class MyAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            FirstName: '',
            LastName: '',
            Gender: '',
            DOB: '',
            Mobile: '',
            MailId: '',
            Address: '',
            showPopup: false,
            OldPin: '',
            NewPin: '',
            ConPin: '',
            Profile: ' https://punchmateblobstorageac.blob.core.windows.net/punchmateappimg/nophoto.jpg',
        }
    }
    componentDidMount() {
        this._GetUserDetail();
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
                this.setState({ Profile: respObject.image })
                this.setState({ FirstName: respObject.firstname })
                this.setState({ LastName: respObject.lastname })
                const dateString = respObject.dob;
                const date = new Date(dateString);
                const formattedDate = `${String(
                    date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
                this.setState({ DOB: formattedDate })
                this.setState({ Mobile: respObject.mobileno })
                this.setState({ Address: respObject.address })
                this.setState({ MailId: respObject.mailid })
                this.setState({ Gender: respObject.gender })
                console.log("Res1==>", responseText);
            }
            catch (error) {
                this.setState({ isLoading: false });
                console.log(error);
            }
        });
    }
    UpdateAndClose = async () => {
        if (this.state.NewPin != this.state.ConPin) {
            Alert.alert(global.TITLE, "New Pin & Confirm Pin are not Same");
        }
        else if (this.state.OldPin == '' || this.state.NewPin == '' || this.state.ConPin == '') {
            Alert.alert(global.TITLE, "Old Pin or New Pin or Confirm Pin can't be left empty");
        } else {
            let body = {
                "loginId": await AsyncStorage.getItem('mobile'),
                "password": this.state.NewPin,
            }
            fetch(global.URL + "Login/ChangePassword", {
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
                    Alert.alert(global.TITLE, respObject.status.toString());
                    this.setState({ showPopup: !this.state.showPopup });
                }
                catch (error) {
                    this.setState({ isLoading: false });
                    console.log(error);
                }
            });
        }
    }
    ShowUpdatePassword() {
        this.setState({ showPopup: !this.state.showPopup });
    }
    MyHome() {
        console.log("1");
        this.props.navigation.navigate('Dashboard', { name: 'Dashboard' })
    }
    MyFav() {
        console.log("2");
        // alert("Fav");
    }
    MyAccount() {
        console.log("3");
        this.props.navigation.navigate('MyAccount', { name: 'MyAccount' })
    }
    _Close(){
        this.setState({ showPopup: !this.state.showPopup });
    }
    render() {
        return (
            <SafeAreaView style={{ backgroundColor: '#fff' }}>
                <View style={{ backgroundColor: '#fff' }}>
                    <View>
                        <Image
                            style={{ width: SCREEN_WIDTH, height: 200, alignSelf: 'center' }}
                            source={profileBG}
                        />
                        <Image style={{ alignSelf: 'center', width: 130, height: 130, marginTop: -80, borderRadius: 80, marginRight: 10, resizeMode: 'contain' }}
                            source={{ "uri": this.state.Profile.toString() }} />
                    </View>
                    <View style={{ marginTop: 20, padding: 10, flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                        <View style={{ flex: 0.5 }}>
                            <Image style={{ alignSelf: 'center', width: 30, height: 30, }}
                                source={UserImg} />
                        </View>
                        <View style={{ flex: 2 }}>
                            <Text style={{ fontSize: 20, color: '#000' }}>{this.state.FirstName} {this.state.LastName}</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 5, padding: 10, flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                        <View style={{ flex: 0.5 }}>
                            <Image style={{ alignSelf: 'center', width: 30, height: 30, }}
                                source={GenderImg} />
                        </View>
                        <View style={{ flex: 2 }}>
                            <Text style={{ fontSize: 20, color: '#000' }}>{this.state.Gender}</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 5, padding: 10, flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                        <View style={{ flex: 0.5 }}>
                            <Image style={{ alignSelf: 'center', width: 30, height: 30, }}
                                source={BirthImg} />
                        </View>
                        <View style={{ flex: 2 }}>
                            <Text style={{ fontSize: 20, color: '#000' }}>{this.state.DOB} </Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 5, padding: 10, flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                        <View style={{ flex: 0.5 }}>
                            <Image style={{ alignSelf: 'center', width: 30, height: 30, }}
                                source={MobileImg} />
                        </View>
                        <View style={{ flex: 2 }}>
                            <Text style={{ fontSize: 20, color: '#000' }}>{this.state.Mobile}</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 5, padding: 10, flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                        <View style={{ flex: 0.5 }}>
                            <Image style={{ alignSelf: 'center', width: 30, height: 30, }}
                                source={MailImg} />
                        </View>
                        <View style={{ flex: 2 }}>
                            <Text style={{ fontSize: 18, color: '#000' }}>{this.state.MailId}</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 5, padding: 10, flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                        <View style={{ flex: 0.5 }}>
                            <Image style={{ alignSelf: 'center', width: 30, height: 30, }}
                                source={AddressImg} />
                        </View>
                        <View style={{ flex: 2 }}>
                            <Text style={{ fontSize: 20, color: '#000' }}>{this.state.Address} </Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 0, padding: 5, flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
                        <View style={{ flex: 3 }}>
                            <TouchableOpacity style={[styles.BtnLogin]} onPress={() => this.ShowUpdatePassword()} >
                                <Text style={[styles.BtnText]}>Update Password</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <BottomBar onHomePress={() => this.MyHome()} onAccountPress={() => this.MyAccount()} onFavPress={() => this.MyFav()} />
                </View>
                {/* Popup Model For Adding Items */}
                <Modal visible={this.state.showPopup} transparent={true} animationType='fade' onRequestClose={this.UpdateAndClose}>
                    <View style={[styles.popup]}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <Text style={{ fontSize: 20, color: '#000' }}>Update Password</Text>
                            </View>
                            <View style={{ flex: 0.1, alignItems: 'flex-end' }}>
                                <TouchableOpacity onPress={() => this._Close()}>
                                    <Text style={{ fontSize: 20, color: '#000' }}>X</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ width: '95%' }}>
                            <TextInput
                                style={[styles.TextBox, { textAlign: 'center' }]}
                                placeholder="Old Pin"
                                placeholderTextColor="#000"
                                keyboardType='number-pad'
                                secureTextEntry={true}
                                onChangeText={(txt) => { this.setState({ OldPin: txt }); }}
                            />
                        </View>
                        <View style={{ width: '95%' }}>
                            <TextInput
                                style={[styles.TextBox, { textAlign: 'center' }]}
                                placeholder="New Pin"
                                placeholderTextColor="#000"
                                keyboardType='number-pad'
                                secureTextEntry={true}
                                onChangeText={(txt) => { this.setState({ NewPin: txt }); }}
                            />
                        </View>
                        <View style={{ width: '95%' }}>
                            <TextInput
                                style={[styles.TextBox, { textAlign: 'center' }]}
                                placeholder="Confirm Pin"
                                placeholderTextColor="#000"
                                keyboardType='number-pad'
                                secureTextEntry={true}
                                onChangeText={(txt) => { this.setState({ ConPin: txt }); }}
                            />
                        </View>
                        <View style={{ width: '95%' }}>
                            <TouchableOpacity style={[styles.BtnLogin]} onPress={this.UpdateAndClose}>
                                <Text style={{ fontFamily: "Arial", fontSize: 18, fontWeight: 'bold' }}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}
