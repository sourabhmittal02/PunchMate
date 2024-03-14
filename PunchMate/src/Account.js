import React, { Component } from 'react'
import { ImageBackground, BackHandler, PermissionsAndroid, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, FlatList, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import Header from './Header'
import BottomBar from './BottomBar'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChPass from './images/chPass.png';
import Fav from './images/fav.png';
import NavigationService from './Service/NavigationService';

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'Account',
      Profile: 'https://punchmateblobstorageac.blob.core.windows.net/punchmateappimg/nophoto.jpg',
      ProfileName: '',
      Mobile: '',
    }
  }
  async componentDidMount() {
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
        console.log("TEST===>", respObject.firstname);
        await AsyncStorage.setItem('UserId', respObject.id.toString());
        if (respObject.image !== null) {
          this.setState({ Profile: respObject.image })
          this.setState({ ProfileName: respObject.firstname });
          this.setState({ Mobile: respObject.mobileno });
        }
        console.log("Res1==>", respObject);
      }
      catch (error) {
        this.setState({ isLoading: false });
        console.log(error);
      }
    });
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
  _FavList() {
    this.props.navigation.navigate('Favourite', { name: 'Favourite' })
  }
  _ChPass() {
    this.props.navigation.navigate('ChangePassword', { name: 'ChangePassword' })
  }
  render() {
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
              <Text style={{ marginTop: 5, color: '#000', fontSize: 15 }}>  My Account</Text>
            </View>
          </View>
          {/* Contents */}
          <View>
            <View style={{ backgroundColor: '#fff', marginTop: 10, height: 100, padding: 20, flexDirection: 'row' }}>
              <View style={{ flex: 0.3 }}>
                <Image style={[styles.profileImg]} source={{ "uri": this.state.Profile.toString() }} />
              </View>
              <View>
                <Text style={{ color: '#000', fontSize: 13 }}>{this.state.ProfileName}</Text>
                <Text style={{ color: '#000', fontSize: 13 }}>{this.state.Mobile}</Text>
              </View>
            </View>
            <View style={{ backgroundColor: '#fff', marginTop: 10, height: 80, padding: 20, flexDirection: 'row' }}>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this._FavList()}>
                <Image source={Fav} style={{ height: 30, width: 30, tintColor: '#ff7f50', backgroundColor: '#fff3ee', borderRadius: 25 }} />
                <Text style={{ color: '#000', marginTop: 5 }}>  Favourite Orders</Text>
              </TouchableOpacity>
            </View>
            <View style={{ backgroundColor: '#fff', marginTop: 10, height: 80, padding: 20, flexDirection: 'row' }}>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this._ChPass()}>
                <Image source={ChPass} style={{ height: 30, width: 30, tintColor: '#ff7f50', backgroundColor: '#fff3ee', borderRadius: 25 }} />
                <Text style={{ color: '#000', marginTop: 5 }}>  Change Password</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.BtnLogin]} onPress={() => this._Logout()}>
              <Text style={{ color: '#fff', textAlign: 'center', padding: 5 }}>Logout</Text>
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
