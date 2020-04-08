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
                /* user.getIdTokenResult().then(idTokenResult => {
                   this.setState({ isAdmin: idTokenResult.claims.admin })
                 })*/
            }
            else { this.setState({ isLoggedIn: false }) }
        })
    };

    componentWillMount() {
        this.UserAuthStatus()
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
