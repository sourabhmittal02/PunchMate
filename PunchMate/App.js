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
const Stack = createNativeStackNavigator();
function App() {
  global.URL = "https://punchmate01.azurewebsites.net/";
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
          <Stack.Screen name="BottomBar" component={BottomBar} />         
          <Stack.Screen name="MyAccount" component={MyAccount} />         
          <Stack.Screen name="OrderList" component={OrderList} />         
          <Stack.Screen name="RestaurantDetail" component={RestaurantDetail} />         
          <Stack.Screen name="Cart" component={Cart} />         
          <Stack.Screen name="Favourite" component={Favourite} />         
          <Stack.Screen name="QRCodes" component={QRCodes} />         
          <Stack.Screen name="Map" component={Map} />         
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;