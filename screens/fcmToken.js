import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux'
import { setReduxState } from '../functions/functions'

import * as REFS from '../DB/CollectionsRefs';

import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')


class fcmToken extends Component {

  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners(); 
    //await AsyncStorage.removeItem('fcmToken');
  }

  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');

    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();

      //POST Token to Firestore
      const token = {
        fcmToken: fcmToken,
        active: true,
        createdAt: moment(new Date()).format()
      }

      //POST new fcmToken to Firestore
      REFS.users.doc('6x1cDBvzXGMfRkgizjLtALqTWRt2').collection('Devices').add(token).then(() => console.log('fcm token added to firestore'))
                                                                                     .catch((err) => console.error(err))
      //Add new fcmToken to AsyncStorage
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }

    setReduxState('FCMTOKEN', fcmToken, this)
    // console.log('hi there !')
    // console.log(this.props.fcmToken)
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  //Remove listeners allocated in createNotificationListeners()
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      this.showAlert(title, body);
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }


  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text>Welcome !</Text>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    fcmToken: state.fcmtoken
  }
}

export default connect(mapStateToProps)(fcmToken)