import { createStackNavigator } from 'react-navigation-stack'

import { createAppContainer } from 'react-navigation';

//The app screens bellow
import Screens from '../screens/Welcome/Screens'
import SignUp1 from '../screens/SignUp/SignUp1'
import SignUp2 from '../screens/SignUp/SignUp2'
import SignUp3 from '../screens/SignUp/SignUp3'
import SignUp4 from '../screens/SignUp/SignUp4'
import SignUp5P from '../screens/SignUp/SignUp5P'
import SignUp5D from '../screens/SignUp/Doctor/SignUp5D'
import SignUp6 from '../screens/SignUp/Doctor/SignUp6'
import SignUp7 from '../screens/SignUp/Doctor/SignUp7'
import AddDoctorClaim from '../screens/SignUp/Doctor/AddDoctorClaim'
import SignUpPW from '../screens/SignUp/SignUpPW'
import PhoneAuth0 from '../screens/SignUp/PhoneAuth0'
import PhoneAuth from '../screens/Login/PhoneAuth'
import Login from '../screens/Login/Login'
import Search from '../screens/Booking/Search'
import Booking from '../screens/Booking/Booking'
/*import Symptomes from '../screens/Booking/Symptomes'
import Upload from '../screens/Booking/Upload'
import BookingConfirmed from '../screens/Booking/BookingConfirmed'*/
import Home from '../screens/Home/Home'
/*import PreviousAppointments from '../screens/User/PreviousAppointments'
import NextAppointments from '../screens/User/NextAppointments'
import MedicalFolder from '../screens/User/Patient/MedicalFolder'
import DispoConfig from '../screens/User/Doctor/DispoConfig'*/
import DoctorFile from '../screens/Booking/DoctorFile'
import RootComponent from '../screens/Root/Guest/RootComponent'
import Test1 from '../screens/Test1'
import Test2 from '../screens/Test2'
//import CustomClaims from '../screens/CustomClaims'

//import PhoneVerify  from '../screens/PhoneVerify'

const SearchStackNavigator = createStackNavigator({
  /*CustomClaims: {
    screen: CustomClaims,
    navigationOptions: {
      title: 'Add Claims',
      headerShown: false
    }
  },*/
  Test1: {
    screen: Test1,
    navigationOptions: {
      title: 'Accueil',
      headerShown: false
    }
  },
  RootComponent: {
    screen: RootComponent,
    navigationOptions: {
      title: 'Accueil',
      headerShown: false
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
  PhoneAuth0: {
    screen: PhoneAuth0,
    navigationOptions: {
      title: ''
    }
  },
  Test1: {
    screen: Test1,
    navigationOptions: {
      title: 'Connection'
    }
  },
  Test2: {
    screen: Test2,
    navigationOptions: {
      title: 'Connection'
    }
  },
  Screens: {
    screen: Screens,
    navigationOptions: {
      title: 'Screens'
    }
  },
  //The app screens
  Search: {
    screen: Search,
    navigationOptions: {
      title: '',
      headerShown: false
    }
  },
  DoctorFile: { 
    screen: DoctorFile,
    navigationOptions: {
      title: '',
      headerShown: false
    }
  }, 
  Booking: {
    screen: Booking,
    navigationOptions: {
      title: ''
    }
  },
 /* Symptomes: {
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
  },*/
  
  Home: {
    screen: Home,
    navigationOptions: {
      title: '',
      headerShown: false
    }
  },

 /* PreviousAppointments: {
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
  },*/
  
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
  SignUp5P: {
    screen: SignUp5P,
    navigationOptions: {
      title: 'Inscription'
    }
  },
  SignUp5D: {
    screen: SignUp5D,
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
  SignUp7: {
    screen: SignUp7,
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

export default createAppContainer(SearchStackNavigator)