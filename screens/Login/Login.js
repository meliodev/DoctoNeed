

import React from 'react'
import { View, TextInput, Text, Image, Dimensions, ActivityIndicator, StyleSheet } from 'react-native'

import firebase from 'react-native-firebase'

import Button from '../../components/Button';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.2 * ratioLogo;

export default class LoginDoctor extends React.Component {

  state = {
    email: '', password: '', errorMessage: null, message: '', confirmResult: null,
    user: null, codeInput: '', phoneNumber: '', isLoading: false,
    isUser: false, isDoctor: false
  }

  handleLogin = () => {
    const { email, password } = this.state

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
            email: this.state.email.toString(),
            password: this.state.password.toString(),
            phoneNumber: this.state.phoneNumber
          })
        })
        .catch(error => {
          this.setState({ isLoading: false })
          alert('Mot de passe et/ou adresse email non valide(s).')
        })
    }

    else {
      alert('Veuillez saisir votre email et votre mot de passe.')
    }
  }

  renderMessage() {
    const { message } = this.state;

    if (!message.length) return null;

    return (
      <Text style={{ padding: 5, backgroundColor: '#000', color: '#fff' }}>{message}</Text>
    );
  }

  render() {
    const { isLoading } = this.state;
    const isDoctor = this.props.navigation.getParam('isDoctor', 'nothing sent')

    return (
      <View style={styles.container}>
        {isLoading
          ? <View style={styles.loading_container}>
            <ActivityIndicator size='large' />
          </View>

          : <View style={styles.container}>

            <View style={styles.bar_progression}>
            </View>

            {/* Display Message Success/Error */}
            {this.renderMessage()}

            <View style={styles.logo_container}>
              <Image source={require('../../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />
            </View>

            <View style={styles.header_container}>
              <Text style={styles.header}> Se connecter </Text>
            </View>

            <View style={styles.form_container}>
              <TextInput style={styles.search_button} onChangeText={(text) => this.setState({ email: text })} placeholder={'Votre email'} value={this.state.email} />
              <TextInput secureTextEntry style={styles.search_button} onChangeText={(text) => this.setState({ password: text })} placeholder={'Votre mot de passe'} value={this.state.password} />
            </View>

            {isDoctor === 'nothing sent' ?
              <View style={styles.button_container}>
                <Button width= {SCREEN_WIDTH*0.65} text="Se Connecter" onPress={this.handleLogin} />
                <Text style={styles.text}>Vous n'avez pas de compte? <Text onPress={() => this.props.navigation.navigate('SignUp1')} style={{ textDecorationLine: 'underline', color: '#70e2f9', fontFamily: 'Avenir', }}>
                  Inscrivez-vous</Text>
                </Text>
              </View>
              :
              <View style={styles.button_container}>
                <Button text="Se Connecter" onPress={this.handleLogin} />
                <Text style={styles.text}>Vous n'avez pas de compte? <Text onPress={() => this.props.navigation.navigate('SignUp1', { isDoctor: true })} style={{ textDecorationLine: 'underline', color: '#70e2f9', fontFamily: 'Avenir', }}>
                  Postulez ici</Text>
                </Text>
              </View>}

          </View>
        }
      </View>
    );
  }
}

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
    flex: 0.1,
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
    flex: 0.37,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    //backgroundColor: 'brown',
  },
  search_button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: 15,
    paddingLeft: SCREEN_WIDTH*0.1,
    width: SCREEN_WIDTH * 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 4,
  },
  searchText: {
    color: '#b2bbbc',
    marginLeft: SCREEN_WIDTH * 0.03
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