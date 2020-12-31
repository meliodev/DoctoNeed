//This is an example of React Native Tab
import React from 'react';

import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack'

import NavigationService from '../../Navigation/NavigationService'

import { Dimensions, AsyncStorage, Alert } from 'react-native'

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

import PaymentSummary from '../../screens/User/PaymentSummary'
import PaymentDetails from '../../screens/User/PaymentDetails'

import DoctorProfile from '../../screens/User/Doctor/Profile'
import Diplomes from '../../screens/User/Doctor/Diplomes'
import DispoConfig from '../../screens/User/Doctor/DispoConfig'
import MyPatients from '../../screens/User/MyPatients'

const SCREEN_HEIGHT = Dimensions.get("window").height;

let CallStarting = false

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.hasEmailProvider = false

    this.createNotificationListeners = this.createNotificationListeners.bind(this);

    //Signout user in the following cases:
    if (firebase.auth().currentUser !== null) {
      // 1. check if user has email provider (if not sign him out)
      firebase.auth().currentUser.providerData.forEach((provider) => {
        if (provider.providerId === 'password')
          this.hasEmailProvider = true
      })

      if (this.hasEmailProvider === false) {
        firebase.auth().signOut()
        console.log('Sign out user: ATTEMPTED TO CONNECT WITH PHONE PROVIDER.')
      }

      // 2. check if user's account is disabled (if yes sign him out). Maybe use onCall and check response on SignUpPW.. if response = true, sign him out before going 'Home'
      REFS.signuprequests.doc(firebase.auth().currentUser.uid).get().then((doc) => {
        if (doc.data().disabled === true) {
          firebase.auth().signOut()
          console.log('Sign out user: ATTEMPTED TO CONNECT WITH DISABLED ACCOUNT.')
        }
      })
    }

    this.state = {
      isLoggedIn: false,
      isAdmin: undefined,
      isDoctor: undefined,
      isPatient: false,
      isAuthenticating: false,
      phoneNumber: ''
    }
  }


  async componentDidMount() {
    // let fcmToken = await AsyncStorage.removeItem('fcmToken').then(() => console.info('removed !!!!!!!!!!'));
    this.getClaims()

    if (firebase.auth().currentUser) {
      firebase.auth().currentUser.getIdTokenResult().then(idTokenResult => {
        // !important: Check if the user has an Email/Password account ; Because it is possible that the user creates a Phone Number account and stops the signup process -> He will automatically log in with phone number (either the phone has an account (which is worst) or not)
        if (!idTokenResult.claims.email) {
          firebase.auth().signOut().then(() => this.setState({ isLoggedIn: false }))
        }
      })
    }

    this.checkPermission();
    this.createNotificationListeners();
  }

  //Handle role access
  getClaims() {
    firebase.auth().onAuthStateChanged(user => {

      if (user) {
        this.setState({ isLoggedIn: true })

        user.getIdTokenResult().then(idTokenResult => {
          if (idTokenResult.claims.admin) {
            this.setState({ isAdmin: true })
            this.setRole('isAdmin')
          }

          else if (idTokenResult.claims.doctor) {
            this.setState({ isDoctor: true })
            this.setRole('isDoctor')
          }

          else if (typeof (idTokenResult.claims.admin) === 'undefined' && typeof (idTokenResult.claims.doctor) === 'undefined') {
            this.setState({ isPatient: true })
            this.setRole('isPatient')
          }

        })
      }
      else {
        this.setState({ isLoggedIn: false, isAdmin: undefined, isDoctor: undefined, isPatient: false })
        this.setRole('')
      }
    })
  }

  setRole(role) {
    const action = { type: "ROLE", value: role }
    this.props.dispatch(action)
  }

  //FCM Notifications functions
  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
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
    if (this.state.isLoggedIn) {
      let fcmToken = await AsyncStorage.getItem('fcmToken');
      // console.log('async storage fcmToken: ' + this.props.fcmToken.fcmToken)

      if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        // console.log('fcm token from firebase messaging: ' + this.props.fcmToken)

        //POST Token to Firestore
        const token = {
          fcmToken: fcmToken,
          active: true,
          createdAt: moment(new Date()).format()
        }

        //FOR ADMINS
        if (this.props.role === 'isAdmin') {
          //Set active to false for other User's devices
          await REFS.admins.doc(firebase.auth().currentUser.uid).collection('Devices').get().then((querySnapshot) => {
            querySnapshot.forEach(doc => {
              REFS.admins.doc(firebase.auth().currentUser.uid).collection('Devices').doc(doc.id).update({ active: false })
            })
          })

          REFS.admins.doc(firebase.auth().currentUser.uid).collection('Devices').add(token)
            .then(() => console.log('fcm token added to admins devices list'))
            .catch((err) => console.error(err))
        }

        //FOR DOCTORS
        else if (this.props.role === 'isDoctor') {
          //Set active to false for other User's devices
          await REFS.doctors.doc(firebase.auth().currentUser.uid).collection('Devices').get().then((querySnapshot) => {
            querySnapshot.forEach(doc => {
              REFS.doctors.doc(firebase.auth().currentUser.uid).collection('Devices').doc(doc.id).update({ active: false })
            })
          })

          //Add new token
          REFS.doctors.doc(firebase.auth().currentUser.uid).collection('Devices').add(token)
            .then(() => console.log('fcm token added to doctors devices list'))
            .catch((err) => console.error(err))
        }


        //FOR PATIENTS
        else if (this.props.role === 'isPatient') {
          //Set active to false for other User's devices
          await REFS.users.doc(firebase.auth().currentUser.uid).collection('Devices').get().then((querySnapshot) => {
            querySnapshot.forEach(doc => {
              REFS.users.doc(firebase.auth().currentUser.uid).collection('Devices').doc(doc.id).update({ active: false })
            })
          })

          REFS.users.doc(firebase.auth().currentUser.uid).collection('Devices').add(token)
            .then(() => console.log('fcm token added to patients devices list'))
            .catch((err) => console.error(err))
        }

        //Add new fcmToken to AsyncStorage
        if (fcmToken) {
          await AsyncStorage.setItem('fcmToken', fcmToken);
        }
      }

      setReduxState('FCMTOKEN', fcmToken, this)
      //console.log(this.props.fcmToken)
    }
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.unsubscribeFromNotificationListener = firebase.notifications().onNotification(notification => {

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
            //sound: 'ringtone',
            //show_in_foreground: true,
            show_in_background: true,
          }
        )
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          .setData(notification.data)
          .setSound(channel.sound)
          //.setSound(notification.data.sound ? notification.data.sound : "default")
          //.android.setSmallIcon("notification_icon_black")
          .android.setChannelId("channelId")
          .android.setAutoCancel(true)
          .android.setVibrate(3000)
          .android.setColor("#93eafe") // you can set a color here
          .android.setGroup(notification.notificationId)
          .android.setPriority(firebase.notifications.Android.Priority.High);

        firebase.notifications().displayNotification(localNotification)
          .catch(err => console.error(err));

        const data = notification.data
        NavigationService.navigate('Video', { appId: data.roomId })
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

        firebase
          .notifications()
          .displayNotification(localNotification)
          .catch(err => console.error(err));
      }

    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      console.log(notificationOpen);
      const { action, notification } = notificationOpen;
      firebase.notifications().removeDeliveredNotification(notification.notificationId);

      const data = notification.data
      NavigationService.navigate('Video', { appId: data.roomId })
    })

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      console.log(notificationOpen)
      
      const data = notification.data
      NavigationService.navigate('Video', { appId: data.roomId })
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });

    // listens for changes to the user's notification token and updates database upon change
    this.notificationTokenListener = firebase.messaging().onTokenRefresh(notificationToken => {
      console.log('notificationTokenListener');
      console.log(notificationToken);

      return REFS.users.doc(firebase.auth().currentUser.uid).update({ pushToken: notificationToken, updatedAt: ts })
        .then(ref => console.log('savePushToken success'))
        .catch(e => console.error(e))
    })
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

  //Remove listeners allocated in createNotificationListeners()
  componentWillUnmount() {
    // this.notificationListener();
    this.unsubscribeFromNotificationListener()
    this.notificationOpenedListener();
  }


  render() {
    const isLoggedIn = this.state.isLoggedIn
    const isDoctor = this.state.isDoctor
    const isAdmin = this.state.isAdmin

    if (isLoggedIn) {
      if (typeof (this.state.isAdmin) === 'undefined' && typeof (this.state.isDoctor) === 'undefined' && this.state.isPatient === false)
        return null

      else if (this.state.isAdmin === true)
        return <AppContainerAdmin />

      else if (this.state.isDoctor === true)
        return <AppContainerDoctor />

      else if (typeof (this.state.isAdmin) === 'undefined' && typeof (this.state.isDoctor) === 'undefined' && this.state.isPatient === true)
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
);

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
      title: '',
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
      title: '',
    }
  },
  Symptomes: {
    screen: Symptomes,
    navigationOptions: {
      title: '',
    }
  },
  Video: {
    screen: Video,
    navigationOptions: {
      title: 'Appel Video',
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
      title: ''
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
      title: 'Votre date de naissance',
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
      title: "",
      // headerStyle: {
      //   elevation: null
      // }
    }
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      title: "Chat"
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
);


