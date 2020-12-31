//Presentation.js
//Next tasks: 
//1. Display this screen only on first launch
//2. Add a swiper (slides)

import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator, StyleSheet } from 'react-native'
import PhoneInput from "react-native-phone-input";

import * as REFS from '../../../DB/CollectionsRefs'

import { connect } from 'react-redux'
import { setReduxState } from '../../../functions/functions'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.2 * ratioLogo;

class SignUp7 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      valid: "",
      type: "",
      value: "",
      isLoading: false,
      errorMessage: ""
    }

    this.updateInfo = this.updateInfo.bind(this);
    this.renderInfo = this.renderInfo.bind(this);
    this.checkIfPhoneExists = this.checkIfPhoneExists.bind(this);
  }

  updateInfo() {
    this.setState({
      valid: this.phone.isValidNumber(),
      type: this.phone.getNumberType(),
      value: this.phone.getValue()
    });
  }

  renderInfo() {
    if (this.state.value) {
      return (
        <View style={styles.info}>
          <Text>
            Is Valid:{" "}
            <Text style={{ fontWeight: "bold" }}>
              {this.state.valid.toString()}
            </Text>
          </Text>
          <Text>
            Type: <Text style={{ fontWeight: "bold" }}>{this.state.type}</Text>
          </Text>
          <Text>
            Value:{" "}
            <Text style={{ fontWeight: "bold" }}>{this.state.value}</Text>
          </Text>
        </View>
      );
    }
  }

  checkIfPhoneExists(type) {
    let phone_exist = false
    REFS.phones.where('phone', '==', this.state.value).get().then((querySnapshot) => {
      querySnapshot.forEach(doc => {
        if (doc.data().phone !== null)
          phone_exist = true
      })
    }).then(() => {
      if (!phone_exist) {
        console.log('yeaaaaaaaaaaaaaaaaaaah')
        setReduxState(type, this.state.value, this)
        this.props.navigation.navigate('PhoneAuth0')
      }

      else
        this.setState({ errorMessage: "Ce numéro de téléphone est déjà associée à un compte utilisateur." })
    })
      .finally(() => this.setState({ isLoading: false }))
  }
  updateInfoandNavigate(type) {
    this.setState({
      isLoading: true,
      valid: this.phone.isValidNumber(),
      type: this.phone.getNumberType(),
      value: this.phone.getValue()
    }, () => {

      if (this.state.valid) {
        this.setState({ errorMessage: null })
        //TASK: Check if the number is already linked to an existing user
        this.checkIfPhoneExists(type)
      }

      else
        this.setState({ errorMessage: 'Numéro de téléphone invalide', isLoading: false })
    });
  }

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.bar_progression}>
          <View style={[styles.bar_D, styles.activeBar]} />
          <View style={[styles.bar_D, styles.activeBar]} />
          <View style={[styles.bar_D, styles.activeBar]} />
          <View style={[styles.bar_D, styles.activeBar]} />
          <View style={[styles.bar_D, styles.activeBar]} />
          <View style={[styles.bar_D, styles.activeBar]} />
          <View style={[styles.bar_D, styles.activeBar]} />
          <View style={styles.bar_D} />
        </View>

        <View style={styles.logo_container}>
          <Image source={require('../../../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />
        </View>

        <View style={styles.header_container}>
          <Text style={styles.header}> Quel est votre numéro de téléphone ? </Text>
          {/* <Text>{email}</Text> */}
        </View>

        <View style={styles.form_container}>
          {this.state.isLoading ?
            <View style={styles.loading_container}>
              <ActivityIndicator size='large' />
            </View>
            :
            <PhoneInput
              ref={ref => { this.phone = ref; }}
              textProps={{
                placeholder: 'exp: +33 X XX XX XX XX',
                keyboardType: 'phone-pad',
                textContentType: 'telephoneNumber',
              }} />
          }

        </View>

        <View style={styles.error_container}>
          <Text style={{ color: 'red', textAlign: 'center' }}>
            {this.state.errorMessage}
          </Text>
        </View>

        <View style={styles.button_container}>
          {!this.state.isLoading &&
            <TouchableOpacity
              onPress={() => this.updateInfoandNavigate('PHONE')}>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['#b3f3fd', '#84e2f4', '#5fe0fe']}
                style={styles.linearGradient}>
                <Text style={styles.buttonText}> Suivant </Text>
              </LinearGradient>
            </TouchableOpacity>
          }

        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    signupData: state.signup
  }
}

export default connect(mapStateToProps)(SignUp7)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  bar_progression: {
    flex: 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    //backgroundColor: 'purple',
  },
  bar: {
    height: SCREEN_HEIGHT * 0.007,
    width: SCREEN_WIDTH / 6.2,
    // marginLeft: SCREEN_WIDTH * 0.015,
    borderRadius: 20,
    backgroundColor: '#cdd6d5'
  },
  bar_D: {
    height: SCREEN_HEIGHT * 0.007,
    width: SCREEN_WIDTH / 8.4,
    // marginLeft: SCREEN_WIDTH * 0.015,
    borderRadius: 20,
    backgroundColor: '#cdd6d5'
  },
  activeBar: {
    backgroundColor: '#48d8fb',
  },
  logo_container: {
    flex: 0.2,
    //justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'red',
  },
  logoIcon: {
    height: SCREEN_WIDTH * 0.2,
    width: LOGO_WIDTH,
    marginTop: SCREEN_WIDTH * 0.05
  },
  header_container: {
    flex: 0.12,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'green',
  },
  header: {
    fontSize: SCREEN_HEIGHT * 0.025,
    fontWeight: 'bold',
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: 'black',
    //backgroundColor: 'yellow',
    marginBottom: SCREEN_HEIGHT * 0.01
  },
  form_container: {
    flex: 0.28,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    //backgroundColor: 'brown',
  },
  error_container: {
    flex: 0.07,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'green',
  },
  button_container: {
    flex: 0.28,
    justifyContent: 'flex-start',
    alignItems: 'center',
    //backgroundColor: 'yellow',
    paddingBottom: SCREEN_HEIGHT * 0.01
  },
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    marginTop: 16,
    width: SCREEN_WIDTH * 0.68,
    borderRadius: 20
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
  /*info: {
    // width: 200,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginTop: 20
  },*/
});