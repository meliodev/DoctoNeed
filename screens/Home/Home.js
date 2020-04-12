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
import Booking from '../../screens/Booking/Booking'
import Symptomes from '../../screens/Booking/Symptomes'
import Upload from '../../screens/Booking/Upload'
import BookingConfirmed from '../../screens/Booking/BookingConfirmed'
import PreviousAppointments from '../../screens/User/PreviousAppointments'
import NextAppointments from '../../screens/User/NextAppointments'
import MedicalFolder from '../../screens/User/Patient/MedicalFolder'
import DispoConfig from '../../screens/User/Doctor/DispoConfig'

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default class Appointments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
      isAdmin: false,
      phoneNumber: ''
    }
  }

  UserAuthStatus = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ isLoggedIn: true })
      }
      else { this.setState({ isLoggedIn: false }) }
    })
  };

  componentWillMount() {
    this.UserAuthStatus()
    if (firebase.auth().currentUser) {
      firebase.auth().currentUser.getIdTokenResult().then(idTokenResult => {
        // this.setState({ isAdmin: idTokenResult.claims.admin })
        if (!idTokenResult.claims.email) {
          firebase.auth().signOut().then(() => this.setState({ isLoggedIn: false }))
        }
        //console.log(idTokenResult.claims.email)
      })
    }

  }



  render() {
    const isLoggedIn = this.state.isLoggedIn

    if (isLoggedIn) {
      return <AppContainer />
    }

    else return <HomeGuest />
  }
}

const TabScreen = createMaterialTopTabNavigator(
  {
    PreviousAppointments: {
      screen: PreviousAppointments,
      navigationOptions: {
        title: 'Consultations passées'
      }
    },
    NextAppointments: {
      screen: NextAppointments,
      navigationOptions: {
        title: 'Consultations à venir'
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
        marginTop: SCREEN_HEIGHT * 0.17,
        borderTopWidth: 0,
        borderTopColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#d3d7d7'
      },
      containerStyle: {

      },
      labelStyle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: SCREEN_HEIGHT * 0.015
      },
      indicatorStyle: {
        borderBottomColor: '#93eafe',
        borderBottomWidth: 2,
      },
    },
  }
);

const StackNavigator = createStackNavigator({
  TabScreen: {
    screen: TabScreen,
    navigationOptions: {
      title: 'Accueil',
      headerShown: false

    }
  },
  MedicalFolder: {
    screen: MedicalFolder,
    navigationOptions: {
      title: 'Mon dossier médical'
    }
  },
  Search: {
    screen: Search,
    navigationOptions: {
      title: 'Recherche médecins'
    }
  },
  Booking: {
    screen: Booking,
    navigationOptions: {
      title: 'Booking'
    }
  },
  Symptomes: {
    screen: Symptomes,
    navigationOptions: {
      title: 'Symptomes'
    }
  },
  Upload: {
    screen: Upload,
    navigationOptions: {
      title: 'Upload'
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
      title: 'Mon dossier médical'
    }
  },
  DispoConfig: {
    screen: DispoConfig,
    navigationOptions: {
      title: 'Mes horaires'
    }
  },
})

const AppContainer = createAppContainer(StackNavigator)




