import React, { Component } from 'react'
import { ImageBackground, BackHandler, PermissionsAndroid, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, FlatList, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import QR from './images/qrcode.png';
import logo from './images/logo.png';
import QRCode from 'react-native-qrcode-svg';
import BottomBar from './BottomBar';
import NonAlcohal from './images/noalcohol.png';
import Veg from './images/veg.png';
import rating from './images/rating.png';

let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT = Dimensions.get('window').height;
export default class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UserId: '',
      R_Name: '',
      OrderId: '1',
      OrderList: [],
      OrderDetail: [],
      isLoading: false,
      showPopup: false,
      showQR: false,
      selectedTab: 'Order',
      scrollingEnabled: true,
      currentIndex: 0,
      Profile: 'https://punchmateblobstorageac.blob.core.windows.net/punchmateappimg/nophoto.jpg',
    }
  }

  async componentDidMount() {
    this.setState({ UserId: await AsyncStorage.getItem('UserId') });
    this.setState({ Profile: await AsyncStorage.getItem('Profile') });
    await this._GetOrders(await AsyncStorage.getItem('UserId'));
    setTimeout(() => {
      this.startAutoScroll();
    }, 1000);
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
  ShowRating = async (oid, uid, restId) => {
    this.props.navigation.navigate('ShowReview', { OrderId: oid, UserId: uid, RestId: restId })
  }
  Close() {
    this.setState({ showPopup: !this.state.showPopup });
  }
  CloseQR() {
    this.setState({ showQR: !this.state.showQR });
  }
  GenQRCode(OID, RestId) {
    var orderID = RestId + "," + this.state.UserId + "," + OID;
    this.setState({ OrderId: orderID });
    this.setState({ showQR: !this.state.showQR });
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
  componentWillUnmount() {
    this.stopAutoScroll();
  }

  startAutoScroll = () => {
    const pendingOrdersCount = this.state.OrderList.filter(item => item.orderStatus === 'Pending').length;
    this.timer = setInterval(() => {
      const { currentIndex } = this.state;
      const nextIndex = currentIndex + 1 >= pendingOrdersCount ? 0 : currentIndex + 1;
      this.flatListRef.scrollToOffset({ animated: true, offset: nextIndex * SCREEN_WIDTH });
      this.setState({ currentIndex: nextIndex });
    }, 5000); // Adjust the interval as needed
  };

  stopAutoScroll = () => {
    clearInterval(this.timer);
  };
  render() {
    const { OrderId } = this.state;
    const pendingOrdersCount = this.state.OrderList.filter(item => item.orderStatus === 'Pending').length;
    const dynamicHeight = pendingOrdersCount === 0 ? SCREEN_HEIGHT - 120 : SCREEN_HEIGHT - 270;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <Header />
        {/* Main content */}
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          {/* Header Bar */}
          <View style={{ height: 50, backgroundColor: "#fff", flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
            <View style={{ flex: 1, margin: 10, flexDirection: 'row' }}>
              <View style={{ flex: 0.1 }}>
                <TouchableOpacity onPress={() => this.GoBack()}>
                  <Image style={{ tintColor: '#000', width: 25, height: 25, marginTop: 5, }} source={require('./images/back.png')} />
                </TouchableOpacity>
              </View>
              {/* <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => { this._Logout() }}>
                  <Image style={{ width: 30, height: 30, marginRight: 0, borderRadius: 30, marginRight: 10, resizeMode: 'contain' }} source={{ "uri": this.state.Profile.toString() }} />
                </TouchableOpacity>
              </View> */}
              <Text style={{ marginTop: 5, color: '#000', fontSize: 15 }}>  My Order</Text>
            </View>
          </View>
          {/* Contents */}
          <View>
            {/* New Order */}
            {this.state.OrderList.filter(item => item.orderStatus === 'Pending').length > 0 && (
              <View style={{ backgroundColor: '#fff3ee', padding: 15 }}>
                <View><Text style={{ fontSize: 11, backgroundColor: '#e6e9d8', padding: 2, width: '26%', borderRadius: 20, color: '#000', textAlign: 'center' }}>New Order</Text></View>
                <FlatList style={{ height: 110, marginLeft: -5, marginTop: 5 }}
                  horizontal
                  scrollEnabled={false}
                  ref={(ref) => { this.flatListRef = ref; }}
                  showsHorizontalScrollIndicator={false}
                  data={this.state.OrderList}
                  keyExtractor={(item) => item.order_ID}
                  renderItem={({ item, index }) => (
                    (item.orderStatus == 'Pending') && (
                      <View style={[{ width: SCREEN_WIDTH, height: 105, backgroundColor: '#fff3ee', flexDirection: 'row' }]}>
                        <View style={{ flex: 1.2, marginLeft: 5 }}>
                          <Image source={{ "uri": item.image.toString() }} style={{ borderRadius: 15, margin: 5, height: 90, width: 90 }} />
                        </View>
                        <View style={{ margin: 0, flex: 1.8, }}>
                          <TouchableOpacity onPress={() => this.GetDetail(item.order_ID, item.restaurentName)}>
                            <Text style={styles.itemName}> {item.restaurentName}</Text>
                            <Text style={styles.address}>{moment(item.order_Date).format("MMM DD, yyyy")}</Text>
                            <Text style={styles.address}>${item.order_amount}</Text>
                            <Text style={[styles.statusPending,]}>{item.orderStatus}</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={{ flex: 0.8, marginTop: 20 }}>
                          <TouchableOpacity onPress={() => this.GenQRCode(item.order_ID, item.registrationID)}>
                            <Image source={QR} style={{ height: 25, width: 25 }} />
                          </TouchableOpacity>
                          <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            <Image source={NonAlcohal} style={{ height: 20, width: 20, marginRight: 5 }} />
                            <Image source={Veg} style={{ height: 20, width: 20 }} />
                          </View>
                        </View>

                      </View>
                    )
                  )}
                />
              </View>
            )}
            {/* Completed/Rejected Order */}
            <View style={{ backgroundColor: '#fff', padding: 15 }}>
              <View><Text style={{ fontSize: 11, backgroundColor: '#ddd', padding: 2, width: '31%', borderRadius: 20, color: '#000', textAlign: 'center' }}>Order History</Text></View>
              <FlatList
                style={{ backgroundColor: '#fff', height: dynamicHeight, marginLeft: -5, marginTop: 5 }}
                showsVerticalScrollIndicator
                data={this.state.OrderList}
                keyExtractor={(item) => item.order_ID}
                renderItem={({ item, index }) => (
                  (item.orderStatus !== 'Pending') && (
                    <View style={[{ height: 105, flexDirection: 'row' }]}>
                      <View style={{ flex: 1.5, marginLeft: 5 }}>
                        <Image source={{ "uri": item.image.toString() }} style={{ borderRadius: 15, margin: 5, height: 90, width: 90 }} />
                      </View>
                      <View style={{ flex: 1, flexGrow: 2.5, marginTop: 0 }}>
                        <TouchableOpacity style={{ margin: 5, width: SCREEN_WIDTH - 150 }} onPress={() => this.ShowRating(item.order_ID, this.state.UserId, item.registrationID)}>
                          <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 3, }}>
                              <Text style={styles.itemName}> {item.restaurentName}</Text>
                            </View>
                            {item.ratings !== 0 && (
                              <View style={{ flexDirection: 'row', flex: 0.5 }}>
                                <Text style={[styles.address,{marginTop: 10,}]}>
                                  <Image source={rating} style={{  height: 12, width: 12 }} /> {item.ratings}</Text>
                              </View>
                            )}

                          </View>
                          <Text style={styles.address}>{moment(item.order_Date).format("MMM DD, yyyy")}</Text>
                          <Text style={styles.address}>${item.order_amount}</Text>
                          <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                              {item.orderStatus === 'Completed' && (
                                <Text style={[styles.statusComplete]}>{item.orderStatus}</Text>
                              )}
                              {item.orderStatus === 'Cancelled' && (
                                <Text style={[styles.statusCancel]}>{item.orderStatus}</Text>
                              )}
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }} >
                              <Image source={NonAlcohal} style={{ height: 20, width: 20, marginRight: 5 }} />
                              <Image source={Veg} style={{ height: 20, width: 20 }} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={{ flex: 0.5, marginTop: 20 }}>
                        {/* <TouchableOpacity onPress={() => this.GenQRCode(item.order_ID, item.registrationID)}>
                      <Image source={QR} style={{ height: 25, width: 25 }} />
                    </TouchableOpacity> */}
                      </View>
                    </View>
                  )
                )}
              />
            </View>
          </View>
        </View>
        {/* BottomBar */}
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <BottomBar selectedTab={this.state.selectedTab} onHomePress={() => this.OrderNow()} onOfferPress={()=>this.MyOffer()} onOrderPress={() => this.OrderList()} onAccPress={() => this.MyAcc()} />
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
        {/* QRCode Model */}
        <Modal visible={this.state.showQR} transparent={true} animationType='fade' onRequestClose={this.Close}>
          <View style={[styles.popup, { flexDirection: 'column' }]}>
            <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
              <View style={{ flex: 4, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: '#000', fontFamily: 'Inter-Bold' }}>QR Code {OrderId}</Text>
              </View>
              <View style={{ flex: 0.3 }}>
                <TouchableOpacity onPress={() => this.CloseQR()}>
                  <Text style={{ fontSize: 20, color: '#fc6a57', fontFamily: 'Inter-Bold', }}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flex: 1, padding: 10, height: 300, alignItems: 'center', margin: 10, backgroundColor: '#fff' }}>
              <QRCode
                value={OrderId.toString()}
                logo={logo}
                logoSize={80}
                logoBackgroundColor='transparent'
                linearGradient={true}
                size={280}
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    )
  }
}