const StackNavigatorDoctor = createStackNavigator({
  TabScreenDoctor: {
    screen: TabScreenDoctor,
    navigationOptions: {
      title: 'Accueil',
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
      title: 'Mes horaires',
      headerShown: false,
    }
  },
  MyPatients: {
    screen: MyPatients,
    navigationOptions: {
      title: 'Mes patients'
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
      title: 'Mon dossier médical',
      headerShown: false
    }
  },
  Video: {
    screen: Video,
    navigationOptions: {
      title: 'Appel Video',
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
      headerShown: false
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
);


const StackNavigatorAdmin = createStackNavigator({
  TabScreenAdmin: {
    screen: TabScreenAdmin,
    navigationOptions: {
      title: 'Accueil',
      headerShown: false,
    },
  },
  Search: {
    screen: Search,
    navigationOptions: {
      title: '',
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
  Booking: {
    screen: Booking,
    navigationOptions: {
      title: '',
    }
  },
  Symptomes: {
    screen: Symptomes,
    navigationOptions: {
      title: '',
    }
  },
  Upload: {
    screen: Upload,
    navigationOptions: {
      title: ''
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
      title: 'Mes horaires'
    }
  },
  MyPatients: {
    screen: MyPatients,
    navigationOptions: {
      title: 'Les patients'
    }
  },
  DateNaissance: {
    screen: DateNaissance,
    navigationOptions: {
      title: 'Accueil',
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
      title: 'Mon dossier médical',
      headerShown: false
    }
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      title: "Chat"
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
      title: "Revenu quotidien"
    }
  },


})

const AppContainerAdmin = createAppContainer(StackNavigatorAdmin)

/*{"authTime": "2020-04-12T20:50:55Z", "claims": {"aud": "urgencepharma-b8196", "auth_time": 1586724655, "email": "ttt@uuu.io", "email_verified": false, "exp": 1586728255, "firebase": {"identities": [Object], "sign_in_provider": "password"}, "iat": 1586724655, "iss": "https://securetoken.google.com/urgencepharma-b8196", "phone_number": "+212654620000", "sub": "iAtFku2nSgTjGUr7YO6nbyBS4SG2", "user_id": "iAtFku2nSgTjGUr7YO6nbyBS4SG2"}, "expirationTime": "2020-04-12T21:50:55Z", "issuedAtTime": "2020-04-12T20:50:55Z", "signInProvider": "password", "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImRjMGMzNWZlYjBjODIzYjQyNzdkZDBhYjIwNDQzMDY5ZGYzMGZkZWEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdXJnZW5jZXBoYXJtYS1iODE5NiIsImF1ZCI6InVyZ2VuY2VwaGFybWEtYjgxOTYiLCJhdXRoX3RpbWUiOjE1ODY3MjQ2NTUsInVzZXJfaWQiOiJpQXRGa3UyblNnVGpHVXI3WU82bmJ5QlM0U0cyIiwic3ViIjoiaUF0Rmt1Mm5TZ1RqR1VyN1lPNm5ieUJTNFNHMiIsImlhdCI6MTU4NjcyNDY1NSwiZXhwIjoxNTg2NzI4MjU1LCJlbWFpbCI6InR0dEB1dXUuaW8iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInBob25lX251bWJlciI6IisyMTI2NTQ2MjAwMDAiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7InBob25lIjpbIisyMTI2NTQ2MjAwMDAiXSwiZW1haWwiOlsidHR0QHV1dS5pbyJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.vsemymsOehgWlMLpozi6kSRCLPtXoAsRn6_RugudU464AyahjfQCXlvsefR7IBJ1hq7nfwRAY5ohfMIzcOMAD1LH7ckL4_iaKTkZib1fbb48g35g1iNPpOOTmUFVaheqG8oYO0aeLhQiK4O7JcZI1qQpCYyqAPLe6Kefp0l4VtWxiOOVzEwXM2Xkgi_F6y_euHGGeknJwJWIw01L_MtTHTHcLY3c1nGmySgllSZnTjVgAPKjwWYQ17ogrJtzJXCjS8RZ7Yjg-c90_5BhpORKTHV1Lg2TRjsbYKD0HhDJNpGxyAPYrYePwEvrgZmATdmDxRxfK6N0YbmP9xhQdjYGVg"}*/
/*{"authTime": "2020-04-12T20:56:34Z", "claims": {"aud": "urgencepharma-b8196", "auth_time": 1586724994, "exp": 1586728594, "firebase": {"identities": [Object], "sign_in_provider": "phone"}, "iat": 1586724994, "iss": "https://securetoken.google.com/urgencepharma-b8196", "phone_number": "+212654620000", "sub": "9YOq57PsD8RwE1jpR6fKnWvWytG2", "user_id": "9YOq57PsD8RwE1jpR6fKnWvWytG2"}, "expirationTime": "2020-04-12T21:56:34Z", "issuedAtTime": "2020-04-12T20:56:34Z", "signInProvider": "phone", "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImRjMGMzNWZlYjBjODIzYjQyNzdkZDBhYjIwNDQzMDY5ZGYzMGZkZWEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdXJnZW5jZXBoYXJtYS1iODE5NiIsImF1ZCI6InVyZ2VuY2VwaGFybWEtYjgxOTYiLCJhdXRoX3RpbWUiOjE1ODY3MjQ5OTQsInVzZXJfaWQiOiI5WU9xNTdQc0Q4UndFMWpwUjZmS25Xdld5dEcyIiwic3ViIjoiOVlPcTU3UHNEOFJ3RTFqcFI2ZktuV3ZXeXRHMiIsImlhdCI6MTU4NjcyNDk5NCwiZXhwIjoxNTg2NzI4NTk0LCJwaG9uZV9udW1iZXIiOiIrMjEyNjU0NjIwMDAwIiwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJwaG9uZSI6WyIrMjEyNjU0NjIwMDAwIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGhvbmUifX0.0zc4ZIKu6XAkLFFlz6Tjn_kvwWXoon_coQOxgqn-KY_TmT84KN1feGnBgZ8cIswv-CFDCeOc1JIUJo6zVyRJWHxSpCGWR4GLsEUmOQ3s8YliNEDj25OoCGCO6s-8goWomawR892uxriCjHz2PJhkrpSdzLAC6AevuXSKyx2twr0mjZyzEJUdbXgkh8qktp_8wUHPzSBTJQUq6DJCUx8FkY4Fejias85VQEV4gcazEyCHNTq5BnEhl3_M-Z07T19pLe803ImpdptRUE_6n0ud-PzYuUrYRpU3AVGRT69txOfMRyD2Gj25wBnnGkvjGkruvo374k0eJs9XjG9S7KUchw"}*/
