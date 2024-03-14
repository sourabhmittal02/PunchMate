import React, { Component } from 'react'
import { BackHandler, PermissionsAndroid, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, FlatList, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import Thank from './images/Thanks.png';
import Smile from './images/smile.png';

let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT = Dimensions.get('window').height;
export default class ShowReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            OrderId: '',
            UserId: '',
            RestId: '',
            ReviewDetail: [],
            rating: 0,
        }
    }
    componentDidMount() {
        this.setState({ OrderId: this.props.route.params.OrderId })
        this.setState({ UserId: this.props.route.params.UserId })
        this.setState({ RestId: this.props.route.params.RestId })
        const orderIdString = this.props.route.params.OrderId.toString();
        this._GetReview(orderIdString, this.props.route.params.UserId)
    }
    _GetReview(oid, uid) {
        let body = {
            "orderID": oid,
            "userID": uid
        };
        fetch(global.URL + "RMS/GetOrderWiseRestaurantRatings", {
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
                console.log("Review==>", respObject.ratings);
                this.setState({ rating: respObject.ratings });
                this.setState({ ReviewDetail: respObject })
            }
            catch (error) {
                this.setState({ isLoading: false });
                console.log(error);
                Alert.alert(global.TITLE, "No Review Found");
            }
        }).catch(error => {
            console.log(error);
            this.setState({ isLoading: false });
            Alert.alert(global.TITLE, " " + error);
        });
    }
    _GoBack() {
        this.props.navigation.goBack();
    }
    _WriteReview() {
        this.props.navigation.navigate('WriteReview', { OrderId: this.state.OrderId, UserId: this.state.UserId, RestId: this.state.RestId })
    }
    renderStar(index) {
        const filledStars = this.state.ReviewDetail[0].ratings >= index ? require('./images/fill.png') : require('./images/empty.png');
        return (
            <Image source={filledStars} style={{ margin: 3, width: 30, height: 30 }} />
        );
    }
    render() {
        const smileyImages = {
            1: require('./images/smiley1.png'),
            2: require('./images/smiley2.png'),
            3: require('./images/smiley3.png'),
            4: require('./images/smiley4.png'),
            5: require('./images/smiley5.png'),
        };
        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                {/* <Text style={{ color: '#000' }}>{this.state.OrderId},{this.state.UserId}</Text> */}
                {this.state.ReviewDetail.length === 0 && (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Image source={Thank} style={{ alignSelf: 'center', height: 230, width: 230 }} />
                        <Text style={{ textAlign: 'center', color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20 }}>Thank You For Order!</Text>
                        <View style={{ marginBottom: 100, flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ textAlign: 'center', color: '#000', fontFamily: 'Poppins', fontSize: 15 }}>Enjoy your order  </Text>
                            <Image source={Smile} style={{ height: 25, width: 25 }} />
                        </View>
                        <TouchableOpacity style={[styles.BtnLogin]} onPress={() => this._WriteReview()}>
                            <Text style={{ color: '#fff', textAlign: 'center', padding: 5 }}>Write a Review</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.BtnLogin, { backgroundColor: '#000' }]} onPress={() => this._GoBack()}>
                            <Text style={{ color: '#fff', textAlign: 'center', padding: 5 }}>Back to Home</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {this.state.ReviewDetail.length > 0 && (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={{marginTop:150, flex: 4, alignItems: 'center' }}>
                            <Image source={smileyImages[this.state.ReviewDetail[0].ratings]} style={{ width: 120, height: 120 }} />
                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                {[1, 2, 3, 4, 5].map((index) => this.renderStar(index))}
                            </View>
                        </View>
                        {/* <Text style={{ color: '#000' }}>{this.state.ReviewDetail[0].ratings}</Text> */}
                        <View style={{flex: 2, alignItems: 'center' }}>
                            <TouchableOpacity style={[styles.BtnLogin, {width:SCREEN_WIDTH-10, backgroundColor: '#000' }]} onPress={() => this._GoBack()}>
                                <Text style={{ color: '#fff', textAlign: 'center', padding: 5 }}>Back to Home</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                )}
            </View>
        )
    }
}
