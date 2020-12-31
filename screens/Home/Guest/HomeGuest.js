
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { View, Text, Image, TouchableOpacity, Dimensions, TextInput, StyleSheet, ImageBackground, BackHandler, AsyncStorage } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Feather';

import theme from '../../../constants/theme.js'

import LeftSideMenu from '../../../components/LeftSideMenu'

import firebase, { crashlytics } from 'react-native-firebase';

//Redux
import { connect } from 'react-redux'
import { setReduxState } from '../../../functions/functions'
import { withNavigation } from 'react-navigation';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioFooter = 254 / 668; // The actual icon footer size is 254 * 668
const FOOTER_ICON_HEIGHT = Dimensions.get("window").width * ratioFooter; // This is to keep the same ratio in all screen sizes (proportion between the image  width and height)

const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.25 * ratioLogo;

import moment from 'moment-timezone'
import 'moment/locale/fr'  // without this line it didn't work
moment.locale('fr')

class HomeGuest extends React.Component {
  constructor(props) {
    super(props);
    this.navigateToDoctorPortal = this.navigateToDoctorPortal.bind(this);
    this.navigateToPatientPortal = this.navigateToPatientPortal.bind(this);

    this.state = {
      timeslots: []
    }
  }

  async componentDidMount() {
    // let fcmToken = await AsyncStorage.removeItem('fcmToken').then(() => console.info('removed !!!!!!!!!!'));
    // let fcmToken = await AsyncStorage.getItem('fcmToken').catch((err) => alert(err));
    // console.log(fcmToken)
  }

  navigateToDoctorPortal() {
    setReduxState('ISDOCTOR', true, this)
    this.props.navigation.navigate('Login')
  }

  navigateToPatientPortal() {
    setReduxState('ISDOCTOR', false, this)
    this.props.navigation.navigate('Login')
  }

  // sendDataMessage() {
  //   const sendDataMessage = functions.httpsCallable('sendDataMessage')
  //   sendDataMessage({ fcmToken: 'c-YqG1Y2RyeKnteTjJ_uvi:APA91bEDCe9kBQg1Pi_onZznWLxeICg3xZaOiEhhMu7mk2tSJhI6e8jdFbcSy7qyL-7zB3-9h7bTxkdEI-AJKSiCgbLNsvOvAuAoIZwcS1nC5e6Cyj0TZPqFLORe0MryvSBqQWLqvQBu' })
  //     .then((response) => console.log('11111111111111111'))
  //     .catch((err) => console.error(err))
  // }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.logo_container_guest}
          onPress={(this.toggleSideMenu)}>
          <Image source={require('../../../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />
        </View>

        <View style={styles.search_container}>
          <TouchableOpacity style={styles.search_button}
            onPress={() => this.props.navigation.navigate('Search')}>
            <Icon name="search" size={20} color="#afbbbc" />
            <Text style={styles.searchText}>Rechercher un médecin</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cnxButton_container}>
          <TouchableOpacity
            onPress={this.navigateToPatientPortal}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={['#b3f3fd', '#84e2f4', '#5fe0fe']}
              style={styles.linearGradient}>
              <Text style={styles.buttonText}> Connexion/Inscription </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.terms_container}>
          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
            <Text style={styles.termsText}> En cliquant sur Inscription, vous acceptez {'\n'} les <Text onPress={() => { console.log('conditions générales...') }} style={styles.termsLink}>
              Conditions générales d'utilisation</Text>
            </Text>
            <TouchableOpacity style={{ marginLeft: SCREEN_WIDTH * 0.025 }}>
              <Icon1 name="info" size={20} color="#8febfe" />
            </TouchableOpacity>
          </View>
        </View>



        <ImageBackground source={require('../../../assets/footerIconReduced.png')} style={styles.footer_container}>
          <Text style={{ color: 'gray' }}>Vous êtes un professionnel ? <Text onPress={this.navigateToDoctorPortal} style={{ textDecorationLine: 'underline', color: '#ffffff' }}>
            Par ici
            </Text>
          </Text>
        </ImageBackground>

      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    signupData: state.signup
  }
}

export default withNavigation(connect(mapStateToProps)(HomeGuest))


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.BACKGROUND_COLOR,
  },
  menu_button: {
    width: SCREEN_WIDTH * 0.12,
    height: SCREEN_WIDTH * 0.12,
    borderRadius: SCREEN_WIDTH * 0.12 / 2,
    backgroundColor: theme.BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    left: SCREEN_WIDTH * 0.05,
    top: SCREEN_WIDTH * 0.05,
  },
  logo_container_guest: {
    flex: 0.25,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'red',
  },
  logoIcon: {
    height: SCREEN_WIDTH * 0.25,
    width: LOGO_WIDTH,
    marginTop: SCREEN_HEIGHT * 0.025
  },
  search_container: {
    flex: 0.25,
    justifyContent: 'flex-end',
    alignItems: 'center',
    //backgroundColor: 'green',
  },
  search_button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.BACKGROUND_COLOR,
    borderRadius: 25,
    padding: SCREEN_WIDTH * 0.033,
    width: SCREEN_WIDTH * 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
  },
  searchText: {
    color: theme.GRAY_COLOR,
    marginLeft: SCREEN_WIDTH * 0.03
  },
  cnxButton_container: {
    flex: 0.25,
    justifyContent: 'flex-end',
    alignItems: 'center',
    //backgroundColor: 'yellow',
    paddingBottom: SCREEN_HEIGHT * 0.01
  },
  linearGradient: {
    width: SCREEN_WIDTH * 0.68,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: theme.FONT_FAMILY,
    textAlign: 'center',
    margin: SCREEN_WIDTH * 0.025,
    color: theme.WHITE_COLOR,
    backgroundColor: 'transparent',
  },
  terms_container: {
    flex: 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    //backgroundColor: 'brown',
  },
  termsText: {
    color: theme.GRAY_COLOR,
    fontSize: 12,
    //backgroundColor: 'green'
  },
  termsLink: {
    textDecorationLine: 'underline',
    color: theme.GRAY_COLOR,
    fontSize: 12,
    fontWeight: 'bold'
  },
  footer_container: {
    flex: 0.2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: SCREEN_HEIGHT * 0.02,
    //backgroundColor: 'red'
  },
  footerIcon: {
    width: SCREEN_WIDTH,
    height: FOOTER_ICON_HEIGHT,
  },
});