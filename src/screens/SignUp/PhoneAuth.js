//Presentation.js
//Next tasks: 
//1. Display this screen only on first launch
//2. Add a swiper (slides)

import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator, TextInput, StyleSheet } from 'react-native'

// import PhoneInput from "react-native-phone-input";

import firebase from '../../configs/firebase';
import * as REFS from '../../DB/CollectionsRefs'

import { connect } from 'react-redux'
import { setReduxState } from '../../functions/functions'
import { error } from 'react-native-gifted-chat/lib/utils';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioLogo = 1;
const LOGO_WIDTH = SCREEN_WIDTH * 0.2 * ratioLogo;


class PhoneAuth extends React.Component {
  constructor(props) {
    super(props);
    this.isDoctor = this.props.signupData.isDoctor
    this.phoneNumber = this.props.navigation.getParam('phoneNumber', '')
    this.isLogin = this.props.navigation.getParam('isLogin', false)
    this.unsubscribe = null;

    this.state = {
      phone: '',
      valid: "",
      type: "",
      isLoading: false,

      message: "",
      errorMessage: "",
      codeInput: '',
      value: this.phoneNumber,
      confirmResult: null,
    }

    this.checkIfPhoneExists = this.checkIfPhoneExists.bind(this);
  }

  componentDidMount() {
    // this.signOut()
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => { // <-- #edits reactivated this authListener
      console.log('AUTH LISTENER..')

      if (user) {
        console.log('USER CONNECTED..')

        this.setState({
          message: '',
          errorMessage: "",
          codeInput: '',
          value: "",
          confirmResult: null,
        })

        if (this.isLogin)
          this.props.navigation.navigate('Home')

        else
          this.props.navigation.navigate('SignUpPW')
      }

      else {
        // User has been signed out, reset the state
        this.setState({
          message: '',
          errorMessage: "",
          codeInput: '',
          value: "",
          confirmResult: null,
        })
      }
    })

