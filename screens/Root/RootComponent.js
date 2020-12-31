import React, { Component } from 'react';
import {
  StyleSheet,   // CSS-like styles
  Text,         // Renders text
  View,          // Container component
  Dimensions,
  Image,
} from 'react-native';

import Swiper from '../Welcome/Swiper';
import checkIfFirstLaunch from '../../util/checkIfFirstLaunch';
import Home from '../Home/Home';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratio = 254 / 668; // The actaul icon footer size is 254 * 668
const FOOTER_ICON_HEIGHT = Dimensions.get("window").width * ratio; // This is to keep the same ratio in all screen sizes (proportion between the image  width and height)

export default class RootComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFirstLaunch: false,
      hasCheckedAsyncStorage: false,
    }
  }

  async componentDidMount() {
    const isFirstLaunch = await checkIfFirstLaunch();
    this.setState({ isFirstLaunch, hasCheckedAsyncStorage: true });
  }

  render() {
    const { hasCheckedAsyncStorage, isFirstLaunch } = this.state;

    if (!hasCheckedAsyncStorage) {
      return null;
    }

    return isFirstLaunch ?
      <Swiper navigate={this.props.navigation}>
        {/* First screen */}
        <View style={[styles.slide, { backgroundColor: '#ffffff' }]}>
          <View style={[styles.logo_container, styles.fullScreen]}>
            <Image source={require('../../assets/logoIcon.png')} style={styles.logoIcon} />
          </View>
          <View style={[styles.presentation_container, styles.fullScreen]}>
            <Text style={styles.header}>Bienvenue sur{'\n'}DoctoNeed</Text>
            <Text style={styles.text}>L'application qui met en relation le praticien avec son patient</Text>
          </View>
          <View style={[styles.otherComponents_container, styles.fullScreen]}>
            <Image source={require('../../assets/footerIconReduced.png')} style={styles.footerIcon} />
          </View>
        </View>

        {/* Second screen */}
        <View style={[styles.slide, { backgroundColor: '#ffffff' }]}>
          <View style={[styles.logo_container, styles.fullScreen]}>
            <Image source={require('../../assets/logoIcon.png')} style={styles.logoIcon} />
          </View>
          <View style={[styles.presentation_container, styles.fullScreen]}>
            <Text style={styles.header}>Bienvenue sur{'\n'}DoctoNeed</Text>
            <Text style={styles.text}>Prenez rendez-vous dans plusieurs jours ou en urgence</Text>
          </View>
          <View style={[styles.otherComponents_container, styles.fullScreen]}>
            <Image source={require('../../assets/footerIconReduced.png')} style={styles.footerIcon} />
          </View>
        </View>

        {/* Third screen */}
        <View style={[styles.slide, { backgroundColor: '#ffffff' }]}>
          <View style={[styles.logo_container, styles.fullScreen]}>
            <Image source={require('../../assets/logoIcon.png')} style={styles.logoIcon} />
          </View>
          <View style={[styles.presentation_container, styles.fullScreen]}>
            <Text style={styles.header}>Bienvenue sur{'\n'}DoctoNeed</Text>
            <Text style={styles.text}>Le praticien vous rappelle en visio-consultation</Text>
          </View>
          <View style={[styles.otherComponents_container, styles.fullScreen]}>
            <Image source={require('../../assets/footerIconReduced.png')} style={styles.footerIcon} />
          </View>
        </View>
      </Swiper>
      :
      <Home />
  }
}

const styles = StyleSheet.create({
  fullScreen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  // Slide styles
  slide: {
    flex: 1,                    // Take up all screen
    //justifyContent: 'center',   // Center vertically
    // alignItems: 'center',       // Center horizontally
    //backgroundColor: 'blue',
  },
  logo_container: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    //backgroundColor: 'blue',
  },
  logoIcon: {
    height: SCREEN_WIDTH * 0.17,
    width: SCREEN_WIDTH * 0.17,
    marginTop: SCREEN_WIDTH * 0.05
  },
  presentation_container: {
    flex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: SCREEN_HEIGHT * 0.2
    //backgroundColor: 'green',
  },
  // Header styles
  header: {
    fontSize: SCREEN_HEIGHT * 0.035,
    fontWeight: 'bold',
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: 'black',
    //backgroundColor: 'yellow',
    marginBottom: SCREEN_HEIGHT * 0.01
  },
  // Text below header
  text: {
    color: '#8f9595',
    fontFamily: 'Avenir',
    fontSize: SCREEN_HEIGHT * 0.018,
    marginHorizontal: SCREEN_WIDTH * 0.1,
    textAlign: 'center',
    //backgroundColor: 'yellow',
  },
  // Dots + Button + FooterIcon
  otherComponents_container: {
    flex: 1,
    position: 'absolute',
    alignItems: 'center',
    //backgroundColor: 'green',
    //backgroundColor: 'brown',
    justifyContent: 'flex-end',
  },
  footerIcon: {
    width: SCREEN_WIDTH,
    height: FOOTER_ICON_HEIGHT,
  },
});