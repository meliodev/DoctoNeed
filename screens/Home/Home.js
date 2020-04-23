//This is an example of React Native Tab
import React from 'react';

import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack'

import { Dimensions } from 'react-native'
import firebase from 'react-native-firebase'

import { createAppContainer } from 'react-navigation';
import Navigation from '../../Navigation/Navigation'

import HomeGuest from './Guest/HomeGuest';

import Search from '../../screens/Booking/Search'
import DoctorFile from '../../screens/Booking/DoctorFile'
import Booking from '../../screens/Booking/Booking'
import Symptomes from '../../screens/Booking/Symptomes'
import Upload from '../../screens/Booking/Upload'
import BookingConfirmed from '../../screens/Booking/BookingConfirmed'
import PreviousAppointmentsPAT from '../User/Patient/PreviousAppointments'
import NextAppointmentsPAT from '../User/Patient/NextAppointments'
import PreviousAppointmentsDOC from '../User/Doctor/PreviousAppointments'
import NextAppointmentsDOC from '../User/Doctor/NextAppointments'
import PreviousAppointmentsADMIN from '../User/Admin/PreviousAppointments'
import NextAppointmentsADMIN from '../User/Admin/NextAppointments'
import MedicalFolder from '../../screens/User/Patient/MedicalFolder'
import AppointmentDetails from '../../screens/User/AppointmentDetails'
import Chat from '../../screens/User/Patient/Chat'

