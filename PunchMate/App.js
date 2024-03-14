import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavigationService from './src/Service/NavigationService';

import Splash from './src/Splash';
import Main from './src/Main';
import Login from './src/Login';
import Dashboard  from './src/Dashboard';
import ValidatePin from './src/ValidatePin';
import Registration from './src/Registration';
import BottomBar from './src/BottomBar';
import MyAccount from './src/MyAccount';
import OrderList from './src/OrderList';
import RestaurantDetail from './src/RestaurantDetail';
import Cart from './src/Cart';
import Map from './src/Map';
import QRCodes from './src/QRCodes';
import Favourite from './src/Favourite';
import OrderNow from './src/OrderNow';
import Direction from './src/Direction';
import Account from './src/Account';
import ChangePassword from './src/ChangePassword';
import ShowReview from './src/ShowReview';
import WriteReview from './src/WriteReview';
import ForgetPass from './src/ForgetPass';
import OfferList from './src/OfferList';

const Stack = createNativeStackNavigator();
function App() {
  //global.URL = "https://punchmate01.azurewebsites.net/";
  global.URL = "http://20.5.185.135/punchmateapi/";
  global.TITLE = "PUNCH MATE";
  return (
    <>
      <NavigationContainer ref={(navigatorRef) => {
        NavigationService.setTopLevelNavigator(navigatorRef)
      }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="Login" component={Login} />         
          <Stack.Screen name="ValidatePin" component={ValidatePin} />         
          <Stack.Screen name="Registration" component={Registration} />         
          <Stack.Screen name="Dashboard" component={Dashboard} />         
          <Stack.Screen name="OrderNow" component={OrderNow} />         
          <Stack.Screen name="BottomBar" component={BottomBar} />         
          <Stack.Screen name="MyAccount" component={MyAccount} />         
          <Stack.Screen name="OrderList" component={OrderList} />         
          <Stack.Screen name="RestaurantDetail" component={RestaurantDetail} />         
          <Stack.Screen name="Cart" component={Cart} />         
          <Stack.Screen name="Favourite" component={Favourite} />         
          <Stack.Screen name="QRCodes" component={QRCodes} />         
          <Stack.Screen name="Map" component={Map} />         
          <Stack.Screen name="Direction" component={Direction} />         
          <Stack.Screen name="Account" component={Account} />         
          <Stack.Screen name="ChangePassword" component={ChangePassword} />         
          <Stack.Screen name="ShowReview" component={ShowReview} />         
          <Stack.Screen name="WriteReview" component={WriteReview} />         
          <Stack.Screen name="ForgetPass" component={ForgetPass} />         
          <Stack.Screen name="OfferList" component={OfferList} />         
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;