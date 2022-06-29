//Tasks:
//Forget password
//Regex: ignore spaces
//Handle all type or errors (including no network)

import React from 'react'
import { View, TextInput, Text, Image, Dimensions, ActivityIndicator, NetInfo, StyleSheet } from 'react-native'

import firebase from '../../configs/firebase'

import Button from '../../components/Button';
import { connect } from 'react-redux'

import ErrorMessage from '../../components/ErrorMessage'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioLogo = 1;
const LOGO_WIDTH = SCREEN_WIDTH * 0.2 * ratioLogo;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.isAlert = this.props.navigation.getParam('isAlert', false)

    this.state = {
      email: '', password: '', errorMessage: null, message: '', confirmResult: null,
      user: null, codeInput: '', phoneNumber: '', isLoading: false,
      isUser: false,
      isValid: null,
    }
  }

  componentDidMount() {
    if (this.isAlert)
      alert('Votre médecin vous attend, veuillez vous connecter afin de pouvoir rejoindre la téléconsultation.')
  }

  handleLogin = () => {
    const { email, password } = this.state
    //task: check network

    if (this.state.email && this.state.password) {

      this.setState({ isLoading: true })
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(async (cred) => {
          this.setState({ phoneNumber: cred.user.phoneNumber })
          await firebase.auth().signOut()
          this.setState({ isLoading: false })
          this.props.navigation.navigate('PhoneAuth', {
            email: email,
            password: this.state.password.toString(),
            phoneNumber: this.state.phoneNumber,
            isLogin: true
          })
        })
        .catch(error => {
          this.setState({ isLoading: false })
          var errorCode = error.code;
          //var errorMessage = error.message;
          if (errorCode == 'auth/user-not-found') {
            this.setState({ message: 'Adresse email et/ou mot de passe non valide.' })
          }
          else if (errorCode == 'auth/wrong-password') {
            this.setState({ message: 'Adresse email et/ou mot de passe non valide.' })
          }
          else if (errorCode == 'auth/invalid-email') {
            this.setState({ message: 'Adresse email et/ou mot de passe non valide.' })
          }
          else if (errorCode == 'auth/user-disabled') {
            this.setState({ message: 'Adresse email et/ou mot de passe non valide.' })
          }
          else {
            this.setState({ message: 'Erreur, veuillez vérifier votre réseau internet' })
          }
        })
    }

    else {
      this.setState({ message: 'Veuillez saisir votre email et votre mot de passe.' })
    }
  }

  renderMessage() {
    const { message } = this.state;

    if (!message.length)
      return null

    else return (
      <Text style={{ padding: 5, color: 'red' }}>{message}</Text>
    )
  }

  render() {
    const { isLoading, isValid } = this.state;
    const isDoctor = this.props.navigation.getParam('isDoctor', 'nothing sent')

    return (

      <View style={styles.container}>
        {isLoading ?
          <View style={styles.loading_container}>
            <ActivityIndicator size='large' />
          </View>
          :
          <View style={styles.container}>

            <View style={styles.bar_progression} />

            <View style={styles.logo_container}>
              <Image source={require('../../assets/logo-1000-1000.png')} style={styles.logoIcon} />
            </View>

            <View style={styles.header_container}>
              <Text style={styles.header}>Se connecter</Text>
            </View>

            <View style={styles.form_container}>
              <TextInput
                style={styles.search_button}
                name='email'
                value={this.state.email}
                onChangeText={(email) => {
                  let em = ''
                  em = email
                  em = em.trim()
                  this.setState({ email: em })
                }
                }
                placeholder='Adresse email'
                autoCapitalize='none' />

              <TextInput
                style={styles.search_button}
                name="password"
                value={this.state.password}
                placeholder="Mot de passe"
                secureTextEntry
                onChangeText={(password) => this.setState({ password })} />
            </View>

            {/* Display Message Success/Error */}
            <View style={styles.error_container}>
              {this.renderMessage()}
            </View>

            {this.props.signupData.isDoctor ?
              <View style={styles.button_container}>
                <Button
                  width={SCREEN_WIDTH * 0.65}
                  text="Se Connecter"
                  onPress={this.handleLogin}
                  disabled={!isValid || isSubmitting} />
                <Text style={styles.text}>Vous n'avez pas de compte? <Text onPress={() => this.props.navigation.navigate('SignUp1')} style={{ textDecorationLine: 'underline', color: '#70e2f9', fontFamily: 'Avenir', }}>
                  Postulez ici</Text>
                </Text>
                <Text onPress={() => this.props.navigation.navigate('ForgotPassword', { isDoctor: true })} style={{ textDecorationLine: 'underline', color: '#70e2f9', fontFamily: 'Avenir', }}>
                  Mot de passe oublié?
                </Text>
              </View>
              :
              <View style={styles.button_container}>
                <Button
                  width={SCREEN_WIDTH * 0.65}
                  text="Se Connecter"
                  onPress={this.handleLogin}
                  disabled={!isValid || isSubmitting} />
                <Text style={styles.text}>Vous n'avez pas de compte? <Text onPress={() => this.props.navigation.navigate('SignUp1')} style={{ textDecorationLine: 'underline', color: '#70e2f9', fontFamily: 'Avenir', }}>
                  Inscrivez-vous</Text>
                </Text>
                <Text onPress={() => this.props.navigation.navigate('ForgotPassword', { isDoctor: true })} style={{ textDecorationLine: 'underline', color: '#70e2f9', fontFamily: 'Avenir', }}>
                  Mot de passe oublié?
              </Text>
              </View>}

          </View>
        }
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    signupData: state.signup
  }
}

export default connect(mapStateToProps)(Login)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#ffffff',
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
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'blue',
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
    flex: 0.30,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'brown',
  },
  error_container: {
    flex: 0.05,
    alignItems: 'center',
    justifyContent: 'space-between',
    //backgroundColor: 'green',
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
    marginBottom: SCREEN_HEIGHT * 0.03
  },
  searchText: {
    color: '#b2bbbc',
    marginLeft: SCREEN_WIDTH * 0.03
  },
  button_container: {
    flex: 0.35,
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
  text: {
    color: '#8f9595',
    fontFamily: 'Avenir',
    fontSize: SCREEN_HEIGHT * 0.018,
    marginTop: SCREEN_HEIGHT * 0.02
    //textAlign: 'center',
    //backgroundColor: 'yellow',
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

});