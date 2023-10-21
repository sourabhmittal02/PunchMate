// SplashScreen.js
import React, { useEffect } from 'react';
import { PermissionsAndroid, Dimensions, StyleSheet, ImageBackground, SafeAreaView, Image, Alert, ActivityIndicator, StatusBar, Text, View, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const Splash = ({ navigation }) => {
  useEffect(() => {
    // Simulate a loading time or perform any necessary initialization here
    setTimeout(() => {
      // Navigate to your app's main screen or the screen you want to display after the splash screen
      navigation.navigate('Main');
    }, 2000); // 2000 milliseconds (2 seconds) here is just an example
    this.requestLocationPermission();
  }, []);
  requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      this.getCurrentLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.getCurrentLocation();
        } else {
          // Permission denied
        }
      } catch (error) {
        console.warn(error);
      }
    }
  }
  getCurrentLocation = async () => {
    Geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            console.log('Current Location:', latitude, longitude);
            AsyncStorage.setItem('Current_Latitude', latitude.toString());
            AsyncStorage.setItem('Current_Longitude', longitude.toString());
        },
        error => {
            console.warn(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
}
  return (
    <View style={styles.container}>
      <Image
        source={require('./images/splash.png')}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Customize the background color
  },
  image: {
    width: screenWidth, // Adjust the image size as needed
    height: screenHeight,
  },
});

export default Splash;