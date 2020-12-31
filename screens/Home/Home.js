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

import { createAppContainer } from 'react-navigation';

import HomeGuest from './Guest/HomeGuest';

//Booking
import Search from '../Booking/Search'
import DoctorFile from '../../screens/Booking/DoctorFile'
import Booking from '../Booking/Booking'
import Symptomes from '../../screens/Booking/Symptomes'
import Payment from '../../screens/Booking/Payment'

import Upload from '../../screens/Booking/Upload'
import BookingConfirmed from '../../screens/Booking/BookingConfirmed'
import PreviousAppointmentsPAT from '../User/Patient/PreviousAppointments'
import NextAppointmentsPAT from '../User/Patient/NextAppointments'
import PreviousAppointmentsDOC from '../User/Doctor/PreviousAppointments'
import NextAppointmentsDOC from '../User/Doctor/NextAppointments'
import PreviousAppointmentsADMIN from '../User/Admin/PreviousAppointments'
import NextAppointmentsADMIN from '../User/Admin/NextAppointments'
import MedicalFolder from '../../screens/User/Patient/MedicalFolder'
import DateNaissance from '../../screens/User/Patient/DateNaissance'
import Allergies from '../../screens/User/Patient/Allergies'
import Antecedants from '../../screens/User/Patient/Antecedants'
import AppointmentDetails from '../../screens/User/AppointmentDetails'
import Chat from '../User/Chat'
import SignUpRequests from '../../screens/User/Admin/SignUpRequests'

import Video from '../../screens/VideoCall/Video'
import VideoPlayer from '../../screens/User/VideoPlayer'

import PaymentSummary from '../../screens/User/PaymentSummary'
import PaymentDetails from '../../screens/User/PaymentDetails'

