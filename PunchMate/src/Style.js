// import { color } from "@shopify/restyle";
// import MenuItem from "react-native-paper/lib/typescript/components/Menu/MenuItem";
// import { Colors } from "react-native/Libraries/NewAppScreen";

const React = require("react-native");
const { StyleSheet, Dimensions } = React;

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const DOT_SIZE = 10;
const styles = StyleSheet.create({
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#fc6a57', // You can customize the color
    marginHorizontal: 8,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  dropdownButton: {
    backgroundColor: '#fff', // Change the background color of the button
    borderRadius: 15,
    width:'90%',
    height:35
  },
  dropdownButtonGender: {
    backgroundColor: '#fff', // Change the background color of the button
    borderRadius: 20,
    width:'98%',
    height:40
  },
  dropdownButtonText: {
    color: '#000', // Change the text color of the button
    fontSize: 16,
  },
  dropdownContainer: {
    borderColor: '#3498db', // Change the border color of the dropdown container
    borderRadius: 5,
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop:100
  },
  overlayText: {
    fontSize: 16,
    color: 'black',
  },
  contentContainer: {
    backgroundColor:'#fff',
    fontFamily:'Poppins-Regular',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 5,
    height:screenHeight
  },
  SideBarItem:{
    fontFamily:'Poppins-Regular',
    fontSize: 12, 
    color: '#fff', 
    marginLeft: 10
  },
  BtnLink:{},
  BtnLinkText:{
    color: "#fc6a57",
    fontFamily: 'Poppins',
    fontSize: 14,
    textDecorationLine:'underline'
  },
  BtnLogin: {
    // color:'#fff',
    fontFamily:'Poppins-Regular',
    borderRadius: 30,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    margin: 10,
    backgroundColor: "#fc6a57",//"#FEAE0F",//"#db4437",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3, },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  BtnTab1: {
    width: '90%',
    borderRadius: 15,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    backgroundColor: "#fc6a57",//"#FEAE0F",//"#db4437",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3, },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,

  },
  BtnTab2: {
    borderRadius: 5,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    margin: 10,
    backgroundColor: "#fc6a57",//"#FEAE0F",//"#db4437",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3, },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  BtnIcon: {
    width: '30%',
    borderRadius: 5,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: -5,
    backgroundColor: "#fc6a57",//"#FEAE0F",//"#db4437",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3, },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  BtnText: {
    color: "#fff",
    fontFamily: 'Poppins',
    fontSize: 15,
    // fontWeight: 'bold',
  },
  BtnTabText: {
    color: "#fff",
    fontSize: 18,
  },
  TextBox: { 
    marginLeft: 15, color: '#000', fontSize: 13, width: '80%', padding: 2,
    // margin: 5, borderRadius: 10, backgroundColor: '#f2f2f2', fontSize: 14,
    height: 40,
    // color: '#000',
    // borderWidth: 1, borderColor: '#000'
  },
  TextBoxContainer:{
    borderRadius: 20, backgroundColor: '#fff', height: 40, margin: 5, 
  },
  card: {
    margin: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalListItem: {
    // borderTopLeftRadius:15,
    // borderTopRightRadius:15,
    // borderColor: '#ccc',// '#092D21',
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    width: screenWidth - 20,
    height: 140,  //240,
    backgroundColor: '#fff',// '#092D21',//#527e70',// '#092D21',
    justifyContent: 'center',
    alignItems: 'flex-start',
    // padding:10,
    marginLeft: 10,
    marginRight: 30,
    // marginBottom:10,
  },
  itemImage: {
    margin: 5, height: 100, width: 100, borderRadius: 5

  },
  itemName: {
    fontFamily:'Poppins-Bold',
    fontSize:14,
    color: '#ff7f50',
    marginTop: 5,
  },
  statusPending: {
    fontFamily:'Poppins',
    fontSize:12,
    color: '#ff7f50',
    textAlign:'center',
    width:'50%',
    borderWidth:1,
    borderRadius:15,
    borderColor:'#ff7f50'
  },
  statusComplete: {
    fontFamily:'Poppins',
    fontSize:12,
    textAlign:'center',
    backgroundColor:'#e6f4e7',
    borderRadius:15,
    color: '#008a0e',
  },
  statusCancel: {
    fontFamily:'Poppins',
    fontSize:12,
    textAlign:'center',
    backgroundColor:'#fee6e6',
    borderRadius:15,
    color: '#f20000',
  },
  ListIcon:{
    tintColor:'#4d4d4d',height:15,width:15
  },
  distance: {
    fontFamily:'Poppins-Regular',
    color: 'red',
    marginTop: 10,
    textAlign: 'right', width: 350,
  },
  address: {
    fontFamily:'Poppins-Regular',
    fontSize: 11,
    marginLeft: 5,
    marginBottom: 0,
    color: '#000'
  },
  profileImg:{
    width: 50, 
    height: 50, 
    marginRight: 0, 
    borderRadius: 30, 
    resizeMode: 'contain'
  },
  time: {
    fontFamily:'Poppins-Regular',
    color: '#000',
    marginTop: -20,
    textAlign: 'right', width: 350,
  },
  icon: {
    width: 20, // Adjust the icon size as needed
    height: 18,
  },
  BtnLink: {
    width: "100%",
    height: 50,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "#000",//"#092D21",
    borderBottomColor: '#fff',
    borderBottomWidth: 1
  },
  ListHeading: {
    color: "#000",
    fontSize: 16,
    fontFamily:'Poppins-Bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginLeft: 10,
    marginTop: 10,
  },
  searchIcon: {
    margin: 10,
    width: 25, height: 25
  },
  popup: {
    flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute',
    top: '40%',
    left: '20%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    width: screenWidth - 50,
    borderWidth: 1,
    borderColor: '#092D21'
  },
  headerOverImage: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Transparent background color
    padding: 10,
  },
  quantityText: {
    margin: 4,
    marginLeft:10,
    marginRight:10,
    color: '#000',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  buttonText: {
    fontSize: 24,
    color: '#000',
  },
  StarImg:{
    height:50,
    width:50,
    marginLeft:10,
    marginRight:10
  },
  cartIconContainer: {
    position: 'relative', // To position the item count over the icon
  },
  itemCountContainer: {
    position: 'absolute',
    top: -5, // Adjust the top position as needed
    right: -5, // Adjust the right position as needed
    backgroundColor: '#ff7f50', // Customize the background color
    borderRadius: 10, // Adjust the border radius as needed
    width: 20, // Adjust the width as needed
    height: 20, // Adjust the height as needed
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCountText: {
    color: 'white', // Customize the text color
    fontSize: 12, // Customize the font size
    fontWeight: 'bold', // Customize the font weight
  },
  checkoutButton: {
    top: -50,
    backgroundColor: '#000', // Customize the background color
    alignItems: 'center',
    justifyContent: 'center',
    height: 40, // Adjust the button height as needed
  },
  checkoutButtonText: {
    color: 'white', // Customize the text color
    fontSize: 15, // Customize the font size
    fontFamily:'Poppins-Bold',
  },
  CartItemHeader: {
    margin: 0,
    padding:8,
    width: '100%',
    alignItems: 'center',
    marginTop: 5,
    borderRadius: 5,
    backgroundColor: "#000",//'#092D21',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3, },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  dropdownText:{
    color: '#000',
    fontSize:12,
    fontFamily:'Poppins-Regular',
},
placeholderStyle: {
  fontFamily:'Poppins-Regular',
  fontSize: 12,
  color: "#000",
  borderWidth: 1,
  borderRightWidth:0,
  backgroundColor: '#fff',
  height: 40,
  padding: 10,
  borderTopLeftRadius:5,
  borderBottomLeftRadius:5,
},
selectedTextStyle: {
  fontFamily:'Poppins-Regular',
  fontSize: 12,
  color: "#000",
  borderWidth: 1,
  backgroundColor: '#fff',
  height: 40,
  padding: 10,
},
iconStyle: {
  width: 20,
  height: 40,
  backgroundColor: '#fff',
  padding: 15,
  marginRight: 10,
  borderWidth:1,
  borderLeftWidth:0,
  borderColor:'#000',
  borderTopRightRadius:5,
  borderBottomRightRadius:5
},
inputSearchStyle: {
  fontFamily:'Poppins-Regular',
  height: 40,
  fontSize: 16,
  backgroundColor: 'white',
  color: "#000",
  borderColor: 'blue',
},
dropdown: {
  fontFamily:'Poppins-Regular',
  flex: 2,
  color:'#000',
},
dropHeading:{
  backgroundColor: '#fc6a57',//'rgba(0, 0, 0, 0.5)', 
  borderRadius:15, 
  width:screenWidth-10, 
  margin:10, 
  padding:15
},
  borderRadii: {
    none: 0,
    s: 4,
    m: 8,
    l: 16,
    xl: 24,
    xxl: 32,
    xxxl: 100,
  },
  spacing: {
    none: 0,
    xxs: 2,
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 64,
    '10%': '10%',
    '20%': '20%',
    '30%': '30%',
    '40%': '40%',
    '50%': '50%',
  },
  colors: {
    primary: '#FC6A57',
    secondary: '#71717a',
    background: '#f4f4f5',
    card: '#FFF',
    text: '#18181b',
    border: '#d4d4d8',
    danger: '#ef4444',
    warning: '#eab308',
    success: '#008060',
    info: '#2E72D2',
    black: '#000000',
    white: '#fff',
    transparent: 'transparent',
    facebook: '#3b5998',
    google: '#db4437',
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  textVariants: {
    defaults: {
      color: 'text',
      fontSize: 16,
    },
    primary: {
      color: 'primary',
      fontSize: 16,
    },
    secondary: {
      color: 'secondary',
      fontSize: 14,
    },
    largeHeader: {
      fontWeight: 'bold',
      fontSize: 28,
    },
    header: {
      fontWeight: 'bold',
      fontSize: 24,
    },
    subHeader: {
      fontWeight: 'bold',
      fontSize: 20,
    },
  },
  buttonVariants_defaults: {
    backgroundColor: '#FC6A57',
  },
  buttonVariants_primary: {
    backgroundColor: '#FC6A57',
  },
  buttonVariants_danger: {
    backgroundColor: '#ef4444',
  },
  buttonVariants_warning: {
    backgroundColor: '#eab308',
  },
  buttonVariants_success: {
    backgroundColor: '#008060',
  },
  buttonVariants_info: {
    backgroundColor: '#2E72D2',
  },
  buttonVariants_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FC6A57',
  },
  buttonVariants_transparent: {
    backgroundColor: 'transparent',
  },
  buttonVariants_facebook: {
    backgroundColor: '#3b5998',
  },
  buttonVariants_google: {
    backgroundColor: '#db4437',
  },
  buttonSizeVariants: {
    defaults: {
      paddingVertical: 'm',
      paddingHorizontal: 'm',
    },
    xs: {
      paddingVertical: 'xs',
      paddingHorizontal: 'xs',
    },
    s: {
      paddingVertical: 's',
      paddingHorizontal: 's',
    },
    m: {
      paddingVertical: 'm',
      paddingHorizontal: 'm',
    },
    l: {
      paddingVertical: 'l',
      paddingHorizontal: 'l',
    },
  },
  cardVariants: {
    defaults: {
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    flat: {
      borderWidth: 1,
      borderColor: 'border',
    },
  },
  cardCoverImageSizeVariants: {
    defaults: {
      height: 125,
    },
    s: {
      height: 100,
    },
    m: {
      height: 125,
    },
    l: {
      height: 150,
    },
  },
});
export default styles;
// const palette = {
//     orange: '#FC6A57',
//     white: '#FFF',
//     black: '#000000',
//     yellow: '#eab308',
//     red: '#ef4444',
//     green: '#008060',
//     blue: '#2E72D2',
//     gray: {
//       50: '#fafafa',
//       100: '#f4f4f5',
//       200: '#e4e4e7',
//       300: '#d4d4d8',
//       400: '#a1a1aa',
//       500: '#71717a',
//       600: '#52525b',
//       700: '#3f3f46',
//       800: '#27272a',
//       900: '#18181b',
//       950: '#09090b',
//     },
//     facebook: '#3b5998',
//     google: '#db4437',
//   };