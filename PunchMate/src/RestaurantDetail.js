import React, { Component } from 'react'
import { Animated, FlatList, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Style'
import AngleUp from './images/up.png';
import AngleDown from './images/down.png';
import Nonveg from './images/nonveg.png';
import Veg from './images/veg.png';
import NoAlcohol from './images/noalcohol.png';
import Alcohol from './images/alcohol.png';

let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT = Dimensions.get('window').height;
export default class RestaurantDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Login: '',
            RestImg: 'https://punchmateblobstorageac.blob.core.windows.net/punchmateappimg/nophoto.jpg',
            RestaurantID: '',
            OrderCount: '',
            OfferList: [
                // { offerDetail: 'Buy 4 Get 1 Free', offerID: 1 },
                // { offerDetail: 'Buy 2 Get 1 Free', offerID: 2},
            ],
            expandedOffers: {}, // Maintain a state for expanded offers
            productList: [],
            isExpanded: true,
            itemQuantity: 0,
            selectedProducts: [],
            showCheckoutButton: false,
        }
    }
    async componentDidMount() {
        this.setState({ RestImg: this.props.route.params.img })
        this.setState({ RestaurantID: this.props.route.params.regID })

        // this.GetProductLIst(this.props.route.params.regID);
        this._GetOfferList();
        this._GetCount();
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
                console.log("LIST=>", respObject);
                this.setState({ OfferList: respObject });
            } catch (error) {

            }
        })
    }
    _GetCount = async () => {
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('accessToken');
        let body = {
            "userID": await AsyncStorage.getItem('UserId'),
            "restaurant_ID":this.state.RestaurantID,
        }
        fetch(global.URL + "RMS/OrderCOunt", {
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
                console.log("COUNT=>", respObject);
                this.setState({ OrderCount: respObject.response });
            } catch (error) {

            }
        })
    }
    _UpdateCount(flag) {
        if (flag == 1) {
            this.setState({ OrderCount: this.state.OrderCount + 1 })
        } else {
            this.setState({ OrderCount: this.state.OrderCount - 1 })
        }
    }
    _GetProductLIst = async (offerId) => {
        let jsonList = [];
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('accessToken');
        let body = {
            "restaurantRegistrationID": this.state.RestaurantID,
            "userID": await AsyncStorage.getItem('UserId'),
            "offerID": offerId
        }
        fetch(global.URL + "RMS/ProductList", {
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
            jsonList = respObject;
            console.log("Product iNFunction=>", respObject);
        });
        return jsonList;
    }

    // Function to toggle the expanded state of an offer
    toggleOfferExpand = (offerID) => {
        console.log("OID=====>", offerID);
        this.fetchProductList(offerID)
        this.setState((prevState) => ({
            isExpanded: !prevState.isExpanded,
        }));
        this.setState((prevState) => ({
            expandedOffers: {
                ...prevState.expandedOffers,
                [offerID]: !prevState.expandedOffers[offerID],
            },
        }));
    };

    // Function to fetch and set the product list for an offer
    fetchProductList = async (offerID) => {
        // You can make an API call here to fetch the product list based on offerID, userId, and restaurantId
        // For this example, we'll just set a sample product list.
        // let sampleProductList = this._GetProductLIst(offerID);
        let sampleProductList = [];
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('accessToken');
        let body = {
            "restaurantRegistrationID": this.state.RestaurantID,
            "userID": await AsyncStorage.getItem('UserId'),
            "offerID": offerID
        }
        fetch(global.URL + "RMS/ProductList", {
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
            this.setState((prevState) => ({
                productList: {
                    ...prevState.productList,
                    [offerID]: respObject,
                },
            }));
        });
    };
    // Function to increase the quantity of an item
    increaseQuantity = (offerID, productID, productName, rate) => {
        // console.log("==========OfferID:", offerID, "ProductID:", productID);
        let totalQuantity = 0;
        for (const item of this.state.selectedProducts) {
            totalQuantity += item.quantity;
        }
        const totalCount = this.state.OrderCount + totalQuantity;
        console.log("Count==>", this.state.OrderCount,"TOtal==>", totalCount,"totalQty==>", totalQuantity);
        if ( totalCount == 4) {
            console.log("Count2==>", totalCount);
            const newProduct = {
                offerID,
                productID,
                productName,
                rate: 0,
                quantity: 1,
            };
            this.setState((prevState) => ({
                selectedProducts: [...prevState.selectedProducts, newProduct],
            }));
        } else {
            // Check if the product is already in the selectedProducts list
            const existingProductIndex = this.state.selectedProducts.findIndex(
                (product) => product.offerID === offerID && product.productID === productID && product.rate!==0
            );

            if (existingProductIndex !== -1) {
                // If the product exists, update its quantity
                const updatedSelectedProducts = [...this.state.selectedProducts];
                updatedSelectedProducts[existingProductIndex].quantity++;
                this.setState({ selectedProducts: updatedSelectedProducts });
            } else {
                // If the product doesn't exist, add it to the list
                const newProduct = {
                    offerID,
                    productID,
                    productName,
                    rate,
                    quantity: 1,
                };
                this.setState((prevState) => ({
                    selectedProducts: [...prevState.selectedProducts, newProduct],
                }));
            }
        }
        this.setState({ showCheckoutButton: true, });
        console.log(this.state.selectedProducts);
        this.setState((prevState) => {
            const updatedProductList = { ...prevState.productList };
            const offerProducts = updatedProductList[offerID];

            if (offerProducts) {
                const updatedProducts = offerProducts.map((product) =>
                    product.pid === productID
                        ? { ...product, orderedQuntity: product.orderedQuntity + 1 }
                        : product
                );

                updatedProductList[offerID] = updatedProducts;
            }

            return {
                productList: updatedProductList,
            };
        });
    };

    // Function to decrease the quantity of an item in a specific offer
    decreaseQuantity = (offerID, productID) => {
        // Check if the product is already in the selectedProducts list
        const existingProductIndex = this.state.selectedProducts.findIndex(
            (product) => product.offerID === offerID && product.productID === productID
        );

        if (existingProductIndex !== -1) {
            // If the product exists and its quantity is greater than 1, update its quantity
            if (this.state.selectedProducts[existingProductIndex].quantity > 1) {
                const updatedSelectedProducts = [...this.state.selectedProducts];
                updatedSelectedProducts[existingProductIndex].quantity--;
                this.setState({ selectedProducts: updatedSelectedProducts });
            } else {
                // If the product exists and its quantity is 1, remove it from the list
                const updatedSelectedProducts = [...this.state.selectedProducts];
                updatedSelectedProducts.splice(existingProductIndex, 1);
                this.setState({ selectedProducts: updatedSelectedProducts });
            }
        }
        // Update the quantity of the selected product in productList
        this.setState((prevState) => {
            const updatedProductList = { ...prevState.productList };
            const offerProducts = updatedProductList[offerID];

            if (offerProducts) {
                const updatedProducts = offerProducts.map((product) =>
                    product.pid === productID && product.orderedQuntity > 0
                        ? { ...product, orderedQuntity: product.orderedQuntity - 1 }
                        : product
                );

                updatedProductList[offerID] = updatedProducts;
            }
            console.log("UPDATED+++++++>", updatedProductList);
            return {
                productList: updatedProductList,
            };
        });
    };
    //Showing List of Orders
    renderOfferItem = ({ item }) => {
        const { expandedOffers, productList } = this.state;
        const isExpanded = expandedOffers[item.offerID];
        const products = productList[item.offerID];

        console.log(`OfferID: ${item.offerID}, Expanded: ${isExpanded}, List: ${products}`);
        return (
            <View>
                <TouchableOpacity style={styles.BtnTab2} onPress={() => this.toggleOfferExpand(item.offerID)}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 3, alignItems: 'center' }}>
                            <Text style={{ color: '#fff', fontFamily: 'Iner-Bold', fontSize: 16 }}>{item.offerDetail}</Text></View>
                        <View style={{ flex: 0.3 }}>{isExpanded ? (
                            <Image style={{ width: 25, height: 25 }} source={AngleUp} />
                        ) : (
                            <Image style={{ width: 25, height: 25 }} source={AngleDown} />
                        )}</View>
                    </View>
                </TouchableOpacity>
                {isExpanded && products && (
                    <FlatList
                        data={products}
                        renderItem={({ item: product }) => (
                            <View style={{ margin: 10, flexDirection: 'row' }}>
                                <View style={{ flex: 2.5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        {product.is_Alcoholic ? (
                                            <Image style={{ width: 25, height: 25, margin: 5 }} source={Alcohol} />
                                        ) : (
                                            <Image style={{ width: 25, height: 25, margin: 5 }} source={NoAlcohol} />
                                        )}
                                        {product.is_Veg ? (
                                            <Image style={{ width: 25, height: 25, margin: 5 }} source={Veg} />
                                        ) : (
                                            <Image style={{ width: 25, height: 25, margin: 5 }} source={Nonveg} />
                                        )}
                                    </View>
                                    <Text style={{ color: '#000', fontSize: 15 }}>{product.pName}</Text>
                                    <Text style={{ color: '#000', fontSize: 15, marginBottom: 10 }}>$ {product.pRate}</Text>
                                    <View style={{ flexDirection: 'row', backgroundColor: '#FF3044', borderRadius: 5, width: '50%', height: 35 }}>
                                        <TouchableOpacity style={{ marginLeft: 15, marginRight: 5 }} onPress={() => this.decreaseQuantity(item.offerID, product.pid)}>
                                            <Text style={styles.buttonText}>-</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.quantityText}>{product.orderedQuntity}</Text>
                                        <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => this.increaseQuantity(item.offerID, product.pid, product.pName, product.pRate)}>
                                            <Text style={styles.buttonText}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ flex: 2 }}><Image source={{ "uri": product.image.toString() }} style={styles.itemImage} /></View>
                            </View>
                        )}
                        keyExtractor={(product) => product.pName}
                    />
                )}
            </View>
        );
    };
    GoBack() {
        this.props.navigation.goBack();
    }
    handleCheckout = async () => {
        const jsonList = JSON.stringify(this.state.selectedProducts);
        await AsyncStorage.setItem('ProductList', jsonList);
        this.props.navigation.navigate('Cart', { name: 'Cart', img: this.state.RestImg,RestId: this.state.RestaurantID })
    }
    renderStars = (orderCount) => {
        const stars = [];
        var flag = false;
        if (orderCount == 5) {
            orderCount--;
            flag = true;
        }
        for (let i = 0; i < orderCount; i++) {
            stars.push(
                <View key={i}>
                    <Image style={styles.StarImg} source={require('./images/starfill.png')} />
                </View>
            );
        }
        const blankCount = 4 - orderCount;
        for (let i = 0; i < blankCount; i++) {
            stars.push(
                <View key={i + blankCount}>
                    <Image style={styles.StarImg} source={require('./images/star.png')} />
                </View>
            );
        }
        if (flag == false) {
            stars.push(
                <View key={8}>
                    <Image style={styles.StarImg} source={require('./images/starfree.png')} />
                </View>
            );
        } else {
            stars.push(
                <View key={9}>
                    <Image style={styles.StarImg} source={require('./images/starfreefill.png')} />
                </View>
            );
        }
        return stars;
    };
    render() {
        const totalQuantity = this.state.selectedProducts.reduce((total, product) => total + product.quantity, 0);
        const { showCheckoutButton } = this.state;
        const stars = this.renderStars(this.state.OrderCount);
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View>
                    <Image source={{ "uri": this.state.RestImg.toString() }} style={[styles.itemImage, { width: SCREEN_WIDTH, height: 160 }]} />
                    <View style={styles.headerOverImage}>
                        <View style={{ flex: 0.1 }}>
                            <TouchableOpacity onPress={() => this.GoBack()}>
                                <Image style={{ width: 25, height: 25, marginTop: 5 }} source={require('./images/back.png')} />
                            </TouchableOpacity></View>
                        <View style={{ flex: 1 }}><Text style={{ fontSize: 18, fontFamily: 'Inter', color: 'white', }}>Punch Mate</Text></View>
                        <View style={{ flex: 0.1, alignItems: 'flex-end' }}><Image style={{ width: 25, height: 25 }} source={require('./images/location.png')} /></View>
                        {this.state.selectedProducts.length > 0 && (
                            <View style={{ flex: 0.1, alignItems: 'flex-end' }}>
                                <TouchableOpacity onPress={() => this.handleCheckout()} style={styles.cartIconContainer}>
                                    <Image style={{ width: 25, height: 25 }} source={require('./images/cart.png')} />
                                    <View style={styles.itemCountContainer}>
                                        <Text style={styles.itemCountText}>{totalQuantity}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View >
                <View style={{ flex: 1, alignSelf: 'center', margin: 10, flexDirection: 'row' }}>
                    {stars}
                </View>
                <View style={{ margin: 0, marginTop: -10 }}>
                    <FlatList style={{ backgroundColor: '#fff', height: 500 }}
                        showsVerticalScrollIndicator
                        data={this.state.OfferList}
                        renderItem={this.renderOfferItem}
                        keyExtractor={(item) => item.offerID.toString()}
                    />
                </View>
                <View visible={showCheckoutButton} style={{}}>
                    {/* <FlatList
                        data={this.state.selectedProducts}
                        renderItem={({ item }) => (
                            <View style={{ margin: 10, flexDirection: 'row' }}>
                                <Text style={{ color: '#000', fontSize: 20 }}>{item.productName}</Text>
                                <Text style={{ color: '#000', fontSize: 20 }}>{item.quantity}</Text>
                            </View>
                        )}
                    /> */}
                    {showCheckoutButton && (
                        <TouchableOpacity onPress={() => this.handleCheckout()} style={styles.checkoutButton}
                        >
                            <Text style={styles.checkoutButtonText}>Checkout</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        )
    }
}
{/* <FlatList style={{ backgroundColor: '#fff', height: 400 }}
                    showsVerticalScrollIndicator
                    data={this.state.ProductLIst}
                    keyExtractor={(item) => item.pName}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity key={index}
                            style={styles.horizontalListItem}
                            onPress={() => {console.log("Clicked",item.pName)}}
                        >
                            <Image source={{"uri":item.image.toString()}} style={styles.itemImage} />
                            <Text style={styles.itemName}>{item.pName}</Text>
                            <Text style={styles.address}>{item.image}</Text>
                        </TouchableOpacity>
                    )}
                /> */}