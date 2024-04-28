import React, { Component } from 'react'
import { Animated, FlatList, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import moment from 'moment';
import logo from './images/logo.png';
import styles from './Style'

let SCREEN_HEIGHT = Dimensions.get('window').height;
export default class QRCodes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            OrderId: '',
            Name: '',
            RestName: '',
            Amount: '',
        }
    }
    componentDidMount = async () => {
        console.log("param=>",this.props.route.params);
        this.setState({ OrderId: this.props.route.params.orderId })
        this.setState({ RestName: this.props.route.params.RestName })
        this.setState({ Amount: this.props.route.params.Amount })
        // this.setState({ UserId: await AsyncStorage.getItem('mobile') })
        this.setState({ Name: await AsyncStorage.getItem('firstName') })
    }
    _GoHome(){
        this.props.navigation.navigate('OrderNow',{offerId:null});
    }
    _CancelOrder(){
        Alert.alert(
            'Confirm',
            'Are you sure you want to cancel the order?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        var order=this.state.OrderId.split(',');
                        let body={
                            "orderID": order[2],
                            "status": 2
                          }
                          console.log(body);
                          fetch(global.URL + 'RMS/UpdateOrderStatus', {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "platform": Platform.OS
                            },
                            body: JSON.stringify(body),
                            redirect: 'follow'
                        }).then(response => response.text()).then(async responseText => {
                            var respObject = JSON.parse(responseText);
                            var jsonList = respObject;
                            console.log(jsonList);
                            if(respObject.response===1){
                                this.props.navigation.navigate('OrderNow',{offerId:null});
                            }else{
                                Alert.alert(global.TITLE,respObject.status);
                            }
                            
                        });
                    },
                },
            ],
            { cancelable: false }
        );
    }
    render() {
        return (
            <SafeAreaView>
                <View style={{backgroundColor:'#fff', flexDirection: 'column',height:SCREEN_HEIGHT }}>
                    <View style={{ margin: 40,marginBottom:20 }}>
                        <Text style={[styles.itemName,{fontSize:18,textAlign:'center'}]}>{this.state.RestName}</Text>
                        <Text style={{ textAlign: 'center', color: '#000', fontSize: 10, fontFamily: 'Inter-Bold' }}>{moment(Date()).format('DD/MM/yyyy, hh:mm:ss a')}</Text>
                    </View>
                    {/* <View style={{ margin: 20 }}>
                        <Text style={{ textAlign: 'center', color: '#000', fontSize: 18, fontFamily: 'Inter-Bold' }}>Show this QR at restaurant</Text>
                    </View> */}
                    <View style={{padding:10,height:350, alignItems: 'center',margin:10, backgroundColor:'#fff' }}>
                        <QRCode 
                            value={this.props.route.params.orderID}
                            logo={logo}
                            logoSize={70}
                            logoBorderRadius={20}
                            logoMargin={-25}
                            logoBackgroundColor='#fff'
                            linearGradient={true}
                            size={280}
                        />
                        <View style={{margin:15,backgroundColor:'#fff3ee',padding:8,borderRadius:25}}>
                            <Text style={[styles.itemName]}>QR Code: {this.state.OrderId}</Text>
                        </View>
                    </View>
                    <View>
                        {/* <Text style={{textAlign:'center', margin: 10, color: '#000', fontSize: 20, fontFamily: 'Inter-Bold' }}>{this.state.Name}</Text> */}
                        <Text style={{textAlign:'center', margin: 10, color: '#000', fontSize: 12, fontFamily: 'Poppins-Bold' }}>Scan this QR Code and collect your order </Text>
                    </View>
                    <View>
                        <Text style={{textAlign:'center', marginTop: 40, color: '#000', fontSize: 12, fontFamily: 'Poppins-Bold' }}>You have to pay ${this.state.Amount} in cash </Text>
                        <TouchableOpacity style={[styles.BtnLogin]} onPress={()=>this._CancelOrder()}>
                            <Text style={{color:'#fff'}}>Cancel Order</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.BtnLogin,{backgroundColor:'#000'}]} onPress={()=>this._GoHome()}>
                            <Text style={{color:'#fff'}}>Back to Home</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}
