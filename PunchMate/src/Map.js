import React, { Component } from 'react';
import { View, StyleSheet, Dimensions,Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');
const hotels = [
    { "address": "Plot no 132, 133, Ajmer Rd, opposite IndusInd Bank, Ajmera Garden, Shanti Nagar, DCM, Jaipur, Rajasthan 302019", "area_Code": "123", "distance": 344.80905992883453, "favourite": "FALSE", "image": "https://punchmateblobstorageac.blob.core.windows.net/punchmateappimg/coffee-cup-sits-table-coffee-shop_865967-26031.png", "lat": 26.8952413, "long": 75.750544, "mailID": "vv@gmail.com", "mobileNo": "9045700800", "registrationID": "PM00800541", "restaurentName": "RJ 14" },
    { "address": "Ganpati Paradise, Central Spine, Vidhyadhar Nagar, Jaipur - 302039", "area_Code": "QLD 4000", "distance": 336.90795875104504, "favourite": "True", "image": "https://punchmateblobstorageac.blob.core.windows.net/punchmateappimg/coffee-cup-sits-table-coffee-shop_865967-26031.png", "lat": 26.9631012, "long": 75.7799372, "mailID": "Deepakchaudhary5667@gmail.com", "mobileNo": "9929952443", "registrationID": "PM52443132", "restaurentName": "Tipsy Restaurent" },
    { "address": "E-62, Bhagat Singh Marg, Panch Batti, C Scheme, Ashok Nagar, Jaipur, Rajasthan 302001", "area_Code": "QLD 4000", "distance": 340.5569682760973, "favourite": "FALSE", "image": "https://punchmateblobstorageac.blob.core.windows.net/punchmateappimg/coffee-cup-sits-table-coffee-shop_865967-26031.png", "lat": 26.9122975, "long": 75.7997383, "mailID": "Deepakchaudhary5667@gmail.com", "mobileNo": "9929952443", "registrationID": "PM52443133", "restaurentName": "Kanha" },
    { "address": "Shop No. 2 Plot No. E 54, near Agarwal Caterers, opposite Science Park, Shastri Nagar, Jaipur, Rajasthan 302016", "area_Code": "QLD 4000", "distance": 337.9731994661879, "favourite": "FALSE", "image": "https://punchmateblobstorageac.blob.core.windows.net/punchmateappimg/coffee-cup-sits-table-coffee-shop_865967-26031.png", "lat": 26.9408664, "long": 75.7982479, "mailID": "Deepakchaudhary5667@gmail.com", "mobileNo": "9929952443", "registrationID": "PM52443134", "restaurentName": "Bakers Basket" }
];
class MapComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isMapReady: false
        };
      }
    onMapLayout = () => {
        this.setState({ isMapReady: true });
      };
    
  render() {
    const { hotels,height,width } = this.props;
    const { isMapReady } = this.state;
    return (
      <View style={[styles.container,{height:height,width:width}]}>
        <MapView
          style={styles.map}
          onLayout={this.onMapLayout}
          initialRegion={{
            latitude: 26.9124,
            longitude: 75.7873,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {this.state.isMapReady && hotels.map((hotel, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: hotel.lat, longitude: hotel.long }}
              title={hotel.restaurentName}
            >
              <Image source={require('./images/man_marker.png')} style={{height: 35, width:27 }} />
              </Marker>
          ))}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 250, // Set a fixed height or use flex: 1 to fill available space
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapComponent;
