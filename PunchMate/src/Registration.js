import React, { Component } from 'react'
import { ImageBackground, BackHandler, FlatList, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import RNFetchBlob from "rn-fetch-blob";
import DocumentPicker from 'react-native-document-picker';
import SelectDropdown from 'react-native-select-dropdown'
import Album from './images/album.png';
import Camera from './images/camera.png';
import { create } from 'react-test-renderer';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
let options = {
    maxWidth: 200,
    maxHeight: 200,
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};
const fs = RNFetchBlob.fs;
RNFetchBlob.config({
    fileCache: true
})
const Day = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
const Month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const Year = Array.from({ length: 60 }, (_, index) => (new Date().getFullYear() - index).toString());
const Gender = ["Male", "Female", "Other", "Prefer Not to say"];
const monthValueMapping = {
    'January': '01',
    'February': '02',
    'March': '03',
    'April': '04',
    'May': '05',
    'June': '06',
    'July': '07',
    'August': '08',
    'September': '09',
    'October': '10',
    'November': '11',
    'December': '12',
};
export default class Registration extends Component {
    constructor(props) {
        super(props);
        this.RefName = React.createRef();
        this.RefMobile = React.createRef();
        this.RefPin = React.createRef();
        this.RefEmail = React.createRef();
        this.state = {
            MobileNo: '',
            FirstName: '',
            LastName: '',
            Email: '',
            AreaCode: '',
            Address: '',
            Password: '',
            Latitude: '',
            Longitude: '',
            flag: '',
            isLoading: false,
            fileData: '',
            imageSource: '',
            selectedFile: '',
            showDatePicker: false,
            dd: '',
            mm: '',
            yy: '',
            gender: '',
        }
    }
    async componentDidMount() {
        let user = await AsyncStorage.getItem('mobile');
        this.setState({ MobileNo: user })
        let lat = await AsyncStorage.getItem('Current_Latitude');
        this.setState({ Latitude: lat })
        let long = await AsyncStorage.getItem('Current_Longitude');
        this.setState({ Longitude: long })

    }
    convertToBase64 = (file) => {
        this.setState({ fileData: file });
        //console.log("1=======", this.state.fileData);
    };
    selectImage = () => {
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                console.log(response);
                const source = { uri: response.assets[0].uri };
                this.setState({ imageSource: source });
                fs.readFile(response.assets[0].uri, 'base64')
                    .then(res => this.convertToBase64(res));
            }
        });
    };
    openCamera = () => {
        const options = {
            mediaType: 'photo', // Specify that you want to take a photo
            quality: 0.7, // Image quality (0 to 1)
        };

        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.errorCode) {
                console.log('Camera Error: ', response.errorMessage);
            } else {
                const source = { uri: response.assets[0].uri };
                this.setState({ flag: "2" });
                console.log("Images=====>", response.assets[0].uri);
                console.log("Images=====>", response.assets[0].type);
                console.log("Images=====>", response.assets[0].fileName);
                this.setState({ imageSource: response.assets });
            }
        });
    };
    pickDocument = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });

            this.setState({ imageSource: result });
            this.setState({ flag: "1" });
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker
            } else {
                throw err;
            }
        }
    };
    RegisterUser = async () => {
        console.log(this.state.FirstName,"=",this.state.MobileNo,"=",this.state.Password,"=",this.state.Email);
        if (this.state.FirstName === '' || this.state.MobileNo === null || this.state.Password === '' || this.state.Email === '') {
            Alert.alert(global.TITLE, "Field(s) is Required");
            if (this.state.FirstName === '')
                this.RefName.current.focus();
            if (this.state.MobileNo=== null)
                this.RefMobile.current.focus();
            if (this.state.Password === '')
                this.RefPin.current.focus();
            if (this.state.Email === '')
                this.RefEmail.current.focus();
        } else {
            this.setState({ isLoading: false })
            var dob;
            if (this.state.dd < 10)
                dob = this.state.yy + "-" + this.state.mm + "-0" + this.state.dd;
            else
                dob = this.state.yy + "-" + this.state.mm + "-" + this.state.dd;
            const data = new FormData();
            const userInfo = {
                registrationID: "0",
                FirstName: this.state.FirstName,
                LastName: this.state.LastName,
                MobileNo: this.state.MobileNo,
                MailID: this.state.Email,
                Address: this.state.Address,
                Area_Code: this.state.AreaCode,
                Password: this.state.Password,
                Lat: this.state.Latitude,
                Long: this.state.Longitude,
                DOB: dob,
                Gender: this.state.gender,
                Image: "",
            };
            let body = {
                mobileNo: this.state.MobileNo.toString()
            }
            fetch(global.URL + "Login/SendOTP", {
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
                    console.log(respObject);
                }
                catch (error) {
                    this.setState({ isLoading: false });
                    console.log(error);
                }
            });
            this.props.navigation.navigate('RegisterOTP', { data: JSON.stringify(userInfo), mobile: this.state.MobileNo });
        }
        // data.append('UserInfo', JSON.stringify(userInfo));
        // if (this.state.flag === "1") {
        //     data.append('ImageFile',
        //         {
        //             uri: this.state.imageSource[0].uri,
        //             type: this.state.imageSource[0].type,
        //             name: this.state.imageSource[0].name,
        //         }
        //     );
        // } else {
        //     data.append('ImageFile',
        //         {
        //             uri: this.state.imageSource[0].uri,
        //             type: this.state.imageSource[0].type,
        //             name: this.state.imageSource[0].fileName,
        //         }
        //     );
        // }
        // try {
        //     const response = await fetch(global.URL + "Login/UserRegistration/", {
        //         method: 'POST',
        //         body: data,
        //         headers: {
        //             // 'Accept': 'application/json',
        //             'Content-Type': 'multipart/form-data',
        //         },
        //     });
        //     console.log(response);
        //     if (response.status === 200) {
        //         alert('File uploaded successfully!');
        //         this.setState({ isLoading: false })
        //         this.props.navigation.navigate('Login', { name: "Login" });
        //     } else {
        //         alert('File upload failed.');
        //     }
        // } catch (error) {
        //     console.error('Error uploading file:', error);
        // }
        // data.append("ImageFile", fileInput.files[0], this.state.imageSource);
        // data.append('ImageFile', this.state.imageSource);
        // await fetch(global.URL + "Login/UserRegistration/", {
        //     method: "POST",
        //     headers: {
        //         // "Content-Type": "application/json",
        //         'Content-Type': 'multipart/form-data; ',
        //         "platform": Platform.OS
        //     },
        //     body: data,
        //     redirect: 'follow'
        // }).then(response => response.text()).then(async responseText => {
        //     try {
        //         var respObject = JSON.parse(responseText);
        //        console.log(respObject);
        //         this.setState({ isLoading: false });

        //     }
        //     catch (error) {
        //         this.setState({ isLoading: false });
        //         console.log(error);
        //         Alert.alert(global.TITLE, "Invalid Mobile Number");
        //     }
        // }).catch(error => {
        //     console.log(error);
        //     this.setState({ isLoading: false });
        //     Alert.alert(global.TITLE, " " + error);
        // });
    }

    render() {
        return (
            <SafeAreaView contentContainerStyle={[styles.contentContainer]}>
                <ScrollView>
                    <View style={{ margin: 0, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={require('./images/bgLogin.png')}
                            style={{ width: screenWidth, height: 450 }}
                        />
                    </View>
                    <View style={[{ borderWidth: 1, margin: 0, width: screenWidth, marginTop: -150, borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor: '#f5f5f5', height: screenHeight - 150 }]}>
                        <Text style={{ fontFamily: 'Poppins-Bold', marginTop: 20, margin: 20, color: '#000', fontSize: 14 }}>
                            Please Fill Details of User Registration
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={[styles.TextBoxContainer, { flex: 1 }]}>
                                <TextInput style={[styles.TextBox]}
                                    ref={this.RefName}
                                    placeholder="First Name"
                                    placeholderTextColor="#000"
                                    onChangeText={(txt) => { this.setState({ FirstName: txt }); }}
                                />
                            </View>
                            <View style={[styles.TextBoxContainer, { flex: 1 }]}>
                                <TextInput style={[styles.TextBox]}
                                    placeholder="Last Name"
                                    placeholderTextColor="#000"
                                    onChangeText={(txt) => { this.setState({ LastName: txt }); }}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', margin: 5 }}>
                            <View style={{ flex: 1 }}>
                                <SelectDropdown
                                    data={Day}
                                    onSelect={(selectedItem, index) => {
                                        console.log(selectedItem, index)
                                        this.setState({ dd: selectedItem });
                                    }}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        // text represented after item is selected
                                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                                        return selectedItem
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        // text represented for each item in dropdown
                                        // if data array is an array of objects then return item.property to represent item in dropdown
                                        return item
                                    }}
                                    defaultButtonText="Day"
                                    buttonStyle={styles.dropdownButton}
                                    buttonTextStyle={styles.dropdownButtonText}
                                    dropdownStyle={styles.dropdownContainer}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <SelectDropdown
                                    data={Month}
                                    onSelect={(selectedItem, index) => {
                                        console.log(selectedItem, index)
                                        this.setState({ mm: monthValueMapping[selectedItem] });
                                    }}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        // text represented after item is selected
                                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                                        return selectedItem
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        // text represented for each item in dropdown
                                        // if data array is an array of objects then return item.property to represent item in dropdown
                                        return item
                                    }}
                                    defaultButtonText="Month"
                                    search={true}
                                    buttonStyle={styles.dropdownButton}
                                    buttonTextStyle={styles.dropdownButtonText}
                                    dropdownStyle={styles.dropdownContainer}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <SelectDropdown
                                    data={Year}
                                    onSelect={(selectedItem, index) => {
                                        console.log(selectedItem, index)
                                        this.setState({ yy: selectedItem });
                                    }}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        // text represented after item is selected
                                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                                        return selectedItem
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        // text represented for each item in dropdown
                                        // if data array is an array of objects then return item.property to represent item in dropdown
                                        return item
                                    }}
                                    defaultButtonText="Year"
                                    buttonStyle={styles.dropdownButton}
                                    buttonTextStyle={styles.dropdownButtonText}
                                    dropdownStyle={styles.dropdownContainer}
                                />
                            </View>
                        </View>
                        <View style={{ marginLeft: 5, marginTop: 10 }}>
                            <SelectDropdown
                                data={Gender}
                                onSelect={(selectedItem, index) => {
                                    console.log(selectedItem, index)
                                    this.setState({ gender: selectedItem });
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    // text represented after item is selected
                                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                                    return selectedItem
                                }}
                                rowTextForSelection={(item, index) => {
                                    // text represented for each item in dropdown
                                    // if data array is an array of objects then return item.property to represent item in dropdown
                                    return item
                                }}
                                defaultButtonText="Select Gender"
                                buttonStyle={styles.dropdownButtonGender}
                                buttonTextStyle={styles.dropdownButtonText}
                                dropdownStyle={styles.dropdownContainer}
                            />
                        </View>
                        <View style={[styles.TextBoxContainer, { flexDirection: 'row', marginTop: 10 }]}>
                            <View style={{ flex: 0, margin: 10, marginRight: 2 }}>
                                <Text style={{ fontSize: 13, color: '#000' }}>+61 -</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput style={[styles.TextBox, { marginLeft: 0 }]}
                                    ref={this.RefMobile}
                                    placeholder="Phone Number"
                                    placeholderTextColor="#000"
                                    value={this.state.MobileNo}
                                    keyboardType='number-pad'
                                    onChangeText={(txt) => { this.setState({ MobileNo: txt }); }}
                                />
                            </View>
                        </View>
                        <View style={[styles.TextBoxContainer]}>
                            <TextInput style={[styles.TextBox]}
                                ref={this.RefPin}
                                placeholder="Pin"
                                placeholderTextColor="#000"
                                secureTextEntry={true}
                                keyboardType='numeric'
                                onChangeText={(txt) => { this.setState({ Password: txt }); }}
                            />
                        </View>
                        <View style={[styles.TextBoxContainer]}>
                            <TextInput style={[styles.TextBox]}
                                ref={this.RefEmail}
                                placeholder="Email"
                                placeholderTextColor="#000"
                                keyboardType='email-address'
                                onChangeText={(txt) => { this.setState({ Email: txt }); }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={[styles.TextBoxContainer, { flex: 2 }]}>
                                <TextInput style={[styles.TextBox]}
                                    placeholder="Address"
                                    placeholderTextColor="#000"
                                    onChangeText={(txt) => { this.setState({ Address: txt }); }}
                                />
                            </View>
                            <View style={[styles.TextBoxContainer, { flex: 1 }]}>
                                <TextInput style={[styles.TextBox]}
                                    placeholder="Zip Code"
                                    placeholderTextColor="#000"
                                    onChangeText={(txt) => { this.setState({ AreaCode: txt }); }}
                                />
                            </View>
                        </View>

                        {/* <View style={{ flexDirection: 'row', margin: 10 }}>
                            {this.state.imageSource && ( // Conditionally render the Image component
                                <Image
                                    source={this.state.imageSource}
                                    style={{ width: screenWidth - 20, height: 150 }}
                                />
                            )}
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <TouchableOpacity style={[styles.BtnIcon]} onPress={() => this.pickDocument()} >
                                    <Image
                                        source={Album}
                                        style={{ width: 30, height: 30 }}
                                    />
                                    <Text style={[styles.BtnText, { fontSize: 10, margin: 0 }]}>Album</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <TouchableOpacity style={[styles.BtnIcon]} onPress={() => this.openCamera()} >
                                    <Image
                                        source={Camera}
                                        style={{ width: 30, height: 30 }}
                                    />
                                    <Text style={[styles.BtnText, { fontSize: 10 }]}>Camera</Text>
                                </TouchableOpacity>
                            </View>
                        </View> */}
                        <TouchableOpacity style={[styles.BtnTab1]} onPress={() => this.RegisterUser()} >
                            <Text style={[styles.BtnText, { fontSize: 18 }]}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.isLoading}>
                    <View style={{ flex: 1, backgroundColor: "#ffffffee", alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#F60000" />
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: "#434343", margin: 15 }}>Loading....</Text>
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}
