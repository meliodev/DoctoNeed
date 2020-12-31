//This is an example of React Native Tab
import React from 'react';

import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack'

import NavigationService from '../../Navigation/NavigationService'

import { Dimensions, AsyncStorage, Platform, Alert } from 'react-native'

import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')

import firebase, { notifications } from 'react-native-firebase'
import * as REFS from '../../DB/CollectionsRefs'

import { connect } from 'react-redux'
import { setReduxState } from '../../functions/functions'


const SCREEN_HEIGHT = Dimensions.get("window").height;
const functions = firebase.functions()

class NotificationsConfig extends React.Component {
  constructor(props) {
    super(props);
    this.createNotificationListeners = this.createNotificationListeners.bind(this);

    this.state = {
      isLoggedIn: false,
      isAdmin: undefined,
      isDoctor: undefined,
      isPatient: false,
      isAuthenticating: false,
      phoneNumber: '',
      // notificationTime: moment(),
      // enableNotification: true
    }
  }

  async componentDidMount() {
    //let fcmToken = await AsyncStorage.removeItem('fcmToken').then(() => console.info('removed !!!!!!!!!!'));

    //this.createNotificationChannel()
    if (firebase.auth().currentUser) {
      console.log('NOTIFICATION CONFIG SCREEN COMPONENT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      this.checkPermission()
    }

    this.createNotificationListeners().then(() => this.props.navigation.navigate(''))
  }

  //FCM Notifications functions
  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission()

    if (enabled)
      this.getToken();

    else
      this.requestPermission();
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission().catch((err) => alert(err));
      //User has authorised
      this.getToken();
    }
    catch (error) {
      //User has rejected permissions
      console.log('Permission rejetée');
    }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken').catch((err) => alert(err));
    alert('async storage fcm token: ' + fcmToken)

    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken()
        .catch((err) => alert(err));
      alert('firebase messaging fcm token: ' + fcmToken)

      //POST Token to Firestore: Associate token to the current user on Firestore
      const token = {
        userId: firebase.auth().currentUser.uid,
        fcmToken: fcmToken,
        role: this.props.role,
        //active: true,
        createdAt: moment(new Date()).format()
      }

      REFS.fcmtokens.doc(firebase.auth().currentUser.uid).get()
        .then((doc) => {
          if (doc.exists) {
            REFS.fcmtokens.doc(firebase.auth().currentUser.uid).update({ fcmToken: token.fcmToken })
              .then(() => console.log('fcm token updated on firestore !'))
          }

          else {
            REFS.fcmtokens.doc(firebase.auth().currentUser.uid).set(token)
              .then(() => console.log('fcm token added to firestore'))
              .catch((err) => alert(err))
          }
        })
        .catch((err) => alert(err))