/*{"authTime": "2020-04-12T20:50:55Z", "claims": {"aud": "urgencepharma-b8196", "auth_time": 1586724655, "email": "ttt@uuu.io", "email_verified": false, "exp": 1586728255, "firebase": {"identities": [Object], "sign_in_provider": "password"}, "iat": 1586724655, "iss": "https://securetoken.google.com/urgencepharma-b8196", "phone_number": "+212654620000", "sub": "iAtFku2nSgTjGUr7YO6nbyBS4SG2", "user_id": "iAtFku2nSgTjGUr7YO6nbyBS4SG2"}, "expirationTime": "2020-04-12T21:50:55Z", "issuedAtTime": "2020-04-12T20:50:55Z", "signInProvider": "password", "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImRjMGMzNWZlYjBjODIzYjQyNzdkZDBhYjIwNDQzMDY5ZGYzMGZkZWEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdXJnZW5jZXBoYXJtYS1iODE5NiIsImF1ZCI6InVyZ2VuY2VwaGFybWEtYjgxOTYiLCJhdXRoX3RpbWUiOjE1ODY3MjQ2NTUsInVzZXJfaWQiOiJpQXRGa3UyblNnVGpHVXI3WU82bmJ5QlM0U0cyIiwic3ViIjoiaUF0Rmt1Mm5TZ1RqR1VyN1lPNm5ieUJTNFNHMiIsImlhdCI6MTU4NjcyNDY1NSwiZXhwIjoxNTg2NzI4MjU1LCJlbWFpbCI6InR0dEB1dXUuaW8iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInBob25lX251bWJlciI6IisyMTI2NTQ2MjAwMDAiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7InBob25lIjpbIisyMTI2NTQ2MjAwMDAiXSwiZW1haWwiOlsidHR0QHV1dS5pbyJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.vsemymsOehgWlMLpozi6kSRCLPtXoAsRn6_RugudU464AyahjfQCXlvsefR7IBJ1hq7nfwRAY5ohfMIzcOMAD1LH7ckL4_iaKTkZib1fbb48g35g1iNPpOOTmUFVaheqG8oYO0aeLhQiK4O7JcZI1qQpCYyqAPLe6Kefp0l4VtWxiOOVzEwXM2Xkgi_F6y_euHGGeknJwJWIw01L_MtTHTHcLY3c1nGmySgllSZnTjVgAPKjwWYQ17ogrJtzJXCjS8RZ7Yjg-c90_5BhpORKTHV1Lg2TRjsbYKD0HhDJNpGxyAPYrYePwEvrgZmATdmDxRxfK6N0YbmP9xhQdjYGVg"}*/
/*{"authTime": "2020-04-12T20:56:34Z", "claims": {"aud": "urgencepharma-b8196", "auth_time": 1586724994, "exp": 1586728594, "firebase": {"identities": [Object], "sign_in_provider": "phone"}, "iat": 1586724994, "iss": "https://securetoken.google.com/urgencepharma-b8196", "phone_number": "+212654620000", "sub": "9YOq57PsD8RwE1jpR6fKnWvWytG2", "user_id": "9YOq57PsD8RwE1jpR6fKnWvWytG2"}, "expirationTime": "2020-04-12T21:56:34Z", "issuedAtTime": "2020-04-12T20:56:34Z", "signInProvider": "phone", "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImRjMGMzNWZlYjBjODIzYjQyNzdkZDBhYjIwNDQzMDY5ZGYzMGZkZWEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdXJnZW5jZXBoYXJtYS1iODE5NiIsImF1ZCI6InVyZ2VuY2VwaGFybWEtYjgxOTYiLCJhdXRoX3RpbWUiOjE1ODY3MjQ5OTQsInVzZXJfaWQiOiI5WU9xNTdQc0Q4UndFMWpwUjZmS25Xdld5dEcyIiwic3ViIjoiOVlPcTU3UHNEOFJ3RTFqcFI2ZktuV3ZXeXRHMiIsImlhdCI6MTU4NjcyNDk5NCwiZXhwIjoxNTg2NzI4NTk0LCJwaG9uZV9udW1iZXIiOiIrMjEyNjU0NjIwMDAwIiwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJwaG9uZSI6WyIrMjEyNjU0NjIwMDAwIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGhvbmUifX0.0zc4ZIKu6XAkLFFlz6Tjn_kvwWXoon_coQOxgqn-KY_TmT84KN1feGnBgZ8cIswv-CFDCeOc1JIUJo6zVyRJWHxSpCGWR4GLsEUmOQ3s8YliNEDj25OoCGCO6s-8goWomawR892uxriCjHz2PJhkrpSdzLAC6AevuXSKyx2twr0mjZyzEJUdbXgkh8qktp_8wUHPzSBTJQUq6DJCUx8FkY4Fejias85VQEV4gcazEyCHNTq5BnEhl3_M-Z07T19pLe803ImpdptRUE_6n0ud-PzYuUrYRpU3AVGRT69txOfMRyD2Gj25wBnnGkvjGkruvo374k0eJs9XjG9S7KUchw"}*/