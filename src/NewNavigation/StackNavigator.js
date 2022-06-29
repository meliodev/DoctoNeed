import * as React from 'react';

import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import * as theme from '../core/theme';
import {Text} from 'react-native';

import {constants, isTablet} from '../core/constants';
import {createBottomTabNavigator} from 'react-navigation-tabs';

//Import screens
import Screens from '../screens/Welcome/Screens';
// import SignUp1 from '../screens/SignUp/SignUp1'
// import SignUp2 from '../screens/SignUp/SignUp2'
// import SignUp3 from '../screens/SignUp/SignUp3'
// import SignUp4 from '../screens/SignUp/SignUp4'
// import SignUp5 from '../screens/SignUp/Doctor/SignUp5'
// import SignUp6 from '../screens/SignUp/Doctor/SignUp6'
import SignUp from '../screens/SignUp/SignUp';
import PhoneAuth from '../screens/SignUp/PhoneAuth';
import AddDoctorClaim from '../screens/SignUp/Doctor/AddDoctorClaim';
import SignUpPW from '../screens/SignUp/SignUpPW';
import SignUpRequestFinished from '../screens/SignUp/Doctor/SignUpRequestFinished';
import SignUpRequests from '../screens/User/Admin/SignUpRequests';

import Login from '../screens/Authentication/Login';
import ForgotPassword from '../screens/Authentication/ForgotPassword';

import Search from '../screens/Booking/Search';
import Booking from '../screens/Booking/Booking';
import Upload from '../screens/Booking/Upload';

import HomeGuest from '../screens/Home/Guest/HomeGuest';
import NewHome from '../screens/Home/NewHome';
//import Home from '../screens/Home/Home';
// import Home2 from '../screens/Home/Home2'

import DoctorFile from '../screens/Booking/DoctorFile';

import DispoConfig from '../screens/User/Doctor/DispoConfig';
import MedicalFolder from '../screens/User/Patient/MedicalFolder';
import Profile from '../screens/User/Doctor/Profile';

import Video from '../screens/VideoCall/Video';
import ApiContainer from '../screens/ApiContainer';

import RootComponent from '../screens/Root/RootComponent';

//Icons: No Icon
const hideHeader = () => ({
  headerShown: false,
});

//USER APP
const appScreens = {
  SignUpRequestFinished: {
    screen: SignUpRequestFinished,
    navigationOptions: hideHeader,
  },
  SignUpRequests: {
    screen: SignUpRequests,
    navigationOptions: hideHeader,
  },
  Search: {
    screen: Search,
    navigationOptions: hideHeader,
  },
  Booking: {
    screen: Booking,
    navigationOptions: hideHeader,
  },
  Upload: {
    screen: Upload,
    navigationOptions: hideHeader,
  },
  NewHome: {
    screen: NewHome,
    navigationOptions: hideHeader,
  },
  DoctorFile: {
    screen: DoctorFile,
    navigationOptions: hideHeader,
  },
  DispoConfig: {
    screen: DispoConfig,
    navigationOptions: hideHeader,
  },
  MedicalFolder: {
    screen: MedicalFolder,
    navigationOptions: hideHeader,
  },
  //   // Profile: {
  //   //   screen: Profile,
  //   //   navigationOptions: hideHeader,
  //   // },
  //   // Video: {
  //   //   screen: Video,
  //   //   navigationOptions: hideHeader,
  //   // },
};

//GUEST APP
const authScreens = {
  SignUp: {
    screen: SignUp,
    navigationOptions: hideHeader,
  },
  SignUpPW: {
    screen: SignUpPW,
    navigationOptions: hideHeader,
  },
  PhoneAuth: {
    screen: PhoneAuth,
    navigationOptions: hideHeader,
  },
  Login: {
    screen: Login,
    navigationOptions: hideHeader,
  },
  ForgotPassword: {
    screen: ForgotPassword,
    navigationOptions: hideHeader,
  },
};

const AuthStack = createStackNavigator(authScreens, {
  initialRouteName: 'Login',
});

const BookingGuestStack = createStackNavigator(appScreens, {
  initialRouteName: 'Search',
});

const guestScreens = {
  HomeGuest: {
    screen: HomeGuest,
    navigationOptions: hideHeader
  },
  Auth: {
    screen: AuthStack,
    navigationOptions: hideHeader
  },
  BookingGuest: {
    screen: BookingGuestStack,
    navigationOptions: hideHeader
  },
};

export const GuestStack = createStackNavigator(guestScreens, {
  initialRouteName: 'HomeGuest',
});

export const AppStack = createStackNavigator(appScreens, {
  initialRouteName: 'Search',
});
