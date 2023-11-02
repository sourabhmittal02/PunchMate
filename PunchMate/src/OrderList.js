import React, { Component } from 'react'
import { ImageBackground, BackHandler, PermissionsAndroid, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, FlatList, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT = Dimensions.get('window').height;
export default class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UserId: '',
      R_Name: '',
      OrderList: [],
      OrderDetail: [],
      isLoading: false,
      showPopup: false,
      Profile: 'https://punchmateblobstorageac.blob.core.windows.net/punchmateappimg/nophoto.jpg',
    }
  }

  componentDidMount = async () => {
    this.setState({ UserId: await AsyncStorage.getItem('UserId') });
    this._GetOrders(await AsyncStorage.getItem('UserId'));
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
  _GetOrders = async (userid) => {
    this.setState({ isLoading: true })
    this._GetToken();
    let token = "Bearer " + await AsyncStorage.getItem('accessToken');
    let body = {
      "UserId": userid,
      "restaurant_ID": "string"
    };
    fetch(global.URL + "RMS/OrderMasterList", {
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
        this.setState({ OrderList: respObject })
        this.setState({ isLoading: false })
        console.log("Res2==>", this.state.OrderList);
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
  GetDetail = async (oid, rname) => {
    this.setState({ isLoading: true })
    this.setState({ R_Name: rname })
    this._GetToken();
    let token = "Bearer " + await AsyncStorage.getItem('accessToken');
    let body = {
      "orderID": oid,
    };
    fetch(global.URL + "RMS/OrderDetailList", {
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
        this.setState({ OrderDetail: respObject })
        this.setState({ isLoading: false })
        console.log("Res==>", this.state.OrderDetail);
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
    this.setState({ showPopup: !this.state.showPopup });
  }
  Close() {
    this.setState({ showPopup: !this.state.showPopup });
  }
  render() {
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
              <Text style={{ color: '#fff', fontSize: 18 }}>Order List</Text>
            </View>
          </View>
        </View>
        <FlatList style={{ backgroundColor: '#fff', height: SCREEN_HEIGHT - 10 }}
          showsVerticalScrollIndicator
          data={this.state.OrderList}
          keyExtractor={(item) => item.order_ID}
          renderItem={({ item, index }) => (
            <View style={[styles.horizontalListItem, { flexDirection: 'row' }]}>
              <View style={{ flex: 2 }}>
                <TouchableOpacity onPress={() => this.GetDetail(item.order_ID, item.restaurentName)}>
                  <Text style={styles.itemName}>{item.restaurentName}</Text>
                  <Text style={styles.address}>Date: {moment(item.order_Date).format("MMM DD, yyyy")}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.address]}>Status: </Text><Text style={{color:'#000',fontFamily:'Inter-Bold'}}>{item.orderStatus}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <Image source={{ "uri": item.image.toString() }} style={{ margin: 10, height: 90, width: 90 }} />
              </View>
            </View>
          )}
        />
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.isLoading}>
          <View style={{ flex: 1, backgroundColor: "#ffffffee", alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#F60000" />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: "#434343", margin: 15 }}>Loading....</Text>
          </View>
        </Modal>
        {/* Detail Show */}
        <Modal visible={this.state.showPopup} transparent={true} animationType='fade' onRequestClose={this.Close}>
          <View style={[styles.popup, { flexDirection: 'column' }]}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: '#000', fontFamily: 'Inter-Bold' }}>Order Detail({this.state.R_Name})</Text>
              </View>
              <View style={{ flex: 0.1, alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={() => this.Close()}>
                  <Text style={{ fontSize: 20, color: '#fc6a57', fontFamily: 'Inter-Bold', }}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <FlatList style={{ backgroundColor: '#fff', height: 200 }}
                showsVerticalScrollIndicator
                data={this.state.OrderDetail}
                renderItem={({ item, index }) => (
                  <View key={index} style={[styles.horizontalListItem, { flexDirection: 'row' }]}>
                    <View style={{ flex: 2 }}>
                      <Text style={styles.itemName}>{item.pName}</Text>
                      <Text style={styles.address}>Date: {moment(item.order_Date).format("MMM DD, yyyy")}</Text>
                      <Text style={styles.address}>Rate: ${item.price}</Text>
                      <Text style={styles.address}>Qty: {item.quantity}</Text>
                    </View>
                  </View>
                )}
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    )
  }
}
