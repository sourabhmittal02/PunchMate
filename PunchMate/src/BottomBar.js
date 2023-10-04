import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SafeAreaView, Alert, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import home from './images/home.png';
import account from './images/account.png';
import fav from './images/fav.png';
export default class BottomBar extends Component {
    constructor(props) {
        super(props);
        }

  render() {
    const {onHomePress, onFavPress,onAccountPress } = this.props;
    return (
        <SafeAreaView>
            <View style={{flexDirection:'row',backgroundColor:'#000'}}>
                <View style={{flex:1}}>
                    <TouchableOpacity style={stylesBar.btnBar} onPress={onHomePress}>
                    <Image style={stylesBar.imageIcon} source={home}></Image>
                        <Text style={stylesBar.buttonText}>Home </Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex:0.8}}></View>
                <View style={{flex:1}}>
                    <TouchableOpacity style={stylesBar.btnBar} onPress={onFavPress}>
                    <Image style={stylesBar.imageIcon} source={fav}></Image>
                        <Text style={stylesBar.buttonText}>Favrouite</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex:0.8}}></View>
                <View style={{flex:1}}>
                    <TouchableOpacity style={stylesBar.btnBar} onPress={onAccountPress}>
                    <Image style={stylesBar.imageIcon} source={account}></Image>
                        <Text style={stylesBar.buttonText}>Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
  }
}
const stylesBar = StyleSheet.create({
    btnBar:{
        margin:10,height:50, width:55
    },
    imageIcon: {
        width: 30, height: 30, marginRight: 0, resizeMode: 'contain', tintColor: "#ffffff", alignSelf:'center'
    },
    buttonText:{
        fontFamily:'Inter',
        textAlign:'center', width:60,fontSize:12,color:'#fff'
    },
})