//import DoctorProfile from '../../screens/User/Doctor/Profile'
import DispoConfig from '../../screens/User/Doctor/DispoConfig'
import MyPatients from '../../screens/User/MyPatients'
import AppointmentDetailsDOC from '../../screens/User/Doctor/AppointmentDetails'

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
      isAdmin: undefined,
      isDoctor: undefined,
      phoneNumber: ''
    }
  }

  UserAuthStatus = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ isLoggedIn: true })
        user.getIdTokenResult().then(idTokenResult => {
          if (idTokenResult.claims.doctor) {
            this.setState({ isDoctor: true })
          }
          else if (idTokenResult.claims.admin) {
            this.setState({ isAdmin: true })
          }

        })
      }
      else { this.setState({ isLoggedIn: false }) }
    })
  };

  componentWillMount() {
    this.UserAuthStatus()
    if (firebase.auth().currentUser) {
      firebase.auth().currentUser.getIdTokenResult().then(idTokenResult => {
        // --important: Check if the user has an Email/Password account ; Because it is possible that the user creates a Phone Number account and stops the signup process -> He will automatically log in with phone number (either the phone has an account (which is worst) or not)
        if (!idTokenResult.claims.email) {
          firebase.auth().signOut().then(() => this.setState({ isLoggedIn: false }))
        }
        //console.log(idTokenResult.claims.email)
      })
    }

  }



  render() {
    const isLoggedIn = this.state.isLoggedIn
    const isDoctor = this.state.isDoctor
    const isAdmin = this.state.isAdmin

    if (isLoggedIn) {
      if (isDoctor === undefined && isAdmin === undefined)
        return <AppContainerPatient />
      else if (isDoctor) {
        return <AppContainerDoctor />
      }
      else if (isAdmin) {
        return <AppContainerAdmin />
      }

    }

    else return <HomeGuest />
  }
}

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
      title: 'Recherche médecins',
      headerShown: false
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
      title: ''
    }
  },
  Symptomes: {
    screen: Symptomes,
    navigationOptions: {
      title: ''
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
  AppointmentDetails: {
    screen: AppointmentDetails,
    navigationOptions: {
      title: "Détails de la consultation"
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
 /* Search: {
    screen: Search,
    navigationOptions: {
      title: 'Recherche médecins',
      headerShown: false
    }
  },
  Booking: {
    screen: Booking,
    navigationOptions: {
      title: ''
    }
  },
  Symptomes: {
    screen: Symptomes,
    navigationOptions: {
      title: ''
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
  },*/
 
/*  Profile: {
    screen: DoctorProfile,
    navigationOptions: {
      title: 'Mon profil'
    }
  },*/
  DispoConfig: {
    screen: DispoConfig,
    navigationOptions: {
      title: 'Mes horaires'
    }
  },
  MyPatients: {
    screen: MyPatients,
    navigationOptions: {
      title: 'Mes patients'
    }
  },
  AppointmentDetails: {
    screen: AppointmentDetailsDOC,
    navigationOptions: {
      title: 'Détails de la consultation'
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
      title: 'Recherche médecins',
      headerShown: false
    }
  },
  Booking: {
    screen: Booking,
    navigationOptions: {
      title: ''
    }
  },
  Symptomes: {
    screen: Symptomes,
    navigationOptions: {
      title: ''
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
  AppointmentDetails: {
    screen: AppointmentDetails,
    navigationOptions: {
      title: 'Détails de la consultation'
    }
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      title: "Chat"
    }
  },
})

const AppContainerAdmin = createAppContainer(StackNavigatorAdmin)

/*{"authTime": "2020-04-12T20:50:55Z", "claims": {"aud": "urgencepharma-b8196", "auth_time": 1586724655, "email": "ttt@uuu.io", "email_verified": false, "exp": 1586728255, "firebase": {"identities": [Object], "sign_in_provider": "password"}, "iat": 1586724655, "iss": "https://securetoken.google.com/urgencepharma-b8196", "phone_number": "+212654620000", "sub": "iAtFku2nSgTjGUr7YO6nbyBS4SG2", "user_id": "iAtFku2nSgTjGUr7YO6nbyBS4SG2"}, "expirationTime": "2020-04-12T21:50:55Z", "issuedAtTime": "2020-04-12T20:50:55Z", "signInProvider": "password", "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImRjMGMzNWZlYjBjODIzYjQyNzdkZDBhYjIwNDQzMDY5ZGYzMGZkZWEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdXJnZW5jZXBoYXJtYS1iODE5NiIsImF1ZCI6InVyZ2VuY2VwaGFybWEtYjgxOTYiLCJhdXRoX3RpbWUiOjE1ODY3MjQ2NTUsInVzZXJfaWQiOiJpQXRGa3UyblNnVGpHVXI3WU82bmJ5QlM0U0cyIiwic3ViIjoiaUF0Rmt1Mm5TZ1RqR1VyN1lPNm5ieUJTNFNHMiIsImlhdCI6MTU4NjcyNDY1NSwiZXhwIjoxNTg2NzI4MjU1LCJlbWFpbCI6InR0dEB1dXUuaW8iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInBob25lX251bWJlciI6IisyMTI2NTQ2MjAwMDAiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7InBob25lIjpbIisyMTI2NTQ2MjAwMDAiXSwiZW1haWwiOlsidHR0QHV1dS5pbyJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.vsemymsOehgWlMLpozi6kSRCLPtXoAsRn6_RugudU464AyahjfQCXlvsefR7IBJ1hq7nfwRAY5ohfMIzcOMAD1LH7ckL4_iaKTkZib1fbb48g35g1iNPpOOTmUFVaheqG8oYO0aeLhQiK4O7JcZI1qQpCYyqAPLe6Kefp0l4VtWxiOOVzEwXM2Xkgi_F6y_euHGGeknJwJWIw01L_MtTHTHcLY3c1nGmySgllSZnTjVgAPKjwWYQ17ogrJtzJXCjS8RZ7Yjg-c90_5BhpORKTHV1Lg2TRjsbYKD0HhDJNpGxyAPYrYePwEvrgZmATdmDxRxfK6N0YbmP9xhQdjYGVg"}*/
/*{"authTime": "2020-04-12T20:56:34Z", "claims": {"aud": "urgencepharma-b8196", "auth_time": 1586724994, "exp": 1586728594, "firebase": {"identities": [Object], "sign_in_provider": "phone"}, "iat": 1586724994, "iss": "https://securetoken.google.com/urgencepharma-b8196", "phone_number": "+212654620000", "sub": "9YOq57PsD8RwE1jpR6fKnWvWytG2", "user_id": "9YOq57PsD8RwE1jpR6fKnWvWytG2"}, "expirationTime": "2020-04-12T21:56:34Z", "issuedAtTime": "2020-04-12T20:56:34Z", "signInProvider": "phone", "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImRjMGMzNWZlYjBjODIzYjQyNzdkZDBhYjIwNDQzMDY5ZGYzMGZkZWEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdXJnZW5jZXBoYXJtYS1iODE5NiIsImF1ZCI6InVyZ2VuY2VwaGFybWEtYjgxOTYiLCJhdXRoX3RpbWUiOjE1ODY3MjQ5OTQsInVzZXJfaWQiOiI5WU9xNTdQc0Q4UndFMWpwUjZmS25Xdld5dEcyIiwic3ViIjoiOVlPcTU3UHNEOFJ3RTFqcFI2ZktuV3ZXeXRHMiIsImlhdCI6MTU4NjcyNDk5NCwiZXhwIjoxNTg2NzI4NTk0LCJwaG9uZV9udW1iZXIiOiIrMjEyNjU0NjIwMDAwIiwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJwaG9uZSI6WyIrMjEyNjU0NjIwMDAwIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGhvbmUifX0.0zc4ZIKu6XAkLFFlz6Tjn_kvwWXoon_coQOxgqn-KY_TmT84KN1feGnBgZ8cIswv-CFDCeOc1JIUJo6zVyRJWHxSpCGWR4GLsEUmOQ3s8YliNEDj25OoCGCO6s-8goWomawR892uxriCjHz2PJhkrpSdzLAC6AevuXSKyx2twr0mjZyzEJUdbXgkh8qktp_8wUHPzSBTJQUq6DJCUx8FkY4Fejias85VQEV4gcazEyCHNTq5BnEhl3_M-Z07T19pLe803ImpdptRUE_6n0ud-PzYuUrYRpU3AVGRT69txOfMRyD2Gj25wBnnGkvjGkruvo374k0eJs9XjG9S7KUchw"}*/