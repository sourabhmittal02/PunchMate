import React, { Component } from 'react'
import { BackHandler, PermissionsAndroid, Dimensions, SafeAreaView, Alert, ActivityIndicator, StatusBar, Image, Text, View, StyleSheet, FlatList, TouchableOpacity, ScrollView, TextInput, Modal, Platform } from 'react-native'
import styles from './Style'
import Smile from './images/smile.png';

let SCREEN_WIDTH = Dimensions.get('window').width;
export default class WriteReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 0,
      comment: '',
      OrderId: '',
      UserId: '',
      RestId: '',
    }
  }
  componentDidMount() {
    this.setState({ OrderId: this.props.route.params.OrderId })
    this.setState({ UserId: this.props.route.params.UserId })
    this.setState({ RestId: this.props.route.params.RestId })

  }
  renderStar(index) {
    const filledStars = this.state.rating >= index ? require('./images/fill.png') : require('./images/empty.png');
    return (
      <TouchableOpacity key={index} onPress={() => this.setState({ rating: index })}>
        <Image source={filledStars} style={{margin:3, width: 30, height: 30 }} />
      </TouchableOpacity>
    );
  }
  _WriteReview() {
    var body = {
      "userID": this.state.UserId,
      "restroID": this.state.RestId,
      "orderID": this.state.OrderId,
      "ratings": this.state.rating,
      "review": this.state.comment
    }
    console.log(body);
    fetch(global.URL + "RMS/SubmitRatings", {
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
        console.log("Review==>", respObject);
        if (respObject.response == 1) {
          this.props.navigation.navigate('OrderList');
        } else {
          Alert.alert(global.TITLE, respObject.status);
        }
      }
      catch (error) {
        this.setState({ isLoading: false });
        console.log(error);
        Alert.alert(global.TITLE, "No Review Found");
      }
    }).catch(error => {
      console.log(error);
      this.setState({ isLoading: false });
      Alert.alert(global.TITLE, " " + error);
    });
  }
  render() {
    const { rating } = this.state;
    const smiley = [
      require('./images/smile.png'),
      require('./images/smiley1.png'),
      require('./images/smiley2.png'),
      require('./images/smiley3.png'),
      require('./images/smiley4.png'),
      require('./images/smiley5.png'),
    ][rating];
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ textAlign: 'center', color: '#000', fontFamily: 'Poppins-Bold', fontSize: 20 }}>How was our service?</Text>
          <Image source={smiley} style={{ width: 120, height: 120 }} />
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            {[1, 2, 3, 4, 5].map((index) => this.renderStar(index))}
          </View>
          <TextInput placeholder='Add a comment' multiline={true}
            numberOfLines={6}
            onChangeText={(text) => this.setState({ comment: text })}
            style={{marginBottom:0, marginTop: 30, borderWidth: 0, borderRadius: 10, width: SCREEN_WIDTH - 20, backgroundColor: '#fff3ee' }}></TextInput>
        </View>
        <View style={{ marginTop: 0, flex: 0.3, }}>
          <TouchableOpacity style={[styles.BtnLogin]} onPress={() => this._WriteReview()}>
            <Text style={{ color: '#fff', textAlign: 'center', padding: 5 }}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
