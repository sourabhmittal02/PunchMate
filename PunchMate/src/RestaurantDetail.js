import React, { Component } from 'react'
import { Linking, FlatList, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Style'
import AngleUp from './images/up.png';
import AngleDown from './images/down.png';
import Nonveg from './images/nonveg.png';
import Veg from './images/veg.png';
import NoAlcohol from './images/noalcohol.png';
import Alcohol from './images/alcohol.png';
import fav from './images/fav.png';
import addfav from './images/addfav.png';
import time from './images/time.png';
import call from './images/call.png';
import location from './images/location.png';
import rating from './images/rating.png';
import LinearGradient from 'react-native-linear-gradient';
import MapComponent from './Direction';

let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT = Dimensions.get('window').height;
export default class RestaurantDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Login: '',
            RestImg: 'https://punchmateblobstorageac.blob.core.windows.net/punchmateappimg/nophoto.jpg',
            RestaurantID: '',
            RestFav: '',
            OrderCount: '',
            UserId: '',
            searchText: '',
            RestTime: '',
            RestMobile: '',
            RestDistance: '',
            RestName: '',
            RestAddress: '',
            offerName: '',
            offerId: '',
            rating: '',
            OfferList: [
                // { offerDetail: 'Buy 4 Get 1 Free', offerID: 1 },
                // { offerDetail: 'Buy 2 Get 1 Free', offerID: 2},
            ],
            expandedOffers: { 1: true }, // Maintain a state for expanded offers
            productList: [],
            isExpanded: true,
            itemQuantity: 0,
            selectedProducts: [],
            coordinates: [],
            showCheckoutButton: false,
            LAT: '',
            LONG: '',
            CurrDistance: '',
            EstDuration: '',
        }
    }
    async componentDidMount() {
        const Lat1 = await AsyncStorage.getItem('Current_Latitude');
        const Lng1 = await AsyncStorage.getItem('Current_Longitude');
        this.setState({ RestImg: this.props.route.params.img })
        this.setState({ RestFav: this.props.route.params.fav })
        this.setState({ RestaurantID: this.props.route.params.regID })
        this.setState({ LAT: this.props.route.params.lat })
        this.setState({ LONG: this.props.route.params.long })
        this.setState({ RestTime: this.props.route.params.time })
        this.setState({ RestMobile: this.props.route.params.mobile })
        this.setState({ RestDistance: this.props.route.params.distance })
        this.setState({ RestName: this.props.route.params.name })
        this.setState({ RestAddress: this.props.route.params.address })
        this.setState({ offerId: this.props.route.params.offerID })
        this.setState({ offerName: this.props.route.params.offerName })
        this.setState({ rating: this.props.route.params.rating })
        this.setState({ UserId: await AsyncStorage.getItem('UserId') })
        this.setState({
            coordinates: [
                {
                    latitude: this.props.route.params.lat,
                    longitude: this.props.route.params.long,
                }
            ]
        })
        // this.GetProductLIst(this.props.route.params.regID);
        this.fetchProductList(this.props.route.params.offerID)
        this._GetOfferList();
        this._GetCount();
        this.haversineDistance(Lat1, Lng1, this.props.route.params.lat, this.props.route.params.long)
        //Check For Productlist is empty ot not
        const productList = await AsyncStorage.getItem('ProductList');
        console.log("productList on Details=>", productList);
        if (productList.length !== 0) {
            console.log("====Yes====");
            const plist = JSON.parse(await AsyncStorage.getItem('ProductList'));
            this.setState({ selectedProducts: plist });
        }
    }
    _ShowMap = async () => {
        this.props.navigation.navigate('Map', { lat: this.state.LAT.toString(), long: this.state.LONG.toString() })
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
            "restaurant_ID": this.state.RestaurantID,
        }
        console.log('body==>',body);
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
    AddFav = async () => {
        this._GetToken();
        let token = "Bearer " + await AsyncStorage.getItem('accessToken');
        let body = {
            "restaurantRegID": this.state.RestaurantID,
            "userID": this.state.UserId,
        }
        fetch(global.URL + "RMS/ManageFevouriteRestaurants", {
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
                if (respObject.response === 1) {
                    if (this.state.RestFav === "True")
                        this.setState({ RestFav: "FALSE" })
                    else
                        this.setState({ RestFav: "True" })

                }
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
    increaseQuantity = (offerID, productID, productName, rate, prodImg, isAlcoholic, isVeg) => {
        console.log("==========OfferID:", offerID, "ProductID:", productID, "==", this.state.offerId);
        let totalQuantity = 0;
        let offerCount = 0;
        if (this.state.offerId == 1)
            offerCount = 4;
        else if (this.state.offerId == 2)
            offerCount = 5;
        else if (this.state.offerId == 3)
            offerCount = 6;
        else if (this.state.offerId == 4)
            offerCount = 7;
        else if (this.state.offerId == 5)
            offerCount = 8;
        for (const item of this.state.selectedProducts) {
            if (item.restaurantID === this.state.RestaurantID) {
                totalQuantity += item.quantity;
            }
        }
        const totalCount = this.state.OrderCount + totalQuantity;
        console.log("Count==>", this.state.OrderCount, "TOtal==>", totalCount, "totalQty==>", totalQuantity);
        if (totalCount === offerCount) {
            console.log("Free--->", totalCount);
            const newProduct = {
                offerID,
                productID,
                productName,
                prodType: "Free",
                rate: 0,
                quantity: 1,
                image: prodImg,
                Alcohol: isAlcoholic,
                Veg: isVeg,
                restaurantID: this.state.RestaurantID,
                restaurantName: this.state.RestName,
                restaurantAddress: this.state.RestAddress,
                restaurantRating: this.state.rating,
                restaurantDistance: this.state.CurrDistance,
            };
            this.setState((prevState) => ({
                selectedProducts: [...prevState.selectedProducts, newProduct],
            }));
        } else {
            // Check if the product is already in the selectedProducts list
            const existingProductIndex = this.state.selectedProducts.findIndex(
                (product) => product.offerID === offerID && product.productID === productID && product.rate !== 0 && product.restaurantID === this.state.RestaurantID
            );
            if (existingProductIndex !== -1) {
                console.log("product exists", existingProductIndex);
                // If the product exists, update its quantity
                // const updatedSelectedProducts = [...this.state.selectedProducts];
                // updatedSelectedProducts[existingProductIndex].quantity++;
                // this.setState({ selectedProducts: updatedSelectedProducts });
                const updatedSelectedProducts = this.state.selectedProducts.map((product, index) => {
                    if (index === existingProductIndex) {
                        // Check your condition here and update the quantity accordingly
                        if (product.offerID === offerID && product.productID === productID && product.rate !== 0 && product.restaurantID === this.state.RestaurantID) {
                            return { ...product, quantity: product.quantity + 1 }; // Increase quantity by 1
                        } else {
                            return { ...product }; // No change needed
                        }
                    } else {
                        return { ...product }; // No change needed for other products
                    }
                });

                this.setState({ selectedProducts: updatedSelectedProducts },()=>{
                    AsyncStorage.setItem('ProductList', JSON.stringify(updatedSelectedProducts))
                        .then(() => console.log('ProductList updated in AsyncStorage'))
                        .catch((error) => console.error('Error updating ProductList in AsyncStorage:', error));
                });
            } else {
                // If the product doesn't exist, add it to the list
                console.log("product not exists");
                const newProduct = {
                    offerID,
                    productID,
                    productName,
                    rate,
                    prodType: "Paid",
                    quantity: 1,
                    image: prodImg,
                    Alcohol: isAlcoholic,
                    Veg: isVeg,
                    restaurantID: this.state.RestaurantID,
                    restaurantName: this.state.RestName,
                    restaurantAddress: this.state.RestAddress,
                    restaurantRating: this.state.rating,
                    restaurantDistance: this.state.CurrDistance,
                };
                this.setState((prevState) => ({
                    selectedProducts: [...prevState.selectedProducts, newProduct],
                }));
            }
        }
        this.setState({ showCheckoutButton: true, });
        // console.log('Updated--->', this.state.selectedProducts);
        // this.setState((prevState) => {
        //     const updatedProductList = { ...prevState.productList };
        //     const offerProducts = updatedProductList[offerID];

        //     if (offerProducts) {
        //         const updatedProducts = offerProducts.map((product) =>
        //             product.pid === productID
        //                 ? { ...product, orderedQuntity: product.orderedQuntity + 1 }
        //                 : product
        //         );

        //         updatedProductList[offerID] = updatedProducts;
        //     }

        //     return {
        //         productList: updatedProductList,
        //     };
        // });
    };

    // Function to decrease the quantity of an item in a specific offer
    decreaseQuantity = (offerID, productID) => {
        var offerquantity = 0;
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
        // Check if the product is already in the selectedProducts list
        const existingProductIndex = this.state.selectedProducts.findIndex(
            (product) => product.offerID === offerID && product.productID === productID && product.restaurantID === this.state.RestaurantID
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
            let prodList = this.state.selectedProducts;
            const totalQuantity = prodList.reduce((total, item) => {
                if (item.restaurantId === this.state.RestaurantID) {
                    return total + item.quantity;
                }
                return total;
            }, 0);
            if (totalQuantity <= offerquantity) {
                // Find the index of the product to delete
                const indexToDelete = this.state.selectedProducts.findIndex(
                    (item) => item.offerID === offerID && item.prodType === 'Free' && item.restaurantID === this.state.RestaurantID
                );
                console.log('indexToDelete==>', indexToDelete)
                if (indexToDelete !== -1) {
                    // Remove the product from the list
                    prodList.splice(indexToDelete, 1);
                    // Update AsyncStorage with the modified list
                    this.setState({ selectedProducts: prodList });
                }
            }
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
        // Check if products is defined
        if (typeof products === 'undefined') {
            return null; // Return null or an empty view when products is undefined
        }

        // Filter products based on the search text
        const filteredProducts = products.filter(product => {
            return product.pName.toLowerCase().includes(this.state.searchText.toLowerCase());
        });
        console.log(`OfferID: ${item.offerID}, Expanded: ${isExpanded}, List: ${products}`);
        return (
            <View>
                {/* <View style={[styles.searchContainer, { flex: 4, margin: 10, }]}>
                    <Image
                        source={search}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={[{ color: '#000', flex: 1, paddingVertical: 8, paddingHorizontal: 5, fontFamily: 'Inter-Regular' }]}
                        placeholder="Search Products"
                        placeholderTextColor="#000"
                        onChangeText={(txt) => { this.setState({ searchText: txt }) }}
                    />
                </View> */}
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
                {isExpanded && filteredProducts && (
                    <FlatList
                        data={filteredProducts}
                        renderItem={({ item: product }) => (
                            <View key={products.pid} style={{ margin: 10, flexDirection: 'row' }}>
                                <View style={{ flex: 2.5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        {/* {product.is_Alcoholic ? (
                                            <Image style={{ width: 25, height: 25, margin: 5 }} source={Alcohol} />
                                        ) : (
                                            <Image style={{ width: 25, height: 25, margin: 5 }} source={NoAlcohol} />
                                        )} */}
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
    renderOfferItemNew = ({ item }) => {
        const { expandedOffers, productList } = this.state;
        const isExpanded = expandedOffers[item.offerID];
        var products = productList[item.offerID];
        //==========Check Seleted Product in assign qut to product list=======================
        if (products && Array.isArray(products)) {

            const selectedRestaurantOffers = this.state.selectedProducts.filter(offer => offer.restaurantID === this.props.route.params.regID);
            const updatedProductList = products.map(product => {
                const matchedOffer = selectedRestaurantOffers.find(offer => offer.productID === product.pid);
                if (matchedOffer) {
                    return {
                        ...product,
                        orderedQuntity: product.orderedQuntity + matchedOffer.quantity
                    };
                }
                return product;
            });
            products = updatedProductList;
        }
        //================================
        // Check if products is defined
        if (typeof products === 'undefined') {
            return null; // Return null or an empty view when products is undefined
        }

        // Filter products based on the search text
        const filteredProducts = products.filter(product => {
            return product.pName.toLowerCase().includes(this.state.searchText.toLowerCase());
        });
        return (
            <View>
                {filteredProducts && (
                    <FlatList
                        data={filteredProducts}
                        renderItem={({ item: product }) => (
                            <View key={products.pid} style={{ margin: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1.3 }}>
                                    <Image source={{ "uri": product.image.toString() }} style={[styles.itemImage, { height: 90, width: 90 }]} />
                                </View>
                                <View style={{ flex: 2.5, marginTop: 11 }}>

                                    <Text style={{ color: '#000', fontSize: 12, fontFamily: 'Poppins-Bold' }}>{product.pName}</Text>
                                    <Text style={{ color: '#000', fontSize: 12, marginBottom: 10, fontFamily: 'Poppins' }}>${product.pRate}</Text>
                                    <View style={{ flexDirection: 'row', height: 30 }}>
                                        <View style={{ borderWidth: 1, borderRadius: 5, flex: 1.5, flexDirection: 'row' }}>
                                            <View style={{ flex: 2, borderRightWidth: 1, alignContent: 'center' }}>
                                                <TouchableOpacity style={{ marginTop: -5, paddingRight: 15, paddingLeft: 10 }} onPress={() => this.decreaseQuantity(item.offerID, product.pid)}>
                                                    <Text style={styles.buttonText}>-</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flex: 2, alignContent: 'center', marginTop: 0, paddingLeft: 10, paddingRight: 14 }}>
                                                <Text style={styles.quantityText}>{product.orderedQuntity}</Text>
                                            </View>
                                            <View style={{ flex: 2, borderLeftWidth: 1, alignContent: 'center' }}>
                                                <TouchableOpacity style={{ marginTop: -5, paddingRight: 10, paddingLeft: 10 }} onPress={() => this.increaseQuantity(item.offerID, product.pid, product.pName, product.pRate, product.image, product.is_Alcoholic, product.is_Veg)}>
                                                    <Text style={styles.buttonText}>+</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row-reverse', }}>
                                            {/* {product.is_Alcoholic ? (
                                                <Image style={{ width: 20, height: 20, margin: 3 }} source={Alcohol} />
                                            ) : (
                                                <Image style={{ width: 20, height: 20, margin: 3 }} source={NoAlcohol} />
                                            )} */}
                                            {product.is_Veg ? (
                                                <Image style={{ width: 20, height: 20, margin: 3 }} source={Veg} />
                                            ) : (
                                                <Image style={{ width: 20, height: 20, margin: 3 }} source={Nonveg} />
                                            )}
                                        </View>
                                    </View>
                                </View>

                            </View>
                        )}
                        keyExtractor={(product) => product.pName}
                    />
                )}
            </View>
        )
    }
    GoBack() {
        this.props.navigation.goBack();
    }
    handleCheckout = async () => {
        //Getting Old List
        const existingProductList = await AsyncStorage.getItem('ProductList');
        let productList = [];
        // If the existing ProductList is not null, parse it
        if (existingProductList !== null) {
            productList = JSON.parse(existingProductList);
        }
        // Check if each product in selectedProducts is already in the list
        this.state.selectedProducts.forEach((newProduct) => {
            const isProductExists = productList.some(
                (existingProduct) =>
                    existingProduct.offerID === newProduct.offerID &&
                    existingProduct.productID === newProduct.productID &&
                    existingProduct.productName === newProduct.productName &&
                    existingProduct.rate === newProduct.rate &&
                    existingProduct.quantity === newProduct.quantity &&
                    existingProduct.restaurantID === newProduct.restaurantID
            );

            // If the product doesn't exist, add it to the list
            if (!isProductExists) {
                productList.push(newProduct);
            }
        });

        // Convert the updated ProductList to a JSON string
        const jsonList = JSON.stringify(productList);

        // Update the ProductList in AsyncStorage
        await AsyncStorage.setItem('ProductList', jsonList);

        // const jsonList = JSON.stringify(this.state.selectedProducts);
        // await AsyncStorage.setItem('ProductList', jsonList);
        this.props.navigation.navigate('Cart', { name: 'Cart', img: this.state.RestImg, RestId: this.state.RestaurantID })
    }
    // renderStars = (count) => {
    //     const cups = [];
    //     var flag = false;
    //     if (count == 5) {
    //         count--;
    //         flag = true;
    //     }
    //     if (count == 0) {
    //         for (let i = 0; i < 4; i++) {
    //             cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 20, height: 20 }} />);
    //         }
    //         cups.push(<View style={{ marginTop: 5, marginLeft: 10, top: -5, flexDirection: 'row', flex: 1, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', padding: 5 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 20, height: 20 }} /><Text style={{ fontSize: 11, }}> Free</Text></View>);
    //     } else if (count == 1) {
    //         cups.push(<Image key={0} source={require('./images/coffee2.png')} style={{ tintColor: '#ff7f50', width: 20, height: 20 }} />);
    //         for (let i = count; i < 4; i++) {
    //             cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 20, height: 20 }} />);
    //         }
    //         cups.push(<View style={{ marginTop: 5, marginLeft: 10, top: -5, flexDirection: 'row', flex: 1, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', padding: 5 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 20, height: 20 }} /><Text style={{ fontSize: 11, }}> Free</Text></View>);
    //     } else if (count == 2) {
    //         for (let i = 0; i < count; i++) {
    //             cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ tintColor: '#ff7f50', width: 20, height: 20 }} />);
    //         }
    //         for (let i = count; i < 4; i++) {
    //             cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 20, height: 20 }} />);
    //         }
    //         cups.push(<View style={{ marginTop: 5, marginLeft: 10, top: -5, flexDirection: 'row', flex: 1, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', padding: 5 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 20, height: 20 }} /><Text style={{ fontSize: 11 }}> Free</Text></View>);
    //     } else if (count == 3) {
    //         for (let i = 0; i < count; i++) {
    //             cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ tintColor: '#ff7f50', width: 20, height: 20 }} />);
    //         }
    //         for (let i = count; i < 4; i++) {
    //             cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 20, height: 20 }} />);
    //         }
    //         cups.push(<View style={{ marginTop: 5, marginLeft: 10, top: -5, flexDirection: 'row', flex: 1, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', padding: 5 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 20, height: 20 }} /><Text style={{ fontSize: 11 }}> Free</Text></View>);
    //     } else {
    //         for (let i = 0; i < count; i++) {
    //             cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ tintColor: '#ff7f50', width: 20, height: 20, marginTop: 5 }} />);
    //         }
    //         cups.push(<View style={{ marginTop: 5, marginLeft: 10, top: -5, flexDirection: 'row', flex: 1, borderRadius: 20, backgroundColor: '#ff7f50', justifyContent: 'center', padding: 5 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#fff', width: 20, height: 20 }} /><Text style={{ fontSize: 11, color: '#fff' }}> Free</Text></View>);
    //     }
    //     return cups;
    // };
    renderStars = (count) => {
        console.log("CNT==>", count);
        const cups = [];
        if (this.state.offerId == 1) {
            if (count == 0) {
                for (let i = 0; i < 4; i++) {
                    cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ marginTop: 3, tintColor: '#ccc', width: 15, height: 15 }} />);
                }
                cups.push(<View style={{ marginTop: 3, marginLeft: 5, top: -5, flexDirection: 'row', flex: 0.8, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', padding: 5 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 15, height: 15 }} /><Text style={{ fontSize: 10 }}> Free</Text></View>);
            } else if (count > 0 && count < 4) {
                for (let i = 0; i < count; i++) {
                    cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ marginTop: 3, tintColor: '#ff7f50', width: 15, height: 15 }} />);
                }
                for (let i = 0; i < (4 - count); i++) {
                    cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ marginTop: 3, tintColor: '#ccc', width: 15, height: 15 }} />);
                }
                cups.push(<View style={{ marginTop: 3, marginLeft: 5, top: -5, flexDirection: 'row', flex: 0.8, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', padding: 5 }}>
                    <Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 15, height: 15 }} />
                    <Text style={{ fontSize: 10 }}> Free</Text>
                </View>);
            } else {
                for (let i = 0; i < 4; i++) {
                    cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ marginTop: 3, tintColor: '#ff7f50', width: 15, height: 15 }} />);
                }
                cups.push(<View style={{ marginTop: 3, marginLeft: 5, top: -5, flexDirection: 'row', flex: 0.8, borderRadius: 20, backgroundColor: '#ff7f50', justifyContent: 'center', padding: 5 }}>
                    <Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#fff', width: 15, height: 15 }} />
                    <Text style={{ fontSize: 10, color: '#fff' }}> Free</Text>
                </View>);
            }
        } else if (this.state.offerId == 2) {
            if (count == 0) {
                for (let i = 0; i < 5; i++) {
                    cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ marginTop: 3, tintColor: '#ccc', width: 15, height: 15 }} />);
                }
                cups.push(<View style={{ marginTop: 3, marginLeft: 5, top: -5, flexDirection: 'row', flex: 0.8, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', padding: 5 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 15, height: 15 }} /><Text style={{ fontSize: 10 }}> Free</Text></View>);
            } else if (count > 0 && count < 5) {
                for (let i = 0; i < count; i++) {
                    cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ marginTop: 3, tintColor: '#ff7f50', width: 15, height: 15 }} />);
                }
                for (let i = 0; i < (5 - count); i++) {
                    cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ marginTop: 3, tintColor: '#ccc', width: 15, height: 15 }} />);
                }
                cups.push(<View style={{ marginTop: 3, marginLeft: 5, top: -5, flexDirection: 'row', flex: 0.8, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', padding: 5 }}>
                    <Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 15, height: 15 }} />
                    <Text style={{ fontSize: 10 }}> Free</Text>
                </View>);
            } else {
                for (let i = 0; i < 5; i++) {
                    cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ marginTop: 3, tintColor: '#ff7f50', width: 15, height: 15 }} />);
                }
                cups.push(<View style={{ marginTop: 3, marginLeft: 5, top: -5, flexDirection: 'row', flex: 0.8, borderRadius: 20, backgroundColor: '#ff7f50', justifyContent: 'center', padding: 5 }}>
                    <Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#fff', width: 15, height: 15 }} />
                    <Text style={{ fontSize: 10, color: '#fff' }}> Free</Text>
                </View>);
            }

        } else if (this.state.offerId == 3) {
            if (count == 0) {
                for (let i = 0; i < 6; i++) {
                    cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ marginTop: 3, tintColor: '#ccc', width: 15, height: 15 }} />);
                }
                cups.push(<View style={{ marginTop: 3, marginLeft: 5, top: -5, flexDirection: 'row', flex: 0.8, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', padding: 5 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 15, height: 15 }} /><Text style={{ fontSize: 10 }}> Free</Text></View>);
            } else if (count > 0 && count < 6) {
                for (let i = 0; i < count; i++) {
                    cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ marginTop: 3, tintColor: '#ff7f50', width: 15, height: 15 }} />);
                }
                for (let i = 0; i < (6 - count); i++) {
                    cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ marginTop: 3, tintColor: '#ccc', width: 15, height: 15 }} />);
                }
                cups.push(<View style={{ marginTop: 3, marginLeft: 5, top: -5, flexDirection: 'row', flex: 0.8, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', padding: 5 }}>
                    <Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 15, height: 15 }} />
                    <Text style={{ fontSize: 10 }}> Free</Text>
                </View>);
            } else {
                for (let i = 0; i < 6; i++) {
                    cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ marginTop: 3, tintColor: '#ff7f50', width: 15, height: 15 }} />);
                }
                cups.push(<View style={{ marginTop: 3, marginLeft: 5, top: -5, flexDirection: 'row', flex: 0.8, borderRadius: 20, backgroundColor: '#ff7f50', justifyContent: 'center', padding: 5 }}>
                    <Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#fff', width: 15, height: 15 }} />
                    <Text style={{ fontSize: 10, color: '#fff' }}> Free</Text>
                </View>);
            }

        } else if (this.state.offerId == 4) {
            if (count == 0) {
                for (let i = 0; i < 7; i++) {
                    cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ marginTop: 3, tintColor: '#ccc', width: 15, height: 15 }} />);
                }
                cups.push(<View style={{ marginTop: 3, marginLeft: 5, top: -5, flexDirection: 'row', flex: 0.8, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', padding: 5 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 15, height: 15 }} /><Text style={{ fontSize: 10 }}> Free</Text></View>);
            } else if (count > 0 && count < 7) {
                for (let i = 0; i < count; i++) {
                    cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ marginTop: 3, tintColor: '#ff7f50', width: 15, height: 15 }} />);
                }
                for (let i = 0; i < (7 - count); i++) {
                    cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ marginTop: 3, tintColor: '#ccc', width: 15, height: 15 }} />);
                }
                cups.push(<View style={{ marginTop: 3, marginLeft: 5, top: -5, flexDirection: 'row', flex: 0.8, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', padding: 5 }}>
                    <Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 15, height: 15 }} />
                    <Text style={{ fontSize: 10 }}> Free</Text>
                </View>);
            } else {
                for (let i = 0; i < 7; i++) {
                    cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ marginTop: 3, tintColor: '#ff7f50', width: 15, height: 15 }} />);
                }
                cups.push(<View style={{ marginTop: 3, marginLeft: 5, top: -5, flexDirection: 'row', flex: 0.8, borderRadius: 20, backgroundColor: '#ff7f50', justifyContent: 'center', padding: 5 }}>
                    <Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#fff', width: 15, height: 15 }} />
                    <Text style={{ fontSize: 10, color: '#fff' }}> Free</Text>
                </View>);
            }

        } else if (this.state.offerId == 5) {
            if (count == 0) {
                for (let i = 0; i < 8; i++) {
                    cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ marginTop: 3, tintColor: '#ccc', width: 15, height: 15 }} />);
                }
                cups.push(<View style={{ marginTop: 3, marginLeft: 5, top: -5, flexDirection: 'row', flex: 0.8, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', padding: 5 }}><Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 15, height: 15 }} /><Text style={{ fontSize: 10 }}> Free</Text></View>);
            } else if (count > 0 && count < 8) {
                for (let i = 0; i < count; i++) {
                    cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ marginTop: 3, tintColor: '#ff7f50', width: 15, height: 15 }} />);
                }
                for (let i = 0; i < (8 - count); i++) {
                    cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ marginTop: 3, tintColor: '#ccc', width: 15, height: 15 }} />);
                }
                cups.push(<View style={{ marginTop: 3, marginLeft: 5, top: -5, flexDirection: 'row', flex: 0.8, borderRadius: 20, backgroundColor: '#eee', justifyContent: 'center', padding: 5 }}>
                    <Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#ccc', width: 15, height: 15 }} />
                    <Text style={{ fontSize: 10 }}> Free</Text>
                </View>);
            } else {
                for (let i = 0; i < 8; i++) {
                    cups.push(<Image key={i} source={require('./images/coffee2.png')} style={{ marginTop: 3, tintColor: '#ff7f50', width: 15, height: 15 }} />);
                }
                cups.push(<View style={{ marginTop: 3, marginLeft: 5, top: -5, flexDirection: 'row', flex: 0.8, borderRadius: 20, backgroundColor: '#ff7f50', justifyContent: 'center', padding: 5 }}>
                    <Image key={5} source={require('./images/coffee2.png')} style={{ tintColor: '#fff', width: 15, height: 15 }} />
                    <Text style={{ fontSize: 10, color: '#fff' }}> Free</Text>
                </View>);
            }

        }
        return cups;
    };
    _HandleCall() {
        Linking.openURL(`tel:${this.state.RestMobile}`);
    }
    // Function to calculate distance between two points using Haversine formula
    haversineDistance(lat1, lon1, lat2, lon2) {
        var origin = {
            latitude: parseFloat(lat1.toString()),
            longitude: parseFloat(lon1.toString()),
        };
        var destination = {
            latitude: parseFloat(lat2.toString()),
            longitude: parseFloat(lon2.toString()),
        };
        this.getDistanceAndDuration(origin, destination);
    }
    getDistanceAndDuration = async (origin, destination) => {
        // const { origin, destination } = this.props;

        // Replace 'YOUR_API_KEY' with your Google Maps Directions API key
        const apiKey = 'AIzaSyAP-LAud0co77rYuATkXmshuOEVE4e6HnU';

        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apiKey}`;

        try {
            const response = await fetch(url);
            console.log("O/P=>", response);
            const data = await response.json();
            if (data.routes.length > 0) {
                const { distance, duration } = data.routes[0].legs[0];
                this.setState({ CurrDistance: distance.text, EstDuration: duration.text });
                //console.log('Estimated Travel Time===========>:', distance.text, duration.text,'hours');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    render() {
        const totalQuantity = this.state.selectedProducts.reduce((total, product) => total + product.quantity, 0);
        const { showCheckoutButton } = this.state;
        const stars = this.renderStars(this.state.OrderCount);
        // const firstOfferDetail = this.state.OfferList.length > 0 ? this.state.OfferList[0].offerDetail : '';
        const firstOfferDetail = this.state.offerName;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flex: 2 }}>
                    {/* SelectedRestaurent Image */}
                    {/* <Image source={require('./images/map.png')} style={[styles.itemImage, { width: SCREEN_WIDTH, height: 250 }]} /> */}
                    <MapComponent destination={this.state.coordinates} width={SCREEN_WIDTH} height={280} />
                    {/* Top Header Bar */}
                    <View style={styles.headerOverImage}>
                        <View style={{ flex: 0.1 }}>
                            <TouchableOpacity onPress={() => this.GoBack()}>
                                <Image style={{ width: 25, height: 25, marginTop: 5 }} source={require('./images/back.png')} />
                            </TouchableOpacity></View>
                        <View style={{ flex: 1 }}><Text style={{ marginTop: 5, fontSize: 18, fontFamily: 'Inter', color: 'white', }}>  CaféRewards</Text></View>
                        <View style={{ marginTop: 5, flex: 0.2, alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={() => this.AddFav()}>
                                {this.state.RestFav === "True" &&
                                    <Image source={fav} style={{ height: 25, width: 25 }} />
                                }
                                {this.state.RestFav === "FALSE" &&
                                    <Image source={addfav} style={{ height: 25, width: 25 }} />
                                }
                            </TouchableOpacity>
                        </View>
                        {/* <View style={{ marginTop: 5, flex: 0.1, alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={() => this._ShowMap()}>
                                <Image style={{ width: 25, height: 25 }} source={require('./images/location.png')} />
                            </TouchableOpacity>
                        </View> */}
                        {this.state.selectedProducts.length > 0 && (
                            <View style={{ marginLeft: 10, marginTop: 5, flex: 0.1, alignItems: 'flex-end' }}>
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
                <View style={{
                    flex: 3,
                    backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 10, marginTop: -10, zIndex: 3,
                    shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.29, shadowRadius: 4.65, elevation: 7,
                }}>
                    <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'center', borderRadius: 30, borderWidth: 1, borderColor: '#ccc', marginTop: -40, backgroundColor: '#fff', margin: 10 }}>
                        <View style={{ flex: 0.3 }}><Image source={time} style={{ width: 20, height: 20, margin: 5 }} /></View>
                        <View style={{ flex: 2, flexDirection: 'column' }}>
                            <Text style={{ fontSize: 11, margin: 0, color: '#000', fontFamily: 'Poppins-Bold' }}>{this.state.EstDuration} away</Text>
                            <Text style={{ fontSize: 11, margin: 0, color: '#000' }}>{this.state.CurrDistance.toLocaleUpperCase()} </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => this._HandleCall()} style={{ flexDirection: 'row', padding: 20, borderRadius: 20, backgroundColor: '#ff7f50', justifyContent: 'center', padding: 5 }}>
                                <Image source={call} style={{ tintColor: '#fff', width: 20, height: 20 }} />
                                <Text style={{ fontSize: 11, marginTop: 3, color: '#fff' }}>Call Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* Name & Address */}
                    <View style={{}}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.itemName, { fontSize: 13 }]}>{this.state.RestName}</Text>
                            </View>
                            <View style={{ flex: 1, marginTop: 10, flexDirection: 'row-reverse' }}>
                                <Text style={{ marginTop: 3, fontSize: 11, color: '#000' }}> {this.state.rating}</Text>
                                <Image source={rating} />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', margin: 5 }}>
                            <Image source={location} style={styles.ListIcon} />
                            <Text style={{ marginRight: 3, fontSize: 10, color: '#000' }}>
                                {this.state.RestAddress}</Text>
                        </View>
                        <View style={{ padding: 5, alignSelf: 'center', margin: 1 }}>
                            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#fff', '#fff3ee', '#fff3ee']} style={{ paddingTop: 10, alignSelf: 'center', padding: 5, borderRadius: 20, flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'Inter', color: '#000', marginLeft: 10, marginRight: 20 }}>{firstOfferDetail}</Text>
                                {stars}
                            </LinearGradient>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList style={{ backgroundColor: '#fff', flexGrow: 1 }}
                            showsVerticalScrollIndicator
                            data={this.state.OfferList}
                            renderItem={this.renderOfferItemNew}
                            keyExtractor={(item) => item.offerID.toString()}
                        />
                    </View>
                    <View visible={showCheckoutButton} style={{}}>
                        {showCheckoutButton && (
                            <TouchableOpacity onPress={() => this.handleCheckout()} style={styles.BtnLogin}>
                                <Text style={styles.checkoutButtonText}>Go To Cart</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}