import DoctorProfile from '../../screens/User/Doctor/Profile'
import Diplomes from '../../screens/User/Doctor/Diplomes'
import DispoConfig from '../../screens/User/Doctor/DispoConfig'
import MyPatients from '../../screens/User/MyPatients'
import setFCMToken from '../../Store/Reducers/fcmtokenReducer';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const functions = firebase.functions()

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.hasEmailProvider = false

    this.createNotificationListeners = this.createNotificationListeners.bind(this);

    this.state = {
      isLoggedIn: false,
      isAdmin: undefined,
      isDoctor: undefined,
      isPatient: false,
      isAuthenticating: false,
      phoneNumber: '',
    }
  }

  async componentDidMount() {
    //let fcmToken = await AsyncStorage.removeItem('fcmToken').then(() => console.info('removed !!!!!!!!!!'));

    //Signout user in the following cases:
    if (firebase.auth().currentUser)
      await this.checkUserAuthMethod()

    this.getClaims()

    if (firebase.auth().currentUser) {
      const idTokenResult = await firebase.auth().currentUser.getIdTokenResult()
      // !important: Check if the user has an Email/Password account ; Because it is possible that the user creates a Phone Number account and stops the signup process -> He will automatically log in with phone number (either the phone has an account (which is worst) or not)
      if (!idTokenResult.claims.email) {
        await firebase.auth().signOut()
        this.setState({ isLoggedIn: false })
      }

      this.checkPermission()
    }

    this.createNotificationListeners()
  }

  async checkUserAuthMethod() {
    // 1. check if user has email provider
    firebase.auth().currentUser.providerData.forEach((provider) => {
      if (provider.providerId === 'password')
        this.hasEmailProvider = true
    })

    if (!this.hasEmailProvider) {
      await firebase.auth().signOut()
      console.log('Sign out user: ATTEMPTED TO CONNECT NOT USING PASSWORD PROVIDER.')
    }

    // 2. check if user's account is disabled (if yes sign him out). Maybe use onCall and check response on SignUpPW.. if response = true, sign him out before going 'Home'
    REFS.signuprequests.doc(firebase.auth().currentUser.uid).get().then(async (doc) => {
      if (doc.exists && doc.data().disabled) {
        await firebase.auth().signOut()
        console.log('Sign out user: ATTEMPTED TO CONNECT WITH DISABLED ACCOUNT.')
      }
    })
  }

  //HANDLE ROLE ACCESS
  getClaims() {
    firebase.auth().onAuthStateChanged(async user => {
      console.log('AUTH LISTENER..........................')
      console.log(user)

      if (user) {
        this.setState({ isLoggedIn: true })

        let idTokenResult = await user.getIdTokenResult()

        if (idTokenResult.claims.admin) {
          this.setState({ isAdmin: true })
          this.setRole('isAdmin')
        }

        else if (idTokenResult.claims.doctor) {
          this.setState({ isDoctor: true })
          this.setRole('isDoctor')
        }

        else if (!idTokenResult.claims.admin && !idTokenResult.claims.doctor) {
          this.setState({ isPatient: true })
          this.setRole('isPatient')
        }
      }

      else {
        this.setState({ isLoggedIn: false, isAdmin: false, isDoctor: false, isPatient: false }) //Guest
        this.setRole('')
      }
    })
  }

  setRole(role) {
    const action = { type: "ROLE", value: role }
    this.props.dispatch(action)
  }

  //************************************************************************************************************************* */
  //FCM Notifications functions
  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission().catch((err) => alert(err));

    if (enabled)
      this.getToken()

    else
      this.requestPermission()
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission().catch((err) => alert(err))
      //User has authorised
      this.getToken()
    }
    catch (error) {
      //User has rejected permissions
      console.log('Permission rejetée')
    }
  }

  //3
  async getToken() {
    const currentUser = firebase.auth().currentUser
    let fcmToken = await AsyncStorage.getItem('fcmToken').catch((err) => alert(err));

    //CASE1:
    if (!fcmToken) {
      try {
        //A. Generate new fcmToken
        fcmToken = await firebase.messaging().getToken()

        //B. Add the new fcmToken to AsyncStorage
        if (fcmToken)
          await AsyncStorage.setItem('fcmToken', fcmToken)

        //C. POST Token to Firestore (Associate token to the current user on Firestore)
        const token = {
          userId: currentUser.uid,
          fcmToken: fcmToken,
          role: this.props.role,
          createdAt: moment().format('lll')
        }

        await REFS.fcmtokens.doc(currentUser.uid).set(token, { merge: true })
      }

      catch (e) {
        await AsyncStorage.removeItem('fcmToken')
        console.error(e)
        Alert.alert('Erreur inattendue', "Le système de notifications n'a pas été initialisé correctment. Essayer de vous reconnecter.")
      }
    }

    //CASE2:
    else {
      await REFS.fcmtokens.where('fcmToken', '==', fcmToken).get().then(async (querySnapshot) => {

        //CASE1: Check if the current fcmtoken was removed (for any reason) from DB
        if (querySnapshot.empty) {
          let token1 = {
            userId: currentUser.uid,
            fcmToken: fcmToken,
            role: this.props.role,
            createdAt: moment().format('lll')
          }
          await REFS.fcmtokens.doc(currentUser.uid).set(token1)
        }

        //CASE2: Check if this device is using another user account than last time.
        else
          querySnapshot.forEach(async doc => {
            if (currentUser.uid !== doc.id) {

              const batch = firebase.firestore().batch()

              let token2 = {
                userId: currentUser.uid,
                fcmToken: fcmToken,
                role: this.props.role,
                createdAt: moment().format('lll')
              }

              //A. Delete old fcmtoken
              const dltFcmtokenRef = REFS.fcmtokens.doc(doc.id)
              batch.delete(dltFcmtokenRef)

              //B. Set new fcmtoken
              const fcmtokensRef = REFS.fcmtokens.doc(currentUser.uid)
              batch.set(fcmtokensRef, token2)

              await batch.commit()
            }
          })
      })
    }

    setReduxState('FCMTOKEN', fcmToken, this)
  }

  // sendDataMessage() {
  //   //Send call notification to doctor & patient
  //   console.log('000000000')
  //   const sendDataMessage = functions.httpsCallable('sendDataMessage')
  //   sendDataMessage({ fcmToken: 'c-YqG1Y2RyeKnteTjJ_uvi:APA91bEDCe9kBQg1Pi_onZznWLxeICg3xZaOiEhhMu7mk2tSJhI6e8jdFbcSy7qyL-7zB3-9h7bTxkdEI-AJKSiCgbLNsvOvAuAoIZwcS1nC5e6Cyj0TZPqFLORe0MryvSBqQWLqvQBu', roomId: 'this.appId' })
  //     // sendDataMessage({ fcmToken: this.fcmTokenPatient, roomId: this.appId })
  //     .then((response) => console.log(response))
  //     .catch((err) => console.error(err))
  // }

  //4
  async createNotificationListeners() {
    const currentUser = firebase.auth().currentUser

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
      const { action, notification } = notificationOpen
      firebase.notifications().removeDeliveredNotification(notification.notificationId)

      const roomId = notification._data.roomId

      //Video Calls
      if (roomId) {

        if (this.state.isLoggedIn)
          NavigationService.navigate('Video', { appId: roomId })

        else {
          //task: set a redux variable 'isDoctorCalling' to true, and navigate to VideoCall after log in instead of navigating to Home
          NavigationService.navigate('Login', { isAlert: true })
        }
      }
    })

    //CLOSED: If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    const notificationOpen = await firebase.notifications().getInitialNotification()
    if (notificationOpen) {

      const { title, body } = notificationOpen.notification;
      const roomId = notificationOpen.notification._data.roomId

      //Video Calls
      if (roomId) {
        if (this.state.isLoggedIn)
          NavigationService.navigate('Video', { appId: roomId })

        else
          NavigationService.navigate('Login', { isAlert: true })
      }
    }

    //DATA ONLY: Triggered for data only payload in foreground
    this.messageListener = firebase.messaging().onMessage((message) => {

      if (Platform.OS === 'android') {
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
            if (this.state.isLoggedIn)
              NavigationService.navigate('Video', { appId: message.data.roomId })

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

      return REFS.fcmtokens.doc(currentUser.uid).set({
        fcmToken: notificationToken,
        userId: currentUser.uid,
        role: this.props.role,
        createdAt: moment().format('lll')
      })
        .then(() => console.log('Token saved successfully'))
        .catch(e => console.error(e))
    })
  }

  componentWillUnmount() {
    // this.notificationListener();
    this.unsubscribeFromNotificationListener()
    this.notificationOpenedListener()
    this.messageListener()
    this.notificationTokenListener()
  }

  render() {
    const { isLoggedIn, isDoctor, isAdmin, isPatient } = this.state
    const isPassProvider = this.hasEmailProvider

    if (isLoggedIn && isPassProvider) {
      if (!isAdmin && !isDoctor && !isPatient)
        return null

      else if (isAdmin)
        return <AppContainerAdmin />

      else if (isDoctor)
        return <AppContainerDoctor />

      else if (!isAdmin && !isDoctor && isPatient)
        return <AppContainerPatient />
    }

    else {
      return <HomeGuest />
    }

  }
}