      //Add the new fcmToken to AsyncStorage
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken).catch((err) => alert(err));
      }
    }

    else {
      REFS.fcmtokens.where('fcmToken', '==', fcmToken).get().then((querySnapshot) => {
        //CHeck if the current token exists on DB (is associated to the current user)
        if (querySnapshot.empty) {
          let tok1 = {
            userId: firebase.auth().currentUser.uid,
            fcmToken: fcmToken,
            role: this.props.role,
            //active: true,
            createdAt: moment(new Date()).format()
          }
          REFS.fcmtokens.doc(firebase.auth().currentUser.uid).set(tok1)
            .then(() => console.log('fcm token added to admins devices list'))
            .catch((err) => alert(err))
        }

        //Check if this device is using another user account than last time.
        else
          querySnapshot.forEach(doc => {
            if (doc.exists && firebase.auth().currentUser.uid !== doc.id) {
              //delete token from the old user role
              REFS.fcmtokens.doc(doc.id).delete()
              //add token to the current user role
              let tok2 = {
                userId: firebase.auth().currentUser.uid,
                fcmToken: fcmToken,
                role: this.props.role,
                //active: true,
                createdAt: moment(new Date()).format()
              }
              REFS.fcmtokens.doc(firebase.auth().currentUser.uid).set(tok2)
                .then(() => console.log('fcm token added to firestore'))
                .catch((err) => alert(err))
            }

          })
      })
    }

    setReduxState('FCMTOKEN', fcmToken, this)
  }

  //4
  async createNotificationListeners() {

    //FOREGROUND: Triggered when a particular notification has been received in foreground
    this.unsubscribeFromNotificationListener = firebase.notifications().onNotification(notification => {

      // if (notification.title === 'Daily Reminder')
      //   this.sendDataMessage()

      // else {
      if (Platform.OS === "android") {
        const channel = new firebase.notifications.Android.Channel(
          "channelId",
          "Channel Name",
          firebase.notifications.Android.Importance.Max
        )
          .setDescription("A natural description of the channel")
          .setSound('ringtone');

        firebase.notifications().android.createChannel(channel);

        const localNotification = new firebase.notifications.Notification(
          {
            //show_in_foreground: true,
            show_in_background: true,
          }
        )
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          .setData(notification.data)
          .setSound(notification.sound === "ringtone" ? channel.sound : "default")
          //.android.setSmallIcon("notification_icon_black")
          .android.setChannelId("channelId")
          .android.setAutoCancel(false)
          .android.setVibrate(10000)
          //.android.setColor("#93eafe") // you can set a color here
          .android.setGroup(notification.notificationId)
          .android.setPriority(firebase.notifications.Android.Priority.High);

        firebase.notifications().displayNotification(localNotification)
          .catch(err => console.error(err))
      }

      else if (Platform.OS === "ios") {
        const localNotification = new firebase.notifications.Notification()
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSound('ringtone')  //task: ringtone should be configured on IOS (put ringtone.mp3 file on the suitable directory)
          .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          .setData(notification.data)
          .ios.setBadge(notification.ios.badge);

        firebase.notifications().displayNotification(localNotification)
          .catch(err => console.error(err));
      }
      // }
    });

    //BACKGROUND: If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {

      const { action, notification } = notificationOpen;
      firebase.notifications().removeDeliveredNotification(notification.notificationId);

      if (notification._data.roomId !== "") {
        const roomId = notification._data.roomId

        if (this.state.isLoggedIn)
          NavigationService.navigate('Video', { appId: roomId })

        else {
          //task: set a redux variable 'isDoctorCalling' to true, and navigate to VideoCall after log in instead of navigating to Home
          NavigationService.navigate('Login', { isAlert: true })
        }
      }
    })

    //CLOSED: If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      console.log(notificationOpen.notification)

      if (notificationOpen.notification._data.roomId !== "") {
        const roomId = notificationOpen.notification._data.roomId

        if (this.state.isLoggedIn)
          NavigationService.navigate('Video', { appId: roomId })

        else
          NavigationService.navigate('Login', { isAlert: true })
      }
    }

    //DATA ONLY: Triggered for data only payload in foreground
    this.messageListener = firebase.messaging().onMessage((message) => {

      if (Platform.OS === 'android') {
        console.log('Android is here !!! ')
        const channel = new firebase.notifications.Android.Channel(
          "channelId",
          "Channel Name",
          firebase.notifications.Android.Importance.Max
        )
          .setDescription("Video Call Channel")
          .setSound('ringtone');

        firebase.notifications().android.createChannel(channel);

        const localNotification = new firebase.notifications.Notification()
          .android.setChannelId("channelId")
          .android.setPriority(firebase.notifications.Android.Priority.High)
          .setSound(channel.sound)
          .setTitle('La téléconsultation va commencer...')
          .setBody('Votre médecin vous attend, veuillez rejoindre la téléconsultation')
          .setData(message.data)

        firebase.notifications().displayNotification(localNotification)
          .then(() => {
            console.log('Message displayed')
            if (this.state.isLoggedIn) {
              console.log('ROOMID:::::::::::: ' + message.data.roomId)
              NavigationService.navigate('Video', { appId: message.data.roomId })
            }

            else
              NavigationService.navigate('Login', { isAlert: true })
          })
          .catch((e) => console.error(e))
      }


      if (Platform.OS === "ios") {
        const localNotification = new firebase.notifications.Notification()
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSound('ringtone')  //task: ringtone should be configured on IOS (put ringtone.mp3 file on the suitable directory)
          .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          .setData(notification.data)
          .ios.setBadge(notification.ios.badge);

        firebase.notifications().displayNotification(localNotification)
          .catch(err => console.error(err));
      }
    });

    // listens for changes to the user's notification token and updates database upon change
    this.notificationTokenListener = firebase.messaging().onTokenRefresh(notificationToken => {
      console.log('notificationTokenListener !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.log(notificationToken);

      return REFS.fcmtokens.doc(firebase.auth().currentUser.uid).set({
        fcmToken: notificationToken,
        userId: firebase.auth().currentUser.uid,
        role: this.props.role,
        //active: true,
        createdAt: moment(new Date()).format()
      })
        //}, { merge: true })
        .then(() => console.log('Token saved successfully'))
        .catch(e => console.error(e))
    })
  }

  //Remove listeners allocated in createNotificationListeners()
  componentWillUnmount() {
    // this.notificationListener();
    this.unsubscribeFromNotificationListener()
    this.notificationOpenedListener()
    this.messageListener()
    this.notificationTokenListener()
  }

  render() {
    return null
  }
}

