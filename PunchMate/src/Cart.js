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
            selectedProducts: [],
        }
    }
    componentDidMount = async () => {
        this.setState({ RestImg: this.props.route.params.img })
        let Product = await AsyncStorage.getItem('ProductList');
        this.setState({ selectedProducts: JSON.parse(Product) });
        console.log(this.state.selectedProducts);
    }
    GoBack() {
        this.props.navigation.goBack();
    }
    increaseQuantity(offerID,pid){
        const existingProductIndex = this.state.selectedProducts.findIndex(
            (product) => product.offerID === offerID && product.productID === pid
        );
        if (existingProductIndex !== -1) {
            // If the product exists, update its quantity
            const updatedSelectedProducts = [...this.state.selectedProducts];
            updatedSelectedProducts[existingProductIndex].quantity++;
            this.setState({ selectedProducts: updatedSelectedProducts });
        }
    }
    decreaseQuantity(offerID,pid){
        const existingProductIndex = this.state.selectedProducts.findIndex(
            (product) => product.offerID === offerID && product.productID === pid
        );
        if (existingProductIndex !== -1) {
            // If the product exists, update its quantity
            const updatedSelectedProducts = [...this.state.selectedProducts];
            updatedSelectedProducts[existingProductIndex].quantity--;
            this.setState({ selectedProducts: updatedSelectedProducts });
        }
    }
    render() {
        const totalQuantity = this.state.selectedProducts.reduce((total, product) => total + (product.rate*product.quantity), 0);
        return (
            <SafeAreaView>
                <View>
                <Image source={{ "uri": this.state.RestImg.toString() }} style={[styles.itemImage, { width: SCREEN_WIDTH, height: 230 }]} />
                    <View style={styles.headerOverImage}>
                        <View style={{ flex: 0.1 }}>
                            <TouchableOpacity onPress={() => this.GoBack()}>
                                <Image style={{ width: 25, height: 25,marginTop:5 }} source={require('./images/back.png')} />
                            </TouchableOpacity></View>
                        <View style={{ flex: 1 }}><Text style={{ fontSize: 18, fontFamily:'Inter', color: 'white', }}>Punch Mate</Text></View>
                    </View>
                    <View style={styles.CartItemHeader} >
                        <Text style={{ fontSize: 20, color: '#fff' }}>Cart</Text>
                    </View>
                    <View style={{ marginTop: 5, margin: 10,backgroundColor:'#fff',borderRadius:10 }} >
                        <FlatList style={{ height: SCREEN_HEIGHT-340 }}
                            data={this.state.selectedProducts}
                            renderItem={({ item }) => (
                                <View style={{ flexDirection: 'row',borderBottomWidth:1, borderBlockColor:'#000'  }}>
                                    <View style={{ flex: 2}}>
                                        <Text style={{ color: '#000', fontSize: 16 }}>{item.productName}</Text>
                                        <Text style={{ color: '#000', fontSize: 16 }}>$ {item.rate}</Text>
                                    </View>
                                    <View style={{height:40, flex: 1,borderColor:'#e23744',borderWidth:1, backgroundColor:'#fff5f7', flexDirection:'row',borderRadius:10,margin:10 }}>
                                        <TouchableOpacity style={{ marginLeft:25,margin:0,marginRight:5 }} onPress={() => this.decreaseQuantity(item.offerID,item.productID)}>
                                            <Text style={[styles.buttonText,{color:'#e23744'}]}>-</Text>
                                        </TouchableOpacity>
                                        <Text style={[styles.quantityText,{color:'#000',fontSize:15,marginTop:8}]}>{item.quantity}</Text>
                                        <TouchableOpacity style={{ margin: 5 }} onPress={() => this.increaseQuantity(item.offerID,item.productID)}>
                                            <Text style={[styles.buttonText,{color:'#e23744',marginTop:-5,marginLeft:5}]}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                </View>
                <View style={[{ flexDirection: 'row',marginTop:-40,margin:10,backgroundColor:'#e23744', padding:10,borderRadius:10,position:'relative' }]}>
                    <View style={{ flex: 1 }}>
                        <Text style={{color:'#fff', fontSize:16}}>Total ${totalQuantity}</Text>
                    </View>
                    <View style={{ flex: 0.8 }}>
                        <TouchableOpacity>
                            <Text style={{color:'#fff', fontSize:18}}>Place Order</Text>
                            <Image style={{width:25,height:24,position:'absolute',marginLeft:110,marginTop:0 }} source={require('./images/right.png')}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}