const mapStateToProps = (state) => {

  return {
    role: state.roles.role,
    fcmToken: state.fcmtoken
  }
}

export default connect(mapStateToProps)(Home)

//Patient Navigation
const TabScreenPatient = createMaterialTopTabNavigator(
  {
    PreviousAppointments: {
      screen: PreviousAppointmentsPAT,
      navigationOptions: {
        title: 'Consultations passées',
        headerShown: false,
      }
    },
    NextAppointments: {
      screen: NextAppointmentsPAT,
      navigationOptions: {
        title: 'Consultations à venir',
        headerShown: false,
      }
    },
  },
  {
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#333',
      inactiveTintColor: '#333',
      upperCaseLabel: false,
      style: {
        width: '100%',
        height: SCREEN_HEIGHT * 0.06,
        position: 'absolute',
        zIndex: 1,
        backgroundColor: '#ffffff',
        marginTop: SCREEN_HEIGHT * 0.15,
        borderTopWidth: 0,
        borderTopColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#d3d7d7'
      },
      labelStyle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: SCREEN_HEIGHT * 0.015
      },
      indicatorStyle: {
        borderBottomColor: '#93eafe',
        borderBottomWidth: 3,
      },
    },
  }
)

const StackNavigatorPatient = createStackNavigator({
  TabScreenPatient: {
    screen: TabScreenPatient,
    navigationOptions: {
      title: 'Accueil',
      headerShown: false,
    },
  },
  Search: {
    screen: Search,
    navigationOptions: {
      title: 'Médecins disponibles',
      // headerStyle: {
      //   backgroundColor: '#93eafe',
      // },
      // headerTintColor: '#fff',
      // headerTitleStyle: {
      //   fontWeight: 'bold',
      // },
    }
  },
  DoctorFile: {
    screen: DoctorFile,
    navigationOptions: {
      title: 'Fiche médecin'
    }
  },
  Booking: {
    screen: Booking,
    navigationOptions: {
      title: 'Disponibilités',
    }
  },
  Symptomes: {
    screen: Symptomes,
    navigationOptions: {
      title: 'Mes symptômes',
    }
  },
  Video: {
    screen: Video,
    navigationOptions: {
      title: 'Téléconsultation',
    }
  },
  VideoPlayer: {
    screen: VideoPlayer,
    navigationOptions: {
      //title: 'Appel Video',
      headerShown: false
    }
  },
  Payment: {
    screen: Payment,
    navigationOptions: {
      title: 'Paiement',
    }
  },
  Upload: {
    screen: Upload,
    navigationOptions: {
      title: 'Mes documents'
    }
  },
  BookingConfirmed: {
    screen: BookingConfirmed,
    navigationOptions: {
      title: 'Confirmation'
    }
  },
  MedicalFolder: {
    screen: MedicalFolder,
    navigationOptions: {
      title: 'Mon dossier médical',
      headerShown: false
    }
  },
  DateNaissance: {
    screen: DateNaissance,
    navigationOptions: {
      title: 'Ma date de naissance',
    }
  },
  Allergies: {
    screen: Allergies,
    navigationOptions: {
      title: 'Mes allergies',
      //headerShown: false
    }
  },
  Antecedants: {
    screen: Antecedants,
    navigationOptions: {
      title: 'Mes antécédants médicaux',
      //headerShown: false
    }
  },
  AppointmentDetails: {
    screen: AppointmentDetails,
    navigationOptions: {
      title: "Détails de la consultation",
      // headerStyle: {
      //   elevation: null
      // }
    }
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      title: "Messagerie instantanée"
    }
  },
})

