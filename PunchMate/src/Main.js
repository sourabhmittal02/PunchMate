import React, { Component } from 'react'
import { Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, Button, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native'
import { Screen } from 'react-native-screens';
import styles from './Style'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slide1 from './images/slide1.png';
import Slide2 from './images/slide2.png';
import Slide3 from './images/slide3.png';

const screenWidth = Dimensions.get('window').width;
export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollPosition: 0,
            contentWidth: 0,
            scrollingEnabled: true,
        };
    }

    componentDidMount=async()=> {
        let user = await AsyncStorage.getItem('firstName');
        if (user !== null) {
            this.props.navigation.navigate('Dashboard', { name: 'Dashboard' })
        }
        this.startAutoScroll();
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
    _Login(){
        this.props.navigation.navigate('Login', { name: 'Login' })
    }
    MyFun(){
        this.props.navigation.navigate('Map', { name: 'Map' })
      }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                <View style={{ flex: 8, }}>
                    <ScrollView
                        ref={(ref) => (this.scrollView = ref)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        onContentSizeChange={(contentWidth) =>
                            this.setState({ contentWidth })
                        }
                    >
                        {/* Add your content here */}
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
                        <Image style={{ width: screenWidth, height: 600 }} source={Slide1} />
                        <Image style={{ width: screenWidth, height: 600 }} source={Slide2} />
                        <Image style={{ width: screenWidth, height: 600 }} source={Slide3} />
                    </ScrollView>
                </View>
                <View style={{ flex: 0.8, marginTop: 20 }}>
                    <TouchableOpacity onPress={()=>this._Login()} >
                        <Text style={{ textAlign:'center', color: '#000', fontFamily: 'Inter-Bold', fontSize: 14, width: screenWidth - 20, height: 100, }}>
                            Login to Punch your every sip <Image style={{ width: 25, height: 25, marginTop: 5 }} source={require('./images/coffee.png')} /> here
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1.2, flexDirection: 'row', backgroundColor: '#fff' }}>
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
                </View>
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