
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { View, Text, Image, TouchableOpacity, Dimensions, TextInput, StyleSheet, ImageBackground } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Feather';

import theme from '../../../constants/theme.js'

import LeftSideMenu from '../../../components/LeftSideMenu'

import firebase from 'react-native-firebase';
import { signOutUser } from '../../../DB/CRUD'
import * as REFS from '../../../DB/CollectionsRefs'
const functions = firebase.functions()

import { withNavigation } from 'react-navigation';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioFooter = 254 / 668; // The actual icon footer size is 254 * 668
const FOOTER_ICON_HEIGHT = Dimensions.get("window").width * ratioFooter; // This is to keep the same ratio in all screen sizes (proportion between the image  width and height)

const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.25 * ratioLogo;

class LandingScreen extends React.Component {


  render() {

    return (


      <View style={styles.container}>

        <View style={{ flex: 1 }}>

          <View style={styles.logo_container_guest}
            onPress={(this.toggleSideMenu)}>
            <Image source={require('../../../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />
          </View>

          <View style={styles.search_container}>
            <TouchableOpacity style={styles.search_button}
              onPress={() => this.props.navigation.navigate('Search')}>
              <Icon name="search" size={20} color="#afbbbc" />
              <Text style={styles.searchText}> Rechercher un médecin </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cnxButton_container}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Login')}>
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
            <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', }}>
              <Text style={styles.termsText}> En cliquant sur Inscription, vous acceptez les <Text onPress={() => { alert("Conditions générales d'utilisation"); }} style={styles.termsLink}>
                Conditions{'\n'}générales d'utilisation</Text>
              </Text>
              <TouchableOpacity style={{ marginLeft: SCREEN_WIDTH * 0.025 }}>
                <Icon1 name="info" size={20} color="#8febfe" />
              </TouchableOpacity>
            </View>
          </View>

         

          <ImageBackground source={require('../../../assets/footerIconReduced.png')} style={styles.footer_container}>
          <Text style={{color: 'gray'}}>Vous êtes un professionnel? <Text onPress={() => this.props.navigation.navigate('Login', {isDoctor: true})} style={{ textDecorationLine: 'underline', color: '#ffffff', fontFamily: 'Avenir', }}>
              Par ici</Text>
            </Text>
          </ImageBackground>
        </View>

      </View>
    );
  }
}

export default withNavigation(LandingScreen);

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
    elevation: 6,
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
    fontSize: theme.FONT_SIZE_LARGE,
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
    fontSize: theme.FONT_SIZE_SMALL * 0.95,
    //backgroundColor: 'green'
  },
  termsLink: {
    textDecorationLine: 'underline',
    color: theme.GRAY_COLOR,
    fontSize: theme.FONT_SIZE_SMALL * 0.95,
    fontWeight: 'bold'
  },
  footer_container: {
    flex: 0.2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: SCREEN_HEIGHT*0.02,
    //backgroundColor: 'red'
  },
  footerIcon: {
    width: SCREEN_WIDTH,
    height: FOOTER_ICON_HEIGHT,
  },
});