const AppContainerPatient = createAppContainer(StackNavigatorPatient)

//Doctor Navigation
const TabScreenDoctor = createMaterialTopTabNavigator(
  {
    PreviousAppointments: {
      screen: PreviousAppointmentsDOC,
      navigationOptions: {
        title: 'Consultations passées',
        headerShown: false,
      }
    },
    NextAppointments: {
      screen: NextAppointmentsDOC,
      navigationOptions: {
        title: 'Consultations à venir',
        headerShown: false,
      }
    },
  },
  {
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#333',
      inactiveTintColor: '#333',
      upperCaseLabel: false,
      style: {
        width: '100%',
        height: SCREEN_HEIGHT * 0.06,
        position: 'absolute',
        zIndex: 1,
        backgroundColor: '#ffffff',
        marginTop: SCREEN_HEIGHT * 0.15,
        borderTopWidth: 0,
        borderTopColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#d3d7d7'
      },
      labelStyle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: SCREEN_HEIGHT * 0.015
      },
      indicatorStyle: {
        borderBottomColor: '#93eafe',
        borderBottomWidth: 3,
      },
    },
  }
)

const StackNavigatorDoctor = createStackNavigator({
  TabScreenDoctor: {
    screen: TabScreenDoctor,
    navigationOptions: {
      title: '',
      headerShown: false,
    },
  },
  Profile: {
    screen: DoctorProfile,
    navigationOptions: {
      title: 'Mon profil',
      headerShown: false,
    }
  },
  Diplomes: {
    screen: Diplomes,
    navigationOptions: {
      title: '',
    }
  },
  DispoConfig: {
    screen: DispoConfig,
    navigationOptions: {
      title: 'Mes disponibilités',
      headerShown: false,
    }
  },
  MyPatients: {
    screen: MyPatients,
    navigationOptions: {
      title: 'Mes patients',
    }
  },
  AppointmentDetails: {
    screen: AppointmentDetails,
    navigationOptions: {
      title: 'Détails de la consultation'
    }
  },
  MedicalFolder: {
    screen: MedicalFolder,
    navigationOptions: {
      title: 'Dossier médical',
      headerShown: false
    }
  },
  Video: {
    screen: Video,
    navigationOptions: {
      title: 'Téléconsultation',
    }
  },
  VideoPlayer: {
    screen: VideoPlayer,
    navigationOptions: {
      //title: 'Appel Video',
      headerShown: false
    }
  },
  PaymentSummary: {
    screen: PaymentSummary,
    navigationOptions: {
      title: 'Historique des paiements',
      headerShown: false
    }
  },
  PaymentDetails: {
    screen: PaymentDetails,
    navigationOptions: {
      title: 'Détails des paiements',
      // headerShown: false
    }
  },
})

const AppContainerDoctor = createAppContainer(StackNavigatorDoctor)

