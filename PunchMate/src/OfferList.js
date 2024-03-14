import React, { Component } from 'react'
import { Appearance, PanResponder, Animated, BackHandler, FlatList, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import Header from './Header'
import BottomBar from './BottomBar'
import AsyncStorage from '@react-native-async-storage/async-storage';

let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT = Dimensions.get('window').height;
export default class OfferList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'Offer',
            Profile: 'https://punchmateblobstorageac.blob.core.windows.net/punchmateappimg/nophoto.jpg',
            appearance: Appearance.getColorScheme(),
            UserId: '',
            OfferList: [],
        }
    }
    componentDidMount = async () => {
        this.appearanceSubscription = Appearance.addChangeListener(({ colorScheme }) => {
            this.setState({ appearance: colorScheme });
        });
        this._GetOfferList();
    }
    _GetOfferList() {
        fetch(global.URL + "RMS/GetOfferDetail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": token,
                "platform": Platform.OS
            },
            redirect: 'follow'
        }).then(response => response.text()).then(async responseText => {
            try {
                var respObject = JSON.parse(responseText);
                this.setState({ OfferList: respObject })
                this.setState({ isLoading: false })
                console.log("Res3==>", this.state.OfferList);
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
    OrderNow() {
        console.log("6");
        this.props.navigation.navigate('OrderNow', { name: 'OrderNow' })
    }
    MyOffer() {
        console.log("8");
        this.props.navigation.navigate('OfferList', { name: 'OfferList' })
    }
    OrderList() {
        console.log("7");
        this.props.navigation.navigate('OrderList', { name: 'OrderList' })
    }
    MyAcc() {
        console.log("7");
        this.props.navigation.navigate('Account', { name: 'Account' })
    }
    GoBack() {
        this.props.navigation.goBack();
    }
    _UseOffer(oid) {
        console.log("offerid",oid);
        this.props.navigation.navigate('OrderNow', { offerId: oid })

    }
    render() {
        const { appearance } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Header />
                {/* Main content */}
                <View style={{ flex: 1, backgroundColor: appearance === 'dark' ? '#000' : '#eee' }}>
                    {/* Header Bar */}
                    <View style={{ height: 50, backgroundColor: "#fff", flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
                        <View style={{ flex: 1, margin: 10, flexDirection: 'row' }}>
                            <View style={{ flex: 0.1 }}>
                                <TouchableOpacity onPress={() => this.GoBack()}>
                                    <Image style={{ tintColor: '#000', width: 25, height: 25, marginTop: 5, }} source={require('./images/back.png')} />
                                </TouchableOpacity>
                            </View>
                            <Text style={{ marginLeft: 5, marginTop: 5, color: '#000', fontSize: 15, fontFamily: 'Poppins' }}>  Offers</Text>
                        </View>
                    </View>
                    {/* Contents */}
                    <View style={{ flex: 1 }}>
                        <View style={{ flexGrow: 1, backgroundColor: appearance === 'dark' ? '#000' : '#fff' }}>
                            <FlatList style={{ backgroundColor: '#fff', height: SCREEN_HEIGHT - 310 }}
                                showsVerticalScrollIndicator
                                data={this.state.OfferList}
                                renderItem={({ item, index }) => (
                                    <View key={index} style={[styles.horizontalListItem, {height:110, flexDirection: 'row' }]}>
                                        <View style={{ flex: 2 }}>
                                            <TouchableOpacity onPress={() => this._UseOffer(item.offerID)}>
                                                <Image
                                                    source={{ uri: item.image.toString() }}
                                                    style={{ margin: 0, height: 100, width: SCREEN_WIDTH - 20, borderRadius: 15 }}
                                                />
                                            </TouchableOpacity>
                                            {/* <Text style={styles.itemName}>{item.offerDetail}</Text> */}
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    </View>
                </View>
                {/* BottomBar */}
                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                    <BottomBar selectedTab={this.state.selectedTab} onHomePress={() => this.OrderNow()} onOfferPress={() => this.MyOffer()} onOrderPress={() => this.OrderList()} onAccPress={() => this.MyAcc()} />
                </View>
            </View>
        )
    }
}
