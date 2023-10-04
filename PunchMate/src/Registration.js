import React, { Component } from 'react'
import { ImageBackground, BackHandler, FlatList, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import RNFetchBlob from "rn-fetch-blob";
import DocumentPicker from 'react-native-document-picker';

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
export default class Registration extends Component {
    constructor(props) {
        super(props);
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
            isLoading: false,
            fileData: '',
            imageSource: '',
            selectedFile: '',
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
                this.setState({ imageSource: source });
                fs.readFile(response.assets[0].uri, 'base64')
                    .then(res => this.convertToBase64(res));
            }
        });
    };
    pickDocument = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });

            this.setState({ selectedFile: result });
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker
            } else {
                throw err;
            }
        }
    };
    RegisterUser = async () => {
        let body = {
            "FirstName": this.state.FirstName,
            "LastName": this.state.LastName,
            "MobileNo": this.state.MobileNo,
            "MailID": this.state.Email,
            "Address": this.state.Address,
            "Area_Code": this.state.AreaCode,
            "Password": this.state.Password,
            "Lat": this.state.Latitude,
            "Long": this.state.Longitude,
        }
        const data = new FormData();
        const userInfo = {
            FirstName: 'Ee',
            LastName: 'Ee',
            MobileNo: '9045800700',
            MailID: 'Ee@ee.ee',
            Address: 'Ee',
            Area_Code: 'Ee',
            Password: '11',
            Lat: '28.6296459',
            Long: '77.2316241',
        };

        data.append('ImageFile', 
            { uri: this.state.selectedFile[0].uri,
            type: this.state.selectedFile[0].type,
            name: this.state.selectedFile[0].name,
        }
        );
        data.append('UserInfo', JSON.stringify(userInfo));
        console.log("Path1=>",this.state.selectedFile[0].uri);
        console.log("Path2=>",this.state.selectedFile[0].name);
        console.log("Path3=>",this.state.selectedFile[0].type);
        console.log(data);
        try {
            const response = await fetch(global.URL + "Login/UserRegistration/", {
                method: 'POST',
                body: data,
                headers: {
                    // 'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response);
            if (response.status === 200) {
                alert('File uploaded successfully!');
            } else {
                alert('File upload failed.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
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
                    <View style={{ margin: -5, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={require('./images/icon.png')}
                            style={{ width: screenWidth, height: screenHeight - 550 }}
                        />
                    </View>
                    <View style={[{ margin: 0, width: screenWidth, marginTop: -50, borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor: '#000', height: screenHeight }]}>
                        <Text style={{ marginTop: 20, margin: 30, color: '#fff', fontSize: 16 }}>
                            Please Fill Details of User Registration
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <TextInput style={[styles.TextBox]}
                                    placeholder="First Name"
                                    placeholderTextColor="#000"
                                    onChangeText={(txt) => { this.setState({ FirstName: txt }); }}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput style={[styles.TextBox]}
                                    placeholder="Last Name"
                                    placeholderTextColor="#000"
                                    onChangeText={(txt) => { this.setState({ LastName: txt }); }}
                                />
                            </View>
                        </View>
                        <TextInput style={[styles.TextBox]}
                            placeholder="Phone Number"
                            placeholderTextColor="#000"
                            value={this.state.MobileNo}
                            keyboardType='number-pad'
                            onChangeText={(txt) => { this.setState({ MobileNo: txt }); }}
                        />
                        <TextInput style={[styles.TextBox]}
                            placeholder="Pin"
                            placeholderTextColor="#000"
                            secureTextEntry={true}
                            onChangeText={(txt) => { this.setState({ Password: txt }); }}
                        />
                        <TextInput style={[styles.TextBox]}
                            placeholder="Email"
                            placeholderTextColor="#000"
                            keyboardType='email-address'
                            onChangeText={(txt) => { this.setState({ Email: txt }); }}
                        />
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 2 }}>
                                <TextInput style={[styles.TextBox]}
                                    placeholder="Address"
                                    placeholderTextColor="#000"
                                    onChangeText={(txt) => { this.setState({ Address: txt }); }}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput style={[styles.TextBox]}
                                    placeholder="Zip Code"
                                    placeholderTextColor="#000"
                                    onChangeText={(txt) => { this.setState({ AreaCode: txt }); }}
                                />
                            </View>
                        </View>
                        
                        <View style={{ flexDirection: 'row', margin: 10 }}>
                            {this.state.imageSource && ( // Conditionally render the Image component
                                <Image
                                    source={this.state.imageSource}
                                    style={{ width: screenWidth - 20, height: 200 }}
                                />
                            )}
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity style={[styles.BtnTab1]} onPress={() => this.pickDocument()} >
                                    <Text style={[styles.BtnText, { fontSize: 18 }]}>Select Photo</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity style={[styles.BtnTab1]} onPress={() => this.openCamera()} >
                                    <Text style={[styles.BtnText, { fontSize: 18 }]}>Open Camera</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={[styles.BtnTab1]} onPress={() => this.RegisterUser()} >
                            <Text style={[styles.BtnText, { fontSize: 18 }]}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
