import React, { Component } from 'react'
import { ImageBackground, PanResponder, Animated, BackHandler, FlatList, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import AsyncStorage from '@react-native-async-storage/async-storage';
import search from './images/search.png';
import order from './images/order.png';
import getintouch from './images/mail2.png';
import MenuIcon from './images/menu.png';
import account from './images/account.png';
import fav from './images/fav.png';
import addfav from './images/addfav.png';
import BottomBar from './BottomBar';
import { Dropdown } from 'react-native-element-dropdown';
import { HelperText } from 'react-native-paper';
// import Icon from 'react-native-paper/lib/typescript/components/Icon';

let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT = Dimensions.get('window').height;
export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Login: '',
      search: '',
      Profile: 'https://punchmateblobstorageac.blob.core.windows.net/punchmateappimg/nophoto.jpg',
      showPopup: false,
      showMenu: false,
      UserId: '',
      menuVisible: false,
      RangeList: [{ label: '2 Kms', value: '2' }, { label: '4 Kms', value: '4' },
      { label: '6 Kms', value: '6' }, { label: '8 Kms', value: '8' }, { label: 'All', value: 'All' },
      ],
      RangeVal: '',
      horizontalData: [
        {
          id: '1',
          itemName: 'Item 1',
          description: 'This is item 1 description',
          buyLink: 'https://example.com/item1',
          image: require('./images/pizza.png'),
        },
        {
          id: '2',
          itemName: 'Item 2',
          description: 'This is item 2 description',
          buyLink: 'https://example.com/item2',
          image: require('./images/pizza.png'),
        },
        // Add more items as needed
      ]
    }
    this.inactivityTimer = null;
    this.inactivityDuration = 3600000; // 5 minutes (in milliseconds)
    // this.translateX = new Animated.Value(this.state.showMenu ? 0 : -SCREEN_WIDTH + 100);
    this.translateX = new Animated.Value(SCREEN_WIDTH);
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        const { dx } = gestureState;
        return dx > 10;
      },
      onPanResponderMove: (evt, gestureState) => {
        const { dx } = gestureState;
        const newX = dx + (this.state.showMenu ? 0 : -SCREEN_WIDTH);
        if (newX > 0) {
          this.translateX.setValue(newX);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx } = gestureState;
        const shouldShowMenu = dx > 50;
        if (shouldShowMenu) {
          this.showMenu();
        } else {
          this.hideMenu();
        }
      },
    });
  }
  componentDidMount = async () => {
    this.setState({ Login: await AsyncStorage.getItem('firstName') });
    this._GetUserDetail();
    this._SearchHotel(this.state.RangeVal);
    // this. hideMenu();
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
  _GetUserDetail = async () => {
    let body = {
      "mobileNo": await AsyncStorage.getItem('mobile')
    }
    fetch(global.URL + "RMS/GetUserDetail", {
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
        this.setState({ UserId: respObject.id.toString() })
        await AsyncStorage.setItem('UserId', respObject.id.toString());
        this.setState({ Profile: respObject.image })
        await AsyncStorage.setItem('Profile', respObject.image);
        console.log("Res1==>", respObject);
      }
      catch (error) {
        this.setState({ isLoading: false });
        console.log(error);
      }
    });
  }
  _SearchHotel = async (range) => {
    console.log("Range=>", range);
    this._GetToken();
    let token = "Bearer " + await AsyncStorage.getItem('accessToken');
    let body;
    if (range === '') {
      body = {
        "current_Lat": "29.472561",//await AsyncStorage.getItem('Current_Latitude'),
        "current_Log": "77.707130",//await AsyncStorage.getItem('Current_Longitude'),
        "filterRange": "1000"
      }
    } else {
      body = {
        "current_Lat": "29.472561",//await AsyncStorage.getItem('Current_Latitude'),
        "current_Log": "77.707130",//await AsyncStorage.getItem('Current_Longitude'),
        "filterRange": range
      }
    }

    fetch(global.URL + "RMS/RestaurantList", {
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
        this.setState({ horizontalData: respObject })
        console.log("Res2==>", this.state.horizontalData);
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
  handleSearchChange = (text) => {
    this.setState({ search: text }); // Update the search state
  };

  handleSearchPress = () => {
    // Handle the search logic here, using this.state.search
    console.log('Search Query:', this.state.search);
  };
  toggleMenu = () => {
    this.setState((prevState) => ({ menuVisible: !prevState.menuVisible }));
  };

  _ShowModel() {
    this.setState({ showPopup: !this.state.showPopup });
  }
  MyHome() {
    console.log("4");
    this.props.navigation.navigate('Dashboard', { name: 'Dashboard' })
  }
  MyFav() {
    console.log("5");
    this.props.navigation.navigate('Map', { name: 'Map' })
  }
  MyAccount() {
    console.log("6");
    this.props.navigation.navigate('MyAccount', { name: 'MyAccount' })
  }
  GetOffer(regID, restImg, restfav) {
    this.props.navigation.navigate('RestaurantDetail', { regID: regID, img: restImg, fav: restfav })
  }
  _SearchList = async (hotel) => {
    this._GetToken();
    let token = "Bearer " + await AsyncStorage.getItem('accessToken');
    let body = {
      "current_Lat": "29.472561",//await AsyncStorage.getItem('Current_Latitude'),
      "current_Log": "77.707130",//await AsyncStorage.getItem('Current_Longitude'),
      "name": hotel
    }
    fetch(global.URL + "RMS/SearchRestaurantList", {
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
        this.setState({ horizontalData: respObject })
        console.log("Res2==>", this.state.horizontalData);
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
  UpdateAndClose(range) {
    this.setState({ showPopup: !this.state.showPopup });
    this._SearchHotel(range);
  }
  _orders = async () => {
    this.setState({menuVisible: false});
    this.props.navigation.navigate('OrderList', { name: 'OrderList' })
  }
  _Favrouite = async () => {
    this.setState({menuVisible: false});
    this.props.navigation.navigate('Favourite', { name: 'Favourite' })
  }
  _ChangePassword() {
    this.props.navigation.navigate('Map', { name: 'Map' })
  }
  // AddFav = async (RegId, UserId) => {
  //   this._GetToken();
  //   let token = "Bearer " + await AsyncStorage.getItem('accessToken');
  //   let body = {
  //     "restaurantRegID": RegId,
  //     "userID": UserId,
  //   }
  //   fetch(global.URL + "RMS/ManageFevouriteRestaurants", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": token,
  //       "platform": Platform.OS
  //     },
  //     body: JSON.stringify(body),
  //     redirect: 'follow'
  //   }).then(response => response.text()).then(async responseText => {
  //     try {
  //       var respObject = JSON.parse(responseText);
  //       if (respObject.response === 1) {
  //         const existingProductIndex = this.state.horizontalData.findIndex(
  //           (product) => product.registrationID === RegId
  //         );
  //         console.log("FOUND==>", existingProductIndex, "  RegId=>", RegId);
  //         if (existingProductIndex !== -1) {
  //           const updatedSelectedProducts = [...this.state.horizontalData];
  //           if (updatedSelectedProducts[existingProductIndex].favourite === "True")
  //             updatedSelectedProducts[existingProductIndex].favourite = "FALSE";
  //           else
  //             updatedSelectedProducts[existingProductIndex].favourite = "True";
  //           this.setState({ horizontalData: updatedSelectedProducts });
  //         }
  //       }
  //     }
  //     catch (error) {
  //       this.setState({ isLoading: false });
  //       console.log(error);
  //       Alert.alert(global.TITLE, "No Resaturent Found");
  //     }
  //   }).catch(error => {
  //     console.log(error);
  //     this.setState({ isLoading: false });
  //     Alert.alert(global.TITLE, " " + error);
  //   });
  // }
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* Header #092D21 */}
        <View style={{ height: 40, backgroundColor: "#000", flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
          <View style={{ flex: 1, margin: 10 }}>
            <TouchableOpacity onPress={() => { this._Logout() }}>
              <Image style={{ width: 30, height: 30, marginRight: 0, borderRadius: 30, marginRight: 10, resizeMode: 'contain' }} source={{ "uri": this.state.Profile.toString() }} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end', margin: 10 }}>
            {/* <TouchableOpacity onPress={() => { this.showMenu() }}>
              <Image style={{ width: 25, height: 25, marginRight: 0, resizeMode: 'contain', tintColor: "#ffffff", marginLeft: 10 }} source={MenuIcon}></Image>
            </TouchableOpacity> */}
          </View>
          {/* <Text style={{ flex: 1.8, fontSize: 16, color: "#ffffff", alignSelf: "center", textAlign: "center" }}>Dashboard</Text> */}
        </View>
        <View style={{ flexDirection: 'row', position: 'relative' }}>
          <Image
            style={{ width: SCREEN_WIDTH, height: 250, alignSelf: 'center', zIndex: 2, position: 'relative' }}
            source={require('./images/map.png')}
          />
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: '#fff', marginTop: 10 }}>
          <View style={[styles.searchContainer, { flex: 4 }]}>
            <Image
              source={search}
              style={styles.searchIcon}
            />
            <TextInput
              style={[{ color: '#000', flex: 1, paddingVertical: 8, paddingHorizontal: 5, fontFamily: 'Inter-Regular' }]}
              placeholder="Search Restaurant"
              placeholderTextColor="#000"
              onChangeText={(txt) => { this.setState({ search: txt }), this._SearchList(txt) }}
            />
          </View>
          <View style={{ flex: 1, margin: 10, marginTop: 15, flexDirection: 'row' }}>
            <Text style={{ color: '#000', fontFamily: 'Inter-Regular' }}>Filter</Text>
            <TouchableOpacity style={[]} onPress={() => this._ShowModel()} >
              <View style={{ flexDirection: 'row' }}>
                <Image
                  style={{ width: 30, height: 30, alignSelf: 'center' }}
                  source={require('./images/filter.png')}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ backgroundColor: '#fff', padding: 10 }}>
          {/* <Text style={{ fontWeight: 'bold' }}>Login As {this.state.Login}</Text> */}
          <Text style={[styles.ListHeading]}>Nearby Stores</Text>
        </View>
        <FlatList style={{ backgroundColor: '#fff', height: 400 }}
          showsVerticalScrollIndicator
          data={this.state.horizontalData}
          keyExtractor={(item) => item.registrationID}
          renderItem={({ item, index }) => (
            <View style={[styles.horizontalListItem, { flexDirection: 'row' }]}>
              <View style={{ flex: 2 }}>
                <TouchableOpacity key={index} onPress={() => this.GetOffer(item.registrationID, item.image, item.favourite)} >
                  <Text style={styles.itemName}>{item.restaurentName}</Text>
                  <Text style={styles.address}>{item.address}</Text>
                  <Text style={styles.address}>5:00 am-5:00 am</Text>
                  <Text style={styles.address}>DRIVE THRU</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ margin: 10 }}>
                  <Image
                    source={require('./images/location.png')} // Replace with the actual icon source
                  />
                  {item.distance !== undefined ? item.distance.toFixed(2) : ''}
                </Text>
                {/* <TouchableOpacity key={index} onPress={() => this.AddFav(item.registrationID, this.state.UserId)}>
                  {item.favourite === "FALSE" &&
                    <Image source={addfav} style={{ height: 25, width: 25, margin: 15 }} />
                  }
                  {item.favourite === "True" &&
                    <Image source={fav} style={{ height: 25, width: 25, margin: 15 }} />
                  }
                </TouchableOpacity> */}
              </View>
            </View>
          )}
        />
        <BottomBar onHomePress={() => this.MyHome()} onAccountPress={() => this.MyAccount()} onFavPress={() => this.MyFav()} />
        {/* Menu */}
        {this.state.menuVisible && (
          <View
            style={{
              position: 'absolute',
              top: 30,
              right: 0,
              width: 200,
              height: '100%',
              backgroundColor: '#000',
              opacity: 0.8,
              zIndex: 2, // Ensure the menu is above the image
            }}
          >
            <TouchableOpacity style={[styles.BtnLink]} onPress={() => this._ChangePassword()} >
              <View style={{ flexDirection: 'row', margin: 10 }}>
                <Image style={{ width: 25, height: 25, alignSelf: 'center' }} source={account} />
                <Text style={styles.SideBarItem}>My Account</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.BtnLink]} onPress={() => this._orders()} >
              <View style={{ flexDirection: 'row', margin: 10 }}>
                <Image style={{ width: 25, height: 25, alignSelf: 'center' }} source={order} />
                <Text style={styles.SideBarItem}>Order(s)</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.BtnLink]} onPress={() => this._Favrouite()} >
              <View style={{ flexDirection: 'row', margin: 10 }}>
                <Image style={{ width: 25, height: 25, alignSelf: 'center' }} source={fav} />
                <Text style={styles.SideBarItem}>Favrouite</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.BtnLink]} onPress={() => this._ChangePassword()} >
              <View style={{ flexDirection: 'row', margin: 10 }}>
                <Image
                  style={{ width: 25, height: 25, alignSelf: 'center' }}
                  source={require('./images/password.png')}
                />
                <Text style={styles.SideBarItem}>Change Password</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.BtnLink} onPress={() => this._Logout()} >
              <View style={{ flexDirection: 'row', margin: 10 }}>
                <Image
                  style={{ width: 25, height: 25, alignSelf: 'center' }}
                  source={require('./images/logout2.png')}
                />
                <Text style={styles.SideBarItem}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity onPress={this.toggleMenu} style={{ position: 'absolute', top: 10, right: 10, zIndex: 3 }}>
          {/* <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Toggle Menu</Text> */}
          <Image style={{ width: 25, height: 25, marginRight: 0, resizeMode: 'contain', tintColor: "#ffffff", marginLeft: 10 }} source={MenuIcon}></Image>
        </TouchableOpacity>
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: 10,
            zIndex: 1, // Ensure the gesture handler is below the menu
          }}
        // ... Gesture handler props
        />
        {/* Ends Menu*/}
        {/* Popup Model For Adding Items */}
        <Modal visible={this.state.showPopup} transparent={true} animationType='fade' onRequestClose={this.UpdateAndClose}>
          <View style={[styles.popup]}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color: '#000', fontFamily: 'Inter-Bold' }}>Range</Text>
              </View>
              <View style={{ flex: 0.1, alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={() => this._ShowModel()}>
                  <Text style={{ fontSize: 20, color: '#fc6a57', fontFamily: 'Inter-Bold', }}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ width: '95%' }}>
              <Dropdown
                style={[styles.dropdown, this.state.isFocus && { color: '#000', borderColor: 'blue' }]}
                itemTextStyle={styles.dropdownText}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={this.state.RangeList}
                search={true}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!this.state.isFocus ? 'Select Range' : '...'}
                searchPlaceholder="Search..."
                value={this.state.RangeVal}
                onFocus={() => this.setState({ isFocus: true })}
                onBlur={() => this.setState({ isFocus: false })}
                onChange={item => {
                  this.setState({ RangeVal: item.value });
                  this.setState({ isFocus: false });
                  this.UpdateAndClose(item.value);
                }}
              />
            </View>
            {/* <View style={{ width: '95%' }}>
              <TouchableOpacity style={[styles.BtnLogin]} onPress={()=>this.UpdateAndClose()}>
                <Text style={{ fontFamily: "Arial", fontSize: 18, fontWeight: 'bold' }}>Update</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </Modal>
      </SafeAreaView>
    )
  }
}

{/* <SearchHeader
          search={this.state.search}
          onSearchChange={this.handleSearchChange}
          onSearchPress={this.handleSearchPress}
        /> */}
{/* <View style={{flex:1, backgroundColor:'#fff', padding:10}}><Text style={[styles.ListHeading]}>What's on your Mind?</Text></View>
        <SearchByItem /> */}
