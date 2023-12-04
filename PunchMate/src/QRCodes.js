import React, { Component } from 'react'
import { Animated, FlatList, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import moment from 'moment';
import logo from './images/logo.png';
import styles from './Style'

export default class QRCodes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            OrderId: '',
            Name: '',
        }
    }
    componentDidMount = async () => {
        this.setState({ OrderId: this.props.route.params.orderID })
        // this.setState({ UserId: await AsyncStorage.getItem('mobile') })
        this.setState({ Name: await AsyncStorage.getItem('firstName') })
    }
    render() {
        return (
            <SafeAreaView>
                <View style={{backgroundColor:'#000', flexDirection: 'column' }}>
                    <View style={{marginTop:120, margin: 40,marginBottom:20,borderBottomWidth:1 }}>
                        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 14, fontFamily: 'Inter-Bold' }}>{moment(Date()).format('DD/MM/yyyy, hh:mm:ss a')}</Text>
                    </View>
                    <View style={{ margin: 20 }}>
                        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18, fontFamily: 'Inter-Bold' }}>Show this QR at restaurant</Text>
                    </View>
                    <View style={{padding:10,height:350, alignItems: 'center',margin:10, backgroundColor:'#fff' }}>
                        <QRCode 
                            value={this.props.route.params.orderID}
                            logo={logo}
                            logoBackgroundColor='green'
                            linearGradient={true}
                            size={330}
                        />
                    </View>
                    <View style={{height:200}}>
                        <Text style={{textAlign:'center', margin: 10, color: '#fff', fontSize: 20, fontFamily: 'Inter-Bold' }}>{this.state.Name}</Text>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}
