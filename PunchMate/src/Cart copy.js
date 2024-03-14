import React, { Component } from 'react'
import { Animated, FlatList, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Style'


let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT = Dimensions.get('window').height;
export default class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            RestImg: 'https://punchmateblobstorageac.blob.core.windows.net/punchmateappimg/nophoto.jpg',
            RestId: '',
            UserId: '',
            selectedProducts: [],
        }
    }
    componentDidMount = async () => {
        this.setState({ RestImg: this.props.route.params.img })
        this.setState({ RestId: this.props.route.params.RestId })
        this.setState({ UserId: await AsyncStorage.getItem('UserId') })
        let Product = await AsyncStorage.getItem('ProductList');
        this.setState({ selectedProducts: JSON.parse(Product) });
        console.log("IN CART=>",this.state.selectedProducts);
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
    GoBack() {
        this.props.navigation.goBack();
    }
    increaseQuantity(offerID, pid) {
        const restaurantID = this.state.RestId;
        const existingProductIndex = this.state.selectedProducts.findIndex(
            (product) => product.offerID === offerID && product.productID === pid && product.restaurantID === restaurantID
        );
        if (existingProductIndex !== -1) {
            // If the product exists, update its quantity
            const updatedSelectedProducts = [...this.state.selectedProducts];
            updatedSelectedProducts[existingProductIndex].quantity++;
            this.setState({ selectedProducts: updatedSelectedProducts });
        }
    }
    decreaseQuantity(offerID, pid) {
        const restaurantID = this.state.RestId;
        const existingProductIndex = this.state.selectedProducts.findIndex(
            (product) => product.offerID === offerID && product.productID === pid && product.restaurantID === restaurantID
        );
        if (existingProductIndex !== -1) {
            // If the product exists, update its quantity
            const updatedSelectedProducts = [...this.state.selectedProducts];
            updatedSelectedProducts[existingProductIndex].quantity--;
            this.setState({ selectedProducts: updatedSelectedProducts });
        }
    }
    _PlaceOrder = async () => {
        //===>QR code mai OrderID, RestaurantID, UserID 
        var orderID=this.state.RestId+","+this.state.UserId+",";
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('accessToken');
        const ProductList = this.state.selectedProducts.map(item => ({
            productID: item.productID.toString(),
            offerID: item.offerID.toString(),
            quantity: item.quantity,
            price: item.quantity * item.rate
        }));
        let body = {
            "restro_ID": this.state.RestId,
            "costumer_ID": this.state.UserId,
            "order_Date": new Date().toISOString(),
            "qR_Details": "string",
            "is_Finalized": false,
            "orderDetailsModels": ProductList
        }
        // console.log("Vody==>", body);
        // let Product = await AsyncStorage.getItem('ProductList');
        // console.log("1==>", Product);
        // AsyncStorage.removeItem('ProductList');
        // Product = await AsyncStorage.getItem('ProductList');
        // console.log("2==>", Product);
        // const updatedProductList = this.state.selectedProducts.filter(product => product.restaurantID !== this.state.RestId);
        // this.setState({selectedProducts:updatedProductList})
        // await AsyncStorage.setItem('ProductList', JSON.stringify(updatedProductList));
        // console.log("3==>", AsyncStorage.getItem('ProductList'));
        
        fetch(global.URL+'RMS/CreateOrder',{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
                "platform": Platform.OS
            },
            body: JSON.stringify(body),
            redirect: 'follow'
        }).then(response => response.text()).then(async responseText => {
            var respObject = JSON.parse(responseText);
            var jsonList = respObject;
            console.log(jsonList);
            if(jsonList.response>0){
                orderID=orderID+jsonList.response.toString();
                console.log(orderID);
                AsyncStorage.removeItem('ProductList');
                // this.props.navigation.navigate('QRCode', { orderID: jsonList.response })
            }else{
                Alert.alert("Punch Mate",jsonList.status);
            }
        });
        this.props.navigation.navigate('QRCodes', { orderID: orderID })
    }
    render() {
        const totalQuantity = this.state.selectedProducts.reduce((total, product) => total + (product.rate * product.quantity), 0);
        const { selectedProducts, RestId } = this.state;
        const filteredProducts = selectedProducts.filter(
            (product) => product.restaurantID === RestId
        );
        return (
            <SafeAreaView>
                <View>
                    <Image source={{ "uri": this.state.RestImg.toString() }} style={[styles.itemImage, { width: SCREEN_WIDTH, height: 230 }]} />
                    <View style={styles.headerOverImage}>
                        <View style={{ flex: 0.1 }}>
                            <TouchableOpacity onPress={() => this.GoBack()}>
                                <Image style={{tintColor:'#fff', width: 25, height: 25, marginTop: 5 }} source={require('./images/back.png')} />
                            </TouchableOpacity></View>
                        <View style={{ flex: 1 }}><Text style={{ fontSize: 18, fontFamily: 'Inter', color: 'white', }}>Cart</Text></View>
                    </View>
                    <View style={styles.CartItemHeader} >
                        <Text style={{ fontSize: 20, color: '#fff' }}>Cart</Text>
                    </View>
                    <View style={{ marginTop: 5, margin: 10, backgroundColor: '#fff', borderRadius: 10 }} >
                        <FlatList style={{ height: SCREEN_HEIGHT - 340 }}
                            // data={this.state.selectedProducts}
                            data={filteredProducts}
                            renderItem={({ item }) => (
                                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBlockColor: '#000' }}>
                                    <View style={{ flex: 2 }}>
                                        <Text style={{ color: '#000', fontSize: 16 }}>{item.productName}</Text>
                                        <Text style={{ color: '#000', fontSize: 16 }}>$ {item.rate}</Text>
                                    </View>
                                    {item.rate !== 0 && (
                                        <View style={{ height: 40, flex: 1, borderColor: '#e23744', borderWidth: 1, backgroundColor: '#fff5f7', flexDirection: 'row', borderRadius: 10, margin: 10 }}>
                                            <TouchableOpacity style={{ marginLeft: 30, margin: 0, marginRight: 5 }} onPress={() => this.decreaseQuantity(item.offerID, item.productID)}>
                                                <Text style={[styles.buttonText, { color: '#e23744' }]}>-</Text>
                                            </TouchableOpacity>
                                            <Text style={[styles.quantityText, { color: '#000', fontSize: 15, marginTop: 8 }]}>{item.quantity}</Text>
                                            <TouchableOpacity style={{ marginLeft: 8, margin: 0, marginRight: 5 }} onPress={() => this.increaseQuantity(item.offerID, item.productID)}>
                                                <Text style={[styles.buttonText, { color: '#e23744', marginTop: 0 }]}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    {item.rate === 0 && (
                                        <View style={{ height: 40, flex: 1, borderColor: '#e23744', borderWidth: 1, backgroundColor: '#fff5f7', borderRadius: 10, margin: 10 }}>
                                            <Text style={[styles.quantityText, { textAlign: 'center', color: '#000', fontSize: 15, marginTop: 8 }]}>{item.quantity}</Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        />
                    </View>
                </View>
                <View style={[{ flexDirection: 'row', marginTop: -40, margin: 10, backgroundColor: '#e23744', padding: 10, borderRadius: 10, position: 'relative' }]}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#fff', fontSize: 16 }}>Total ${totalQuantity}</Text>
                    </View>
                    <View style={{ flex: 0.8 }}>
                        <TouchableOpacity onPress={() => this._PlaceOrder()}>
                            <Text style={{ color: '#fff', fontSize: 18 }}>Place Order</Text>
                            <Image style={{ width: 25, height: 24, position: 'absolute', marginLeft: 110, marginTop: 0 }} source={require('./images/right.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}
