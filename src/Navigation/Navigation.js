import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation';
import React, { Component } from 'react'

//The app screens bellow
import Screens from '../screens/Welcome/Screens'
import SignUp1 from '../screens/SignUp/SignUp1'
import SignUp2 from '../screens/SignUp/SignUp2'
import SignUp3 from '../screens/SignUp/SignUp3'
import SignUp4 from '../screens/SignUp/SignUp4'
import SignUp5 from '../screens/SignUp/Doctor/SignUp5'
import SignUp6 from '../screens/SignUp/Doctor/SignUp6'
import AddDoctorClaim from '../screens/SignUp/Doctor/AddDoctorClaim'
import SignUpPW from '../screens/SignUp/SignUpPW'
import PhoneAuth from '../screens/SignUp/PhoneAuth'
import SignUpRequestFinished from '../screens/SignUp/Doctor/SignUpRequestFinished'
import SignUpRequests from '../screens/User/Admin/SignUpRequests'

import Login from '../screens/Authentication/Login'
import ForgotPassword from '../screens/Authentication/ForgotPassword'

import Search from '../screens/Booking/Search'
import Booking from '../screens/Booking/Booking'
import Upload from '../screens/Booking/Upload'

// import Home from '../screens/Home/Home'
// import Home2 from '../screens/Home/Home2'

import DoctorFile from '../screens/Booking/DoctorFile'

import DispoConfig from '../screens/User/Doctor/DispoConfig'
import MedicalFolder from '../screens/User/Patient/MedicalFolder'
import Profile from '../screens/User/Doctor/Profile'

import Video from '../screens/VideoCall/Video'
import ApiContainer from '../screens/ApiContainer'

import NavigationService from './NavigationService'

import RootComponent from '../screens/Root/RootComponent'

const SearchStackNavigator = createStackNavigator({
  RootComponent: {
    screen: RootComponent,
    navigationOptions: {
      title: 'Accueil',
      headerShown: false
    }
  },
  MedicalFolder: {
    screen: MedicalFolder,
    navigationOptions: {
      title: 'Mon dossier médical', 
      headerShown: false
    }
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      title: 'Mon profil', 
      headerShown: false,
    }
  },
  DispoConfig:{
    screen: DispoConfig,
    navigationOptions:{
      title: 'Mes horaires',
      headerShown: false
    }
  },
  DoctorFile: { 
    screen: DoctorFile,
    navigationOptions: {
      title: 'Fiche médecin',
      headerShown: false
    }
  }, 
  Login: {
    screen: Login,
    navigationOptions: {
      title: '',
      // headerStyle: {
      //   elevation: null
      // }
    }
  },
  ForgotPassword: {
    screen: ForgotPassword,
    navigationOptions: {
      title: '',
      // headerStyle: {
      //   elevation: null
      // }
    }
  },
  PhoneAuth: {
    screen: PhoneAuth,
    navigationOptions: {
      title: 'Authentification SMS'
    }
  },
  SignUpRequestFinished: { //task: disable go back
    screen: SignUpRequestFinished,
    navigationOptions: {
      title: 'Bienvenue' 
    }
  },
  SignUpRequests: {
    screen: SignUpRequests,
    navigationOptions: {
      title: "Demandes d'inscription",
    }
  },
  Screens: {
    screen: Screens,
    navigationOptions: {
      title: ''
    }
  },
  //The app screens
  Search: {
    screen: Search,
    navigationOptions: {
      title: 'Médecins disponibles',
    }
  },
  Booking: {
    screen: Booking,
    navigationOptions: {
      title: 'Créneaux horaires'
    }
  },
  Video: {
    screen: Video,
    navigationOptions: {
      title: 'Téléconsultation'
    }
  },  
  Home: {
    screen: Home,
    navigationOptions: {
      title: '',
      headerShown: false
    }
  },
  Home2: {
    screen: Home2,
    navigationOptions: {
      title: '',
      headerShown: false
    }
  },
  SignUp1: {
    screen: SignUp1,
    navigationOptions: {
      title: 'Inscription'
    }
  },
  SignUp2: {
    screen: SignUp2,
    navigationOptions: {
      title: 'Inscription'
    }
  },
  SignUp3: {
    screen: SignUp3,
    navigationOptions: {
      title: 'Inscription'
    }
  },
  SignUp4: {
    screen: SignUp4,
    navigationOptions: {
      title: 'Inscription'
    }
  },
  SignUp5: {
    screen: SignUp5,
    navigationOptions: {
      title: 'Inscription'
    }
  },
  SignUp6: {
    screen: SignUp6,
    navigationOptions: {
      title: 'Inscription'
    }
  },
  SignUpPW: {
    screen: SignUpPW,
    navigationOptions: {
      title: 'Inscription'
    }
  },
  AddDoctorClaim: {
    screen: AddDoctorClaim,
    navigationOptions: {
      title: 'Inscription'
    }
  },
})

const AppContainer = createAppContainer(SearchStackNavigator);

const App = (() => {
  return (
    <AppContainer
      ref={navigatorRef => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }} />
  );
});

export default App;

//export default createAppContainer(SearchStackNavigator)