    if (this.isLogin)
      this.signIn()
  }

  componentWillUnmount() {
    if (this.unsubscribe)
      this.unsubscribe();
  }

  async checkIfPhoneExists(type) {

    const querySnapshot = await REFS.phones.where('phone', '==', this.state.value).get()

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      this.setState({ errorMessage: "Ce numéro de téléphone est déjà associée à un compte utilisateur.", isLoading: false })
      return true
    }

    else {
      setReduxState(type, this.state.value, this)
      return false
    }
  }

  updateInfoandSignIn() {

    this.setState({
      isLoading: true,
      valid: this.phone.isValidNumber(),
      type: this.phone.getNumberType(),
      value: this.phone.getValue()
    }, async () => {

      if (this.state.valid) {
        this.setState({ errorMessage: "" })

        //1. Check if the number is already linked to an existing user
        const phoneExist = await this.checkIfPhoneExists("PHONE")
        if (phoneExist) return

        //2. Sign in with phone auth 
        this.signIn()
      }

      else
        this.setState({ errorMessage: 'Numéro de téléphone invalide', isLoading: false })
    })
  }

  signIn = () => {
    const { value } = this.state

    if (this.isLogin) this.setState({ isLoading: true })

    this.setState({ message: 'Envoie du code ...' })

    firebase.auth().signInWithPhoneNumber(value)
      .then(confirmResult => this.setState({ confirmResult, message: 'Le code a été envoyé!' }))
      .catch(error => this.setState({ errorMessage: error.toString() }))
      // .catch(error => this.setState({ errorMessage: `Erreur d'authentification, veuillez réessayer.` }))
      .finally(() => this.setState({ isLoading: false }))
  }

  confirmCode = () => {
    const { codeInput, confirmResult } = this.state

    if (confirmResult && codeInput.length) {
      this.setState({ isLoading: true })

      confirmResult.confirm(codeInput)
        .then((user) => {
          this.setState({ message: 'Code Confirmé !' });

          if (this.isLogin)
            this.props.navigation.navigate('Home')

          else {
            this.setState({
              message: '',
              errorMessage: '',
              codeInput: '',
              value: '',
              confirmResult: null,
            })

            this.props.navigation.navigate('SignUpPW')
          }
        })
        .catch(error => this.setState({ errorMessage: `Erreur de confirmation du code, veuillez réessayer` }))
        .finally(() => this.setState({ isLoading: false }))
    }

    else return
  }

  //renderers
  renderPhoneNumberInput() {
    const { value } = this.state;

    if (this.state.isLoading)
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' />
        </View>
      )

    else
      return (
        <View style={styles.second_container}>
          <View style={styles.header_container}>
            <Text style={styles.header}> Quel est votre numéro de téléphone ? </Text>
          </View>

          <View style={styles.form_container}>
            {/* <PhoneInput
              ref={ref => { this.phone = ref; }}
              textProps={{
                placeholder: 'exp: +33 X XX XX XX XX',
                keyboardType: 'phone-pad',
                textContentType: 'telephoneNumber',
              }} /> */}
          </View>

          <View style={styles.error_container}>
            <Text style={{ color: 'red', textAlign: 'center' }}>
              {this.state.errorMessage}
            </Text>
          </View>

          <View style={styles.button_container}>
            {!this.state.isLoading &&
              <TouchableOpacity
                onPress={() => this.updateInfoandSignIn()}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={['#b3f3fd', '#84e2f4', '#5fe0fe']}
                  style={styles.linearGradient}>
                  <Text style={styles.buttonText}>Suivant</Text>
                </LinearGradient>
              </TouchableOpacity>
            }
          </View>
        </View>
      )
  }

  renderVerificationCodeInput() {
    const { codeInput, isLoading, errorMessage } = this.state;

    if (isLoading)
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' />
        </View>
      )

    else
      return (
        <View style={styles.second_container}>
          <View style={styles.header_container}>
            <Text style={styles.header}>Entrez le code de vérification:</Text>
          </View>

          <View style={styles.form_container}>
            <TextInput
              autoFocus
              style={styles.search_button}
              onChangeText={codeInput => this.setState({ codeInput })}
              placeholder={'Code SMS... '}
              value={codeInput}
            />
          </View>

          <View style={styles.error_container}>
            <Text style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</Text>
          </View>

          <View style={styles.button_container}>
            {!isLoading &&
              <TouchableOpacity
                onPress={this.confirmCode} >
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={['#b3f3fd', '#84e2f4', '#5fe0fe']}
                  style={styles.linearGradient}>
                  <Text style={styles.buttonText}>Confirmer</Text>
                </LinearGradient>
              </TouchableOpacity>
            }
          </View>
        </View>
      )
  }

  renderMessage() {
    const { message, errorMessage } = this.state;

    if (!message.length && !errorMessage.length)
      return null

    if (message.length) //
      return (
        <Text style={{ position: "absolute", bottom: 0, padding: 5, width: SCREEN_WIDTH, backgroundColor: '#93eafe', textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>{message}</Text>
      )
  }

  render() {
    const { confirmResult } = this.state;

    return (
      <View style={styles.container}>

        <View style={styles.first_container}>
          {!this.isLogin && !this.isDoctor &&
            <View style={styles.bar_progression}>
              <View style={[styles.bar, styles.activeBar]} />
              <View style={[styles.bar, styles.activeBar]} />
              <View style={[styles.bar, styles.activeBar]} />
              <View style={[styles.bar, styles.activeBar]} />
              <View style={[styles.bar, styles.activeBar]} />
              <View style={styles.bar} />
            </View>}

          {!this.isLogin && this.isDoctor &&
            <View style={styles.bar_progression}>
              <View style={[styles.bar_D, styles.activeBar]} />
              <View style={[styles.bar_D, styles.activeBar]} />
              <View style={[styles.bar_D, styles.activeBar]} />
              <View style={[styles.bar_D, styles.activeBar]} />
              <View style={[styles.bar_D, styles.activeBar]} />
              <View style={[styles.bar_D, styles.activeBar]} />
              <View style={styles.bar_D} />
              <View style={styles.bar_D} />
            </View>}



          <View style={styles.logo_container}>
            <Image source={require('../../assets/logo-1000-1000.png')} style={styles.logoIcon} />
          </View>
        </View>

        {!confirmResult && this.renderPhoneNumberInput()}
        {confirmResult && this.renderVerificationCodeInput()}

        {this.renderMessage()}

      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    signupData: state.signup
  }
}

export default connect(mapStateToProps)(PhoneAuth)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  first_container: {
    flex: 0.25
  },
  second_container: {
    flex: 0.75
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
  search_button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: 15,
    paddingLeft: SCREEN_WIDTH * 0.1,
    width: SCREEN_WIDTH * 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 3,
  },
  /*info: {
    // width: 200,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginTop: 20
  },*/
});