//Admin Navigation
const TabScreenAdmin = createMaterialTopTabNavigator(
  {
    PreviousAppointments: {
      screen: PreviousAppointmentsADMIN,
      navigationOptions: {
        title: 'Consultations passées',
        headerShown: false,
      }
    },
    NextAppointments: {
      screen: NextAppointmentsADMIN,
      navigationOptions: {
        title: 'Consultations à venir',
        headerShown: false,
      }
    },
  },
  {
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#333',
      inactiveTintColor: '#333',
      upperCaseLabel: false,
      style: {
        width: '100%',
        height: SCREEN_HEIGHT * 0.06,
        position: 'absolute',
        zIndex: 1,
        backgroundColor: '#ffffff',
        marginTop: SCREEN_HEIGHT * 0.15,
        borderTopWidth: 0,
        borderTopColor: '#ffffff',
        borderBottomWidth: 0,
        borderBottomColor: '#d3d7d7'
      },
      labelStyle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: SCREEN_HEIGHT * 0.015
      },
      indicatorStyle: {
        borderBottomColor: '#93eafe',
        borderBottomWidth: 3,
      },
    },
  }
)

const StackNavigatorAdmin = createStackNavigator({
  TabScreenAdmin: {
    screen: TabScreenAdmin,
    navigationOptions: {
      title: '',
      headerShown: false,
    },
  },
  Search: {
    screen: Search,
    navigationOptions: {
      title: 'Médecins',
    },
  },
  DoctorFile: {
    screen: DoctorFile,
    navigationOptions: {
      title: 'Fiche médecin'
    }
  },
  Profile: {
    screen: DoctorProfile,
    navigationOptions: {
      title: 'Profil du médecin',
      headerShown: false,
    }
  },
  Diplomes: {
    screen: Diplomes,
    navigationOptions: {
      title: 'Mes diplômes',
    }
  },
  Booking: {
    screen: Booking,
    navigationOptions: {
      title: 'Disponibilités',
    }
  },
  Symptomes: {
    screen: Symptomes,
    navigationOptions: {
      title: 'Symptômes',
    }
  },
  Upload: {
    screen: Upload,
    navigationOptions: {
      title: 'Documents'
    }
  },
  VideoPlayer: {
    screen: VideoPlayer,
    navigationOptions: {
      //title: 'Appel Video',
      headerShown: false
    }
  },
  BookingConfirmed: {
    screen: BookingConfirmed,
    navigationOptions: {
      title: 'Confirmation'
    }
  },
  DispoConfig: {
    screen: DispoConfig,
    navigationOptions: {
      title: 'Disponibilités du médecin'
    }
  },
  MyPatients: {
    screen: MyPatients,
    navigationOptions: {
      title: 'Patients'
    }
  },
  DateNaissance: {
    screen: DateNaissance,
    navigationOptions: {
      title: 'Date de naissance',
      headerShown: false
    }
  },
  Allergies: {
    screen: Allergies,
    navigationOptions: {
      title: 'Allergies',
      //headerShown: false
    }
  },
  Antecedants: {
    screen: Antecedants,
    navigationOptions: {
      title: 'Antécédants médicaux',
      //headerShown: false
    }
  },
  AppointmentDetails: {
    screen: AppointmentDetails,
    navigationOptions: {
      title: 'Détails de la consultation'
    }
  },
  MedicalFolder: {
    screen: MedicalFolder,
    navigationOptions: {
      title: 'Dossier médical',
      headerShown: false
    }
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      title: "Messagerie instantanée"
    }
  },
  SignUpRequests: {
    screen: SignUpRequests,
    navigationOptions: {
      title: "Demandes d'inscription"
    }
  },
  PaymentSummary: {
    screen: PaymentSummary,
    navigationOptions: {
      title: "Revenu mensuel"
    }
  },
  PaymentDetails: {
    screen: PaymentDetails,
    navigationOptions: {
      title: 'Détails des paiements',
    }
  }
})

const AppContainerAdmin = createAppContainer(StackNavigatorAdmin)






























