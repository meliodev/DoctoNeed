
import React from 'react'
import { View, TextInput, Text, Image, Dimensions, ActivityIndicator, StyleSheet } from 'react-native'
import * as REFS from '../../DB/CollectionsRefs'

import { connect } from 'react-redux'
import { setReduxState } from '../../functions/functions'

import ValidationComponent from 'react-native-form-validator';

import Button from '../../components/Button';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.2 * ratioLogo;

class SignUp1 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.isDoctor = this.props.signupData.isDoctor
    console.log('this.isDoctor:   ' + this.isDoctor)
    this.checkIfUserExists = this.checkIfUserExists.bind(this);

    this.state = {
      email: '',
      errorMessage: '',
      isLoading: false
    }
  }

  checkIfUserExists(type, value) {
    let email_exist = false
    REFS.emails.where('email', '==', this.state.email).get().then((querySnapshot) => {
      querySnapshot.forEach(doc => {
        if (doc.data().email !== null)
          email_exist = true
      })
    })
      .catch(() => alert("Echec de validation de l'adresse email, veuillez réessayer plus tard."))
      .finally(() => this.setState({ isLoading: false }))
      .then(() => {
        if (!email_exist) {
          setReduxState(type, value, this)
          this.props.navigation.navigate('SignUp2')
        }

        else
          this.setState({ errorMessage: "Cette adresse email est déjà associée à un compte utilisateur." })
      })
      .catch(() => alert("Echec de validation de l'adresse email, veuillez réessayer plus tard."))
      .finally(() => this.setState({ isLoading: false }))
  }

  handleNext = (type, value) => {
    this.setState({ isLoading: true })
    //Validate email format

    this.validate({ email: { email: true, required: true } })

    //Check if this email is associated to an existing user.
    if (!this.isFieldInError('email')) {
      this.checkIfUserExists(type, value)
    }

    else
      this.setState({ isLoading: false })
  }

  getExistingUserErrorMessage() {
    const { errorMessage } = this.state;

    if (!errorMessage.length)
      return null;

    else return (
      <Text style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</Text>
    );
  }

  render() {
    console.log(this.props)

    return (
      <View style={styles.container}>

        {this.state.isLoading
          ? <View style={styles.loading_container}>
            <ActivityIndicator size='large' />
          </View>

          :

          <View style={styles.container}>
            {this.isDoctor === false ?
              <View style={styles.bar_progression}>
                <View style={[styles.bar, styles.activeBar]} />
                <View style={styles.bar} />
                <View style={styles.bar} />
                <View style={styles.bar} />
                <View style={styles.bar} />
                <View style={styles.bar} />
              </View>
              :
              <View style={styles.bar_progression}>
                <View style={[styles.bar_D, styles.activeBar]} />
                <View style={styles.bar_D} />
                <View style={styles.bar_D} />
                <View style={styles.bar_D} />
                <View style={styles.bar_D} />
                <View style={styles.bar_D} />
                <View style={styles.bar_D} />
                <View style={styles.bar_D} />
              </View>}

            <View style={styles.logo_container}>
              <Image source={require('../../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />
            </View>

            <View style={styles.header_container}>
              <Text style={styles.header}> Quelle est votre adresse mail ? </Text>
            </View>

            <View style={styles.form_container}>
              <TextInput
                style={styles.search_button}
                onChangeText={(email) => {
                  let em = ''
                  em = email
                  em = em.trim()
                  this.setState({ email: em })
                }
                }
                placeholder={'Adresse mail'}
                autoCapitalize='none'
                value={this.state.email} />
            </View>

            <View style={styles.error_container}>
              <Text style={{ color: 'red', textAlign: 'center' }}>
                {this.getErrorMessages()}
              </Text>
              {this.getExistingUserErrorMessage()}
            </View>


            <View style={styles.button_container}>
              <Button width={SCREEN_WIDTH * 0.65} text="Suivant" onPress={() => this.handleNext('EMAIL', this.state.email)} />
            </View>
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

export default connect(mapStateToProps)(SignUp1)

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
    // backgroundColor: 'green',
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
    justifyContent: 'center',
    // backgroundColor: 'brown',
  },
  error_container: {
    flex: 0.07,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'green',
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

/*Redux test
const mapStateToProps = (state) => {
  return {
    favoritesFilm: state.favoritesFilm
  }
}

export default connect(mapStateToProps)(SignUp1)
*/