import { createStackNavigator } from 'react-navigation-stack'
import {createAppContainer} from 'react-navigation';

//Firestore test screens
//import SignUp from '../screens/Trash/SignUp'
//import Login2 from '../screens/Trash/Login2'
//import Login3 from '../screens/Login3'
//import Main from '../screens/Trash/Main'
//other tests screens
/*import Test1 from '../screens/Test1'
import Test2 from '../screens/Test2'
import Test3 from '../screens/Test3'
import Test4 from '../screens/Test4'
import Test5 from '../screens/Test5'
import Loading from '../screens/Loading'*/this
//The app screens bellow
import Screens from '../screens/Screens'
import LandingScreen from '../screens/LandingScreen'
import SignUp1 from '../screens/SignUp1'
import SignUp2 from '../screens/SignUp2'
import SignUp3 from '../screens/SignUp3'
import SignUp4 from '../screens/SignUp4'
import SignUp5 from '../screens/SignUp5'
import SignUp6 from '../screens/SignUp6'
import PhoneAuth from '../screens/PhoneAuth'
import Login from '../screens/Login'
import Home from '../screens/Home'
import Search from '../screens/Search'
import Booking from '../screens/Booking'
import Symptomes from '../screens/Symptomes'
import Upload from '../screens/Upload'
import BookingConfirmed from '../screens/BookingConfirmed'
import PreviousAppointments from '../screens/PreviousAppointments'
import NextAppointments from '../screens/NextAppointments'
import ProfileSettings from '../screens/ProfileSettings'
import RootComponent  from '../screens/RootComponent'
//import PhoneVerify  from '../screens/PhoneVerify'

const SearchStackNavigator = createStackNavigator({
 RootComponent: { 
    screen: RootComponent,
    navigationOptions: {
      title: 'Accueil'
    }
  }, 
  Login: { 
    screen: Login,
    navigationOptions: {
      title: 'Connection'
    } 
  }, 
  PhoneAuth: { 
    screen: PhoneAuth,
    navigationOptions: {
      title: 'Connection'
    } 
  }, 
  /*Login3: { 
    screen: Login3,
    navigationOptions: {
      title: 'Connection'
    } 
  }, */
  /*PhoneVerify: { 
    screen: PhoneVerify,
    navigationOptions: {
      title: 'PhoneVerify'
    }
  }, */
  Screens: { 
    screen: Screens,
    navigationOptions: {
      title: 'Screens'
    }
  }, 
  
  //The app screens
  LandingScreen: { 
    screen: LandingScreen,
    navigationOptions: {
      title: 'Accueil',
      headerLeft: null
    }
  }, 
  Search: { 
    screen: Search,
    navigationOptions: {
      title: 'Rechercher'
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
  PreviousAppointments: { 
    screen: PreviousAppointments,
    navigationOptions: {
      title: 'Mes Consultations Passées'
    } 
  }, 
  NextAppointments: { 
    screen: NextAppointments,
    navigationOptions: {
      title: 'Mes Consultations à Venir'
    } 
  }, 
  ProfileSettings: { 
    screen: ProfileSettings,
    navigationOptions: {
      title: 'Profile'
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

  Home: { 
    screen: Home,
    navigationOptions: {
      title: 'Home'
    }
    }, 
    // Test screens 
   /* Test1: { 
      screen: Test1,
      navigationOptions: {
        title: 'Test1'
      }
    },  
    Test2: { 
    screen: Test2,
    navigationOptions: {
      title: 'Test2'
    }
    },    
    Test3: { 
      screen: Test3,
      navigationOptions: {
        title: 'Test3'
      }
  },  
  Test4: { 
    screen: Test4,
    navigationOptions: {
      title: 'Test4'
    }
  },
  Test5: { 
    screen: Test5,
    navigationOptions: {
      title: 'Test5'
    }
  }, 
  Loading: { 
  screen: Loading,
  navigationOptions: {
    title: 'Loading'
  }
},*/
  //Firestore test screens
  /*Login2: { 
    screen: Login2,
    navigationOptions: {
      title: 'Login2'
    }
  }, */
  /*SignUp: { 
  screen: SignUp,
  navigationOptions: {
    title: 'SignUp'
  }
}, */
/*Main: { 
screen: Main,
navigationOptions: {
  title: 'Main'
}
},*/ 
})

export default createAppContainer(SearchStackNavigator)