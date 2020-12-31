//Presentation.js
//Next tasks: 
//1. Display this screen only on first launch
//2. Add a swiper (slides)

import React from 'react'
import { View, TextInput, Text, Image, Dimensions, StyleSheet, ActivityIndicator } from 'react-native'

import Button from '../../components/Button';
import Input from '../../components/Input';

import ValidationComponent from 'react-native-form-validator';

import { connect } from 'react-redux'
import { setReduxState } from '../../functions/functions'

import firebase from 'react-native-firebase'
import * as REFS from '../../DB/CollectionsRefs'

const functions = firebase.functions()

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ratioLogo = 420 / 244;
const LOGO_WIDTH = SCREEN_WIDTH * 0.2 * ratioLogo;

class SignUpPW extends ValidationComponent {
  constructor(props) {
    super(props);
    this.isDoctor = this.props.signupData.isDoctor
    this.email = this.props.signupData.email
    this.country = this.props.signupData.country
    this.nom = this.props.signupData.nom
    this.prenom = this.props.signupData.prenom
    this.speciality = this.props.signupData.speciality
    this.dateNaissance = this.props.signupData.dateNaissance
    this.codeFinesse = this.props.signupData.codeFinesse
    this.phone = this.props.signupData.phone

    this.state = {
      password: '',
      isLoading: false,
      isValid: null,
    }
  }

  handleSignUp = () => {
    this.setState({ isLoading: true })

    if (this.isDoctor) {
      var credential = firebase.auth.EmailAuthProvider.credential(this.email, this.state.password);

      firebase.auth().currentUser.linkWithCredential(credential).then((usercred) => {
        console.log('0')
        console.log(usercred.user)

        const doctor = {
          email: this.email,
          phoneNumber: this.phone,
          country: this.country,
          nom: this.nom,
          prenom: this.prenom,
          name: this.prenom + ' ' + this.nom,
          dateNaissance: this.dateNaissance,
          speciality: this.speciality,
          codeFinesse: this.codeFinesse,
          regularPrice: 40, //setted depending on the speciality 
          urgencePrice: 60, //setted depending on the speciality
          urgences: 'false',
          Avatar: '',
          Sexe: '',
          bio: '',
          diplomes: [],
          myPatients: [],
        }

        let signuprequest = doctor
        signuprequest.email = this.email
        signuprequest.password = this.state.password
        signuprequest.phone = this.phone
        signuprequest.disabled = true

        //#task: Use batch
        REFS.emails.add({ email: this.email }).then(() => console.log('email added'))
        REFS.phones.add({ phone: this.phone }).then(() => console.log('phone added'))
        REFS.signuprequests.doc(usercred.user.uid).set(signuprequest).then(() => console.log('signuprequest set'))
      })
        .then(() => this.props.navigation.navigate('SignUpRequestFinished'))
        .catch((e) => console.error(e))
        .finally(() => this.setState({ isLoading: false }))
    }

    else {
      var credential = firebase.auth.EmailAuthProvider.credential(this.email, this.state.password);

      firebase.auth().currentUser.linkWithCredential(credential)
        .then(async (usercred) => {

          const user = {
            //MetaData
            email: this.email,
            phoneNumber: this.phone,
            country: this.country,
            nom: this.nom,
            prenom: this.prenom,
            dateNaissance: this.dateNaissance,
            Avatar: '',

            //Infos personnelles
            Sexe: '-',
            Poids: 0,
            Taille: 0,
            Profession: '',
            GS: '',

            //Allergies
            isAllergies: 'Non',
            Allergies: [],

            //Antécédants médicaux
            isCardioDisease: 'Non',
            isCardioDiseaseFamily: 'Non',
            isStress: 'Non',
            isNoMoral: 'Non',
            isFollowUp: 'Non',
            isAsthme: 'Non',

            //Infos sup
            NumSS: '',
            Mutuelle: '',
            CarteVitale: '',

            myDoctors: []
          }

          //Update user's data on FIRESTORE
          try {
            await REFS.users.doc(usercred.user.uid).set(user)
            await REFS.emails.add({ email: this.email })
            await REFS.phones.add({ phone: this.phone })
          }

          catch (e) {
            console.error(e)
          }

          this.setState({ isLoading: false })
          this.props.navigation.navigate('Home')
        })
    }

  }

  _onPressButton() {
    if (this.state.isValid)
      this.handleSignUp()

    else
      console.log("Le format du mot de passe n'est pas valide")
  }

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' />
        </View>
      )
    }
  }

  render() {

    const { isValid } = this.state;

    return (
      <View style={styles.container}>
        {this.state.isLoading ?
          <View style={styles.loading_container}>
            <ActivityIndicator size='large' />
          </View>
          :
          <View style={styles.container}>
            <View style={styles.bar_progression}>
              <View style={[styles.bar, styles.activeBar]} />
              <View style={[styles.bar, styles.activeBar]} />
              <View style={[styles.bar, styles.activeBar]} />
              <View style={[styles.bar, styles.activeBar]} />
              <View style={[styles.bar, styles.activeBar]} />
              <View style={[styles.bar, styles.activeBar]} />
              <View style={[styles.bar, styles.activeBar]} />
              <View style={[styles.bar, styles.activeBar]} />

            </View>

            <View style={styles.logo_container}>
              <Image source={require('../../assets/doctoneedLogoIcon.png')} style={styles.logoIcon} />
            </View>

            <View style={styles.header_container}>
              <Text style={styles.header}> Choisissez un mot de passe: </Text>
            </View>

            <View style={styles.form_container}>
              <Input secureTextEntry
                placeholder="Votre mot de passe"
                onChangeText={(text) => this.setState({ password: text })}
                value={this.state.password}
                style={styles.search_button}
                pattern={[
                  '^.{7,}$', // min 7 chars
                  '(?=.*\\d)', // number required
                  '(?=.*[A-Z])', // uppercase letter
                ]}
                onValidation={isValid => this.setState({ isValid })}
              />

              <View>
                <Text style={{ color: isValid && isValid[0] ? 'green' : 'red' }}>
                  Règle 1 : Au moins 7 caractères
                </Text>
                <Text style={{ color: isValid && isValid[1] ? 'green' : 'red' }}>
                  Règle 2 : Au moins un chiffre
                </Text>
                <Text style={{ color: isValid && isValid[2] ? 'green' : 'red' }}>
                  Règle 3 : Au moins une lettre majuscule
                </Text>
              </View>
            </View>

            <View style={styles.error_container}>
              <Text style={{ color: 'red' }}>
                {this.getErrorMessages()}
              </Text>
            </View>

            <View style={styles.button_container}>
              <Button width={SCREEN_WIDTH * 0.65} text="Soumettre" onPress={this._onPressButton.bind(this)} />
            </View>
          </View>}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    signupData: state.signup
  }
}

export default connect(mapStateToProps)(SignUpPW)

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