class SearchHeader extends React.Component {
  render() {
    const { search, onSearchChange, onSearchPress } = this.props;
    return (
      <View style={stylesCard.container}>
        <TextInput
          style={stylesCard.searchBar}
          placeholder="Search for dishes & restaurant"
          onChangeText={(txt) => onSearchChange(txt)}
          value={search}
        />
        <TouchableOpacity onPress={onSearchPress} style={stylesCard.iconButton}>
          <Image
            source={require('./images/search.png')} // Replace with the path to your image
            style={stylesCard.iconSearch}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
class SearchByItem extends React.Component {
  render() {
    return (
      <>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}>
            <TouchableOpacity>
              <Image
                source={require('./images/pizza.png')} // Replace with the path to your image

              />
              <Text style={[stylesCard.ItemText]}>Pizza</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}>
            <TouchableOpacity>
              <Image
                source={require('./images/burger.png')} // Replace with the path to your image

              />
              <Text style={[stylesCard.ItemText]}>Burger</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}>
            <TouchableOpacity>
              <Image
                source={require('./images/sandwich.png')} // Replace with the path to your image

              />
              <Text style={[stylesCard.ItemText]}>Sandwich</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}>
            <TouchableOpacity>
              <Image
                source={require('./images/tacos.png')} // Replace with the path to your image
              />
              <Text style={[stylesCard.ItemText]}>Tacos</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}>
            <TouchableOpacity>
              <Image
                source={require('./images/chinese.png')} // Replace with the path to your image

              />
              <Text style={[stylesCard.ItemText]}>Chinese</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}>
            <TouchableOpacity>
              <Image
                source={require('./images/thaifood.png')} // Replace with the path to your image
                style={{ width: 100, height: 100 }}
              />
              <Text style={[stylesCard.ItemText]}>Thai Food</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    )
  }
}
const stylesCard = StyleSheet.create({
  modal: {
    height: 100,  // Set the height
    width: 100,   // Set the width
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    padding: 20
  },
  searchBar: {
    flex: 1,
    padding: 15,
    marginRight: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F0EFF4',
    backgroundColor: '#F0EFF4'
  },
  searchButton: {
    marginLeft: 8,
  },
  iconSearch: {
    width: 24, // Adjust the width and height as needed
    height: 24,
    marginLeft: -50,
  },
  ItemText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  },
});