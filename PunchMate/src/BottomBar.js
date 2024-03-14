import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SafeAreaView, Dimensions, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import home from './images/home.png';
import reward from './images/reward.png';
import account from './images/name.png';
import ordernow from './images/coffee2.png';
let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT = Dimensions.get('window').height;
export default class BottomBar extends Component {
    constructor(props) {
        super(props);
        }

  render() {
    const {selectedTab,onHomePress, onOfferPress,onOrderPress,onAccPress } = this.props;
    return (
        <SafeAreaView>
            <View style={stylesBar.bar}>
                <View style={[stylesBar.FistTab, selectedTab === 'Home' && stylesBar.selectedTab]}>
                    <TouchableOpacity style={stylesBar.btnBar} onPress={onHomePress}>
                    <Image style={[stylesBar.imageIcon, selectedTab === 'Home' && stylesBar.selectedIcon]} source={home}></Image>
                        <Text style={[stylesBar.buttonText, selectedTab === 'Home' && stylesBar.selectedButtonText]}>Home</Text>
                    </TouchableOpacity>
                </View>
                <View style={[stylesBar.tab, selectedTab === 'Offer' && stylesBar.selectedTab]}>
                <TouchableOpacity style={stylesBar.btnBar} onPress={onOfferPress}>
                    <Image style={[stylesBar.imageIcon, selectedTab === 'Offer' && stylesBar.selectedIcon]} source={reward}></Image>
                        <Text style={[stylesBar.buttonText,, selectedTab === 'Offer' && stylesBar.selectedButtonText]}>Offer</Text>
                    </TouchableOpacity>
                </View>
                <View style={[stylesBar.tab, selectedTab === 'Order' && stylesBar.selectedTab]}>
                <TouchableOpacity style={stylesBar.btnBar} onPress={onOrderPress}>
                    <Image style={[stylesBar.imageIcon, selectedTab === 'Order' && stylesBar.selectedIcon]} source={ordernow}></Image>
                        <Text style={[stylesBar.buttonText, selectedTab === 'Order' && stylesBar.selectedButtonText]}>My Order</Text>
                    </TouchableOpacity>
                </View>
                <View style={[stylesBar.LastTab, selectedTab === 'Account' && stylesBar.selectedTab]}>
                    <TouchableOpacity style={stylesBar.btnBar} onPress={onAccPress}>
                    <Image style={[stylesBar.imageIcon, selectedTab === 'Account' && stylesBar.selectedIcon]} source={account}></Image>
                        <Text style={[stylesBar.buttonText, selectedTab === 'Account' && stylesBar.selectedButtonText]}>Account</Text>
                    </TouchableOpacity>
                </View>
                {/* <View style={[stylesBar.tab, selectedTab === 'Fav' && stylesBar.selectedTab]}>
                    <TouchableOpacity style={stylesBar.btnBar} onPress={onFavPress}>
                    <Image style={[stylesBar.imageIcon, selectedTab === 'Fav' && stylesBar.selectedIcon]} source={fav}></Image>
                        <Text style={[stylesBar.buttonText, selectedTab === 'Fav' && stylesBar.selectedButtonText]}>Favrouite</Text>
                    </TouchableOpacity>
                </View> */}
                {/* <View style={{flex:1, borderWidth: 1, alignItems: 'center',marginTop:10, backgroundColor: '#e5c961'}}> */}
                
                {/* <View style={{flex:1}}>
                    <TouchableOpacity style={stylesBar.btnBar} onPress={onAccountPress}>
                    <Image style={stylesBar.imageIcon} source={account}></Image>
                        <Text style={stylesBar.buttonText}>Account</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        </SafeAreaView>
    )
  }
}
const stylesBar = StyleSheet.create({
    bar:{
        flexDirection:'row',
        height:55,
        width:SCREEN_WIDTH-20,
        margin:10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3, },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        alignSelf:'center',
        borderWidth:0,
        borderRadius:20
    },
    tab:{
        flex:1, alignItems: 'center', margin:-1,
        //backgroundColor: 'lightcoral'
        // backgroundColor: '#5956d6'
        // backgroundColor: '#006d6a'
        // backgroundColor: '#e5c961'
        backgroundColor: '#fff',// '#713e2e'
    },
    FistTab:{
        flex:1, alignItems: 'center', margin:-1,
        borderTopLeftRadius:50,
        borderBottomLeftRadius:50,
        backgroundColor: '#fff',// '#713e2e'
    },
    LastTab:{
        flex:1, alignItems: 'center', margin:-1,
        borderTopRightRadius:50,
        borderBottomRightRadius:50,
        backgroundColor: '#fff',// '#713e2e'
    },
    selectedTab:{
        backgroundColor:'#fff3ee',
    },
    btnBar:{
        margin:10, width:55, 
        borderWidth:0,
        borderRadius:50,
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: 3, },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        alignItems:'center'
    },
    imageIcon: {
        width: 25, height: 25, marginRight: 0, resizeMode: 'contain', 
        tintColor: "#4d4d4d", alignSelf:'center'
    },
    selectedIcon:{
        tintColor: "#ff7f50"
    },
    buttonText:{
        fontFamily:'Inter',
        textAlign:'center', width:60,fontSize:10,color:'#000'
    },
    selectedButtonText:{
        color: "#ff7f50"
    },
})