/*{"authTime": "2020-04-12T20:50:55Z", "claims": {"aud": "urgencepharma-b8196", "auth_time": 1586724655, "email": "ttt@uuu.io", "email_verified": false, "exp": 1586728255, "firebase": {"identities": [Object], "sign_in_provider": "password"}, "iat": 1586724655, "iss": "https://securetoken.google.com/urgencepharma-b8196", "phone_number": "+212654620000", "sub": "iAtFku2nSgTjGUr7YO6nbyBS4SG2", "user_id": "iAtFku2nSgTjGUr7YO6nbyBS4SG2"}, "expirationTime": "2020-04-12T21:50:55Z", "issuedAtTime": "2020-04-12T20:50:55Z", "signInProvider": "password", "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImRjMGMzNWZlYjBjODIzYjQyNzdkZDBhYjIwNDQzMDY5ZGYzMGZkZWEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdXJnZW5jZXBoYXJtYS1iODE5NiIsImF1ZCI6InVyZ2VuY2VwaGFybWEtYjgxOTYiLCJhdXRoX3RpbWUiOjE1ODY3MjQ2NTUsInVzZXJfaWQiOiJpQXRGa3UyblNnVGpHVXI3WU82bmJ5QlM0U0cyIiwic3ViIjoiaUF0Rmt1Mm5TZ1RqR1VyN1lPNm5ieUJTNFNHMiIsImlhdCI6MTU4NjcyNDY1NSwiZXhwIjoxNTg2NzI4MjU1LCJlbWFpbCI6InR0dEB1dXUuaW8iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInBob25lX251bWJlciI6IisyMTI2NTQ2MjAwMDAiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7InBob25lIjpbIisyMTI2NTQ2MjAwMDAiXSwiZW1haWwiOlsidHR0QHV1dS5pbyJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.vsemymsOehgWlMLpozi6kSRCLPtXoAsRn6_RugudU464AyahjfQCXlvsefR7IBJ1hq7nfwRAY5ohfMIzcOMAD1LH7ckL4_iaKTkZib1fbb48g35g1iNPpOOTmUFVaheqG8oYO0aeLhQiK4O7JcZI1qQpCYyqAPLe6Kefp0l4VtWxiOOVzEwXM2Xkgi_F6y_euHGGeknJwJWIw01L_MtTHTHcLY3c1nGmySgllSZnTjVgAPKjwWYQ17ogrJtzJXCjS8RZ7Yjg-c90_5BhpORKTHV1Lg2TRjsbYKD0HhDJNpGxyAPYrYePwEvrgZmATdmDxRxfK6N0YbmP9xhQdjYGVg"}*/
/*{"authTime": "2020-04-12T20:56:34Z", "claims": {"aud": "urgencepharma-b8196", "auth_time": 1586724994, "exp": 1586728594, "firebase": {"identities": [Object], "sign_in_provider": "phone"}, "iat": 1586724994, "iss": "https://securetoken.google.com/urgencepharma-b8196", "phone_number": "+212654620000", "sub": "9YOq57PsD8RwE1jpR6fKnWvWytG2", "user_id": "9YOq57PsD8RwE1jpR6fKnWvWytG2"}, "expirationTime": "2020-04-12T21:56:34Z", "issuedAtTime": "2020-04-12T20:56:34Z", "signInProvider": "phone", "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImRjMGMzNWZlYjBjODIzYjQyNzdkZDBhYjIwNDQzMDY5ZGYzMGZkZWEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdXJnZW5jZXBoYXJtYS1iODE5NiIsImF1ZCI6InVyZ2VuY2VwaGFybWEtYjgxOTYiLCJhdXRoX3RpbWUiOjE1ODY3MjQ5OTQsInVzZXJfaWQiOiI5WU9xNTdQc0Q4UndFMWpwUjZmS25Xdld5dEcyIiwic3ViIjoiOVlPcTU3UHNEOFJ3RTFqcFI2ZktuV3ZXeXRHMiIsImlhdCI6MTU4NjcyNDk5NCwiZXhwIjoxNTg2NzI4NTk0LCJwaG9uZV9udW1iZXIiOiIrMjEyNjU0NjIwMDAwIiwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJwaG9uZSI6WyIrMjEyNjU0NjIwMDAwIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGhvbmUifX0.0zc4ZIKu6XAkLFFlz6Tjn_kvwWXoon_coQOxgqn-KY_TmT84KN1feGnBgZ8cIswv-CFDCeOc1JIUJo6zVyRJWHxSpCGWR4GLsEUmOQ3s8YliNEDj25OoCGCO6s-8goWomawR892uxriCjHz2PJhkrpSdzLAC6AevuXSKyx2twr0mjZyzEJUdbXgkh8qktp_8wUHPzSBTJQUq6DJCUx8FkY4Fejias85VQEV4gcazEyCHNTq5BnEhl3_M-Z07T19pLe803ImpdptRUE_6n0ud-PzYuUrYRpU3AVGRT69txOfMRyD2Gj25wBnnGkvjGkruvo374k0eJs9XjG9S7KUchw"}*/


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