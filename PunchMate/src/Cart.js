import React, { Component } from 'react'
import { Animated, FlatList, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Style'
import Header from './Header'
import rating from './images/rating.png';
import location from './images/location.png';
import Nonveg from './images/nonveg.png';
import Veg from './images/veg.png';
import NoAlcohol from './images/noalcohol.png';
import Alcohol from './images/alcohol.png';
import QR from './images/qrcode.png';

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
        console.log("IN CART=>", this.state.selectedProducts);
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
        // this.props.navigation.goBack();
        this.props.navigation.navigate('OrderNow', { OfferId: null });
    }
    async increaseQuantity(offerID, pid, restId) {
        console.log(offerID, pid, restId);
        const existingProductIndex = this.state.selectedProducts.findIndex(
            (product) => product.offerID === offerID && product.productID === pid && product.restaurantID === restId
        );
        console.log(existingProductIndex);
        if (existingProductIndex !== -1) {
            // If the product exists, update its quantity
            const updatedSelectedProducts = [...this.state.selectedProducts];
            updatedSelectedProducts[existingProductIndex] = {
                ...updatedSelectedProducts[existingProductIndex],
                quantity: updatedSelectedProducts[existingProductIndex].quantity + 1
            };
            this.setState({ selectedProducts: updatedSelectedProducts }, () => {
                AsyncStorage.setItem('ProductList', JSON.stringify(updatedSelectedProducts))
                    .then(() => console.log('ProductList updated in AsyncStorage'))
                    .catch((error) => console.error('Error updating ProductList in AsyncStorage:', error));
            });
        }
    }
    async decreaseQuantity(offerID, pid, restId, prodType) {
        var offerquantity=0;
        if (offerID === 1) {
            offerquantity = 4;
        } else if (offerID === 2) {
            offerquantity = 5;
        } else if (offerID === 3) {
            offerquantity = 6;
        } else if (offerID === 4) {
            offerquantity = 7;
        } else if (offerID === 5) {
            offerquantity = 8;
        }
        const existingProductIndex = this.state.selectedProducts.findIndex(
            (product) => product.offerID === offerID && product.productID === pid && product.restaurantID === restId && product.prodType === prodType
        );
        if (existingProductIndex !== -1) {
            // If the product exists, update its quantity
            const updatedSelectedProducts = [...this.state.selectedProducts];
            updatedSelectedProducts[existingProductIndex] = {
                ...updatedSelectedProducts[existingProductIndex],
                quantity: updatedSelectedProducts[existingProductIndex].quantity - 1
            };

            if (updatedSelectedProducts[existingProductIndex].quantity === 0) {
                // If the quantity becomes 0, remove the item from the array
                updatedSelectedProducts.splice(existingProductIndex, 1);
            }

            this.setState({ selectedProducts: updatedSelectedProducts }, async () => {
                await AsyncStorage.setItem('ProductList', JSON.stringify(updatedSelectedProducts))
                    .then(() => console.log('ProductList updated in AsyncStorage'))
                    .catch((error) => console.error('Error updating ProductList in AsyncStorage:', error));
                // Get the updated product list from AsyncStorage
                let prodList = await AsyncStorage.getItem('ProductList');
                prodList = JSON.parse(prodList);
                totalQuantity = prodList.reduce((total, item) => total + item.quantity, 0);
                console.log('totalQuantity==>', totalQuantity,'offerquantity=>',offerquantity);

                // Check if totalQuantity is less than offerquantity and prodType is 'Free'
                if (totalQuantity <= offerquantity) {
                    // Find the index of the product to delete
                    const indexToDelete = prodList.findIndex(
                        (item) => item.offerID === offerID && item.prodType === 'Free'
                    );
                    console.log('indexToDelete==>',indexToDelete)
                    if (indexToDelete !== -1) {
                        // Remove the product from the list
                        prodList.splice(indexToDelete, 1);
                        // Update AsyncStorage with the modified list
                        this.setState({ selectedProducts: prodList }, async () => {
                            await AsyncStorage.setItem('ProductList', JSON.stringify(prodList))
                         });
                        console.log('Product deleted from ProductList');
                    }
                }
            });
        }

    }

    // ==================================
    renderProduct = ({ item }) => (
        <View style={{ borderRadius: 10, borderWidth: 2, margin: 8, borderColor: '#ddd' }}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1.1 }}>
                    <Image source={{ "uri": item.image.toString() }} style={[styles.itemImage, { borderRadius: 10, height: 90, width: 90 }]} />
                </View>
                <View style={{ flex: 2.5, marginTop: 11 }}>
                    <Text style={{ color: '#000', fontSize: 12, fontFamily: 'Poppins-Bold' }}>{item.productName}</Text>
                    <Text style={{ color: '#000', fontSize: 12, marginBottom: 10, fontFamily: 'Poppins-Bold' }}>${item.rate}</Text>
                    <View style={{ flexDirection: 'row', marginTop: -10 }}>
                        <View style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, flex: 1, flexDirection: 'row' }}>
                            {item.prodType == "Paid" && (
                                <View style={{ flex: 2, borderRightWidth: 1, borderColor: '#ccc', alignContent: 'center' }}>
                                    <TouchableOpacity style={{ marginTop: -5, }} onPress={() => this.decreaseQuantity(item.offerID, item.productID, item.restaurantID, item.prodType)}>
                                        <Text style={[styles.buttonText, { textAlign: 'center' }]}>-</Text>
                                    </TouchableOpacity>
                                </View>

                            )}
                            <View style={{ flex: 3, alignContent: 'center', marginTop: 0 }}>
                                <Text style={[styles.quantityText, { textAlign: 'center' }]}>{item.quantity}</Text>
                            </View>
                            {item.prodType == "Paid" && (
                                <View style={{ flex: 2, borderLeftWidth: 1, borderColor: '#ccc', alignContent: 'center' }}>
                                    <TouchableOpacity style={{ marginTop: -5, }} onPress={() => this.increaseQuantity(item.offerID, item.productID, item.restaurantID)}>
                                        <Text style={[styles.buttonText, { textAlign: 'center' }]}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row-reverse', marginRight: 20 }}>
                            {/* {item.Alcohol ? (
                                <Image style={{ width: 20, height: 20, margin: 3 }} source={Alcohol} />
                            ) : (
                                <Image style={{ width: 20, height: 20, margin: 3 }} source={NoAlcohol} />
                            )} */}
                            {item.Veg ? (
                                <Image style={{ width: 20, height: 20, margin: 3 }} source={Veg} />
                            ) : (
                                <Image style={{ width: 20, height: 20, margin: 3 }} source={Nonveg} />
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );

    renderRestaurantDetails = (restaurant) => (
        <View style={{ margin: 10 }}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.itemName]}>{restaurant.restaurantName}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                    <TouchableOpacity onPress={() => this._PlaceOrder(restaurant.restaurantID, restaurant.restaurantName)}>
                        <Image source={QR} style={{ marginTop: 3, height: 30, width: 30 }} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <Image source={rating} style={{ marginTop: 3, height: 12, width: 12 }} />
                <Text style={[styles.address, { fontFamily: 'Poppins-Bold' }]}>{restaurant.restaurantRating} | </Text>
                <Text style={[styles.address, { fontFamily: 'Poppins-Bold' }]}>{restaurant.restaurantDistance} KM Away</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Image source={location} style={styles.ListIcon} />
                <Text style={[styles.address, { marginRight: 6 }]}>{restaurant.restaurantAddress}</Text>
            </View>
        </View>
    );
    // ==================================
    _PlaceOrder = async (restaurantID, restName) => {
        //===>QR code mai OrderID, RestaurantID, UserID 
        var orderID = restaurantID + "," + this.state.UserId + ",";
        const existingProductIndex = this.state.selectedProducts.filter(
            (product) => product.restaurantID === restaurantID
        );
        const amt = existingProductIndex.reduce((total, product) => total + (product.rate * product.quantity), 0);
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('accessToken');
        const ProductList = this.state.selectedProducts
            .filter(item => item.restaurantID === restaurantID)
            .map(item => ({
                productID: item.productID.toString(),
                offerID: item.offerID.toString(),
                quantity: item.quantity,
                price: item.quantity * item.rate
            }));
        let body = {
            "restro_ID": restaurantID,
            "costumer_ID": this.state.UserId,
            "order_Date": new Date().toISOString(),
            "qR_Details": "string",
            "is_Finalized": false,
            "orderDetailsModels": ProductList
        }
        // console.log("Vody==>", body,amt,restName);
        // let Product = await AsyncStorage.getItem('ProductList');
        // console.log("1==>", Product);
        // AsyncStorage.removeItem('ProductList');
        // Product = await AsyncStorage.getItem('ProductList');
        // console.log("2==>", Product);
        // const updatedProductList = this.state.selectedProducts.filter(product => product.restaurantID !== this.state.RestId);
        // this.setState({selectedProducts:updatedProductList})
        // await AsyncStorage.setItem('ProductList', JSON.stringify(updatedProductList));
        // console.log("3==>", AsyncStorage.getItem('ProductList'));

        fetch(global.URL + 'RMS/CreateOrder', {
            method: "POST",
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
            if (jsonList.response > 0) {
                orderID = orderID + jsonList.response.toString();
                console.log(orderID);
                const updatedSelectedProducts = this.state.selectedProducts.filter(item => item.restaurantID !== restaurantID);
                this.setState({ selectedProducts: updatedSelectedProducts });
                AsyncStorage.setItem('ProductList', JSON.stringify(updatedSelectedProducts));
                this.props.navigation.navigate('QRCodes', { orderId: orderID, RestName: restName, Amount: amt })

                // this.props.navigation.navigate('QRCode', { orderID: jsonList.response })
            } else {
                Alert.alert("Punch Mate", jsonList.status);
            }
        });
    }
    render() {
        const totalQuantity = this.state.selectedProducts.reduce((total, product) => total + (product.rate * product.quantity), 0);
        const { selectedProducts, RestId } = this.state;
        const filteredProducts = selectedProducts.filter(
            (product) => product.restaurantID === RestId
        );
        const uniqueRestaurantIDs = [...new Set(selectedProducts.map(product => product.restaurantID))];
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
                            <Text style={{ marginTop: 5, color: '#000', fontSize: 15 }}>  Cart</Text>
                        </View>
                    </View>
                    {/* Contents */}
                    <View style={{ height: SCREEN_HEIGHT }}>
                        <View style={{ height: SCREEN_HEIGHT - 100 }}>
                            <FlatList
                                data={uniqueRestaurantIDs}
                                keyExtractor={item => item}
                                renderItem={({ item }) => (
                                    <View style={{ backgroundColor: '#fff', marginBottom: 10 }}>
                                        {this.renderRestaurantDetails(selectedProducts.find(product => product.restaurantID === item))}
                                        <FlatList
                                            data={selectedProducts.filter(product => product.restaurantID === item)}
                                            keyExtractor={product => product.productID.toString()}
                                            renderItem={this.renderProduct}
                                        />
                                    </View>
                                )}
                            />
                        </View>
                        <View style={{ padding: 10, backgroundColor: '#fff', height: 60, alignItems: 'center', zIndex: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 25, }, shadowOpacity: 0.8, shadowRadius: 14.65, elevation: 47, }}>
                            <Text style={{ color: '#000', fontFamily: 'Poppins-Bold', fontSize: 18 }}>Cart Total: ${totalQuantity}</Text>
                        </View>
                    </View>
                </View >
            </View >
            // <SafeAreaView>
            //     <View>
            //         <Image source={{ "uri": this.state.RestImg.toString() }} style={[styles.itemImage, { width: SCREEN_WIDTH, height: 230 }]} />
            //         <View style={styles.headerOverImage}>
            //             <View style={{ flex: 0.1 }}>
            //                 <TouchableOpacity onPress={() => this.GoBack()}>
            //                     <Image style={{ tintColor: '#fff', width: 25, height: 25, marginTop: 5 }} source={require('./images/back.png')} />
            //                 </TouchableOpacity></View>
            //             <View style={{ flex: 1 }}><Text style={{ fontSize: 18, fontFamily: 'Inter', color: 'white', }}>Cart</Text></View>
            //         </View>
            //         <View style={styles.CartItemHeader} >
            //             <Text style={{ fontSize: 20, color: '#fff' }}>Cart</Text>
            //         </View>
            //         <View style={{ marginTop: 5, margin: 10, backgroundColor: '#fff', borderRadius: 10 }} >
            //             <FlatList style={{ height: SCREEN_HEIGHT - 340 }}
            //                 // data={this.state.selectedProducts}
            //                 data={filteredProducts}
            //                 renderItem={({ item }) => (
            //                     <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBlockColor: '#000' }}>
            //                         <View style={{ flex: 2 }}>
            //                             <Text style={{ color: '#000', fontSize: 16 }}>{item.productName}</Text>
            //                             <Text style={{ color: '#000', fontSize: 16 }}>$ {item.rate}</Text>
            //                         </View>
            //                         {item.rate !== 0 && (
            //                             <View style={{ height: 40, flex: 1, borderColor: '#e23744', borderWidth: 1, backgroundColor: '#fff5f7', flexDirection: 'row', borderRadius: 10, margin: 10 }}>
            //                                 <TouchableOpacity style={{ marginLeft: 30, margin: 0, marginRight: 5 }} onPress={() => this.decreaseQuantity(item.offerID, item.productID)}>
            //                                     <Text style={[styles.buttonText, { color: '#e23744' }]}>-</Text>
            //                                 </TouchableOpacity>
            //                                 <Text style={[styles.quantityText, { color: '#000', fontSize: 15, marginTop: 8 }]}>{item.quantity}</Text>
            //                                 <TouchableOpacity style={{ marginLeft: 8, margin: 0, marginRight: 5 }} onPress={() => this.increaseQuantity(item.offerID, item.productID)}>
            //                                     <Text style={[styles.buttonText, { color: '#e23744', marginTop: 0 }]}>+</Text>
            //                                 </TouchableOpacity>
            //                             </View>
            //                         )}
            //                         {item.rate === 0 && (
            //                             <View style={{ height: 40, flex: 1, borderColor: '#e23744', borderWidth: 1, backgroundColor: '#fff5f7', borderRadius: 10, margin: 10 }}>
            //                                 <Text style={[styles.quantityText, { textAlign: 'center', color: '#000', fontSize: 15, marginTop: 8 }]}>{item.quantity}</Text>
            //                             </View>
            //                         )}
            //                     </View>
            //                 )}
            //             />
            //         </View>
            //     </View>
            //     <View style={[{ flexDirection: 'row', marginTop: -40, margin: 10, backgroundColor: '#e23744', padding: 10, borderRadius: 10, position: 'relative' }]}>
            //         <View style={{ flex: 1 }}>
            //             <Text style={{ color: '#fff', fontSize: 16 }}>Total ${totalQuantity}</Text>
            //         </View>
            //         <View style={{ flex: 0.8 }}>
            //             <TouchableOpacity onPress={() => this._PlaceOrder()}>
            //                 <Text style={{ color: '#fff', fontSize: 18 }}>Place Order</Text>
            //                 <Image style={{ width: 25, height: 24, position: 'absolute', marginLeft: 110, marginTop: 0 }} source={require('./images/right.png')} />
            //             </TouchableOpacity>
            //         </View>
            //     </View>
            // </SafeAreaView>
        )
    }
}
