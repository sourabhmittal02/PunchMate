import React, { Component } from 'react'
import { Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, Modal, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native'
import { Screen } from 'react-native-screens';
import styles from './Style'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slide1 from './images/slide1.png';
import Slide2 from './images/slide2.png';
import Slide3 from './images/slide3.png';
import Slide4 from './images/slide4.gif';
import BottomBar from './BottomBar';

const screenWidth = Dimensions.get('window').width;
export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollPosition: 0,
            contentWidth: 0,
            currentIndex: 0,
            scrollingEnabled: true,
            Sliders: [],
            isLoading:false,
        };
    }

    componentDidMount = async () => {
        let user = await AsyncStorage.getItem('firstName');
        if (user !== null) {
            this.props.navigation.navigate('OrderNow', { name: 'OrderNow' })
        }
        this._GetSlider();
        this.startAutoScroll();
    }
    _GetSlider() {
        this.setState({isLoading:true});
        fetch(global.URL + "Login/GetLoginImages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "platform": Platform.OS
            },
            redirect: 'follow'
        }).then(response => response.text()).then(async responseText => {
            try {
                var respObject = JSON.parse(responseText);
                this.setState({ Sliders: respObject });
                this.setState({isLoading:false});
                console.log("Slider:==>", respObject);
            }
            catch (error) {
                this.setState({ isLoading: false });
                console.log(error);
                Alert.alert(global.TITLE, "Sliders Not Found");
            }
        }).catch(error => {
            console.log(error);
            this.setState({ isLoading: false });
            Alert.alert(global.TITLE, " " + error);
        });
    }
    componentWillUnmount() {
        clearInterval(this.scrollInterval);
    }

    startAutoScroll = () => {
        this.scrollInterval = setInterval(() => {
            if (this.state.scrollingEnabled) {
                this.scrollContent();
            }
        }, 3000); // Adjust the interval as needed
    };

    scrollContent = () => {
        const { scrollPosition, contentWidth } = this.state;
        const nextPosition = scrollPosition + screenWidth; // Adjust the scroll distance as needed

        if (nextPosition >= contentWidth) {
            this.scrollView.scrollTo({ x: 0, animated: true });
            this.setState({ scrollPosition: 0 });
        } else {
            this.scrollView.scrollTo({ x: nextPosition, animated: true });
            this.setState({ scrollPosition: nextPosition });
        }
    };
    handleScroll = (event) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / screenWidth);
        this.setState({ currentIndex: index });
    };
    scrollToIndex = (index) => {
        const { scrollPosition, contentWidth } = this.state;
        if (this.scrollView.current) {
            this.scrollView.scrollTo({
                x: index * contentWidth,
                animated: true,
            });
        }
    };
    _Login() {
        this.props.navigation.navigate('Login', { name: 'Login' })
    }
    MyFun() {
        this.props.navigation.navigate('Map', { name: 'Map' })
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, }}>
                <View style={{ flex: 0.4, }}></View>
                <View style={{ flex: 1, }}>
                    <ScrollView
                        ref={(ref) => (this.scrollView = ref)}
                        horizontal
                        onScroll={this.handleScroll}
                        showsHorizontalScrollIndicator={false}
                        onContentSizeChange={(contentWidth) =>
                            this.setState({ contentWidth })
                        }
                    >
                        {/* Add your content here */}
                        {this.state.Sliders.map((item, index) => (
                            <View key={index} style={{ flex: 1, alignItems: 'center' }}>
                                <Image source={{ "uri": item.image }} style={{ height: 200, width: 200 }} />
                                <Text style={{ marginTop: 50, fontFamily: 'Poppins-Bold', fontSize: 20, textAlign: 'center', color: '#fc6a57', width: screenWidth, }}>
                                    {item.text1}
                                </Text>
                                <Text style={{ marginTop: 20, fontFamily: 'Poppins', fontSize: 15, textAlign: 'center', color: '#000', width: screenWidth - 100, }}>
                                    {item.text2}
                                </Text>
                            </View>
                        ))}
                        {/* <Text style={{ color: '#000', width: screenWidth, height: 600, backgroundColor: 'lightblue' }}>
                            Item 1
                        </Text> 
                        <Text style={{ color: '#000', width: screenWidth, height: 600, backgroundColor: 'lightgreen' }}>
                            Item 2
                        </Text>
                        <Text style={{ color: '#000', width: screenWidth, height: 600, backgroundColor: 'lightcoral' }}>
                            Item 3
                        </Text>
                        */}
                        {/* <Image style={{ width: screenWidth, height: 600 }} source={Slide4} /> */}
                        {/* <Image style={{ width: screenWidth, height: 600 }} source={Slide1} />
                        <Image style={{ width: screenWidth, height: 600 }} source={Slide2} />
                        <Image style={{ width: screenWidth, height: 600 }} source={Slide3} /> */}
                    </ScrollView>
                    <View style={[styles.dotContainer]}>
                        {this.state.Sliders.map((_, index) => (
                            <View
                                key={index}
                                style={[styles.dot, { opacity: index === this.state.currentIndex ? 1 : 0.3 }]}
                                onTouchEnd={() => this.scrollToIndex(index)}
                            />
                        ))}
                    </View>
                </View>
                <TouchableOpacity style={[styles.BtnLogin, { width: screenWidth - 20 }]} onPress={() => this._Login()}>
                    <Text style={{ color: '#fff', textAlign: 'center', padding: 5 }}>Login</Text>
                </TouchableOpacity>
                {/* <View style={{ flex: 0.8, marginTop: 20 }}>
                    <TouchableOpacity onPress={() => this._Login()} >
                        <Text style={{ textAlign: 'center', color: '#000', fontFamily: 'Inter-Bold', fontSize: 14, width: screenWidth - 20, height: 100, }}>
                            Login to Punch your every sip <Image style={{ width: 25, height: 25, marginTop: 5 }} source={require('./images/coffee.png')} /> here
                        </Text>
                    </TouchableOpacity>
                </View> */}
                {/* <BottomBar onHomePress={() => this.MyHome()} onOrderPress={() => this.OrderNow()} onFavPress={() => this.MyFav()} /> */}
                {/* <View style={{ flex: 1.2, flexDirection: 'row', backgroundColor: '#fff' }}>
                    <View style={{ flex: 1, borderWidth: 1, alignItems: 'center', backgroundColor: 'lightcoral' }}>
                        <TouchableOpacity style={stylesBar.btnBar}>
                            <Text style={stylesBar.buttonText}>Home</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, borderWidth: 1, alignItems: 'center', backgroundColor: '#e5c961' }}>
                        <TouchableOpacity style={stylesBar.btnBar} onPress={()=>this.MyFun()}>
                            <Text style={stylesBar.buttonText}>Rewards</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, borderWidth: 1, alignItems: 'center', backgroundColor: '#e5c961' }}>
                        <TouchableOpacity style={stylesBar.btnBar}>
                            <Text style={stylesBar.buttonText}>Favrouite</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, borderWidth: 1, alignItems: 'center', backgroundColor: '#e5c961' }}>
                        <TouchableOpacity style={stylesBar.btnBar}>
                            <Text style={stylesBar.buttonText}>Order Now</Text>
                        </TouchableOpacity>
                    </View>
                </View> */}
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.isLoading}>
                    <View style={{ flex: 1, backgroundColor: "#ffffffee", alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#F60000" />
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: "#434343", margin: 15 }}>Loading....</Text>
                    </View>
                </Modal>
            </SafeAreaView >
        )
    }
}
const stylesBar = StyleSheet.create({
    btnBar: {
        margin: 15, height: 50, width: 55
    },
    buttonText: {
        fontFamily: 'Inter-Bold', marginTop: 10, width: 60, fontSize: 11, color: '#000'
    },
})