const mapStateToProps = (state) => {

  return {
    role: state.roles.role,
    fcmToken: state.fcmtoken
  }
}

export default connect(mapStateToProps)(NotificationsConfig)



 // sendDataMessage() {
  //   //Send call notification to doctor & patient
  //   console.log('000000000')
  //   const sendDataMessage = functions.httpsCallable('sendDataMessage')
  //   sendDataMessage({ fcmToken: 'c-YqG1Y2RyeKnteTjJ_uvi:APA91bEDCe9kBQg1Pi_onZznWLxeICg3xZaOiEhhMu7mk2tSJhI6e8jdFbcSy7qyL-7zB3-9h7bTxkdEI-AJKSiCgbLNsvOvAuAoIZwcS1nC5e6Cyj0TZPqFLORe0MryvSBqQWLqvQBu', roomId: 'this.appId' })
  //     // sendDataMessage({ fcmToken: this.fcmTokenPatient, roomId: this.appId })
  //     .then((response) => console.log(response))
  //     .catch((err) => console.error(err))
  // }


  //**************************************************************************************** */
  //SCHEDULED NOTIFICATIONS
  // createNotificationChannel = () => {
  //   // Build a android notification channel
  //   const channel = new firebase.notifications.Android.Channel(
  //     "reminder", // channelId
  //     "Reminders Channel", // channel name
  //     firebase.notifications.Android.Importance.High // channel importance
  //   ).setDescription("Used for getting reminder notification"); // channel description
  //   // Create the android notification channel
  //   firebase.notifications().android.createChannel(channel)
  //     .then(() => {
  //       console.log('Channel created !')
  //       this.setReminder()
  //     })
  //     .catch((e) => console.error(e))
  // };


  // buildNotification = () => {
  //   const title = Platform.OS === "android" ? "Daily Reminder" : "";
  //   const notification = new firebase.notifications.Notification()
  //     .setNotificationId("1") // Any random ID
  //     .setTitle(title) // Title of the notification
  //     .setBody("This is a notification") // body of notification
  //     .android.setPriority(firebase.notifications.Android.Priority.High) // set priority in Android
  //     .android.setChannelId("reminder") // should be the same when creating channel for Android
  //     .android.setAutoCancel(true); // To remove notification when tapped on it

  //   return notification;
  // };


  // setReminder = async () => {
  //   const { notificationTime, enableNotification } = this.state;

  //   //enableNotification if current user is Patient X or Doctor Y
  //   if (enableNotification) {
  //     // schedule notification  
  //     firebase.notifications().scheduleNotification(this.buildNotification(), {
  //       fireDate: this.state.notificationTime.valueOf(),
  //       exact: true,
  //     })

  //   }
  //   else return false
  // }

  //***************************************************************************************** */

  //Remove listeners allocated in createNotificationListeners()
  // componentWillUnmount() {
  //   // this.notificationListener();
  //   this.unsubscribeFromNotificationListener()
  //   this.notificationOpenedListener()
  //   this.messageListener()
  //   this.notificationTokenListener()
  // }

  //****************************************************************************************************************** */
